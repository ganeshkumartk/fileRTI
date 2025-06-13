-- Clean reset of the database
DROP TABLE IF EXISTS rti_analytics CASCADE;
DROP TABLE IF EXISTS rti_responses CASCADE;
DROP TABLE IF EXISTS rti_attachments CASCADE;
DROP TABLE IF EXISTS rti_applications CASCADE;
DROP TABLE IF EXISTS rti_templates CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- Drop views if they exist
DROP VIEW IF EXISTS popular_templates CASCADE;

-- Drop functions if they exist
DROP FUNCTION IF EXISTS increment_template_usage(UUID) CASCADE;
DROP FUNCTION IF EXISTS generate_application_number() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS refresh_popular_templates() CASCADE;

-- Clean up any existing triggers
DROP TRIGGER IF EXISTS update_departments_updated_at ON departments;
DROP TRIGGER IF EXISTS update_rti_templates_updated_at ON rti_templates;
DROP TRIGGER IF EXISTS update_rti_applications_updated_at ON rti_applications;
DROP TRIGGER IF EXISTS update_rti_attachments_updated_at ON rti_attachments;
DROP TRIGGER IF EXISTS generate_rti_application_number ON rti_applications;
