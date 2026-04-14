--STATEMENT_BREAKPOINT
CREATE TYPE public.guessed_status AS ENUM (
  'busy',
  'free'
);

--STATEMENT_BREAKPOINT
CREATE TABLE public.activity_events (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sink text NOT NULL,
  source text NOT NULL,
  timestamp timestamp NOT NULL,
  guessed_status guessed_status,
  note text
);
