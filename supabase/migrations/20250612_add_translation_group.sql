-- Add translation_group to link multi-language blog posts
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS translation_group UUID DEFAULT gen_random_uuid();
CREATE INDEX IF NOT EXISTS idx_blog_posts_translation_group ON blog_posts(translation_group);
