## II. Deployment & CI/CD

### [CTOC-0005][DevOps] Local Development Environment Setup
- **Description:** Ensure the entire project (frontend and backend) can be run locally with minimal setup.
- **Acceptance Criteria:**
    - Running a single command (e.g., `npm run dev:all`) starts both frontend and backend services.
    - Both services are accessible and functional locally.
    - **Integration Tests:** Verify communication between frontend and backend is possible.
- **Dependencies:**
    - [CTOC-0002][DevOps] Setup Frontend Project with React, Vite, TypeScript
    - [CTOC-0003][DevOps] Setup Backend Project with Node.js and Express
- **Subtasks:**
    - None

### [CTOC-0006][DevOps] Basic Deployment to GitHub Pages / Vercel (Frontend)
- **Description:** Set up continuous deployment for the frontend to a hosting service (e.g., GitHub Pages or Vercel) for demo purposes.
- **Acceptance Criteria:**
    - Frontend application is successfully deployed and accessible via a public URL.
    - Deployment process is automated upon code pushes to the main branch.
- **Dependencies:** [CTOC-0002][DevOps] Setup Frontend Project with React, Vite, TypeScript
- **Subtasks:**
    - None

### [CTOC-0007][DevOps] Basic Deployment to Render / Heroku (Backend)
- **Description:** Set up continuous deployment for the backend to a hosting service (e.g., Render or Heroku) for demo purposes.
- **Acceptance Criteria:**
    - Backend API is successfully deployed and accessible via a public URL.
    - Deployment process is automated upon code pushes to the main branch.
- **Dependencies:** [CTOC-0003][DevOps] Setup Backend Project with Node.js and Express
- **Subtasks:**
    - None

### [CTOC-0008][DevOps] Configure CI/CD Pipeline for Linting and Testing
- **Description:** Implement a basic CI/CD pipeline to run linting and unit/integration tests on both frontend and backend.
- **Acceptance Criteria:**
    - CI pipeline runs on every pull request and push to the main branch.
    - Linting errors are reported and prevent merges if critical.
    - All unit and integration tests pass successfully.
- **Dependencies:**
    - [CTOC-0002][DevOps] Setup Frontend Project with React, Vite, TypeScript
    - [CTOC-0003][DevOps] Setup Backend Project with Node.js and Express
- **Subtasks:**
    - None
