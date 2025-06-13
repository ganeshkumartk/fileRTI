-- Create schema for RTI platform
BEGIN;

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES departments(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on departments
CREATE INDEX idx_departments_active ON departments(is_active);
CREATE INDEX idx_departments_parent ON departments(parent_id);

-- RTI Templates table
CREATE TABLE IF NOT EXISTS rti_templates (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes on rti_templates
CREATE INDEX idx_rti_templates_category ON rti_templates(category);
CREATE INDEX idx_rti_templates_language ON rti_templates(language_code);
CREATE INDEX idx_rti_templates_active ON rti_templates(is_active);
CREATE INDEX idx_rti_templates_featured ON rti_templates(is_featured);
CREATE INDEX idx_rti_templates_usage ON rti_templates(usage_count);

-- RTI Applications table
CREATE TABLE IF NOT EXISTS rti_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_number VARCHAR(50) UNIQUE,
  user_id UUID NOT NULL,
  department_id UUID REFERENCES departments(id),
  department_name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  language_code VARCHAR(10) DEFAULT 'en',
  template_id UUID REFERENCES rti_templates(id),
  applicant_details JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  submitted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes on rti_applications
CREATE INDEX idx_rti_applications_user ON rti_applications(user_id);
CREATE INDEX idx_rti_applications_status ON rti_applications(status);
CREATE INDEX idx_rti_applications_department ON rti_applications(department_id);
CREATE INDEX idx_rti_applications_created ON rti_applications(created_at);

-- RTI Attachments table
CREATE TABLE IF NOT EXISTS rti_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES rti_applications(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size INTEGER NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on rti_attachments
CREATE INDEX idx_rti_attachments_application ON rti_attachments(application_id);

-- RTI Responses table
CREATE TABLE IF NOT EXISTS rti_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES rti_applications(id) ON DELETE CASCADE,
  response_type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  responded_by VARCHAR(255),
  responded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Create index on rti_responses
CREATE INDEX idx_rti_responses_application ON rti_responses(application_id);

-- RTI Analytics table
CREATE TABLE IF NOT EXISTS rti_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100) NOT NULL,
  user_id UUID,
  department_name VARCHAR(255),
  language_code VARCHAR(10),
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes on rti_analytics
CREATE INDEX idx_rti_analytics_event ON rti_analytics(event_type);
CREATE INDEX idx_rti_analytics_user ON rti_analytics(user_id);
CREATE INDEX idx_rti_analytics_created ON rti_analytics(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_departments_updated_at
    BEFORE UPDATE ON departments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rti_templates_updated_at
    BEFORE UPDATE ON rti_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rti_applications_updated_at
    BEFORE UPDATE ON rti_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rti_attachments_updated_at
    BEFORE UPDATE ON rti_attachments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to increment template usage
CREATE OR REPLACE FUNCTION increment_template_usage(template_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE rti_templates 
    SET usage_count = usage_count + 1,
        updated_at = now()
    WHERE id = template_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate application number
CREATE OR REPLACE FUNCTION generate_application_number()
RETURNS TRIGGER AS $$
DECLARE
    year_code TEXT;
    sequence_num INTEGER;
    app_number TEXT;
BEGIN
    -- Get current year (last 2 digits)
    year_code := to_char(CURRENT_DATE, 'YY');
    
    -- Get next sequence number for this year
    SELECT COALESCE(MAX(SUBSTRING(application_number FROM 7)::INTEGER), 0) + 1
    INTO sequence_num
    FROM rti_applications
    WHERE application_number LIKE 'RTI-' || year_code || '-%';
    
    -- Format: RTI-YY-NNNNNN (YY=year, NNNNNN=sequence)
    app_number := 'RTI-' || year_code || '-' || LPAD(sequence_num::TEXT, 6, '0');
    
    -- Set the application number
    NEW.application_number := app_number;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for application number generation
CREATE TRIGGER generate_rti_application_number
    BEFORE INSERT ON rti_applications
    FOR EACH ROW
    WHEN (NEW.application_number IS NULL)
    EXECUTE FUNCTION generate_application_number();

-- Create view for popular templates
CREATE VIEW popular_templates AS
SELECT 
    t.*,
    COALESCE(
        (SELECT COUNT(*) 
         FROM rti_analytics 
         WHERE event_type = 'rti_generated' 
         AND (event_data->>'template_id')::UUID = t.id
         AND created_at >= NOW() - INTERVAL '30 days'
        ), 0
    ) as recent_usage_count
FROM rti_templates t
WHERE t.is_active = true
ORDER BY t.is_featured DESC, recent_usage_count DESC, t.usage_count DESC;

COMMIT;
