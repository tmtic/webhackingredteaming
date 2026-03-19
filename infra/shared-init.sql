\c nexpartner_db;

CREATE TABLE IF NOT EXISTS tenants (id SERIAL PRIMARY KEY, name VARCHAR(255), domain VARCHAR(255), tier VARCHAR(50));
CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username VARCHAR(255) UNIQUE, full_name VARCHAR(255), email VARCHAR(255), profession VARCHAR(255), role VARCHAR(50), tenant_id INTEGER REFERENCES tenants(id), password VARCHAR(255), clearance_level INTEGER DEFAULT 1, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS wiki_articles (id SERIAL PRIMARY KEY, tenant_id INTEGER REFERENCES tenants(id), title VARCHAR(255), content TEXT, category VARCHAR(50), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS legal_assets (id SERIAL PRIMARY KEY, title VARCHAR(255), file_path TEXT, tenant_id INTEGER REFERENCES tenants(id), clearance_level INTEGER DEFAULT 1, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS audit_logs (id SERIAL PRIMARY KEY, principal_id INTEGER, tenant_id INTEGER, action TEXT, details JSONB, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

INSERT INTO tenants (name, domain, tier) VALUES 
('Global Logistics', 'globallogistics.com', 'enterprise'), ('TechFlow Solutions', 'techflow.io', 'premium'),
('HealthSync Group', 'healthsync.pt', 'enterprise'), ('Apex Capital', 'apex.net', 'premium'),
('Retail Prime', 'retail.com.br', 'standard'), ('Nexus Engineering', 'nexus.io', 'enterprise')
ON CONFLICT DO NOTHING;

DO $$
DECLARE t_id INT; i INT; u_id INT;
BEGIN
    FOR t_id IN 1..6 LOOP
        INSERT INTO users (username, full_name, email, profession, role, tenant_id, password, clearance_level)
        VALUES ('ceo_'||t_id, 'CEO '||t_id, 'ceo@t'||t_id||'.com', 'CEO', 'CEO', t_id, 'Admin2026!', 10) RETURNING id INTO u_id;
        
        FOR i IN 1..15 LOOP
            INSERT INTO users (username, full_name, email, profession, role, tenant_id, password)
            VALUES ('user_'||t_id||'_'||i, 'Funcionario '||i, 'emp'||i||'@t'||t_id||'.com', 'Staff', 'Staff', t_id, 'Pass'||i) RETURNING id INTO u_id;
            
            INSERT INTO wiki_articles (tenant_id, title, content, category) VALUES (t_id, 'Procedimento '||i, 'Confidencial', 'Segurança');
            INSERT INTO legal_assets (title, file_path, tenant_id, clearance_level) VALUES ('Doc '||t_id||'-'||i, '/vault/f.pdf', t_id, 1);
            INSERT INTO audit_logs (principal_id, tenant_id, action, details) VALUES (u_id, t_id, 'LOGIN', '{"status": "ok"}'::jsonb);
        END LOOP;
    END LOOP;
END $$;

-- Helix Identity Hub Schema
CREATE TABLE IF NOT EXISTS helix_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'user'
);

INSERT INTO helix_users (username, email, password_hash, role) 
VALUES ('tony.admin', 'tony@stark.lab', 'hash_legacy_2026', 'admin')
ON CONFLICT DO NOTHING;
