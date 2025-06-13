-- Optimize RTI templates table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rti_templates_search 
ON public.rti_templates USING gin(to_tsvector('english', title || ' ' || description));

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rti_templates_tags 
ON public.rti_templates USING gin(tags);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rti_templates_composite 
ON public.rti_templates(language_code, category, is_active, is_featured);

-- Optimize RTI applications table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rti_applications_user_status 
ON public.rti_applications(user_id, status, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rti_applications_department 
ON public.rti_applications(department_name, created_at DESC);

-- Optimize analytics table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rti_analytics_event_time 
ON public.rti_analytics(event_type, created_at DESC);

-- Add materialized view for popular templates
CREATE MATERIALIZED VIEW IF NOT EXISTS popular_templates AS
SELECT 
    t.*,
    COALESCE(usage_stats.recent_usage, 0) as recent_usage_count
FROM rti_templates t
LEFT JOIN (
    SELECT 
        (event_data->>'template_id')::uuid as template_id,
        COUNT(*) as recent_usage
    FROM rti_analytics 
    WHERE event_type = 'rti_generated' 
    AND created_at >= NOW() - INTERVAL '30 days'
    AND event_data->>'template_id' IS NOT NULL
    GROUP BY (event_data->>'template_id')::uuid
) usage_stats ON t.id = usage_stats.template_id
WHERE t.is_active = true
ORDER BY t.is_featured DESC, usage_stats.recent_usage DESC NULLS LAST, t.usage_count DESC;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_popular_templates_id 
ON popular_templates(id);

-- Refresh function for materialized view
CREATE OR REPLACE FUNCTION refresh_popular_templates()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY popular_templates;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule refresh (would be done via cron in production)
-- SELECT cron.schedule('refresh-popular-templates', '0 */6 * * *', 'SELECT refresh_popular_templates();');
