CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT,
    full_name TEXT,
    role TEXT,
    tenant_id INT
);

CREATE TABLE IF NOT EXISTS nex_contracts (
    id SERIAL PRIMARY KEY,
    owner_tenant_id INT,
    company_name TEXT,
    contract_value TEXT,
    status TEXT,
    secret_details TEXT
);

INSERT INTO users (username, password, full_name, role, tenant_id) VALUES 
('admin@nexpartner.com', 'admin_master_2026', 'Global Administrator', 'admin', 0),
('m.silva@alpha.com', 'alpha123', 'Marcos Silva', 'manager', 1),
('analista.financeiro@alpha.com', 'alpha@99', 'Ana Souza', 'editor', 1),
('t.stark@stark.com', 'jarvis123', 'Tony Stark', 'admin', 2),
('b.wayne@wayne.com', 'batman', 'Bruce Wayne', 'admin', 3),
('l.luthor@lex.com', 'kryptonite', 'Lex Luthor', 'admin', 4),
('j.doe@guest.com', 'guest123', 'John Doe', 'viewer', 5)
ON CONFLICT DO NOTHING;

INSERT INTO nex_contracts (owner_tenant_id, company_name, contract_value, status, secret_details) VALUES 
(1, 'Alpha Logistics South', 'R$ 850.000', 'Vigente', 'Acesso Galpão: 5544#'),
(1, 'Alpha Logistics Matriz', 'R$ 1.200.000', 'Vigente', 'Key-Auth: NX-ALPHA-SEC'),
(2, 'Stark Industries Research', 'R$ 45.000.000', 'Vigente', 'Blueprints: /mnt/stark/mark85'),
(3, 'Wayne Enterprises Tech', 'R$ 5.500.000', 'Pendente', 'Bat-Cave: waterfall_entry'),
(4, 'LexCorp Aerospace', 'R$ 12.000.000', 'Vigente', 'Metahuman database access active')
ON CONFLICT DO NOTHING;
