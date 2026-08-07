-- One private JSON snapshot per account keeps the existing local-first data model
-- while allowing the same user to continue on another device.
CREATE TABLE IF NOT EXISTS public.fittrack_data (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE public.fittrack_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own FitTrack data"
  ON public.fittrack_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own FitTrack data"
  ON public.fittrack_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own FitTrack data"
  ON public.fittrack_data FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE ON public.fittrack_data TO authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'fittrack_data'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.fittrack_data';
  END IF;
END $$;
