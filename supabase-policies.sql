-- Example RLS (enable on each table and allow users to read public content)
-- NOTE: Run this ONLY AFTER Prisma has created the tables in your Supabase DB.

-- Enable RLS (safe if table exists)
DO $$ BEGIN
  EXECUTE 'ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY';
EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN
  EXECUTE 'ALTER TABLE public."Project" ENABLE ROW LEVEL SECURITY';
EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN
  EXECUTE 'ALTER TABLE public."ProjectApplication" ENABLE ROW LEVEL SECURITY';
EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN
  EXECUTE 'ALTER TABLE public."Mentor" ENABLE ROW LEVEL SECURITY';
EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN
  EXECUTE 'ALTER TABLE public."MentorshipSession" ENABLE ROW LEVEL SECURITY';
EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN
  EXECUTE 'ALTER TABLE public."Subscription" ENABLE ROW LEVEL SECURITY';
EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN
  EXECUTE 'ALTER TABLE public."ExperiencePoints" ENABLE ROW LEVEL SECURITY';
EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN
  EXECUTE 'ALTER TABLE public."SuccessStory" ENABLE ROW LEVEL SECURITY';
EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN
  EXECUTE 'ALTER TABLE public."Review" ENABLE ROW LEVEL SECURITY';
EXCEPTION WHEN undefined_table THEN NULL; END $$;

-- Basic read for all authenticated users
DO $$ BEGIN
  CREATE POLICY "read_all_users"
    ON public."User"
    FOR SELECT
    TO authenticated
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "read_all_projects"
    ON public."Project"
    FOR SELECT
    TO authenticated
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Insert own user row
DO $$ BEGIN
  CREATE POLICY "insert_own_user"
    ON public."User"
    FOR INSERT
    TO authenticated
    WITH CHECK ((auth.jwt() ->> 'email') = email);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Update own user row
DO $$ BEGIN
  CREATE POLICY "update_own_user"
    ON public."User"
    FOR UPDATE
    TO authenticated
    USING ((auth.jwt() ->> 'email') = email)
    WITH CHECK ((auth.jwt() ->> 'email') = email);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
