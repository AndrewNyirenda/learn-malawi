
#!/bin/bash

# Set your token
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjZGZhNzI4Ny1jODY2LTQ3NzItOTYwYS04N2M0YWQzMDY0OTgiLCJlbWFpbCI6InN1cGVyYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlIjoiQWRtaW4iLCJmaXJzdE5hbWUiOiJTdXBlciIsImxhc3ROYW1lIjoiQWRtaW4iLCJpYXQiOjE3NjkwMzMzMzQsImV4cCI6MTc2OTAzNjkzNH0.kr8YSXieX9pVEoazgAyPcNI5HoYR-Es7MqtDSCd9zGk"
API_URL="http://localhost:3000"

# Function to create news article
create_article() {
  local title="$1"
  local description="$2"
  local content="$3"
  local category="$4"
  local author="$5"
  
  echo "Creating article: $title"
  
  curl -X POST "$API_URL/news" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"title\": \"$title\",
      \"description\": \"$description\",
      \"content\": \"$content\",
      \"category\": \"$category\",
      \"isPublished\": true
    }" | python3 -m json.tool
  
  echo ""
}

# Article 1
create_article \
  "MANEB announce PSLCE, JCE results, records strong pass rate" \
  "Strong performance in national exams with 87.5% PSLCE and 77.61% JCE pass rates" \
  "The 2025 national examinations have registered strong pass rates, with 87.5 percent of Primary School Leaving Certificate of Education (PSLCE) candidates and 77.61 percent of Junior Certificate of Education (JCE) candidates passing, according to results released today by the Malawi National Examinations Board (MANEB). Announcing the results at the Bingu International Convention Centre (BICC), MANEB Executive Director Professor Dorothy Nampota said out of 247,958 candidates who sat for PSLCE, 216,972 passed, with Mzuzu City and Zomba Urban recording the highest performance. For JCE, 158,451 candidates sat the exams, and 122,977 passed, with Phalombe and Zomba District leading the results. Nampota emphasized that all examinations were leakage-free, describing the outcome as clean and credible. The release comes barely days after reports circulated on social media alleging that some candidates had already accessed their results online, claims which MANEB dismissed as false." \
  "Education" \
  "Peter Moyo"

# Article 2
create_article \
  "MANEB tightens exam security as MSCE candidates surge" \
  "Enhanced security measures for record number of MSCE candidates" \
  "The Malawi National Examinations Board (MANEB) has assured the public of enhanced security for the 2025 Malawi School Certificate of Education (MSCE) exams, as candidate numbers reach a record high. Speaking to Malawi24, MANEB spokesperson, Angella Kashitigu said the board is working closely with the Malawi Police Service (MPS) and the Malawi Defence Force (MDF) to ensure the credibility and safety of the exams, set for July 1–25. 'We've partnered with security agencies to prevent malpractice and safeguard the integrity of the exams,' Kashitigu said. 'The Defence Force will secure storage facilities, while police officers will be stationed at all exam centres.' She added that past incidents of exam leakages have led to tighter controls, including increased security at printing sites, storage depots, and examination venues. Trained invigilators and supervisors will also help uphold standards. This year, 202,940 students have registered for the MSCE—up from 177,434 in 2024. The cohort includes 97,089 female and 105,851 male candidates. Kashitigu said the rising numbers reflect growing trust in the national examination system and a deepening commitment to education. 'More students sitting the MSCE is a sign of public confidence. We remain committed to credible exams at all levels,' she said. MANEB has urged students, parents, and educators to support efforts to ensure a fair and secure exam process." \
  "Education" \
  "Innocent Gomwa"

# Article 3
create_article \
  "JCE exams start today with over 166,000 candidates" \
  "Over 166,000 candidates begin Junior Certificate examinations across Malawi" \
  "The 2025 Junior Certificate of Education (JCE) examinations have started today, Tuesday, June 3, with over 166,000 candidates expected to sit for the national exams, which will run until Thursday, June 12, 2025. According to the Malawi National Examinations Board (MANEB), a total of 166,123 candidates have registered for this year's JCE exams. This includes 85,902 females and 80,221 males, showing a slight increase from the 163,950 candidates who sat for the 2024 exams. MANEB also revealed that 5,218 students with visual impairments have registered across the Primary School Leaving Certificate of Education (PSLCE), JCE, and Malawi School Certificate of Education (MSCE) examinations. These include 2,681 female and 2,537 male candidates, reflecting the board's commitment to inclusive education. In light of past challenges—such as the 2025 PSLCE exams, where some candidates sat without proper identification—MANEB has assured the public that such issues have been addressed. Final logistical preparations were completed over the weekend, with exam papers and materials successfully distributed to all the 1,468 examination centres across the country. Parents, guardians, and communities are being encouraged to support candidates throughout the examination period by providing a calm and conducive environment." \
  "Education" \
  "Education Correspondent"

# Article 4
create_article \
  "Government launches free digital learning platform for all students" \
  "New e-learning initiative to provide free access to educational resources" \
  "The Ministry of Education has officially launched a comprehensive digital learning platform that will provide free access to educational resources for all primary and secondary school students across Malawi. The platform, named 'Learn Malawi Digital Hub,' features interactive lessons, past papers, study guides, and virtual classrooms. Education Minister, Agnes Nyalonje, stated that this initiative aims to bridge the digital divide and ensure equitable access to quality education, especially in rural areas. The platform will be accessible through mobile phones, tablets, and computers, with offline capabilities for areas with limited internet connectivity." \
  "Technology" \
  "Sarah Banda"

# Article 5
create_article \
  "Record number of students qualify for university placements" \
  "Increased university admissions reflect improved secondary education outcomes" \
  "The National Council for Higher Education has announced that a record 45,000 students have qualified for university placements this year, representing a 15% increase from last year. This milestone reflects the improving quality of secondary education and better preparation of students for higher education. The council has also introduced new scholarship programs to support disadvantaged students in pursuing STEM (Science, Technology, Engineering, and Mathematics) fields, aiming to address the skills gap in these critical areas." \
  "Education" \
  "James Phiri"

# Article 6
create_article \
  "New curriculum focuses on practical skills and entrepreneurship" \
  "Curriculum reform to better prepare students for job market" \
  "Starting next academic year, primary and secondary schools will implement a revised curriculum that emphasizes practical skills, entrepreneurship, and digital literacy. The new curriculum integrates coding basics, financial literacy, and vocational skills alongside traditional subjects. Education officials say these changes aim to better prepare students for the evolving job market and encourage innovative thinking. Teacher training programs are already underway to ensure smooth implementation of the new curriculum across all schools." \
  "Education" \
  "Grace Mwale"

echo "All articles created successfully!"
EOF

chmod +x upload_news.sh
