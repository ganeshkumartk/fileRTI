BEGIN;

-- Enable Row Level Security on all tables
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rti_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE rti_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE rti_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rti_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE rti_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for departments
CREATE POLICY "Departments are viewable by everyone" 
    ON departments FOR SELECT 
    USING (is_active = true);

-- Create policies for rti_templates
CREATE POLICY "Templates are viewable by everyone" 
    ON rti_templates FOR SELECT 
    USING (is_active = true);

-- Create policies for rti_applications
CREATE POLICY "Applications are viewable by their owners" 
    ON rti_applications FOR SELECT 
    USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "Applications are insertable by authenticated users" 
    ON rti_applications FOR INSERT 
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Applications are updatable by their owners" 
    ON rti_applications FOR UPDATE 
    USING (user_id = auth.uid());

-- Create policies for rti_attachments
CREATE POLICY "Attachments are viewable by application owners" 
    ON rti_attachments FOR SELECT 
    USING (
        application_id IN (
            SELECT id FROM rti_applications 
            WHERE user_id = auth.uid() OR is_public = true
        )
    );

CREATE POLICY "Attachments are insertable by application owners" 
    ON rti_attachments FOR INSERT 
    WITH CHECK (
        application_id IN (
            SELECT id FROM rti_applications 
            WHERE user_id = auth.uid()
        )
    );

-- Create policies for rti_responses
CREATE POLICY "Responses are viewable by application owners" 
    ON rti_responses FOR SELECT 
    USING (
        application_id IN (
            SELECT id FROM rti_applications 
            WHERE user_id = auth.uid() OR is_public = true
        )
    );

-- Create policies for rti_analytics
CREATE POLICY "Analytics are insertable by authenticated users" 
    ON rti_analytics FOR INSERT 
    WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

COMMIT;
