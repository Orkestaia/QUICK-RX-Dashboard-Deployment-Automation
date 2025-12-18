-- 1. Create the calls table
CREATE TABLE calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ,
  call_id TEXT UNIQUE,
  caller_name TEXT,
  phone TEXT,
  callback_date TEXT,
  callback_time TEXT,
  assigned_to TEXT,
  status TEXT,
  call_duration TEXT,
  transcript TEXT,
  recording_url TEXT,
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create profiles table for role-based access
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role TEXT CHECK (role IN ('admin', 'viewer')) DEFAULT 'viewer',
  full_name TEXT
);

-- 3. Enable row level security
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. Create policies
-- Policies for calls
CREATE POLICY "Public read for authenticated" ON calls
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Service role can do everything" ON calls
  FOR ALL TO service_role
  USING (true);

-- Policies for profiles
CREATE POLICY "Users can read their own profile" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- 5. Helper trigger to update 'updated_at' on calls
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_calls_updated_at BEFORE UPDATE ON calls
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
