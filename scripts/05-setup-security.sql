-- Enable Row Level Security
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rti_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE rti_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE rti_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rti_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE rti_analytics ENABLE ROW LEVEL SECURITY;

-- Policies for departments (public read)
CREATE POLICY policy_departments_select ON departments
    FOR SELECT USING (is_active = true);

-- Policies for rti_templates (public read)
CREATE POLICY policy_templates_select ON rti_templates
    FOR SELECT USING (is_active = true);

-- Policies for rti_applications
CREATE POLICY policy_applications_select ON rti_applications
    FOR SELECT USING (
        user_id = auth.uid() OR 
        is_public = true OR
        auth.role() = 'service_role'
    );

CREATE POLICY policy_applications_insert ON rti_applications
    FOR INSERT WITH CHECK (
        user_id = auth.uid() OR
        auth.role() = 'service_role'
    );

CREATE POLICY policy_applications_update ON rti_applications
    FOR UPDATE USING (
        user_id = auth.uid() OR
        auth.role() = 'service_role'
    );

-- Policies for rti_attachments
CREATE POLICY policy_attachments_select ON rti_attachments
    FOR SELECT USING (
        application_id IN (
            SELECT id FROM rti_applications 
            WHERE user_id = auth.uid() OR is_public = true
        ) OR auth.role() = 'service_role'
    );

CREATE POLICY policy_attachments_insert ON rti_attachments
    FOR INSERT WITH CHECK (
        application_id IN (
            SELECT id FROM rti_applications 
            WHERE user_id = auth.uid()
        ) OR auth.role() = 'service_role'
    );

-- Policies for rti_responses
CREATE POLICY policy_responses_select ON rti_responses
    FOR SELECT USING (
        application_id IN (
            SELECT id FROM rti_applications 
            WHERE user_id = auth.uid() OR is_public = true
        ) OR auth.role() = 'service_role'
    );

-- Policies for rti_analytics
CREATE POLICY policy_analytics_insert ON rti_analytics
    FOR INSERT WITH CHECK (
        user_id = auth.uid() OR 
        user_id IS NULL OR
        auth.role() = 'service_role'
    );

CREATE POLICY policy_analytics_select ON rti_analytics
    FOR SELECT USING (auth.role() = 'service_role');
