-- Create tasks_metadata table
CREATE TABLE IF NOT EXISTS tasks_metadata (
  task_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  complexity TEXT NOT NULL,
  validation_method TEXT NOT NULL,
  deadline TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  creator_address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on creator_address for faster queries
CREATE INDEX IF NOT EXISTS idx_tasks_metadata_creator ON tasks_metadata(creator_address);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_tasks_metadata_created_at ON tasks_metadata(created_at DESC);

-- Enable Row Level Security
ALTER TABLE tasks_metadata ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read task metadata
CREATE POLICY "Anyone can read tasks_metadata"
  ON tasks_metadata
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can insert their own tasks
CREATE POLICY "Users can insert their own tasks_metadata"
  ON tasks_metadata
  FOR INSERT
  WITH CHECK (true);

-- Policy: Creators can update their own tasks
CREATE POLICY "Creators can update their own tasks_metadata"
  ON tasks_metadata
  FOR UPDATE
  USING (creator_address = auth.jwt() ->> 'wallet_address')
  WITH CHECK (creator_address = auth.jwt() ->> 'wallet_address');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tasks_metadata_updated_at
  BEFORE UPDATE ON tasks_metadata
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
