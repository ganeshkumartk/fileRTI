-- Indexes for departments table
CREATE INDEX idx_departments_active ON departments(is_active);
CREATE INDEX idx_departments_parent ON departments(parent_id);
CREATE INDEX idx_departments_code ON departments(code);

-- Indexes for rti_templates table
CREATE INDEX idx_templates_category ON rti_templates(category);
CREATE INDEX idx_templates_language ON rti_templates(language_code);
CREATE INDEX idx_templates_active ON rti_templates(is_active);
CREATE INDEX idx_templates_featured ON rti_templates(is_featured);
CREATE INDEX idx_templates_usage ON rti_templates(usage_count DESC);
CREATE INDEX idx_templates_category_lang ON rti_templates(category, language_code, is_active);

-- Indexes for rti_applications table
CREATE INDEX idx_applications_user ON rti_applications(user_id);
CREATE INDEX idx_applications_status ON rti_applications(status);
CREATE INDEX idx_applications_department ON rti_applications(department_id);
CREATE INDEX idx_applications_created ON rti_applications(created_at DESC);
CREATE INDEX idx_applications_user_status ON rti_applications(user_id, status);
CREATE INDEX idx_applications_number ON rti_applications(application_number);

-- Indexes for rti_attachments table
CREATE INDEX idx_attachments_application ON rti_attachments(application_id);

-- Indexes for rti_responses table
CREATE INDEX idx_responses_application ON rti_responses(application_id);

-- Indexes for rti_analytics table
CREATE INDEX idx_analytics_event ON rti_analytics(event_type);
CREATE INDEX idx_analytics_user ON rti_analytics(user_id);
CREATE INDEX idx_analytics_created ON rti_analytics(created_at DESC);
CREATE INDEX idx_analytics_event_created ON rti_analytics(event_type, created_at DESC);
