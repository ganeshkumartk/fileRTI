-- Insert central government departments
INSERT INTO departments (name, code, description, is_active) VALUES
('Ministry of Home Affairs', 'MHA', 'Internal security, law and order, immigration', true),
('Ministry of Finance', 'MOF', 'Financial affairs, taxation, economic policy', true),
('Ministry of Education', 'MOE', 'Education policy and programs', true),
('Ministry of Health and Family Welfare', 'MOHFW', 'Health policy and family welfare programs', true),
('Ministry of Railways', 'MOR', 'Railway operations and policy', true),
('Ministry of External Affairs', 'MEA', 'Foreign relations and diplomatic affairs', true),
('Ministry of Defence', 'MOD', 'National defense and security', true),
('Ministry of Agriculture and Farmers Welfare', 'MOAFW', 'Agriculture policy and farmers welfare', true),
('Ministry of Environment, Forest and Climate Change', 'MOEFCC', 'Environmental policy and climate change', true),
('Ministry of Information and Broadcasting', 'MIB', 'Information policy and broadcasting regulations', true);

-- Insert state departments
INSERT INTO departments (name, code, description, is_active) VALUES
('Delhi Education Department', 'DED', 'Education department for Delhi', true),
('Delhi Health Department', 'DHD', 'Health department for Delhi', true),
('Maharashtra Education Department', 'MED', 'Education department for Maharashtra', true),
('Maharashtra Health Department', 'MHD', 'Health department for Maharashtra', true),
('Karnataka Education Department', 'KED', 'Education department for Karnataka', true),
('Karnataka Health Department', 'KHD', 'Health department for Karnataka', true);

-- Insert local bodies
INSERT INTO departments (name, code, description, is_active) VALUES
('Municipal Corporation of Delhi', 'MCD', 'Local government body for Delhi', true),
('Brihanmumbai Municipal Corporation', 'BMC', 'Local government body for Mumbai', true),
('Bruhat Bengaluru Mahanagara Palike', 'BBMP', 'Local government body for Bengaluru', true);
