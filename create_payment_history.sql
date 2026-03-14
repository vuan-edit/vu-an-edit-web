-- Create a table for tracking payments
create table if not exists payment_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  order_code bigint unique not null,
  amount int not null,
  plan_id text not null check (plan_id in ('monthly', 'yearly', 'lifetime')),
  status text default 'pending' check (status in ('pending', 'PAID', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table payment_history enable row level security;

-- Policies
create policy "Users can view their own payment history." on payment_history
  for select using (auth.uid() = user_id);

create policy "Admins can view all payment history." on payment_history
  for select using (
    auth.jwt() ->> 'email' = 'vuan.edit@gmail.com'
  );

-- Create updated_at trigger
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_payment_history_updated
  before update on payment_history
  for each row execute procedure handle_updated_at();
