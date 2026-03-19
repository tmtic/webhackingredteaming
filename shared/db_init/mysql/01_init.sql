CREATE DATABASE IF NOT EXISTS redteam_db;
USE redteam_db;

-- Usuários e Contratos para NexPartner
CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(50), password VARCHAR(50));
INSERT INTO users VALUES (1, 'admin', 'admin123'), (2, 'parceiro_alpha', 'alpha2026');

CREATE TABLE IF NOT EXISTS nex_contracts (id INT PRIMARY KEY, owner_id INT, company_name VARCHAR(100), contract_value VARCHAR(50), status VARCHAR(20), secret_details TEXT);
INSERT INTO nex_contracts VALUES 
(101, 2, 'Alpha Logistics', 'R$ 450.000', 'Active', 'SkyNet Code: 0000'),
(310, 1, 'Cyberdyne Systems', 'R$ 9.999.000', 'Active', 'T-800 CPU docs'),
(777, 3, 'Stark Industries', 'R$ 1.500.000', 'Active', 'Vibranium Specs');
