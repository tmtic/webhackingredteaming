CREATE TABLE nex_contracts (id SERIAL PRIMARY KEY, company_name VARCHAR(100), contract_value VARCHAR(50), status VARCHAR(20), secret_details TEXT);
INSERT INTO nex_contracts (id, company_name, contract_value, status, secret_details) VALUES 
(101, 'Alpha Logistics', 'R$ 450.000', 'Active', 'Master-Key: SkyNet2026'),
(777, 'Stark Industries', 'R$ 1.500.000', 'Active', 'Arc Reactor Mk85 location: /opt/stark');
