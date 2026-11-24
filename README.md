# RS MMM Frontend

React website containing the TigerFang homepage and a RuneScape Money Making Methods tracker. Visitors can browse, filter, and sort methods. Adding and editing methods requires the owner's Google sign-in and API authorization. Visitors can request a résumé by email; the résumé itself is not published on the site.

Live site: [www.the-tigerfang.com](https://www.the-tigerfang.com/). The domain was purchased through GoDaddy; Azure Static Web Apps hosts the frontend.

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
| RuneScape methods | [http://localhost:3000/rs_MMM](http://localhost:3000/rs_MMM) | Yes |

The homepage and résumé request links work without starting the backend or connecting to SQL Server. Existing `/resume` URLs, including subpaths, redirect to the homepage.

## Environment configuration

The repository's `.env` supplies the background-image list. Use `.env.example` as a reference and create an ignored `.env.local` file beside `package.json` for local overrides:

```dotenv
REACT_APP_BACKGROUND_IMAGES=/image/1.jpg,/image/3.jpg,/image/4.jpg,/image/5.jpg,/image/6.jpg,/image/7.jpg
REACT_APP_VERSION=0.1.3
REACT_APP_API_URL=https://rsmmmapi.azurewebsites.net
REACT_APP_GOOGLE_CLIENT_ID=
```

| Variable | Purpose |
| --- | --- |
| `REACT_APP_BACKGROUND_IMAGES` | Optional comma-separated image URLs for the RuneScape page. An empty or missing value falls back to the bundled images 3, 4, and 6. Files under `public/image/` are served as `/image/...`. |
| `REACT_APP_VERSION` | Optional version label in the site footer. The deployment workflow reads it from `package.json`. |
| `REACT_APP_API_URL` | API base URL shared by data requests, mutations, and session verification through `src/config/api.js`. Defaults to `https://rsmmmapi.azurewebsites.net` when missing or empty. |
| `REACT_APP_GOOGLE_CLIENT_ID` | Public Google OAuth Web client ID. When missing or empty, owner sign-in and editing controls stay hidden. |

Restart `npm start` after changing environment files. React environment values are included in the browser bundle, so they must not contain database credentials, client secrets, or the owner allowlist. Local overrides are not available to GitHub Actions. The deployment workflow reads the GitHub repository variables `REACT_APP_API_URL` and `REACT_APP_GOOGLE_CLIENT_ID` at build time.

## Résumé privacy and requests

The public header, footer, page title, and web app manifest use **TigerFang** without the owner's full name. The public résumé page and its personal details are removed from the application. Routes matching `/resume/*` redirect to the homepage.

**Request résumé** links use the `mailto:` URL defined in `src/config/contact.js`. The owner explicitly chose the professional email address used there. Clicking a link opens the visitor's email application; it does not automatically send a message or deliver a résumé. The recipient address is visible in the link and browser bundle.

The original résumé component, stylesheet, and data are preserved locally under the Git-ignored `private-resume/src/` directory, with their original relative paths. They are outside the application source tree, are not imported by the app, and are not deployed. This local copy is not included in fresh clones. Keep personal résumé content out of `src/` and `public/` when changing the site.

Removing these files from the current application does not erase earlier Git commits, previously deployed content, or copies already held by browsers and search engines. The updated site must be deployed before visitors receive the change.

## Appearance

The home and RuneScape pages use dark blue panels, gold accents, the existing artwork, and the `RuneScape UF` display font when installed (with a Georgia fallback). Shared navigation and footer styles are in `src/App.css`; method-page layout styles are in `src/Styling/MethodsPage.css`.

The header uses the supplied transparent logo at `public/image/tigerfang-logo.png` and the name **TigerFang**. The methods page opens directly into the table panel, with an animated loading ring and skeleton rows while either API request is pending. Loading animations respect reduced-motion preferences. Intensity badge colors follow the API IDs: 1 / Super AFK (green), 2 / AFK (teal), 3 / Chill (blue), 4 / Focused (amber), and 5 / Super Engaging (coral). Labels remain visible, and unknown IDs use a neutral badge.

Browser and mobile icons use a transparent crowned white tiger derived from the supplied logo. The `public/tigerfang-icon-*.png` sizes serve browser tabs, Apple touch icons, and the web app manifest; `public/tigerfang-favicon.ico` includes 16 through 256 pixel sizes. `public/favicon.ico` is the matching fallback for browsers that request the conventional path. The full header artwork remains at `public/image/tigerfang-logo.png`.

## How the projects connect

```text
Browser -> React frontend -> ASP.NET Core API -> SQL Server / Azure SQL
```

The related `RS_MMM_BACKEND` repository contains database scripts and an Azure template. The runnable API source was found in a separate checkout:

```text
C:\Users\sctig\Repos\
  RS_MMM_FRONTEND\RS_MMM_Frontend\   React application (this repository)
  RS_MMM_BACKEND\                   SQL scripts and infrastructure template
  sctigerfang69\RS_MM API\RS_MM API\ ASP.NET Core API project
```

See the [backend setup instructions](https://github.com/ScTigerFang/RS_MMM_BACKEND/blob/main/README.md) for database initialization, API startup, and the local SDK workaround. When working locally, the same instructions are in `C:\Users\sctig\Repos\RS_MMM_BACKEND\README.md`.

### API configuration

All API calls use the shared base URL in `src/config/api.js`. To use the local API described in the backend setup instructions, set `REACT_APP_API_URL=http://localhost:5130` in `.env.local` and restart the frontend. Starting a local API without this override leaves requests pointed at the hosted API.

The API needs a working development database connection and a CORS policy allowing the exact frontend origin. `http://localhost:3000` and `http://127.0.0.1:3000` are different origins. Public reads use GET `/MoneyMakingMethod` and GET `/Intensity`; owner writes use POST `/MoneyMakingMethod` and PUT `/MoneyMakingMethod/{id}`.

### Owner sign-in setup

The methods page remains readable without signing in. Choosing **Owner sign in** loads Google's sign-in button. The frontend sends the returned Google ID token to GET `/auth/session` as a Bearer token and enables editing only after the API confirms owner access and a future expiration time. The credential stays in memory, so reloading the page requires signing in again. Expiration or sign-out removes editing controls; mutation requests also check the session immediately before sending the token.

Create or select an OAuth client with the **Web application** type and configure its OAuth branding using [Google's official setup guide](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid). Add these Authorized JavaScript origins:

- `https://www.the-tigerfang.com`
- `https://the-tigerfang.com`
- `http://localhost`
- `http://localhost:3000`

The two localhost entries follow Google's local-development guidance. This app uses a JavaScript callback for sign-in, so it does not need a redirect URI or a client secret for this flow.

Configure the same client ID in the frontend's `REACT_APP_GOOGLE_CLIENT_ID` and the API's `Auth__GoogleClientId`. Set `Auth__OwnerEmail` only in the API environment to the confirmed owner Gmail account. Optionally set `Auth__OwnerSubject` there to pin access to that account's stable Google subject identifier. The API must verify the token and enforce owner authorization on every mutation; a successful Google sign-in alone does not grant editing access.

The site's public client ID is configured in `.env` and as the deployment workflow's fallback. A nonempty `REACT_APP_GOOGLE_CLIENT_ID` GitHub repository variable overrides that fallback. For local frontend overrides, use `.env.local`.

The local API project uses .NET user secrets (`rs-mmm-api-owner-auth`) for its client ID and owner email in the Development environment. These settings stay outside Git and are not deployed. Start it with `--no-launch-profile -- --urls http://localhost:5130 --environment Development` to avoid opening a browser; set `REACT_APP_API_URL=http://localhost:5130` in the frontend's `.env.local` when testing against it. A working development database is still needed for the methods table.

For production, set `Auth__GoogleClientId` to the same public client ID and `Auth__OwnerEmail` to the confirmed owner account in Azure App Service environment variables. Keep the owner allowlist out of frontend files and variables. A real Google login and production authorization still require the protected API to be configured and deployed.

## Build and test

```powershell
npm run build
npm test -- --watchAll=false --runInBand
```

The production build writes to `build/`. The build script sets `CI=false`; a successful build does not mean the test suite passed.

The interaction tests mock Axios, so they make no live API writes. When changing résumé privacy behavior, check the request links and legacy route redirects, then inspect the generated HTML, manifest, JavaScript, and source maps for unintended personal details or résumé content. The explicitly selected request email remains public by design.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| npm cannot find `package.json` | Change into `RS_MMM_FRONTEND\RS_MMM_Frontend`, not its parent directory. |
| Unexpected game background | Set `REACT_APP_BACKGROUND_IMAGES` in `.env.local`, then restart the server. Only the RuneScape page uses that list. |
| Port 3000 is occupied | Use the server already running there, or stop it with Ctrl+C in its terminal before restarting. A different frontend port requires a matching CORS policy when using the local API. |
| Home works but RS MMM shows an error | Check the hosted API and its database connection. The homepage does not query the API. |
| Request résumé does not open an email application | Check that the visitor has an email application configured to handle `mailto:` links. The site does not submit an email through the API. |
| Local API works in Swagger but browser requests fail | Check `REACT_APP_API_URL`, the exact frontend origin allowed by CORS, and any HTTPS certificate errors. Restart the frontend after changing `.env.local`. |
| Owner sign-in controls are missing | Set `REACT_APP_GOOGLE_CLIENT_ID`, then restart the development server or rebuild the deployed frontend. Missing configuration intentionally leaves editing disabled. |
| Google sign-in succeeds but editing remains disabled | Check `/auth/session`, the API's client ID and owner configuration, and that the selected Google account is the configured owner. The client IDs must match. |
| Browserslist or Babel warnings | The current toolchain can emit dependency-maintenance warnings. Record them separately from compilation failures. |

## Deployment

[.github/workflows/the-tigerfang_deployment.yml](.github/workflows/the-tigerfang_deployment.yml) builds and deploys to **Azure Static Web Apps** on pushes to `main` and handles pull-request deployments. The workflow uses the GitHub secret `TheTigerFang_deployment` for the Azure deployment token and publishes the `build/` directory. Its API location is empty, so it does not deploy the separate C# API.

Deploy the API authorization changes and configure its `Auth__*` settings before deploying the frontend. Hiding Add/Edit controls in the frontend cannot prevent direct requests to an unprotected API. Verify that anonymous and non-owner writes are rejected by the deployed API, then deploy the frontend with its matching client ID and API URL.

`staticwebapp.config.json` defines SPA navigation fallback and cache headers. GoDaddy is the DNS provider recorded for the site. Running `npm start` or `npm run build` locally does not deploy the website.

These changes have not been deployed. The public client ID is configured; real Google sign-in verification still needs the protected API running with its owner configuration.
