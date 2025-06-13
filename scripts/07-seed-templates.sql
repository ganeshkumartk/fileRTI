-- Insert English templates
INSERT INTO rti_templates (title, description, category, template_content, language_code, tags, is_featured) VALUES

-- Education Templates
('School Infrastructure Information', 'Request details about school facilities, infrastructure, and maintenance', 'education', 
'I would like to obtain information regarding [School/Institution Name]:

1. Infrastructure Details:
   - Total number of classrooms and their capacity
   - Laboratory facilities (Science, Computer, Language labs)
   - Library resources and book inventory
   - Sports facilities and playground area
   - Separate toilet facilities for boys and girls

2. Building and Safety:
   - Year of construction and last renovation
   - Structural safety certificates
   - Fire safety equipment and compliance
   - Drinking water facilities and quality reports

3. Maintenance Records:
   - Annual maintenance budget allocation
   - Expenditure on repairs in last 3 years
   - Pending maintenance issues
   - Cleanliness and hygiene measures

Please provide this information under the Right to Information Act, 2005.', 
'en', ARRAY['school', 'infrastructure', 'education', 'facilities'], true),

('Teacher Information and Recruitment', 'Details about teaching staff, qualifications, and recruitment process', 'education',
'I request information about teaching staff at [School/Institution Name]:

1. Staff Details:
   - Total number of teachers (subject-wise breakdown)
   - Teacher-student ratio
   - Qualification details of teaching staff
   - Training and professional development programs

2. Recruitment Process:
   - Vacant teaching positions
   - Recent recruitment advertisements and results
   - Selection criteria and process
   - Salary structure and benefits

3. Performance Metrics:
   - Student performance in board examinations
   - Extra-curricular activities organized
   - Parent-teacher interaction programs
   - Grievance redressal mechanism

This information is sought under the Right to Information Act, 2005.', 
'en', ARRAY['teacher', 'recruitment', 'education', 'staff'], true),

-- Healthcare Templates
('Hospital Services and Facilities', 'Information about hospital infrastructure, services, and patient care', 'health',
'I seek information about [Hospital/Health Center Name]:

1. Infrastructure and Equipment:
   - Total bed capacity (General, ICU, Emergency)
   - Operation theaters and medical equipment status
   - Diagnostic facilities (X-ray, CT scan, MRI, Lab)
   - Pharmacy services and medicine availability

2. Medical Staff:
   - Number of doctors (specialty-wise)
   - Nursing staff strength
   - Support staff details
   - Duty rosters and availability

3. Patient Services:
   - Daily patient footfall (OPD and IPD)
   - Emergency services (24x7 availability)
   - Ambulance services
   - Free treatment schemes and eligibility

4. Quality and Compliance:
   - Accreditation certificates
   - Patient satisfaction surveys
   - Complaint redressal system
   - Infection control measures

Please provide this information under RTI Act 2005.', 
'en', ARRAY['hospital', 'healthcare', 'medical', 'services'], true),

-- Finance Templates
('Government Scheme Implementation', 'Details about government scheme funds, beneficiaries, and implementation', 'finance',
'I request information regarding [Scheme Name] implementation:

1. Scheme Overview:
   - Objectives and target beneficiaries
   - Eligibility criteria and application process
   - Implementation timeline and milestones

2. Financial Details:
   - Total budget allocated for current year
   - Funds released and utilized
   - Pending payments and reasons
   - Administrative vs. direct benefit costs

3. Beneficiary Information:
   - Number of applications received and processed
   - List of beneficiaries (if permissible under RTI)
   - Rejection reasons and appeals
   - Grievance redressal mechanism

4. Monitoring and Evaluation:
   - Implementation monitoring committee
   - Audit reports and findings
   - Performance indicators achieved
   - Corrective measures taken

This information is requested under the Right to Information Act, 2005.', 
'en', ARRAY['scheme', 'finance', 'government', 'benefits'], false),

-- Infrastructure Templates
('Road Development and Maintenance', 'Information about road construction, quality, and maintenance activities', 'infrastructure',
'I would like information about road infrastructure in [Area/City Name]:

1. Construction Projects:
   - Roads constructed in last 3 years
   - Project costs and funding sources
   - Contractor details and completion certificates
   - Quality testing reports and compliance

2. Maintenance Activities:
   - Annual maintenance budget
   - Maintenance schedule and frequency
   - Emergency repair procedures
   - Pothole filling and road resurfacing

3. Current Status:
   - Road condition assessment reports
   - Traffic management measures
   - Street lighting status and maintenance
   - Accident-prone areas and safety measures

4. Future Plans:
   - Proposed road projects for next 2 years
   - Budget allocation for new constructions
   - Environmental clearances
   - Land acquisition status

Please provide this information as per RTI Act 2005.', 
'en', ARRAY['road', 'infrastructure', 'construction', 'maintenance'], false),

-- Employment Templates
('Government Job Vacancies and Recruitment', 'Information about job openings, selection process, and employment policies', 'employment',
'I request information regarding government employment opportunities:

1. Current Vacancies:
   - Department-wise vacant positions
   - Post-wise qualification requirements
   - Reserved category distribution (SC/ST/OBC/General)
   - Expected advertisement timeline

2. Recruitment Process:
   - Selection procedure for different posts
   - Examination pattern and syllabus
   - Interview process and evaluation criteria
   - Medical examination requirements

3. Employment Statistics:
   - Applications received vs. selected (last 2 years)
   - Category-wise selection data
   - Average recruitment timeline
   - Pending recruitment processes

4. Employee Benefits:
   - Salary structure and allowances
   - Promotion policies and career progression
   - Training and skill development programs
   - Retirement and welfare benefits

This information is sought under the Right to Information Act, 2005.', 
'en', ARRAY['employment', 'jobs', 'recruitment', 'government'], false);

-- Insert Hindi templates
INSERT INTO rti_templates (title, description, category, template_content, language_code, tags, is_featured) VALUES

('स्कूल की सुविधाएं और जानकारी', 'स्कूल की बुनियादी सुविधाओं और शिक्षा व्यवस्था के बारे में जानकारी', 'education',
'मैं [स्कूल/संस्थान का नाम] के संबंध में निम्नलिखित जानकारी चाहता हूं:

1. बुनियादी सुविधाएं:
   - कक्षाओं की कुल संख्या और उनकी क्षमता
   - प्रयोगशाला सुविधाएं (विज्ञान, कंप्यूटर, भाषा)
   - पुस्तकालय और पुस्तकों की संख्या
   - खेल सुविधाएं और मैदान का क्षेत्रफल
   - लड़के-लड़कियों के लिए अलग शौचालय

2. भवन और सुरक्षा:
   - निर्माण वर्ष और अंतिम मरम्मत
   - संरचनात्मक सुरक्षा प्रमाणपत्र
   - अग्निशमन उपकरण और अनुपालन
   - पेयजल सुविधा और गुणवत्ता रिपोर्ट

3. रखरखाव रिकॉर्ड:
   - वार्षिक रखरखाव बजट आवंटन
   - पिछले 3 वर्षों में मरम्मत पर खर्च
   - लंबित रखरखाव के मुद्दे
   - सफाई और स्वच्छता के उपाय

कृपया यह जानकारी सूचना का अधिकार अधिनियम, 2005 के तहत प्रदान करें।', 
'hi', ARRAY['स्कूल', 'शिक्षा', 'सुविधाएं', 'जानकारी'], true),

('अस्पताल की सेवाएं और सुविधाएं', 'अस्पताल की सुविधाओं, सेवाओं और मरीजों की देखभाल के बारे में जानकारी', 'health',
'मैं [अस्पताल/स्वास्थ्य केंद्र का नाम] के बारे में जानकारी चाहता हूं:

1. बुनियादी ढांचा और उपकरण:
   - कुल बेड क्षमता (सामान्य, आईसीयू, आपातकाल)
   - ऑपरेशन थिएटर और चिकित्सा उपकरणों की स्थिति
   - निदान सुविधाएं (एक्स-रे, सीटी स्कैन, एमआरआई, लैब)
   - फार्मेसी सेवाएं और दवाओं की उपलब्धता

2. चिकित्सा कर्मचारी:
   - डॉक्टरों की संख्या (विशेषज्ञता के अनुसार)
   - नर्सिंग स्टाफ की संख्या
   - सहायक कर्मचारियों का विवरण
   - ड्यूटी रोस्टर और उपलब्धता

3. मरीजों की सेवाएं:
   - दैनिक मरीजों की संख्या (ओपीडी और आईपीडी)
   - आपातकालीन सेवाएं (24x7 उपलब्धता)
   - एम्बुलेंस सेवाएं
   - मुफ्त इलाज योजनाएं और पात्रता

कृपया यह जानकारी आरटीआई अधिनियम 2005 के तहत प्रदान करें।', 
'hi', ARRAY['अस्पताल', 'स्वास्थ्य', 'चिकित्सा', 'सेवाएं'], true);
