-- 1. Create a table for user profiles
create table profiles (
  id uuid references auth.users not null primary key,
  email text not null,
  plan_id text default 'free' check (plan_id in ('free', 'monthly', 'yearly', 'lifetime')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Turn on Row Level Security (RLS)
alter table profiles enable row level security;

-- ============================================================
-- FIX: Drop the broken admin policies and recreate with correct method
-- Run this in Supabase SQL Editor to fix "permission denied for table users"
-- ============================================================

-- Drop the broken policies
drop policy if exists "Admins can view all profiles." on profiles;
drop policy if exists "Admins can update all profiles." on profiles;

-- Recreate with auth.jwt() which works correctly from client
create policy "Admins can view all profiles." on profiles
  for select using (
    auth.jwt() ->> 'email' = 'vuan.edit@gmail.com'
  );

create policy "Admins can update all profiles." on profiles
  for update using (
    auth.jwt() ->> 'email' = 'vuan.edit@gmail.com'
  );

-- 4. Create a trigger to automatically create a profile when a new user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, plan_id)
  values (new.id, new.email, 'free');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Create a table for products (GeoData)
create table products (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  format text not null, -- geojson, kml, plugin
  size text,
  access text default 'paid' check (access in ('free', 'paid')),
  thumb text,
  file_url text,
  featured boolean default false,
  is_lifetime boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS for products
alter table products enable row level security;

-- Policies for products
create policy "Everyone can view products." on products
  for select using (true);

create policy "Admins can manage products." on products
  for all using (
    auth.jwt() ->> 'email' = 'vuan.edit@gmail.com'
  );
