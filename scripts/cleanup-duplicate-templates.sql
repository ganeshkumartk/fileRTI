-- Clean up duplicate RTI templates
-- This script removes duplicate templates based on title and category,
-- keeping only the template with the highest usage_count

BEGIN;

-- Create a temporary table with unique templates (keeping highest usage_count)
CREATE TEMP TABLE unique_templates AS
SELECT DISTINCT ON (LOWER(title), category) *
FROM rti_templates
ORDER BY LOWER(title), category, usage_count DESC, created_at DESC;

-- Delete all templates
DELETE FROM rti_templates;

-- Insert back only the unique templates
INSERT INTO rti_templates 
SELECT * FROM unique_templates;

-- Drop the temporary table
DROP TABLE unique_templates;

COMMIT;

-- Display the count of remaining templates
SELECT 
    category,
    COUNT(*) as template_count
FROM rti_templates 
WHERE is_active = true
GROUP BY category
ORDER BY category; 