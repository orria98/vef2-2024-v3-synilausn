CREATE TABLE public.users (
  id serial primary key,
  name CHARACTER VARYING(64) NOT NULL,
  username character varying(64) NOT NULL UNIQUE,
  password character varying(256) NOT NULL,
  admin BOOLEAN DEFAULT false
);

CREATE TABLE public.teams (
  id serial primary key,
  name CHARACTER VARYING(64) NOT NULL UNIQUE,
  slug CHARACTER VARYING(64) NOT NULL UNIQUE,
  description TEXT DEFAULT ''
);

CREATE TABLE public.games (
  id serial primary key,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  home integer NOT NULL REFERENCES teams(id),
  away integer NOT NULL REFERENCES teams(id),
  home_score integer NOT NULL check (home_score >= 0),
  away_score integer NOT NULL check (away_score >= 0)
);
