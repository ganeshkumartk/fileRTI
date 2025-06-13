-- Reset database
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE rti_status AS ENUM ('draft', 'submitted', 'pending', 'responded', 'rejected', 'closed');
CREATE TYPE user_type AS ENUM ('anonymous', 'authenticated');

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    type user_type NOT NULL DEFAULT 'anonymous',
    full_name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create departments table
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID REFERENCES departments(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create templates table
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    language_code TEXT DEFAULT 'en',
    tags TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create applications table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_number TEXT UNIQUE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id),
    department_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    status rti_status DEFAULT 'draft',
    language_code TEXT DEFAULT 'en',
    template_id UUID REFERENCES templates(id),
    applicant_details JSONB NOT NULL,
    metadata JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ
);

-- Create attachments table
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    storage_path TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create responses table
CREATE TABLE responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    response_type TEXT NOT NULL,
    content TEXT NOT NULL,
    responded_by TEXT,
    responded_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Create analytics table
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL,
    profile_id UUID REFERENCES profiles(id),
    department_name TEXT,
    language_code TEXT,
    event_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_profiles_type ON profiles(type);
CREATE INDEX idx_profiles_email ON profiles(email);

CREATE INDEX idx_departments_active ON departments(is_active);
CREATE INDEX idx_departments_parent ON departments(parent_id);
CREATE INDEX idx_departments_code ON departments(code);

CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_language ON templates(language_code);
CREATE INDEX idx_templates_active ON templates(is_active);
CREATE INDEX idx_templates_featured ON templates(is_featured);

CREATE INDEX idx_applications_profile ON applications(profile_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_department ON applications(department_id);
CREATE INDEX idx_applications_created ON applications(created_at);
CREATE INDEX idx_applications_number ON applications(application_number);

CREATE INDEX idx_attachments_application ON attachments(application_id);
CREATE INDEX idx_responses_application ON responses(application_id);
CREATE INDEX idx_analytics_event ON analytics(event_type);
CREATE INDEX idx_analytics_profile ON analytics(profile_id);

-- Create functions
CREATE OR REPLACE FUNCTION update_updated_at()
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
    FROM applications
    WHERE application_number LIKE 'RTI-' || year_code || '-%';
    
    app_number := 'RTI-' || year_code || '-' || LPAD(sequence_num::TEXT, 6, '0');
    NEW.application_number := app_number;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_departments_updated_at
    BEFORE UPDATE ON departments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_templates_updated_at
    BEFORE UPDATE ON templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_attachments_updated_at
    BEFORE UPDATE ON attachments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_generate_application_number
    BEFORE INSERT ON applications
    FOR EACH ROW
    WHEN (NEW.application_number IS NULL)
    EXECUTE FUNCTION generate_application_number();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create security policies
CREATE POLICY "Public departments are viewable by everyone"
    ON departments FOR SELECT
    USING (is_active = true);

CREATE POLICY "Public templates are viewable by everyone"
    ON templates FOR SELECT
    USING (is_active = true);

CREATE POLICY "Users can view their own applications"
    ON applications FOR SELECT
    USING (profile_id = auth.uid() OR is_public = true);

CREATE POLICY "Users can create applications"
    ON applications FOR INSERT
    WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update their own applications"
    ON applications FOR UPDATE
    USING (profile_id = auth.uid());

CREATE POLICY "Users can view their own attachments"
    ON attachments FOR SELECT
    USING (
        application_id IN (
            SELECT id FROM applications 
            WHERE profile_id = auth.uid() OR is_public = true
        )
    );

CREATE POLICY "Users can create attachments"
    ON attachments FOR INSERT
    WITH CHECK (
        application_id IN (
            SELECT id FROM applications 
            WHERE profile_id = auth.uid()
        )
    );

CREATE POLICY "Users can view their own responses"
    ON responses FOR SELECT
    USING (
        application_id IN (
            SELECT id FROM applications 
            WHERE profile_id = auth.uid() OR is_public = true
        )
    );

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, type, email)
    VALUES (
        NEW.id,
        CASE 
            WHEN NEW.email IS NULL THEN 'anonymous'::user_type
            ELSE 'authenticated'::user_type
        END,
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Enable RLS
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to departments
CREATE POLICY "Allow public read access to departments"
ON departments FOR SELECT
TO public
USING (true);

-- Create policy to allow authenticated users to insert departments (admin only)
CREATE POLICY "Allow authenticated users to insert departments"
ON departments FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create policy to allow authenticated users to update departments (admin only)
CREATE POLICY "Allow authenticated users to update departments"
ON departments FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Create policy to allow authenticated users to delete departments (admin only)
CREATE POLICY "Allow authenticated users to delete departments"
ON departments FOR DELETE
TO authenticated
USING (true);

-- Enable RLS for templates
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to templates
CREATE POLICY "Allow public read access to templates"
ON templates FOR SELECT
TO public
USING (true);

-- Create policy to allow authenticated users to insert templates (admin only)
CREATE POLICY "Allow authenticated users to insert templates"
ON templates FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create policy to allow authenticated users to update templates (admin only)
CREATE POLICY "Allow authenticated users to update templates"
ON templates FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Create policy to allow authenticated users to delete templates (admin only)
CREATE POLICY "Allow authenticated users to delete templates"
ON templates FOR DELETE
TO authenticated
USING (true);

-- Enable RLS for all tables
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Departments policies
CREATE POLICY "Allow public read access to departments"
ON departments FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated users to insert departments"
ON departments FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update departments"
ON departments FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete departments"
ON departments FOR DELETE
TO authenticated
USING (true);

-- RTI Templates policies
CREATE POLICY "Allow public read access to templates"
ON templates FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated users to insert templates"
ON templates FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update templates"
ON templates FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete templates"
ON templates FOR DELETE
TO authenticated
USING (true);

-- RTI Applications policies
CREATE POLICY "Allow users to read their own applications"
ON applications FOR SELECT
TO authenticated
USING (profile_id = auth.uid());

CREATE POLICY "Allow users to insert their own applications"
ON applications FOR INSERT
TO authenticated
WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Allow users to update their own applications"
ON applications FOR UPDATE
TO authenticated
USING (profile_id = auth.uid());

CREATE POLICY "Allow users to delete their own applications"
ON applications FOR DELETE
TO authenticated
USING (profile_id = auth.uid());

-- RTI Attachments policies
CREATE POLICY "Allow users to read their own attachments"
ON attachments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM applications
    WHERE applications.id = attachments.application_id
    AND applications.profile_id = auth.uid()
  )
);

CREATE POLICY "Allow users to insert their own attachments"
ON attachments FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM applications
    WHERE applications.id = attachments.application_id
    AND applications.profile_id = auth.uid()
  )
);

CREATE POLICY "Allow users to update their own attachments"
ON attachments FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM applications
    WHERE applications.id = attachments.application_id
    AND applications.profile_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM applications
    WHERE applications.id = attachments.application_id
    AND applications.profile_id = auth.uid()
  )
);

CREATE POLICY "Allow users to delete their own attachments"
ON attachments FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM applications
    WHERE applications.id = attachments.application_id
    AND applications.profile_id = auth.uid()
  )
);

-- RTI Responses policies
CREATE POLICY "Allow users to read responses to their applications"
ON responses FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM applications
    WHERE applications.id = responses.application_id
    AND applications.profile_id = auth.uid()
  )
);

-- RTI Analytics policies
CREATE POLICY "Allow public read access to analytics"
ON analytics FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated users to insert analytics"
ON analytics FOR INSERT
TO authenticated
WITH CHECK (true); 