-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate application number
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

-- Function to increment template usage
CREATE OR REPLACE FUNCTION increment_template_usage(template_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE rti_templates 
    SET usage_count = usage_count + 1,
        updated_at = NOW()
    WHERE id = template_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
