-- Create a table for churches
create table churches (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  invite_code text unique not null
);

-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  balance integer default 0,
  role text default 'user' check (role in ('user', 'admin')),
  church_id uuid references churches(id)
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
declare
  target_church_id uuid;
begin
  -- Check if we are creating a new church or joining one
  if (new.raw_user_meta_data->>'church_name' is not null) then
    -- Create new church
    insert into public.churches (name, invite_code)
    values (
      new.raw_user_meta_data->>'church_name', 
      new.raw_user_meta_data->>'generated_invite_code'
    )
    returning id into target_church_id;
    
    -- Set user as admin of the new church
    insert into public.profiles (id, full_name, avatar_url, balance, role, church_id)
    values (
      new.id, 
      new.raw_user_meta_data->>'full_name', 
      new.raw_user_meta_data->>'avatar_url', 
      0, 
      'admin', 
      target_church_id
    );
  else
    -- Joining existing church
    select id into target_church_id from public.churches 
    where invite_code = (new.raw_user_meta_data->>'invite_code');
    
    insert into public.profiles (id, full_name, avatar_url, balance, role, church_id)
    values (
      new.id, 
      new.raw_user_meta_data->>'full_name', 
      new.raw_user_meta_data->>'avatar_url', 
      0, 
      'user', 
      target_church_id
    );
  end if;
  
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
  type text check (type in ('transfer', 'reward', 'redemption')),
  church_id uuid references churches(id)
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
  active boolean default true,
  church_id uuid references churches(id)
);

alter table items enable row level security;

-- Policies for items
create policy "Items are viewable by church members." on items
  for select using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.church_id = items.church_id
    )
  );

create policy "Admins can insert items for their church" on items
  for insert with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
      and profiles.church_id = items.church_id
    )
  );

create policy "Admins can update items for their church" on items
  for update using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
      and profiles.church_id = items.church_id
    )
  );

create policy "Admins can delete items for their church" on items
  for delete using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
      and profiles.church_id = items.church_id
    )
  );
