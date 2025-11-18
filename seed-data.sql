-- Seed initial game data for foosball tracker
-- This will add 21 wins for Usama and 15 wins for Nicholas

-- Insert 21 wins for Usama
INSERT INTO wins (player, delta, created_at)
SELECT 
    'Usama' as player,
    1 as delta,
    NOW() - (random() * interval '30 days') as created_at
FROM generate_series(1, 21);

-- Insert 15 wins for Nicholas
INSERT INTO wins (player, delta, created_at)
SELECT 
    'Nicholas' as player,
    1 as delta,
    NOW() - (random() * interval '30 days') as created_at
FROM generate_series(1, 15);
