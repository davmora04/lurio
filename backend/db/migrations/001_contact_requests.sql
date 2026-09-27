CREATE TABLE IF NOT EXISTS public.contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(120) NOT NULL,
  email varchar(254) NOT NULL,
  company varchar(160) NOT NULL,
  interest text NOT NULL CHECK (interest IN ('expansion', 'assessment')),
  message text NOT NULL CHECK (char_length(message) BETWEEN 10 AND 3000),
  locale text NOT NULL CHECK (locale IN ('en', 'es')),
  created_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  notification_status text NOT NULL DEFAULT 'not_configured'
    CHECK (notification_status IN ('not_configured', 'pending', 'sent', 'failed'))
);
