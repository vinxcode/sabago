-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  balance integer default 0,
  role text default 'user' check (role in ('user', 'admin'))
);

-- Search functionality (trigram)
create extension if not exists pg_trgm;

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, balance)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 0);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Transactions table
create table transactions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  sender_id uuid references profiles(id),
  receiver_id uuid references profiles(id),
  amount integer not null check (amount > 0),
  description text,
  type text check (type in ('transfer', 'reward', 'redemption'))
);

alter table transactions enable row level security;

create policy "Users can view their own transactions (sent or received)." on transactions
  for select using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- Items table for the marketplace
create table items (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  image_url text,
  price integer not null check (price >= 0),
  category text check (category in ('physical', 'event', 'privilege', 'coupon')),
  stock integer default -1, -- -1 for infinite
  active boolean default true
);

alter table items enable row level security;

create policy "Items are viewable by everyone." on items
  for select using (true);
