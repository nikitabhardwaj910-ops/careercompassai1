export interface MockJob {
  title: string;
  company: string;
  type: string;
  location: string;
  requiredSkills: string[];
  deadline: string;
  description: string;
  status: string;
}

export const MOCK_FULL_TIME_JOBS: MockJob[] = [
  {
    title: "Frontend Developer",
    company: "TechNova Solutions",
    type: "Full-time",
    location: "Bengaluru, India",
    requiredSkills: ["React", "TypeScript", "Tailwind CSS"],
    deadline: "2026-08-15",
    description: "Build responsive web applications and collaborate with UI/UX designers.",
    status: "Active"
  },
  {
    title: "Backend Java Developer",
    company: "Infosys",
    type: "Full-time",
    location: "Pune, India",
    requiredSkills: ["Java", "Spring Boot", "PostgreSQL"],
    deadline: "2026-08-18",
    description: "Develop scalable REST APIs and microservices for enterprise applications.",
    status: "Active"
  },
  {
    title: "AI/ML Engineer",
    company: "AI Labs India",
    type: "Full-time",
    location: "Hyderabad, India",
    requiredSkills: ["Python", "TensorFlow", "NLP"],
    deadline: "2026-08-20",
    description: "Build and deploy machine learning models for real-world applications.",
    status: "Active"
  },
  {
    title: "Data Analyst",
    company: "Deloitte",
    type: "Full-time",
    location: "Gurugram, India",
    requiredSkills: ["SQL", "Power BI", "Excel", "Python"],
    deadline: "2026-08-22",
    description: "Analyze business data and create interactive dashboards for stakeholders.",
    status: "Active"
  },
  {
    title: "Software Engineer Intern",
    company: "Google",
    type: "Internship",
    location: "Bengaluru, India",
    requiredSkills: ["Java", "DSA", "Git"],
    deadline: "2026-08-25",
    description: "Work on software engineering projects with experienced mentors.",
    status: "Active"
  },
  {
    title: "DevOps Engineer",
    company: "Accenture",
    type: "Full-time",
    location: "Chennai, India",
    requiredSkills: ["Docker", "Kubernetes", "AWS", "Jenkins"],
    deadline: "2026-08-28",
    description: "Automate deployment pipelines and maintain cloud infrastructure.",
    status: "Active"
  },
  {
    title: "Cyber Security Analyst",
    company: "TCS",
    type: "Full-time",
    location: "Noida, India",
    requiredSkills: ["SIEM", "Linux", "Networking", "Security"],
    deadline: "2026-08-30",
    description: "Monitor security threats and implement cybersecurity best practices.",
    status: "Active"
  },
  {
    title: "UI/UX Designer",
    company: "DesignCraft Studio",
    type: "Full-time",
    location: "Mumbai, India",
    requiredSkills: ["Figma", "Adobe XD", "Prototyping"],
    deadline: "2026-09-01",
    description: "Design user-friendly interfaces for web and mobile applications.",
    status: "Active"
  },
  {
    title: "Full Stack Developer",
    company: "StartupHub",
    type: "Full-time",
    location: "Remote",
    requiredSkills: ["React", "Node.js", "MongoDB"],
    deadline: "2026-09-03",
    description: "Build complete web applications from frontend to backend.",
    status: "Active"
  },
  {
    title: "Cloud Engineer",
    company: "Amazon Web Services",
    type: "Full-time",
    location: "Hyderabad, India",
    requiredSkills: ["AWS", "Terraform", "Linux"],
    deadline: "2026-09-05",
    description: "Design and manage scalable cloud infrastructure solutions.",
    status: "Active"
  },
  {
    title: "Mobile App Developer",
    company: "Flipkart",
    type: "Full-time",
    location: "Bengaluru, India",
    requiredSkills: ["Flutter", "Dart", "Firebase"],
    deadline: "2026-09-08",
    description: "Develop high-performance cross-platform mobile applications.",
    status: "Active"
  },
  {
    title: "Product Manager",
    company: "Razorpay",
    type: "Full-time",
    location: "Bengaluru, India",
    requiredSkills: ["Agile", "Product Strategy", "Analytics"],
    deadline: "2026-09-10",
    description: "Define product roadmap and coordinate cross-functional teams.",
    status: "Active"
  },
  {
    title: "Business Analyst",
    company: "Capgemini",
    type: "Full-time",
    location: "Kolkata, India",
    requiredSkills: ["SQL", "Excel", "Communication"],
    deadline: "2026-09-12",
    description: "Gather business requirements and improve operational processes.",
    status: "Active"
  },
  {
    title: "Content & Social Media Executive",
    company: "Orange Sugar",
    type: "Full-time",
    location: "Remote",
    requiredSkills: ["Content Writing", "Canva", "Instagram", "SEO"],
    deadline: "2026-09-15",
    description: "Create engaging social media campaigns and digital content.",
    status: "Active"
  },
  {
    title: "Digital Marketing Specialist",
    company: "GrowthHive",
    type: "Full-time",
    location: "Delhi, India",
    requiredSkills: ["SEO", "Google Ads", "Meta Ads"],
    deadline: "2026-09-18",
    description: "Manage paid marketing campaigns and improve online presence.",
    status: "Active"
  },
  {
    title: "HR Recruiter",
    company: "PeopleFirst HR",
    type: "Full-time",
    location: "Jaipur, India",
    requiredSkills: ["Recruitment", "Communication", "ATS"],
    deadline: "2026-09-20",
    description: "Source candidates and conduct interviews for multiple roles.",
    status: "Active"
  },
  {
    title: "Financial Analyst",
    company: "KPMG",
    type: "Full-time",
    location: "Mumbai, India",
    requiredSkills: ["Excel", "Financial Modeling", "Power BI"],
    deadline: "2026-09-22",
    description: "Analyze financial reports and assist in business planning.",
    status: "Active"
  },
  {
    title: "Mechanical Design Engineer",
    company: "Tata Motors",
    type: "Full-time",
    location: "Pune, India",
    requiredSkills: ["AutoCAD", "SolidWorks", "CAD"],
    deadline: "2026-09-25",
    description: "Design and optimize automotive components for production.",
    status: "Active"
  },
  {
    title: "Civil Site Engineer",
    company: "L&T Construction",
    type: "Full-time",
    location: "Ahmedabad, India",
    requiredSkills: ["AutoCAD", "Project Management", "Construction"],
    deadline: "2026-09-28",
    description: "Supervise construction sites and ensure quality standards.",
    status: "Active"
  },
  {
    title: "Registered Nurse",
    company: "Apollo Hospitals",
    type: "Full-time",
    location: "Chennai, India",
    requiredSkills: ["Patient Care", "Emergency Response"],
    deadline: "2026-09-30",
    description: "Provide quality patient care and assist doctors in medical procedures.",
    status: "Active"
  }
];

export const MOCK_INTERNSHIPS: MockJob[] = [
  {
    title: "Software Development Intern",
    company: "Google",
    type: "Internship",
    location: "Bengaluru, India",
    requiredSkills: ["Java", "DSA", "Git", "Spring Boot"],
    deadline: "2026-08-20",
    description: "Work with senior engineers to build scalable applications, fix bugs, and participate in code reviews while gaining hands-on industry experience.",
    status: "Active"
  },
  {
    title: "Frontend Developer Intern",
    company: "TechNova Solutions",
    type: "Internship",
    location: "Remote",
    requiredSkills: ["React", "JavaScript", "Tailwind CSS"],
    deadline: "2026-08-25",
    description: "Develop responsive user interfaces, integrate APIs, and collaborate with UI/UX designers on real-world web applications.",
    status: "Active"
  },
  {
    title: "Backend Developer Intern",
    company: "Infosys",
    type: "Internship",
    location: "Pune, India",
    requiredSkills: ["Java", "Spring Boot", "PostgreSQL"],
    deadline: "2026-08-28",
    description: "Build REST APIs, manage databases, and assist in developing scalable backend services.",
    status: "Active"
  },
  {
    title: "AI/ML Intern",
    company: "Microsoft",
    type: "Internship",
    location: "Hyderabad, India",
    requiredSkills: ["Python", "TensorFlow", "Machine Learning"],
    deadline: "2026-08-30",
    description: "Develop machine learning models, preprocess datasets, and experiment with AI solutions under mentor guidance.",
    status: "Active"
  },
  {
    title: "Data Science Intern",
    company: "Deloitte",
    type: "Internship",
    location: "Gurugram, India",
    requiredSkills: ["Python", "SQL", "Pandas", "Power BI"],
    deadline: "2026-09-02",
    description: "Analyze business data, build dashboards, and generate insights using modern data analytics tools.",
    status: "Active"
  },
  {
    title: "DevOps Intern",
    company: "Amazon",
    type: "Internship",
    location: "Chennai, India",
    requiredSkills: ["Docker", "Kubernetes", "AWS"],
    deadline: "2026-09-05",
    description: "Learn cloud deployment, automate CI/CD pipelines, and monitor production infrastructure.",
    status: "Active"
  },
  {
    title: "Cloud Engineering Intern",
    company: "IBM",
    type: "Internship",
    location: "Bengaluru, India",
    requiredSkills: ["AWS", "Linux", "Terraform"],
    deadline: "2026-09-08",
    description: "Assist cloud engineers in deploying and maintaining scalable cloud infrastructure.",
    status: "Active"
  },
  {
    title: "Cyber Security Intern",
    company: "TCS",
    type: "Internship",
    location: "Noida, India",
    requiredSkills: ["Networking", "Linux", "Cyber Security"],
    deadline: "2026-09-10",
    description: "Monitor security events, identify vulnerabilities, and support incident response activities.",
    status: "Active"
  },
  {
    title: "UI/UX Design Intern",
    company: "DesignCraft Studio",
    type: "Internship",
    location: "Mumbai, India",
    requiredSkills: ["Figma", "Adobe XD", "Wireframing"],
    deadline: "2026-09-12",
    description: "Design intuitive user interfaces, create prototypes, and improve user experience across web applications.",
    status: "Active"
  },
  {
    title: "Mobile App Developer Intern",
    company: "Flipkart",
    type: "Internship",
    location: "Bengaluru, India",
    requiredSkills: ["Flutter", "Dart", "Firebase"],
    deadline: "2026-09-15",
    description: "Develop cross-platform mobile applications and optimize app performance.",
    status: "Active"
  },
  {
    title: "Product Management Intern",
    company: "Razorpay",
    type: "Internship",
    location: "Bengaluru, India",
    requiredSkills: ["Product Thinking", "Agile", "Analytics"],
    deadline: "2026-09-18",
    description: "Support product planning, feature prioritization, and market research activities.",
    status: "Active"
  },
  {
    title: "Business Analyst Intern",
    company: "Capgemini",
    type: "Internship",
    location: "Kolkata, India",
    requiredSkills: ["SQL", "Excel", "Communication"],
    deadline: "2026-09-20",
    description: "Gather business requirements, prepare reports, and assist with process improvement initiatives.",
    status: "Active"
  },
  {
    title: "Digital Marketing Intern",
    company: "GrowthHive",
    type: "Internship",
    location: "Remote",
    requiredSkills: ["SEO", "Google Ads", "Social Media Marketing"],
    deadline: "2026-09-22",
    description: "Create marketing campaigns, optimize SEO, and analyze campaign performance.",
    status: "Active"
  },
  {
    title: "Content Writing Intern",
    company: "Orange Sugar",
    type: "Internship",
    location: "Remote",
    requiredSkills: ["Content Writing", "SEO", "Canva"],
    deadline: "2026-09-25",
    description: "Write blogs, social media posts, and website content while learning content strategy.",
    status: "Active"
  },
  {
    title: "HR Recruitment Intern",
    company: "PeopleFirst HR",
    type: "Internship",
    location: "Jaipur, India",
    requiredSkills: ["Recruitment", "Communication", "MS Office"],
    deadline: "2026-09-28",
    description: "Source candidates, schedule interviews, and assist with onboarding activities.",
    status: "Active"
  },
  {
    title: "Finance Intern",
    company: "KPMG",
    type: "Internship",
    location: "Mumbai, India",
    requiredSkills: ["Excel", "Financial Analysis", "Accounting"],
    deadline: "2026-09-30",
    description: "Assist in financial reporting, budgeting, and market analysis for client projects.",
    status: "Active"
  },
  {
    title: "Mechanical Engineering Intern",
    company: "Tata Motors",
    type: "Internship",
    location: "Pune, India",
    requiredSkills: ["AutoCAD", "SolidWorks", "Mechanical Design"],
    deadline: "2026-10-03",
    description: "Support engineering teams in designing and testing automotive components.",
    status: "Active"
  },
  {
    title: "Civil Engineering Intern",
    company: "L&T Construction",
    type: "Internship",
    location: "Ahmedabad, India",
    requiredSkills: ["AutoCAD", "Construction Planning", "Site Management"],
    deadline: "2026-10-05",
    description: "Assist site engineers in project planning, supervision, and quality assurance.",
    status: "Active"
  },
  {
    title: "Graphic Design Intern",
    company: "Creative Pixels",
    type: "Internship",
    location: "Remote",
    requiredSkills: ["Photoshop", "Illustrator", "Canva"],
    deadline: "2026-10-08",
    description: "Design social media creatives, marketing banners, and branding materials for digital campaigns.",
    status: "Active"
  },
  {
    title: "QA Testing Intern",
    company: "Cognizant",
    type: "Internship",
    location: "Hyderabad, India",
    requiredSkills: ["Manual Testing", "Selenium", "Jira"],
    deadline: "2026-10-10",
    description: "Test web applications, report defects, and ensure software quality before production releases.",
    status: "Active"
  }
];

export const ALL_MOCK_JOBS = [...MOCK_FULL_TIME_JOBS, ...MOCK_INTERNSHIPS];
