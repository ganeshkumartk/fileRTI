BEGIN;

-- Insert English templates for Education category
INSERT INTO rti_templates (title, description, category, template_content, language_code, tags, is_featured) VALUES
('School Infrastructure Details', 'Request information about school building conditions, facilities, and maintenance records', 'education', 
'I would like to obtain the following information regarding [School Name]:

1. Details of the school building including:
   - Year of construction
   - Last renovation/repair date
   - Current structural condition assessment
   - Safety certificates and compliance reports

2. Infrastructure facilities available:
   - Number of classrooms and their capacity
   - Laboratory facilities (Science, Computer, etc.)
   - Library resources and books count
   - Sports facilities and playground area
   - Toilet facilities for boys and girls separately

3. Maintenance records for the last 3 years:
   - Annual maintenance budget allocated
   - Actual expenditure on repairs and maintenance
   - List of major repairs undertaken
   - Pending maintenance issues

4. Safety and security measures:
   - Fire safety equipment and certificates
   - Security arrangements
   - Emergency evacuation plans

Please provide this information as per the Right to Information Act, 2005.', 
'en', ARRAY['school', 'infrastructure', 'education', 'building', 'facilities'], true),

('Teacher Recruitment Information', 'Get details about teacher hiring process, vacancies, and qualifications', 'education',
'I request the following information regarding teacher recruitment in [School/District Name]:

1. Current teacher strength and sanctioned posts:
   - Subject-wise breakdown of teachers
   - Number of vacant positions
   - Student-teacher ratio

2. Recruitment process details:
   - Advertisement dates for teacher positions in last 2 years
   - Selection criteria and process followed
   - Number of applications received vs. selected
   - Timeline for recruitment process

3. Teacher qualifications and training:
   - Minimum qualification requirements for each subject
   - Training programs conducted for teachers
   - Professional development opportunities provided

4. Salary and benefits:
   - Pay scale structure for different categories
   - Additional allowances and benefits
   - Promotion criteria and process

This information is sought under the Right to Information Act, 2005.', 
'en', ARRAY['teacher', 'recruitment', 'education', 'vacancy', 'qualification'], true);

-- Insert English templates for Healthcare category
INSERT INTO rti_templates (title, description, category, template_content, language_code, tags, is_featured) VALUES
('Hospital Facilities and Services', 'Information about hospital infrastructure, equipment, and patient services', 'health',
'I seek the following information about [Hospital Name]:

1. Infrastructure and facilities:
   - Total bed capacity (general, ICU, emergency)
   - Operation theaters and their equipment status
   - Diagnostic facilities available (X-ray, CT scan, MRI, etc.)
   - Pharmacy services and medicine availability

2. Medical staff details:
   - Number of doctors (specialty-wise)
   - Nursing staff strength
   - Support staff count
   - Doctor-patient ratio

3. Patient services and statistics:
   - Average daily patient footfall (OPD)
   - Emergency services availability (24x7)
   - Ambulance services
   - Patient satisfaction surveys results

4. Financial information:
   - Annual budget allocation
   - Revenue generated from services
   - Free treatment schemes available
   - Insurance acceptance details

Please provide this information under RTI Act 2005.', 
'en', ARRAY['hospital', 'healthcare', 'medical', 'facilities', 'services'], true),

('Medical College Admission Process', 'Details about medical college admission criteria, seats, and selection process', 'health',
'I request the following information regarding the admission process at [Medical College Name]:

1. Seat allocation details:
   - Total number of MBBS/MD seats available
   - Category-wise seat distribution (General, SC, ST, OBC, etc.)
   - Management quota and NRI quota seats
   - Fee structure for different categories

2. Admission criteria:
   - Minimum eligibility requirements
   - Entrance examination details
   - Counseling process
   - Documents required for admission

3. Previous year statistics:
   - Cut-off marks/ranks for different categories
   - Number of applications received
   - State-wise distribution of admitted students
   - Gender ratio of admitted students

4. Faculty information:
   - Department-wise faculty strength
   - Qualification of teaching staff
   - Student-teacher ratio
   - Visiting faculty details

This information is sought under the Right to Information Act, 2005.', 
'en', ARRAY['medical', 'college', 'admission', 'education', 'healthcare'], false);

-- Insert English templates for Finance category
INSERT INTO rti_templates (title, description, category, template_content, language_code, tags, is_featured) VALUES
('Government Scheme Expenditure', 'Details about government scheme implementation and fund utilization', 'finance',
'I request information regarding [Scheme Name] implementation:

1. Scheme details and objectives:
   - Scheme guidelines and eligibility criteria
   - Target beneficiaries and coverage area
   - Timeline for implementation

2. Financial allocation and utilization:
   - Total budget allocated for current financial year
   - Amount released and utilized so far
   - Pending payments and reasons for delay
   - Administrative costs vs. direct beneficiary costs

3. Beneficiary information:
   - Number of applications received
   - Applications approved and rejected with reasons
   - List of beneficiaries (if permissible)
   - Grievance redressal mechanism

4. Implementation monitoring:
   - Monitoring committee details
   - Audit reports and findings
   - Corrective actions taken
   - Performance indicators and achievements

This information is requested under the Right to Information Act, 2005.', 
'en', ARRAY['scheme', 'finance', 'budget', 'expenditure', 'beneficiary'], false),

('Public Procurement Process', 'Information about government tender process, contracts awarded, and expenditures', 'finance',
'I request the following information regarding public procurement for [Project/Department Name]:

1. Tender process details:
   - List of tenders issued in the last financial year
   - Tender notification and publication process
   - Pre-qualification criteria for bidders
   - Bid evaluation methodology

2. Contract award information:
   - List of contracts awarded with values
   - Names of successful bidders/contractors
   - Basis of selection for each contract
   - Contract duration and key deliverables

3. Financial aspects:
   - Original estimated cost vs. final contract value
   - Payment schedule and disbursements made
   - Cost overruns and reasons (if any)
   - Penalty clauses and their enforcement

4. Monitoring and compliance:
   - Quality assurance mechanisms
   - Performance evaluation reports
   - Contract modifications or extensions
   - Complaints received and their resolution

This information is sought under the Right to Information Act, 2005.', 
'en', ARRAY['procurement', 'tender', 'contract', 'finance', 'government'], false);

-- Insert English templates for Infrastructure category
INSERT INTO rti_templates (title, description, category, template_content, language_code, tags, is_featured) VALUES
('Road Construction and Maintenance', 'Information about road projects, quality, and maintenance schedules', 'infrastructure',
'I would like to obtain information about road infrastructure in [Area/District Name]:

1. Road construction projects:
   - List of roads constructed in last 3 years
   - Project cost and funding source
   - Contractor details and work completion certificates
   - Quality testing reports

2. Maintenance activities:
   - Annual maintenance budget for roads
   - Maintenance schedule and frequency
   - Emergency repair procedures
   - Complaint redressal system for road issues

3. Current road conditions:
   - Assessment reports of major roads
   - Accident-prone areas identification
   - Traffic management measures
   - Street lighting status

4. Future planning:
   - Proposed road projects for next 2 years
   - Budget allocation for new constructions
   - Environmental clearances obtained
   - Land acquisition status

Please provide this information as per RTI Act 2005.', 
'en', ARRAY['road', 'construction', 'infrastructure', 'maintenance', 'transport'], false),

('Water Supply System', 'Details about water supply infrastructure, quality testing, and distribution', 'infrastructure',
'I request the following information regarding water supply in [Area/City Name]:

1. Water supply infrastructure:
   - Source of water supply
   - Treatment plants capacity and technology
   - Distribution network coverage
   - Storage reservoirs and their capacity

2. Water quality management:
   - Water quality testing frequency and parameters
   - Recent water quality test reports
   - Purification methods employed
   - Contamination incidents and remedial actions

3. Supply statistics:
   - Daily water supply quantity
   - Supply duration in different areas
   - Population covered vs. uncovered
   - Water loss/leakage percentage

4. Administration and finance:
   - Water supply department structure
   - Annual budget allocation and expenditure
   - Water charges collection system
   - Complaint management system

This information is sought under the Right to Information Act, 2005.', 
'en', ARRAY['water', 'supply', 'infrastructure', 'quality', 'distribution'], true);

-- Insert English templates for Employment category
INSERT INTO rti_templates (title, description, category, template_content, language_code, tags, is_featured) VALUES
('Government Job Vacancies', 'Information about government job openings, selection process, and recruitment', 'employment',
'I request the following information regarding government employment:

1. Current job vacancies:
   - Department-wise vacant positions
   - Post-wise qualification requirements
   - Reserved category breakup (SC/ST/OBC/General)
   - Expected advertisement dates

2. Recruitment process:
   - Selection procedure for different posts
   - Examination pattern and syllabus
   - Interview process and weightage
   - Medical examination requirements

3. Previous recruitment statistics:
   - Applications received vs. selected in last 2 years
   - Category-wise selection data
   - Average time taken for recruitment process
   - Pending recruitment processes

4. Employee benefits and policies:
   - Salary structure and allowances
   - Promotion policies and criteria
   - Training and development programs
   - Retirement benefits

This information is sought under the Right to Information Act, 2005.', 
'en', ARRAY['employment', 'job', 'recruitment', 'vacancy', 'government'], false),

('Employment Scheme Implementation', 'Details about employment generation schemes, beneficiaries, and outcomes', 'employment',
'I request information regarding the implementation of [Employment Scheme Name]:

1. Scheme overview:
   - Objectives and target beneficiaries
   - Implementation guidelines
   - Eligibility criteria
   - Application process

2. Implementation statistics:
   - Number of beneficiaries in last financial year
   - Funds allocated and utilized
   - Employment days generated
   - Wage payment details and timelines

3. Project details:
   - Types of projects undertaken
   - Selection criteria for projects
   - Average duration of projects
   - Skill development components

4. Monitoring and evaluation:
   - Monitoring mechanism
   - Social audit findings
   - Impact assessment studies
   - Grievance redressal system

This information is requested under the Right to Information Act, 2005.', 
'en', ARRAY['employment', 'scheme', 'MGNREGA', 'jobs', 'rural'], true);

-- Insert Hindi templates
INSERT INTO rti_templates (title, description, category, template_content, language_code, tags, is_featured) VALUES
('स्कूल की जानकारी', 'स्कूल की सुविधाओं और शिक्षा व्यवस्था के बारे में जानकारी', 'education',
'मैं [स्कूल का नाम] के संबंध में निम्नलिखित जानकारी चाहता हूं:

1. स्कूल की बुनियादी सुविधाएं:
   - कक्षाओं की संख्या और उनकी क्षमता
   - शिक्षकों की संख्या (विषयवार)
   - पुस्तकालय और प्रयोगशाला की सुविधा
   - खेल के मैदान और अन्य सुविधाएं

2. शिक्षा की गुणवत्ता:
   - पिछले 3 वर्षों के परीक्षा परिणाम
   - शिक्षकों की योग्यता और प्रशिक्षण
   - अतिरिक्त गतिविधियों का आयोजन

3. वित्तीय जानकारी:
   - वार्षिक बजट और खर्च
   - सरकारी अनुदान की राशि
   - फीस संरचना और छूट योजनाएं

कृपया यह जानकारी सूचना का अधिकार अधिनियम 2005 के तहत प्रदान करें।', 
'hi', ARRAY['स्कूल', 'शिक्षा', 'सुविधा', 'जानकारी'], true),

('अस्पताल की सेवाएं', 'अस्पताल की सुविधाओं और चिकित्सा सेवाओं की जानकारी', 'health',
'मैं [अस्पताल का नाम] के बारे में निम्न जानकारी चाहता हूं:

1. अस्पताल की सुविधाएं:
   - बेड की कुल संख्या (सामान्य, आईसीयू, आपातकाल)
   - डॉक्टरों और नर्सों की संख्या
   - उपकरण और मशीनों की स्थिति
   - दवाओं की उपलब्धता

2. मरीजों की सेवाएं:
   - दैनिक मरीजों की संख्या
   - आपातकालीन सेवाएं (24 घंटे)
   - एम्बुलेंस सेवा
   - निःशुल्क इलाज की योजनाएं

3. वित्तीय विवरण:
   - वार्षिक बजट आवंटन
   - सेवाओं से प्राप्त आय
   - सरकारी अनुदान

कृपया यह जानकारी RTI अधिनियम 2005 के अंतर्गत प्रदान करें।', 
'hi', ARRAY['अस्पताल', 'स्वास्थ्य', 'चिकित्सा', 'सेवा'], true),

('सरकारी नौकरी रिक्तियां', 'सरकारी नौकरियों, चयन प्रक्रिया और भर्ती के बारे में जानकारी', 'employment',
'मैं सरकारी रोजगार के संबंध में निम्नलिखित जानकारी का अनुरोध करता हूं:

1. वर्तमान रिक्त पद:
   - विभाग-वार रिक्त पदों की संख्या
   - पद-वार योग्यता आवश्यकताएं
   - आरक्षित श्रेणी विभाजन (SC/ST/OBC/सामान्य)
   - विज्ञापन की संभावित तिथियां

2. भर्ती प्रक्रिया:
   - विभिन्न पदों के लिए चयन प्रक्रिया
   - परीक्षा पैटर्न और पाठ्यक्रम
   - साक्षात्कार प्रक्रिया
   - चिकित्सा परीक्षा आवश्यकताएं

3. पिछली भर्ती के आंकड़े:
   - पिछले 2 वर्षों में प्राप्त आवेदन बनाम चयनित
   - श्रेणी-वार चयन डेटा
   - भर्ती प्रक्रिया में लगने वाला औसत समय
   - लंबित भर्ती प्रक्रियाएं

यह जानकारी सूचना का अधिकार अधिनियम, 2005 के तहत मांगी गई है।', 
'hi', ARRAY['रोजगार', 'नौकरी', 'भर्ती', 'रिक्ति', 'सरकारी'], false);

COMMIT;
