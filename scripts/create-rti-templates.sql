-- Create RTI templates table
CREATE TABLE IF NOT EXISTS public.rti_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    template_content TEXT NOT NULL,
    language_code VARCHAR(10) DEFAULT 'en',
    tags TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rti_templates_category ON public.rti_templates(category);
CREATE INDEX IF NOT EXISTS idx_rti_templates_language ON public.rti_templates(language_code);
CREATE INDEX IF NOT EXISTS idx_rti_templates_active ON public.rti_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_rti_templates_featured ON public.rti_templates(is_featured);
CREATE INDEX IF NOT EXISTS idx_rti_templates_usage ON public.rti_templates(usage_count DESC);

-- Enable RLS
ALTER TABLE public.rti_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Templates are viewable by everyone" ON public.rti_templates
    FOR SELECT USING (is_active = true);

-- Create function to increment template usage
CREATE OR REPLACE FUNCTION increment_template_usage(template_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.rti_templates 
    SET usage_count = usage_count + 1,
        updated_at = timezone('utc'::text, now())
    WHERE id = template_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rti_templates_updated_at
    BEFORE UPDATE ON public.rti_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
