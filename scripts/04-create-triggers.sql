-- Create triggers for updated_at columns
CREATE TRIGGER trigger_departments_updated_at
    BEFORE UPDATE ON departments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_templates_updated_at
    BEFORE UPDATE ON rti_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_applications_updated_at
    BEFORE UPDATE ON rti_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_attachments_updated_at
    BEFORE UPDATE ON rti_attachments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for application number generation
CREATE TRIGGER trigger_generate_application_number
    BEFORE INSERT ON rti_applications
    FOR EACH ROW
    WHEN (NEW.application_number IS NULL)
    EXECUTE FUNCTION generate_application_number();
