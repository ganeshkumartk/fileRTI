-- Create departments table
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

-- Add foreign key constraint for parent_id
ALTER TABLE departments ADD CONSTRAINT fk_departments_parent 
    FOREIGN KEY (parent_id) REFERENCES departments(id);

-- Create RTI templates table
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

-- Create RTI applications table
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

-- Add foreign key constraints
ALTER TABLE rti_applications ADD CONSTRAINT fk_applications_department 
    FOREIGN KEY (department_id) REFERENCES departments(id);
ALTER TABLE rti_applications ADD CONSTRAINT fk_applications_template 
    FOREIGN KEY (template_id) REFERENCES rti_templates(id);

-- Create RTI attachments table
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

-- Add foreign key constraint
ALTER TABLE rti_attachments ADD CONSTRAINT fk_attachments_application 
    FOREIGN KEY (application_id) REFERENCES rti_applications(id) ON DELETE CASCADE;

-- Create RTI responses table
CREATE TABLE rti_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL,
    response_type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    responded_by VARCHAR(255),
    responded_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Add foreign key constraint
ALTER TABLE rti_responses ADD CONSTRAINT fk_responses_application 
    FOREIGN KEY (application_id) REFERENCES rti_applications(id) ON DELETE CASCADE;

-- Create RTI analytics table
CREATE TABLE rti_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    user_id UUID,
    department_name VARCHAR(255),
    language_code VARCHAR(10),
    event_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
