create table if not exists public.scholarships (
  id text primary key,
  name text not null,
  provider text not null,
  summary text not null,
  amount numeric,
  amount_period text not null check (amount_period in ('year','total')),
  currency text not null,
  full_funding boolean not null default false,
  covers text[] not null default '{}',
  levels text[] not null,
  fields text[] not null default '{ANY}',
  study_countries text[] not null default '{ANY}',
  study_cities text[] not null default '{}',
  eligible_nationalities text[] not null default '{ANY}',
  excluded_nationalities text[] not null default '{}',
  eligibility_notes text not null default '',
  deadline date,
  deadline_note text,
  official_url text not null,
  source_url text not null,
  checked_on date not null
);

create table if not exists public.country_costs (
  country text primary key,
  currency text not null,
  yearly_cost_undergraduate numeric not null,
  yearly_cost_masters numeric not null,
  yearly_cost_phd numeric not null,
  source_url text not null,
  checked_on date not null
);

alter table public.scholarships enable row level security;
alter table public.country_costs enable row level security;

create policy "public read scholarships" on public.scholarships for select using (true);
create policy "public read country costs" on public.country_costs for select using (true);
-- No insert/update/delete policies: only the service role key (server side) can write.
