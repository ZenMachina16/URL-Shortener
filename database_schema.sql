-- URL Shortener Database Schema - Complete Setup
-- Run this in your PostgreSQL/Supabase SQL Editor

-- Drop existing tables if they exist (be careful in production!)
DROP TABLE IF EXISTS url_clicks CASCADE;
DROP TABLE IF EXISTS urls CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS verification_tokens CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS url_mappings CASCADE;

-- Drop existing types if they exist
DROP TYPE IF EXISTS UserRole CASCADE;
DROP TYPE IF EXISTS SubscriptionTier CASCADE;

-- Create enums
CREATE TYPE UserRole AS ENUM ('USER', 'ADMIN', 'MODERATOR');
CREATE TYPE SubscriptionTier AS ENUM ('FREE', 'PRO', 'ENTERPRISE');

-- Users table - supports both OAuth and email/password authentication
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    email_verified TIMESTAMP,
    image TEXT,
    password TEXT, -- For email/password authentication (hashed)
    role UserRole DEFAULT 'USER',
    
    -- Subscription/billing
    subscription_tier SubscriptionTier DEFAULT 'FREE',
    subscription_expires TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login_at TIMESTAMP
);

-- OAuth Accounts table (NextAuth.js)
CREATE TABLE accounts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    provider_account_id TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    
    UNIQUE(provider, provider_account_id)
);

-- Sessions table (NextAuth.js)
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    session_token TEXT UNIQUE NOT NULL,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires TIMESTAMP NOT NULL
);

-- Verification tokens table (NextAuth.js)
CREATE TABLE verification_tokens (
    identifier TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires TIMESTAMP NOT NULL,
    
    UNIQUE(identifier, token)
);

-- URLs table - core functionality
CREATE TABLE urls (
    id TEXT PRIMARY KEY,
    short_code TEXT UNIQUE NOT NULL, -- e.g., "abc123"
    original_url TEXT NOT NULL,
    title TEXT, -- Page title for better UX
    description TEXT, -- Meta description
    
    -- User relationship
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL, -- Nullable for guest users
    
    -- Settings
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP,
    password TEXT, -- Optional password protection (hashed)
    
    -- Analytics
    click_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_click_at TIMESTAMP
);

-- URL Click tracking for analytics
CREATE TABLE url_clicks (
    id TEXT PRIMARY KEY,
    
    -- Relations
    url_id TEXT NOT NULL REFERENCES urls(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL, -- Track authenticated users
    
    -- Analytics data
    ip_address TEXT,
    user_agent TEXT,
    referer TEXT,
    country TEXT,
    city TEXT,
    device TEXT, -- mobile, desktop, tablet
    browser TEXT,
    os TEXT,
    
    -- Timestamp
    clicked_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_provider ON accounts(provider, provider_account_id);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(session_token);

CREATE INDEX idx_urls_short_code ON urls(short_code);
CREATE INDEX idx_urls_user_id ON urls(user_id);
CREATE INDEX idx_urls_created_at ON urls(created_at);
CREATE INDEX idx_urls_is_active ON urls(is_active);

CREATE INDEX idx_url_clicks_url_id ON url_clicks(url_id);
CREATE INDEX idx_url_clicks_user_id ON url_clicks(user_id);
CREATE INDEX idx_url_clicks_clicked_at ON url_clicks(clicked_at);
CREATE INDEX idx_url_clicks_country ON url_clicks(country);
CREATE INDEX idx_url_clicks_device ON url_clicks(device);

-- Create functions for auto-updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_urls_updated_at
    BEFORE UPDATE ON urls
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to increment click count and update last_click_at
CREATE OR REPLACE FUNCTION increment_url_clicks()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE urls 
    SET click_count = click_count + 1, 
        last_click_at = NOW() 
    WHERE id = NEW.url_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically increment click count when a click is recorded
CREATE TRIGGER increment_url_clicks_trigger
    AFTER INSERT ON url_clicks
    FOR EACH ROW
    EXECUTE FUNCTION increment_url_clicks();

-- Sample data for testing (optional)
/*
INSERT INTO users (id, name, email, role) VALUES 
('cm123456789', 'Admin User', 'admin@example.com', 'ADMIN'),
('cm987654321', 'Test User', 'user@example.com', 'USER');

INSERT INTO urls (id, short_code, original_url, user_id, title) VALUES 
('url123456789', 'abc123', 'https://www.example.com', 'cm987654321', 'Example Website'),
('url987654321', 'xyz789', 'https://www.github.com', NULL, 'GitHub');
*/ 