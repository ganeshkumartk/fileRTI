-- Complete database setup in one script

-- Section 1: Cleanup
-- Drop existing objects to ensure a clean slate.
-- Using CASCADE to handle dependencies automatically.
DROP TABLE IF EXISTS rti_analytics CASCADE;
DROP TABLE IF EXISTS rti_responses CASCADE;
DROP TABLE IF EXISTS rti_attachments CASCADE;
DROP TABLE IF EXISTS rti_applications CASCADE;
DROP TABLE IF EXISTS rti_templates CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- Drop functions separately
DROP FUNCTION IF EXISTS increment_template_usage(UUID);
DROP FUNCTION IF EXISTS generate_application_number();
DROP FUNCTION IF EXISTS update_updated_at_column();


-- Section 2: Table Creation
-- Define all table structures.
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE rti_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    template_content TEXT NOT NULL,
    language_code VARCHAR(10) DEFAULT 'en',
    tags TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE rti_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_number VARCHAR(50) UNIQUE,
    user_id UUID NOT NULL,
    department_id UUID,
    department_name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    language_code VARCHAR(10) DEFAULT 'en',
    template_id UUID,
    applicant_details JSONB NOT NULL,
    metadata JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ
);

CREATE TABLE rti_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size INTEGER NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE rti_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL,
    response_type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    responded_by VARCHAR(255),
    responded_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

CREATE TABLE rti_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    user_id UUID,
    department_name VARCHAR(255),
    language_code VARCHAR(10),
    event_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- Section 3: Constraints and Indexes
-- Add foreign key constraints
ALTER TABLE departments ADD CONSTRAINT fk_departments_parent 
    FOREIGN KEY (parent_id) REFERENCES departments(id);
ALTER TABLE rti_applications ADD CONSTRAINT fk_applications_department 
    FOREIGN KEY (department_id) REFERENCES departments(id);
ALTER TABLE rti_applications ADD CONSTRAINT fk_applications_template 
    FOREIGN KEY (template_id) REFERENCES rti_templates(id);
ALTER TABLE rti_attachments ADD CONSTRAINT fk_attachments_application 
    FOREIGN KEY (application_id) REFERENCES rti_applications(id) ON DELETE CASCADE;
ALTER TABLE rti_responses ADD CONSTRAINT fk_responses_application 
    FOREIGN KEY (application_id) REFERENCES rti_applications(id) ON DELETE CASCADE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_departments_active ON departments(is_active);
CREATE INDEX IF NOT EXISTS idx_templates_category ON rti_templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_language ON rti_templates(language_code);
CREATE INDEX IF NOT EXISTS idx_applications_user ON rti_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON rti_applications(status);


-- Section 4: Functions and Triggers
-- Create helper functions and triggers for automation.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_application_number()
RETURNS TRIGGER AS $$
DECLARE
    year_code TEXT;
    sequence_num INTEGER;
    app_number TEXT;
BEGIN
    year_code := to_char(CURRENT_DATE, 'YY');
    SELECT COALESCE(MAX(SUBSTRING(application_number FROM 7)::INTEGER), 0) + 1
    INTO sequence_num
    FROM rti_applications
    WHERE application_number LIKE 'RTI-' || year_code || '-%';
    app_number := 'RTI-' || year_code || '-' || LPAD(sequence_num::TEXT, 6, '0');
    NEW.application_number := app_number;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_template_usage(template_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE rti_templates 
    SET usage_count = usage_count + 1,
        updated_at = NOW()
    WHERE id = template_id;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to call the functions
CREATE TRIGGER trigger_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_templates_updated_at BEFORE UPDATE ON rti_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_applications_updated_at BEFORE UPDATE ON rti_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_attachments_updated_at BEFORE UPDATE ON rti_attachments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_generate_application_number BEFORE INSERT ON rti_applications FOR EACH ROW WHEN (NEW.application_number IS NULL) EXECUTE FUNCTION generate_application_number();


-- Section 5: Row Level Security (RLS)
-- Enable RLS on all tables
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rti_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE rti_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE rti_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rti_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE rti_analytics ENABLE ROW LEVEL SECURITY;

-- Define RLS Policies
-- Public tables can be read by anyone.
CREATE POLICY "Allow public read access to departments" ON departments FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access to templates" ON rti_templates FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access to analytics" ON rti_analytics FOR SELECT TO public USING (true);

-- Users can manage their own applications and related data.
CREATE POLICY "Allow users to manage their own applications" ON rti_applications FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Allow users to manage their own attachments" ON rti_attachments FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM rti_applications WHERE id = rti_attachments.application_id AND user_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM rti_applications WHERE id = rti_attachments.application_id AND user_id = auth.uid()));
CREATE POLICY "Allow users to read responses to their applications" ON rti_responses FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM rti_applications WHERE id = rti_responses.application_id AND user_id = auth.uid()));

-- Authenticated users have wider permissions for inserting data.
CREATE POLICY "Allow authenticated users to insert departments" ON departments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to insert templates" ON rti_templates FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to insert analytics" ON rti_analytics FOR INSERT TO authenticated WITH CHECK (true);


-- Section 6: Permissions
-- Grant usage on the public schema to all roles
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

-- Grant SELECT permissions for public access
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Grant all permissions to authenticated and service roles
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;


-- Section 7: Seed Data
-- Insert initial data into the tables.
INSERT INTO departments (name, code, description, is_active) VALUES
('Ministry of Home Affairs', 'MHA', 'Internal security, law and order, immigration', true),
('Ministry of Finance', 'MOF', 'Financial affairs, taxation, economic policy', true),
('Ministry of Education', 'MOE', 'Education policy and programs', true);

INSERT INTO rti_templates (title, description, category, template_content, language_code, tags, is_featured) VALUES
('School Infrastructure Information', 'Request details about school facilities', 'education', 'Please provide info on classrooms and labs.', 'en', '{"school", "infra"}', true),
('Public Health Center Details', 'Request details about a local PHC', 'health', 'Please provide info on doctors and medicine stock.', 'en', '{"health", "phc"}', true);
