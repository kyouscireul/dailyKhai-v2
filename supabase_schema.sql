-- Create a table for user profiles (settings)
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text,
  level_data jsonb,
  theme text
);

-- Create a table for user progress (routine data, goals)
create table user_progress (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  routine_data jsonb, -- Stores the entire tasks object
  goals_data jsonb -- Stores the goals array
);

-- Set up Row Level Security (RLS)
-- This ensures users can ONLY see/edit their OWN data
alter table profiles enable row level security;
alter table user_progress enable row level security;

-- Policies for Profiles
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- Policies for Progress
create policy "Users can view own progress" on user_progress
  for select using (auth.uid() = id);

create policy "Users can update own progress" on user_progress
  for update using (auth.uid() = id);

create policy "Users can insert own progress" on user_progress
  for insert with check (auth.uid() = id);

-- Handle new user signup automatically (Trigger)
-- This creates a blank row in 'profiles' and 'user_progress' when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, theme)
  values (new.id, 'Khai', 'light');
  
  insert into public.user_progress (id, routine_data, goals_data)
  values (new.id, '{}'::jsonb, '[]'::jsonb);
  
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
