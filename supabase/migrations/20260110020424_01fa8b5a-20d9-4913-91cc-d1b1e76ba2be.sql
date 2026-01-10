-- Add attendance column to registrations table
ALTER TABLE public.registrations 
ADD COLUMN attendance_marked BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN attendance_marked_at TIMESTAMP WITH TIME ZONE;