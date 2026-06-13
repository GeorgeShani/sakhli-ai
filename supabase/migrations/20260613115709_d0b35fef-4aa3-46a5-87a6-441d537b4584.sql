
ALTER TABLE public.student_profiles
  ADD COLUMN IF NOT EXISTS salary_bracket TEXT CHECK (salary_bracket IN ('under_500','500_1000','1000_2000','2000_plus')),
  ADD COLUMN IF NOT EXISTS income_source TEXT CHECK (income_source IN ('job','family','scholarship','mixed'));
