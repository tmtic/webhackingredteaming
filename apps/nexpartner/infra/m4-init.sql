\c nexpartner_db;
CREATE TABLE marketplace_coupons (id SERIAL PRIMARY KEY, code TEXT UNIQUE, discount_value DECIMAL(10,2), usage_limit INTEGER, current_usage INTEGER DEFAULT 0);
INSERT INTO marketplace_coupons (code, discount_value, usage_limit) VALUES ('PARTNER2026', 100.00, 50), ('BETA_TESTER', 500.00, 1);
ALTER TABLE users ADD COLUMN internal_metadata JSONB DEFAULT '{}';
UPDATE users SET internal_metadata = '{"prototype_mode": false, "debug_access": true}' WHERE username = 'thiago';
