# RS MMM Frontend

React website containing a personal homepage, a professional resume, and a RuneScape Money Making Methods tracker. The tracker displays profit and intensity information and supports filtering, sorting, adding, and editing methods.

Live site: [www.the-tigerfang.com](https://www.the-tigerfang.com/). Live resume: [www.the-tigerfang.com/resume](https://www.the-tigerfang.com/resume). The domain was purchased through GoDaddy; Azure Static Web Apps hosts the frontend.

## Quick start

Prerequisites: Git, Node.js, and npm. Local development and the production build were verified with Node.js **20.19.0** and npm **10.8.2** on Windows.

The examples use PowerShell; adjust the workstation paths if your checkouts live elsewhere. Run commands from the folder containing this README and `package.json`. In the current workspace, the frontend is nested one directory below `RS_MMM_FRONTEND`:

```powershell
Set-Location 'C:\Users\sctig\Repos\RS_MMM_FRONTEND\RS_MMM_Frontend'
npm ci
npm start
```

`npm ci` installs the versions recorded in `package-lock.json`. Keep the terminal running and open [http://localhost:3000](http://localhost:3000). Source changes reload automatically. Press **Ctrl+C** in the terminal to stop the server.

| Page | Local URL | Needs the API? |
| --- | --- | --- |
| Home | [http://localhost:3000/](http://localhost:3000/) | No |
| Resume | [http://localhost:3000/resume](http://localhost:3000/resume) | No |
| RuneScape methods | [http://localhost:3000/rs_MMM](http://localhost:3000/rs_MMM) | Yes |

The resume can be edited and previewed without starting the backend or connecting to SQL Server. Its plain background is independent of the RuneScape artwork on the other pages.

## Environment configuration

The repository's `.env` supplies the background-image list. To override it locally, create an ignored `.env.local` file beside `package.json`:

```dotenv
REACT_APP_BACKGROUND_IMAGES=/image/1.jpg,/image/3.jpg,/image/4.jpg,/image/5.jpg,/image/6.jpg,/image/7.jpg
REACT_APP_VERSION=0.1.3
```

| Variable | Purpose |
| --- | --- |
| `REACT_APP_BACKGROUND_IMAGES` | Optional comma-separated image URLs for the RuneScape page. An empty or missing value falls back to the bundled images 3, 4, and 6. Files under `public/image/` are served as `/image/...`. |
| `REACT_APP_VERSION` | Optional version label in the site footer. The deployment workflow reads it from `package.json`. |

Restart `npm start` after changing environment files. React environment values are included in the browser bundle, so they must not contain database credentials or other secrets. Local overrides are not available to GitHub Actions; deployment needs the checked-in `.env` or equivalent workflow configuration.

## Editing the resume

| File | What to change |
| --- | --- |
| [src/data/resumeData.js](src/data/resumeData.js) | Contact information, live resume URL, professional overview, skills, experience, independent projects, community contributions, and education. |
| [src/components/ResumePage.js](src/components/ResumePage.js) | Section structure and rendered markup. |
| [src/Styling/ResumePage.css](src/Styling/ResumePage.css) | Resume typography, spacing, lists, and print styles. |
| [src/App.js](src/App.js) | Navigation and page routes. |
| [src/App.css](src/App.css) and [src/index.css](src/index.css) | Shared styles that can also affect the resume. |

With `npm start` running, edit these files and inspect `/resume`. Career history and skills remain in `resumeData.js`. The resume is presented as a document, with a separate print stylesheet that removes the site navigation, footer, controls, and artwork.

`personalInfo.title` controls the professional title beneath the name. Experience entries appear in array order, with the current Pella Corporation role first. Keep contributions focused on achievements; an empty `overview` or `contributions` array is supported when it would repeat other details. Pella includes the existing Order Management Console work and the rules-engine migration, interim and long-term designs, and custom AI tooling. The summary and skills reflect this current work.

The home and RuneScape pages use dark blue panels, gold accents, the existing artwork, and the `RuneScape UF` display font when installed (with a Georgia fallback). The resume uses a plain white document and keeps the display font for its name on screen. Printing uses Georgia for the name and Arial for body text, with black text, visible contact details, and page numbers. Shared navigation and footer styles are in `src/App.css`; method-page layout styles are in `src/Styling/MethodsPage.css`.

The header uses the supplied transparent logo at `public/image/tigerfang-logo.png` and the name **TigerFang**. The resume toolbar contains the print button without repeating the navigation breadcrumb. The methods page opens directly into the table panel, with an animated loading ring and skeleton rows while either API request is pending. Loading animations respect reduced-motion preferences. Intensity badge colors follow the API IDs: 1 / Super AFK (green), 2 / AFK (teal), 3 / Chill (blue), 4 / Focused (amber), and 5 / Super Engaging (coral). Labels remain visible, and unknown IDs use a neutral badge.

Browser and mobile icons use a transparent crowned white tiger derived from the supplied logo. The `public/tigerfang-icon-*.png` sizes serve browser tabs, Apple touch icons, and the web app manifest; `public/tigerfang-favicon.ico` includes 16 through 256 pixel sizes. `public/favicon.ico` is the matching fallback for browsers that request the conventional path. The full header artwork remains at `public/image/tigerfang-logo.png`.

### Printing or saving the resume as a PDF

1. Open `/resume` and click **Print / save PDF** (or use the browser's Print command).
2. Choose **Save as PDF** or your printer.
3. Use **Letter**, **Portrait**, **100% scale**, and **Default margins**. The stylesheet supplies half-inch page margins.
4. Turn off the browser's **Headers and footers** so it does not add the site URL or date.
5. Check every page in the preview, then save or print.

The current content, including all six positions and the independent projects and community section, was exported and visually checked as **two Letter pages**, with every experience entry kept together. Repeated descriptions and general-purpose skills were condensed to prioritize professional experience. Email, phone, LinkedIn, and the live resume URL are visible and linked in the PDF. Project and YouTube links remain readable on paper. `personalInfo.resumeUrl` stores the public URL even when viewing or printing locally. The document title supplies a useful default PDF filename.

After updating `resumeData.js`, check the print preview again. Pagination flows with the content; the layout has no fixed page height or hidden overflow that could cut off additional text. A longer resume can add pages. Preserve the print rules for section headings, job entries, and list items when changing the layout.

## How the projects connect

```text
Browser -> React frontend -> ASP.NET Core API -> SQL Server / Azure SQL
                 |
                 +-> Resume content in src/data/resumeData.js
```

The related `RS_MMM_BACKEND` repository contains database scripts and an Azure template. The runnable API source was found in a separate checkout:

```text
C:\Users\sctig\Repos\
  RS_MMM_FRONTEND\RS_MMM_Frontend\   React application (this repository)
  RS_MMM_BACKEND\                   SQL scripts and infrastructure template
  sctigerfang69\RS_MM API\RS_MM API\ ASP.NET Core API project
```

See the [backend setup instructions](https://github.com/ScTigerFang/RS_MMM_BACKEND/blob/main/README.md) for database initialization, API startup, and the local SDK workaround. When working locally, the same instructions are in `C:\Users\sctig\Repos\RS_MMM_BACKEND\README.md`.

### API configuration limitation

The following hooks currently hardcode `https://rsmmmapi.azurewebsites.net`:

- `src/hooks/useMethods.js` — GET `/MoneyMakingMethod`.
- `src/hooks/useIntensity.js` — GET `/Intensity`.
- `src/hooks/useCreateMethod.js` — POST `/MoneyMakingMethod`.
- `src/hooks/useUpdateMethod.js` — PUT `/MoneyMakingMethod/{id}`.

Starting a local API does **not** switch these requests to localhost. There is currently no implemented API-base-URL environment variable; adding `REACT_APP_API_URL` alone has no effect. Add/Edit controls target the hosted API even when this frontend runs locally.

To connect the full stack locally, the hooks need a shared configurable API base URL pointing to the local API, and that API needs a working development database connection. Its current CORS policy allows the exact browser origin `http://localhost:3000`; `http://127.0.0.1:3000` is a different origin. These integration changes are not part of the current setup.

## Build and test

```powershell
npm run build
npm test -- --watchAll=false --runInBand
```

The production build writes to `build/`. The build script sets `CI=false`; a successful build does not mean the test suite passed.

Verification on **October 24, 2026**:

- Development server started; the resume rendered and survived a direct browser reload.
- Production build passed.
- The updated interaction suite passes five tests covering loading until both API responses arrive, resume navigation and printing, background isolation, method filtering/sorting/editing, and a failed save that preserves the form. These tests mock Axios, so they make no live API writes.
- The education section now uses valid article/paragraph markup, resolving the previous DOM-nesting warning.
- The complete resume PDF was rendered and all pages visually inspected; the current content fits two Letter pages. No site navigation, artwork, or marketing copy appears in the PDF.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| npm cannot find `package.json` | Change into `RS_MMM_FRONTEND\RS_MMM_Frontend`, not its parent directory. |
| Unexpected game background | Set `REACT_APP_BACKGROUND_IMAGES` in `.env.local`, then restart the server. Only the RuneScape page uses that list; the resume always uses its plain background. |
| Port 3000 is occupied | Use the server already running there, or stop it with Ctrl+C in its terminal before restarting. A different frontend port requires a matching CORS policy when using the local API. |
| Resume works but RS MMM shows an error | Check the hosted API and its database connection. The resume does not query the API. |
| Local API works in Swagger but browser requests fail | Check the hardcoded hook URLs, the exact frontend origin allowed by CORS, and any HTTPS certificate errors. |
| Browserslist or Babel warnings | The current toolchain emits dependency-maintenance warnings. Record them separately from compilation failures; the verified build passed with these warnings. |

## Deployment

[.github/workflows/the-tigerfang_deployment.yml](.github/workflows/the-tigerfang_deployment.yml) builds and deploys to **Azure Static Web Apps** on pushes to `main` and handles pull-request deployments. The workflow uses the GitHub secret `TheTigerFang_deployment` for the Azure deployment token and publishes the `build/` directory. Its API location is empty, so it does not deploy the separate C# API.

`staticwebapp.config.json` defines SPA navigation fallback and cache headers. GoDaddy is the DNS provider recorded for the site. Running `npm start` or `npm run build` locally does not deploy the website.
