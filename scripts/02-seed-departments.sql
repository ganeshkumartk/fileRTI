BEGIN;

-- Insert central government departments
INSERT INTO departments (name, code, description, is_active) VALUES
('Ministry of Home Affairs', 'MHA', 'Responsible for internal security, law and order, and immigration', true),
('Ministry of Finance', 'MOF', 'Responsible for financial affairs, taxation, and economic policy', true),
('Ministry of Education', 'MOE', 'Responsible for education policy and programs', true),
('Ministry of Health and Family Welfare', 'MOHFW', 'Responsible for health policy and family welfare programs', true),
('Ministry of Railways', 'MOR', 'Responsible for railway operations and policy', true),
('Ministry of External Affairs', 'MEA', 'Responsible for foreign relations and diplomatic affairs', true),
('Ministry of Defence', 'MOD', 'Responsible for national defense and security', true),
('Ministry of Agriculture and Farmers Welfare', 'MOAFW', 'Responsible for agriculture policy and farmers welfare', true),
('Ministry of Environment, Forest and Climate Change', 'MOEFCC', 'Responsible for environmental policy and climate change initiatives', true),
('Ministry of Information and Broadcasting', 'MIB', 'Responsible for information policy and broadcasting regulations', true);

-- Insert state government departments (for a few states)
INSERT INTO departments (name, code, description, is_active) VALUES
('Department of Education - Delhi', 'DOE-DL', 'Education department for Delhi state', true),
('Department of Health - Delhi', 'DOH-DL', 'Health department for Delhi state', true),
('Department of Education - Maharashtra', 'DOE-MH', 'Education department for Maharashtra state', true),
('Department of Health - Maharashtra', 'DOH-MH', 'Health department for Maharashtra state', true),
('Department of Education - Karnataka', 'DOE-KA', 'Education department for Karnataka state', true),
('Department of Health - Karnataka', 'DOH-KA', 'Health department for Karnataka state', true);

-- Insert local government departments
INSERT INTO departments (name, code, description, is_active) VALUES
('Municipal Corporation of Delhi', 'MCD', 'Local government body for Delhi', true),
('Brihanmumbai Municipal Corporation', 'BMC', 'Local government body for Mumbai', true),
('Bruhat Bengaluru Mahanagara Palike', 'BBMP', 'Local government body for Bengaluru', true);

COMMIT;
