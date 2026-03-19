CREATE TABLE IF NOT EXISTS tenants (id SERIAL PRIMARY KEY, name VARCHAR(100), domain VARCHAR(100));
CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, tenant_id INTEGER, username VARCHAR(50), password VARCHAR(100), full_name VARCHAR(100), role VARCHAR(20) DEFAULT 'user', plan VARCHAR(20) DEFAULT 'BASIC');
CREATE TABLE IF NOT EXISTS nex_contracts (id SERIAL PRIMARY KEY, tenant_id INTEGER, company_name VARCHAR(100), contract_value VARCHAR(50), secret_details TEXT);

INSERT INTO tenants (name, domain) VALUES ('Stark Industries', 'stark.lab'), ('Wayne Enterprises', 'wayne.lab');
INSERT INTO users (tenant_id, username, password, full_name, role, plan) VALUES (1, 'alpha_manager', 'alpha123', 'Alpha Logistics Mgr', 'user', 'BASIC'), (1, 'tony.stark', 'ironman123', 'Anthony Stark', 'admin', 'PLATINUM'), (2, 'bruce.wayne', 'batman123', 'Bruce Wayne', 'admin', 'PLATINUM');
INSERT INTO nex_contracts (tenant_id, company_name, contract_value, secret_details) VALUES (1, 'Shield Logistics', '$5M', 'Project Insight ID: 882'), (2, 'Gotham Steel', '$2.4M', 'Internal ID: NX-9982');
