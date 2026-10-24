import { useEffect } from "react";
import Icon from "./Icon";
import "../Styling/ResumePage.css";
import {
  personalInfo,
  professionalOverview,
  skills,
  experiences,
  education,
  independentProjects,
  communityContributions,
} from "../data/resumeData";

const skillGroups = skills.reduce(
  (groups, skill) => {
    const index =
      /^(C#|React|Next\.js|Java|TypeScript|HTML|Cobol|PowerShell|Python)/i.test(
        skill,
      )
        ? 0
        : /^(\.NET|Entity Framework|SQL|NoSQL|Spring Boot|Node\.js|GraphQL|AWS|Kafka|Rules Engine|Application Programming|Microsoft Azure|Solution Architecture)/i.test(
              skill,
            )
          ? 1
          : 2;
    groups[index].items.push(skill);
    return groups;
  },
  [
    { title: "Languages & interfaces", items: [] },
    { title: "Platforms & architecture", items: [] },
    { title: "Delivery & teamwork", items: [] },
  ],
);

function SectionHeading({ title }) {
  return <h2 className="resume-section-heading">{title}</h2>;
}

function Contribution({ text }) {
  const separator = text.indexOf(":");
  if (separator < 0) return <li>{text}</li>;
  return (
    <li>
      <strong>{text.slice(0, separator + 1)}</strong>
      {text.slice(separator + 1)}
    </li>
  );
}

export default function ResumePage() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = personalInfo.name + " - Resume";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="resume-page">
      <div className="resume-toolbar">
        <button className="resume-print" onClick={() => window.print()}>
          <Icon name="print" /> Print / save PDF
        </button>
      </div>
      <p className="resume-print-help">
        For PDF: use Letter paper, 100% scale, and turn off browser headers and
        footers.
      </p>
      <article
        className="resume-document"
        aria-label={personalInfo.name + " resume"}
      >
        <header className="resume-hero">
          <h1>{personalInfo.name}</h1>
          <p className="resume-role">{personalInfo.title}</p>
          <address className="resume-contact">
            <span>{personalInfo.location}</span>
            <a href={"mailto:" + personalInfo.email}>{personalInfo.email}</a>
            <a href={"tel:" + personalInfo.phone.replace(/[^\d+]/g, "")}>
              {personalInfo.phone}
            </a>
            <a href={personalInfo.linkedIn} target="_blank" rel="noreferrer">
              {personalInfo.linkedIn
                .replace(/^https?:\/\/(www\.)?/, "")
                .replace(/\/$/, "")}
            </a>
            <a href={personalInfo.resumeUrl} target="_blank" rel="noreferrer">
              {personalInfo.resumeUrl.replace(/^https?:\/\//, "")}
            </a>
          </address>
        </header>
        <section className="resume-section" id="overview">
          <SectionHeading title="Professional overview" />
          <p className="resume-overview">{professionalOverview}</p>
        </section>
        <section className="resume-section" id="experience">
          <SectionHeading title="Experience" />
          {experiences.map((exp) => (
            <article
              className="experience-entry"
              key={exp.company + exp.role + exp.duration}
            >
              <div className="experience-topline">
                <h3>
                  {exp.role}
                  <span className="experience-company"> | {exp.company}</span>
                </h3>
                <p className="experience-date">{exp.duration}</p>
              </div>
              {exp.overview && (
                <p className="experience-overview">{exp.overview}</p>
              )}
              {exp.contributions.length > 0 && (
                <ul className="experience-contributions">
                  {exp.contributions.map((text) => (
                    <Contribution text={text} key={text} />
                  ))}
                </ul>
              )}
              <ul
                className="experience-tools"
                aria-label={"Technologies and skills at " + exp.company}
              >
                {exp.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
        <section className="resume-section" id="projects">
          <SectionHeading title="Independent projects & community" />
          <ul className="resume-projects">
            {independentProjects.map((project) => (
              <li key={project.url}>
                <p>
                  <strong>{project.name} | {project.role}:</strong>{" "}
                  {project.description}
                </p>
                <a href={project.url} target="_blank" rel="noreferrer">
                  {project.linkLabel}
                </a>
              </li>
            ))}
            <Contribution text={communityContributions} />
          </ul>
        </section>
        <section className="resume-section" id="skills">
          <SectionHeading title="Skills & tools" />
          <div className="resume-toolkit">
            {skillGroups.map((group) => (
              <div className="toolkit-group" key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
        <section className="resume-section" id="education">
          <SectionHeading title="Education" />
          {education.map((edu) => (
            <article
              className="education-entry"
              key={edu.school + edu.duration}
            >
              <div>
                <h3>{edu.school}</h3>
                <p>{edu.degree}</p>
              </div>
              <span>{edu.duration}</span>
            </article>
          ))}
        </section>
      </article>
    </div>
  );
}
