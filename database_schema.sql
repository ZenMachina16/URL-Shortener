-- URL Shortener Database Schema
-- Run this in your PostgreSQL/Supabase SQL Editor

CREATE TABLE IF NOT EXISTS url_mappings (
    id SERIAL PRIMARY KEY,
    short_url VARCHAR(255) UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    user_id VARCHAR(255) DEFAULT 'guest-user',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    clicks INTEGER DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_url_mappings_short_url ON url_mappings(short_url);
CREATE INDEX IF NOT EXISTS idx_url_mappings_user_id ON url_mappings(user_id);
CREATE INDEX IF NOT EXISTS idx_url_mappings_created_at ON url_mappings(created_at);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_url_mappings_updated_at ON url_mappings;
CREATE TRIGGER update_url_mappings_updated_at
    BEFORE UPDATE ON url_mappings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Add some sample data for testing
-- INSERT INTO url_mappings (short_url, original_url, user_id) VALUES 
-- ('abc123', 'https://www.example.com', 'guest-user'),
-- ('xyz789', 'https://www.github.com', 'guest-user'); 