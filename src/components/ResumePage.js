import React from "react";
import "../Styling/ResumePage.css";
import {
  personalInfo,
  professionalOverview,
  skills,
  experiences,
  education,
} from "../data/resumeData"; // Adjust the path as necessary

function ResumePage() {
  return (
    <div className="resume-container">
      <header className="resume-header">
        <h1>{personalInfo.name}</h1>
        <p>
          Email: {personalInfo.email} | Phone: {personalInfo.phone}
        </p>
        <p>
          LinkedIn:{" "}
          <a href={personalInfo.linkedIn}>
            {personalInfo.name} {personalInfo.location}
          </a>
        </p>
      </header>

      <section className="professional-overview">
        <h2>Professional Overview</h2>
        <p>{professionalOverview}</p>
      </section>

      <section className="skills">
        <h2>Skills</h2>
        <ul className="skills-list">
          {skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </section>

      <section className="experience">
        <h2>Experience</h2>
        {experiences.map((exp, index) => (
          <article key={index}>
            <h3>
              {exp.role} - {exp.company}
            </h3>
            <p>{exp.duration}</p>
            <div className="experience-skills">
              <h4>Skills Utilized</h4>
              <ul className="experience-skills-list">
                {exp.skills.map((skill, sIndex) => (
                  <li key={sIndex}>{skill}</li>
                ))}
              </ul>
            </div>
            <p>{exp.overview}</p>
            <ul>
              {exp.contributions.map((contribution, cIndex) => (
                <li key={cIndex}>{contribution}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="education">
        <h2>Education</h2>
        {education.map((edu, index) => (
          <p key={index}>
            {edu.school} - {edu.degree}, {edu.duration}
          </p>
        ))}
      </section>

      <footer className="resume-footer">
        <p>Last updated on: {new Date().toLocaleDateString()}</p>
      </footer>
    </div>
  );
}

export default ResumePage;
