\c nexpartner_db;

-- Gerando 15 logs corporativos detalhados com payloads JSONB realistas para o Tenant 1
DO $$
DECLARE
    u_id INT;
BEGIN
    SELECT id INTO u_id FROM users WHERE username = 'ceo_1' LIMIT 1;
    
    INSERT INTO audit_logs (principal_id, tenant_id, action, details, created_at) VALUES 
    (u_id, 1, 'AUTH_SUCCESS', '{"ip_address": "203.0.113.45", "user_agent": "Mozilla/5.0", "mfa_used": true, "location": "Sao Paulo, BR"}', NOW() - INTERVAL '2 days'),
    (u_id, 1, 'VAULT_ACCESS', '{"document": "Financial_Report_Q3.pdf", "clearance_required": 5, "protocol": "HTTPS"}', NOW() - INTERVAL '1 day 10 hours'),
    (u_id, 1, 'POLICY_SYNC', '{"sync_target": "AWS_IAM_Integration", "status": "COMPLETED", "changes_pushed": 12}', NOW() - INTERVAL '1 day 5 hours'),
    (u_id, 1, 'GLOBAL_CONNECT_INIT', '{"partner_id": "TechFlow_B2B", "handshake_latency_ms": 14}', NOW() - INTERVAL '12 hours'),
    (u_id, 1, 'MEMBER_PROVISION', '{"target_user": "analyst_jr", "assigned_role": "Staff", "approver": "ceo_1"}', NOW() - INTERVAL '5 hours'),
    (u_id, 1, 'FAILED_LOGIN', '{"ip_address": "185.15.22.1", "reason": "Invalid Credentials", "risk_score": 85}', NOW() - INTERVAL '2 hours'),
    (u_id, 1, 'SYSTEM_DIAGNOSTIC', '{"node": "NEX-CORE-01", "cpu_load_avg": 45, "memory_status": "Healthy"}', NOW() - INTERVAL '30 minutes'),
    (u_id, 1, 'AUTH_SUCCESS', '{"ip_address": "177.100.20.15", "user_agent": "NexPartner Desktop Client v2.1", "location": "Rio de Janeiro, BR"}', NOW() - INTERVAL '5 minutes');
END $$;
