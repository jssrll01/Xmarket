-- Run this in Supabase SQL Editor to make the market tick automatically every minute
create extension if not exists pg_cron;

select cron.schedule(
  'xcoin_market_tick',
  '* * * * *', -- Every minute
  $$select public.xcoin_tick_market()$$
);
