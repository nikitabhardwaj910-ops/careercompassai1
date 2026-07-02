package com.talentnavigate.backend.services;

import com.talentnavigate.backend.models.Job;
import com.talentnavigate.backend.repositories.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class JobDataSeeder implements CommandLineRunner {

    @Autowired
    private JobRepository jobRepository;

    @Override
    public void run(String... args) throws Exception {
        if (jobRepository.count() < 5) {
            seedFullTimeJobs();
            seedInternships();
            System.out.println("Successfully seeded 40 mock jobs and internships into the database.");
        }
    }

    private void seedFullTimeJobs() {
        Object[][] fullTimeData = {
            {"Frontend Developer", "TechNova Solutions", "Full-time", "Bengaluru, India", "Build responsive web applications and collaborate with UI/UX designers.", "15-08-2026", List.of("React", "TypeScript", "Tailwind CSS")},
            {"Backend Java Developer", "Infosys", "Full-time", "Pune, India", "Develop scalable REST APIs and microservices for enterprise applications.", "18-08-2026", List.of("Java", "Spring Boot", "PostgreSQL")},
            {"AI/ML Engineer", "AI Labs India", "Full-time", "Hyderabad, India", "Build and deploy machine learning models for real-world applications.", "20-08-2026", List.of("Python", "TensorFlow", "NLP")},
            {"Data Analyst", "Deloitte", "Full-time", "Gurugram, India", "Analyze business data and create interactive dashboards for stakeholders.", "22-08-2026", List.of("SQL", "Power BI", "Excel", "Python")},
            {"Software Engineer Intern", "Google", "Internship", "Bengaluru, India", "Work on software engineering projects with experienced mentors.", "25-08-2026", List.of("Java", "DSA", "Git")},
            {"DevOps Engineer", "Accenture", "Full-time", "Chennai, India", "Automate deployment pipelines and maintain cloud infrastructure.", "28-08-2026", List.of("Docker", "Kubernetes", "AWS", "Jenkins")},
            {"Cyber Security Analyst", "TCS", "Full-time", "Noida, India", "Monitor security threats and implement cybersecurity best practices.", "30-08-2026", List.of("SIEM", "Linux", "Networking", "Security")},
            {"UI/UX Designer", "DesignCraft Studio", "Full-time", "Mumbai, India", "Design user-friendly interfaces for web and mobile applications.", "01-09-2026", List.of("Figma", "Adobe XD", "Prototyping")},
            {"Full Stack Developer", "StartupHub", "Full-time", "Remote", "Build complete web applications from frontend to backend.", "03-09-2026", List.of("React", "Node.js", "MongoDB")},
            {"Cloud Engineer", "Amazon Web Services", "Full-time", "Hyderabad, India", "Design and manage scalable cloud infrastructure solutions.", "05-09-2026", List.of("AWS", "Terraform", "Linux")},
            {"Mobile App Developer", "Flipkart", "Full-time", "Bengaluru, India", "Develop high-performance cross-platform mobile applications.", "08-09-2026", List.of("Flutter", "Dart", "Firebase")},
            {"Product Manager", "Razorpay", "Full-time", "Bengaluru, India", "Define product roadmap and coordinate cross-functional teams.", "10-09-2026", List.of("Agile", "Product Strategy", "Analytics")},
            {"Business Analyst", "Capgemini", "Full-time", "Kolkata, India", "Gather business requirements and improve operational processes.", "12-09-2026", List.of("SQL", "Excel", "Communication")},
            {"Content & Social Media Executive", "Orange Sugar", "Full-time", "Remote", "Create engaging social media campaigns and digital content.", "15-09-2026", List.of("Content Writing", "Canva", "Instagram", "SEO")},
            {"Digital Marketing Specialist", "GrowthHive", "Full-time", "Delhi, India", "Manage paid marketing campaigns and improve online presence.", "18-09-2026", List.of("SEO", "Google Ads", "Meta Ads")},
            {"HR Recruiter", "PeopleFirst HR", "Full-time", "Jaipur, India", "Source candidates and conduct interviews for multiple roles.", "20-09-2026", List.of("Recruitment", "Communication", "ATS")},
            {"Financial Analyst", "KPMG", "Full-time", "Mumbai, India", "Analyze financial reports and assist in business planning.", "22-09-2026", List.of("Excel", "Financial Modeling", "Power BI")},
            {"Mechanical Design Engineer", "Tata Motors", "Full-time", "Pune, India", "Design and optimize automotive components for production.", "25-09-2026", List.of("AutoCAD", "SolidWorks", "CAD")},
            {"Civil Site Engineer", "L&T Construction", "Full-time", "Ahmedabad, India", "Supervise construction sites and ensure quality standards.", "28-09-2026", List.of("AutoCAD", "Project Management", "Construction")},
            {"Registered Nurse", "Apollo Hospitals", "Full-time", "Chennai, India", "Provide quality patient care and assist doctors in medical procedures.", "30-09-2026", List.of("Patient Care", "Emergency Response")}
        };

        for (Object[] row : fullTimeData) {
            saveJob((String) row[0], (String) row[1], (String) row[2], (String) row[3], (String) row[4], (String) row[5], (List<String>) row[6]);
        }
    }

    private void seedInternships() {
        Object[][] internshipData = {
            {"Software Development Intern", "Google", "Internship", "Bengaluru, India", "Work with senior engineers to build scalable applications, fix bugs, and participate in code reviews while gaining hands-on industry experience.", "20-08-2026", List.of("Java", "DSA", "Git", "Spring Boot")},
            {"Frontend Developer Intern", "TechNova Solutions", "Internship", "Remote", "Develop responsive user interfaces, integrate APIs, and collaborate with UI/UX designers on real-world web applications.", "25-08-2026", List.of("React", "JavaScript", "Tailwind CSS")},
            {"Backend Developer Intern", "Infosys", "Internship", "Pune, India", "Build REST APIs, manage databases, and assist in developing scalable backend services.", "28-08-2026", List.of("Java", "Spring Boot", "PostgreSQL")},
            {"AI/ML Intern", "Microsoft", "Internship", "Hyderabad, India", "Develop machine learning models, preprocess datasets, and experiment with AI solutions under mentor guidance.", "30-08-2026", List.of("Python", "TensorFlow", "Machine Learning")},
            {"Data Science Intern", "Deloitte", "Internship", "Gurugram, India", "Analyze business data, build dashboards, and generate insights using modern data analytics tools.", "02-09-2026", List.of("Python", "SQL", "Pandas", "Power BI")},
            {"DevOps Intern", "Amazon", "Internship", "Chennai, India", "Learn cloud deployment, automate CI/CD pipelines, and monitor production infrastructure.", "05-09-2026", List.of("Docker", "Kubernetes", "AWS")},
            {"Cloud Engineering Intern", "IBM", "Internship", "Bengaluru, India", "Assist cloud engineers in deploying and maintaining scalable cloud infrastructure.", "08-09-2026", List.of("AWS", "Linux", "Terraform")},
            {"Cyber Security Intern", "TCS", "Internship", "Noida, India", "Monitor security events, identify vulnerabilities, and support incident response activities.", "10-09-2026", List.of("Networking", "Linux", "Cyber Security")},
            {"UI/UX Design Intern", "DesignCraft Studio", "Internship", "Mumbai, India", "Design intuitive user interfaces, create prototypes, and improve user experience across web applications.", "12-09-2026", List.of("Figma", "Adobe XD", "Wireframing")},
            {"Mobile App Developer Intern", "Flipkart", "Internship", "Bengaluru, India", "Develop cross-platform mobile applications and optimize app performance.", "15-09-2026", List.of("Flutter", "Dart", "Firebase")},
            {"Product Management Intern", "Razorpay", "Internship", "Bengaluru, India", "Support product planning, feature prioritization, and market research activities.", "18-09-2026", List.of("Product Thinking", "Agile", "Analytics")},
            {"Business Analyst Intern", "Capgemini", "Internship", "Kolkata, India", "Gather business requirements, prepare reports, and assist with process improvement initiatives.", "20-09-2026", List.of("SQL", "Excel", "Communication")},
            {"Digital Marketing Intern", "GrowthHive", "Internship", "Remote", "Create marketing campaigns, optimize SEO, and analyze campaign performance.", "22-09-2026", List.of("SEO", "Google Ads", "Social Media Marketing")},
            {"Content Writing Intern", "Orange Sugar", "Internship", "Remote", "Write blogs, social media posts, and website content while learning content strategy.", "25-09-2026", List.of("Content Writing", "SEO", "Canva")},
            {"HR Recruitment Intern", "PeopleFirst HR", "Internship", "Jaipur, India", "Source candidates, schedule interviews, and assist with onboarding activities.", "28-09-2026", List.of("Recruitment", "Communication", "MS Office")},
            {"Finance Intern", "KPMG", "Internship", "Mumbai, India", "Assist in financial reporting, budgeting, and market analysis for client projects.", "30-09-2026", List.of("Excel", "Financial Analysis", "Accounting")},
            {"Mechanical Engineering Intern", "Tata Motors", "Internship", "Pune, India", "Support engineering teams in designing and testing automotive components.", "03-10-2026", List.of("AutoCAD", "SolidWorks", "Mechanical Design")},
            {"Civil Engineering Intern", "L&T Construction", "Internship", "Ahmedabad, India", "Assist site engineers in project planning, supervision, and quality assurance.", "05-10-2026", List.of("AutoCAD", "Construction Planning", "Site Management")},
            {"Graphic Design Intern", "Creative Pixels", "Internship", "Remote", "Design social media creatives, marketing banners, and branding materials for digital campaigns.", "08-10-2026", List.of("Photoshop", "Illustrator", "Canva")},
            {"QA Testing Intern", "Cognizant", "Internship", "Hyderabad, India", "Test web applications, report defects, and ensure software quality before production releases.", "10-10-2026", List.of("Manual Testing", "Selenium", "Jira")}
        };

        for (Object[] row : internshipData) {
            saveJob((String) row[0], (String) row[1], (String) row[2], (String) row[3], (String) row[4], (String) row[5], (List<String>) row[6]);
        }
    }

    private void saveJob(String title, String company, String type, String location, String description, String deadline, List<String> skills) {
        Job job = new Job();
        job.setTitle(title);
        job.setCompany(company);
        job.setType(type);
        job.setLocation(location);
        job.setDescription(description);
        job.setDeadline(deadline);
        job.setRequiredSkills(skills);
        job.setStatus("Active");
        job.setApplicantsCount(0);
        job.setPostedAt(LocalDateTime.now());
        jobRepository.save(job);
    }
}
