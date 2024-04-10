import React from "react";
import "../Styling/ResumePage.css"; // Assuming you create a specific CSS file for styling

function ResumePage() {
  return (
    <div className="resume-container">
      <header className="resume-header">
        <h1>Daniel Beals</h1>
        <p>Email: danielbealsprofemail@gmail.com | Phone: 641-629-9635</p>
        <p>
          LinkedIn: Daniel Beals, Pella Iowa Link
          https://www.linkedin.com/in/daniel-beals-470682155/
        </p>
      </header>

      <section className="professional-overview">
        <h2>Professional Overview</h2>
        <p>
          A dedicated and innovative Full Stack Developer with extensive
          experience in designing, developing, and maintaining responsive and
          efficient software solutions. Proficient in both front-end and
          back-end technologies, I have a proven track record of leveraging the
          full software development lifecycle to deliver complex projects from
          conception through deployment. With a strong foundation in React, C#,
          .NET Core, APIs, SQL, and modern cloud infrastructure, I excel at
          building scalable applications that meet and exceed business
          requirements. My approach combines technical excellence with a deep
          commitment to understanding user needs, resulting in software that not
          only performs exceptional but also delivers a seamless user
          experience. A natural problem-solver and team collaborator, I thrive
          in environments where I can contribute to innovative solutions and
          continuous improvement. I naturally lean towards being a mentor as I
          show a strong skill set for leadership and helping others.
        </p>
      </section>

      <section className="skills">
        <h2>Skills</h2>
        <ul>
          {/* List your skills */}
          <li>Entity Framework</li>
          <li>C#</li>
          {/* Add the rest of the skills */}
        </ul>
      </section>

      <section className="experience">
        <h2>Experience</h2>
        {experiences.map((exp) => (
          <article key={exp.company}>
            <h3>
              {exp.role} - {exp.company}
            </h3>
            <p>{exp.duration}</p>
            <p>{exp.overview}</p>
            <ul>
              {exp.contributions.map((contribution, index) => (
                <li key={index}>{contribution}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="education">
        <h2>Education</h2>
        <p>
          Indian Hills Community College - Associate's degree, Computer Science,
          2016 - 2018
        </p>
      </section>

      {/* Include other sections like Licenses & Certifications, Honors & Awards as needed */}

      <footer className="resume-footer">
        {/* Footer can include date of last update or any other info */}
        <p>Last updated on: {/* Dynamic date or static */}</p>
      </footer>
    </div>
  );
}

export default ResumePage;

// You might define this outside your component or in a separate file for clarity
const experiences = [
  {
    role: "Software Engineer II",
    company: "Medical Solutions",
    duration: "Mar 2023 - Mar 2024",
    overview:
      "Project Overview: Contributed to the development and maintenance of a crucial system designed for processing and converting hospital timesheets into formats compatible with internal systems. This initiative ensured seamless data integration and enhanced operational efficiency.",
    contributions: [
      "Collaborative Backend Overhaul: Actively participated in the collaborative effort...",
      "Frontend Revitalization: Led the overhaul of the frontend to align with the new backend architecture.",
      // Add more contributions as needed
    ],
  },
  {
    role: "Software Engineer II",
    company: "DLL",
    duration: "Sep 2020 - Nov 2022",
    overview:
      "Filled in for absent Scrum Master, overseeing 2 teams, and 4 projects. Mentored 2 interns, contributing to their development and integration within the team. Led a project on contracts tracking with a tech stack of React JS/JavaScript/Node with C# API backend using Azure SQL Database. Managed and enhanced the Express Finance Portal project, migrating from AWS to Azure with significant data migration. Supported the development of a customer-initiated credit application generating substantial revenue.",
    contributions: [
      "Mentored 2 interns, contributing to their development and integration within the team.",
      // Add more contributions as needed
    ],
  },
  // Add more experiences as needed
];
