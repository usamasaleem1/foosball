-- Foosball Win Counter - Initial Schema
-- Migration: 20241118_initial_schema
-- Description: Creates the wins table to track lifetime game victories for Usama and Nicholas

-- Create wins table
CREATE TABLE IF NOT EXISTS wins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player TEXT NOT NULL CHECK (player IN ('Usama', 'Nicholas')),
  delta INTEGER NOT NULL CHECK (delta IN (-1, 1)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on created_at for efficient date-based queries
CREATE INDEX IF NOT EXISTS wins_created_at_idx ON wins(created_at DESC);

-- Create index on player for efficient filtering
CREATE INDEX IF NOT EXISTS wins_player_idx ON wins(player);

-- Enable Row Level Security (RLS) but allow all operations since this is public
ALTER TABLE wins ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (public access)
CREATE POLICY "Allow all operations on wins" ON wins
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add comment to table
COMMENT ON TABLE wins IS 'Tracks individual foosball game wins for Usama and Nicholas with timestamps for trend analysis';
