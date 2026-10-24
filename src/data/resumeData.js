export const personalInfo = {
  name: "Daniel Beals",
  title: "Senior Full Stack Engineer",
  email: "danielbealsprofemail@gmail.com",
  phone: "641-629-9635",
  location: "Pella, Iowa",
  linkedIn: "https://www.linkedin.com/in/daniel-beals-470682155/",
  resumeUrl: "https://www.the-tigerfang.com/resume",
};

export const professionalOverview = `Senior Full Stack Engineer with experience building software for manufacturing, healthcare, and finance. Core technologies include React, Next.js, C#/.NET, Java, and cloud services. Recent work includes order management, rules engine design, and AI tools for converting business rules during migration from Oracle E-Business Suite.`;

export const skills = [
  "C#",
  ".NET Core",
  "Entity Framework",
  "SQL (SQL Server, MySQL, PostgreSQL)",
  "NoSQL (MongoDB)",
  "React.js",
  "Next.js",
  "JavaScript",
  "TypeScript",
  "HTML & CSS",
  "Java",
  "Spring Boot",
  "Node.js",
  "GraphQL & REST APIs",
  "AWS (Lambda, PostgreSQL)",
  "Kafka & Camunda",
  "Rules Engines & AI Tools",
  "COBOL",
  "PowerShell",
  "Python",
  "TDD & Automated Testing",
  "Git, GitHub & GitHub Actions",
  "CI/CD (Azure DevOps, Terraform, Helm)",
  "Docker & Kubernetes",
  "Agile, Scrum & Mentoring",
  "Jira",
  "Microsoft Azure",
  "Solution Architecture",
];

export const experiences = [
  {
    role: "Senior Full Stack Engineer",
    company: "Pella Corporation",
    duration: "May 2024 - Present",
    skills: [
      "Next.js",
      "React",
      "JavaScript",
      "GraphQL",
      "Node.js",
      "Java / Spring Boot",
      "Maven",
      "PostgreSQL",
      "AWS / Lambda",
      "Kafka",
      "Camunda",
      "GitHub Actions",
      "Terraform",
      "Helm",
    ],
    overview:
      "Build and maintain the Order Management Console (OMC) on Pella's Order Orchestration (BiFrost) team to manage orders across systems.",
    contributions: [
      "Rules Engine Modernization: Designed an interim rules engine and a long-term replacement to support moving tens of thousands of business rules out of Oracle E-Business Suite (EBS).",
      "Custom AI Tooling: Built a custom AI tool with business and rules engine context to convert rules and add data. Cut several years of conversion work down to a few months, including rules with conditions up to 20,000 characters long.",
      "Backend and Workflow Modernization: Refactored GraphQL and Java/Spring Boot services. Worked with the team to integrate Camunda workflows and Kafka messaging.",
      "Frontend Development: Built Next.js and React interfaces and improved how they retrieved and handled API data.",
      "Production and Delivery: Resolved production issues, supported CI/CD through GitHub Actions, and coordinated infrastructure deployments using Terraform and Helm.",
      "Collaboration and Documentation: Worked with other teams to deliver features and wrote documentation to help developers get started and understand the system.",
    ],
  },
  {
    role: "Software Engineer II",
    company: "Medical Solutions",
    duration: "Mar 2023 - Mar 2024",
    skills: [
      "C#",
      ".NET Core",
      "SQL",
      "Azure",
      "React",
      "JavaScript",
      "TypeScript",
      "Azure Service Bus, App Configuration & Blob Storage",
    ],
    overview:
      "Developed and maintained a system that converted hospital timesheets into formats compatible with internal systems.",
    contributions: [
      "Backend Modernization: Helped rebuild the backend and API endpoints for a V2 release, with more than 1,000 unit and integration tests across the new codebase.",
      "Frontend Leadership: Led the frontend rebuild to work with the new backend, updating a codebase that had been untouched for two years.",
      "Production Support: Handled production support for data processing and integrations, including GoAnywhere managed file transfer.",
      "Team Enablement: Wrote repository and onboarding documentation and helped other developers with UI questions.",
    ],
  },
  {
    role: "Software Engineer",
    company: "DLL",
    duration: "Sep 2020 - Nov 2022",
    skills: [
      "React",
      "JavaScript",
      "Node.js",
      "C# API",
      "Azure SQL Database",
      "AWS to Azure Migration",
    ],
    overview: "",
    contributions: [
      "Technical Leadership: Led engineering for Contracts Tracking using React, Node.js, C# APIs, and Azure SQL. Also supported a credit application that generated approximately $26 million in revenue.",
      "Cloud Migration: Migrated Express Finance Portal from AWS to Azure, including a new backend and 140,000 records.",
      "Team Leadership: Filled in as Scrum Master for two teams across four projects while continuing development work. Mentored two interns and participated in hiring.",
      "Delivery and Operations: Created Azure DevOps pipelines and environment templates. Supported Azure API Management, identity and SSO, database operations, documentation, and developer training.",
    ],
  },
  {
    role: "Developer II",
    company: "Vermeer Corporation",
    duration: "Oct 2019 - Sep 2020",
    skills: [
      "C#",
      "WPF",
      "Agile Development",
      "Scrum Master",
      "Application Architecture",
    ],
    overview: "",
    contributions: [
      "Application Architecture: Designed a C#/WPF application with Entity Framework, Oracle SQL, and MongoDB, including its databases, APIs, documentation, and installation process.",
      "Application Modernization: Led upgrades and redesigned more than 50 web application pages using Oracle APEX, SQL, JavaScript, and CSS.",
      "Agile Leadership: Served as Scrum Master while working as a developer, helping the team plan and deliver its work.",
    ],
  },
  {
    role: "Developer I",
    company: "Vermeer Corporation",
    duration: "Feb 2018 - Oct 2019",
    skills: [
      "WPF",
      "C#",
      ".NET Core",
      "ASP.NET Razor",
      "Database Management",
      "Scrum and Agile Practices",
    ],
    overview:
      "Built enterprise applications, including Digital Instructions and vermeer.com, using C#, WPF, .NET Core, and ASP.NET Razor.",
    contributions: [
      "APIs and Data: Built APIs with Entity Framework and Swagger and managed Oracle SQL, MongoDB, and PostgreSQL databases. Integrated third-party software to improve file loading.",
      "Developer Productivity: Built a Jira ticket integration, maintained virtual machines and three Oracle APEX applications, and documented tools and workflows.",
      "Team Practices and Prototyping: Helped two teams adopt Agile/Scrum, served as Scrum Master, and explored augmented reality with HoloLens and Unity.",
    ],
  },
  {
    role: "Software Developer Internship",
    company: "Grinnell Mutual",
    duration: "May 2017 - Aug 2017",
    skills: ["Java", "COBOL", "HTML", "JavaScript"],
    overview:
      "Contributed to team software projects using Java, COBOL, HTML, and JavaScript.",
    contributions: [],
  },
];

export const independentProjects = [
  {
    name: "League Planner",
    role: "Product Owner & Developer",
    url: "https://league-planner.vercel.app/home",
    linkLabel: "league-planner.vercel.app",
    description:
      "Led product planning and development of a RuneScape application that helps players compare region choices, plan progression, and evaluate available equipment and resources.",
  },
  {
    name: "RuneScape Bingo",
    role: "Product Owner & Developer",
    url: "https://runescape-bingo.com/",
    linkLabel: "runescape-bingo.com",
    description:
      "Designed and developed a community tool for creating, customizing, and randomizing RuneScape bingo boards, with community board sharing and saved progress.",
  },
  {
    name: "TigerFang",
    role: "YouTube Creator",
    url: "https://www.youtube.com/@TigerFangRS",
    linkLabel: "youtube.com/@TigerFangRS",
    description:
      "Built a RuneScape channel with more than 2,000 subscribers and 130 published videos. Produce and edit content using DaVinci Resolve, explaining complex game mechanics through guides, comparisons, and demonstrations.",
  },
];

export const communityContributions =
  "Community Contributions: Contributed to Melvor Idle and PokéRogue.";

export const education = [
  {
    school: "Indian Hills Community College 4.0 GPA",
    degree:
      "Associate Degree, Computer Science: Majored in Mainframe, Software Development, Web Development",
    duration: "2016 - 2018",
  },
];
