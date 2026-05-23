# snakesnap
Identify snakes

---

## Toolchain Installation

To develop and run SnakeSnap, install the following tools:

### 1. Node.js & npm (for React frontend)
- Download from https://nodejs.org/
- Run the installer and ensure "Add to PATH" is checked.
- After installation, open a new terminal and verify:
  ```sh
  node -v
  npm -v
  npx -v
  ```
  All should print version numbers.

### 2. Python 3.x (for Django backend)
- Download from https://python.org/
- Run the installer and ensure "Add Python to PATH" is checked.
- Verify installation:
  ```sh
  python --version
  ```

### 3. Git (for version control)
- Download from https://git-scm.com/
- Run the installer and follow the prompts.
- Verify installation:
  ```sh
  git --version
  ```

### 4. (Optional) Python Virtual Environment
- For Windows:
  ```sh
  python -m venv venv
  .\venv\Scripts\activate
  ```
- For Mac/Linux:
  ```sh
  python3 -m venv venv
  source venv/bin/activate
  ```

---

## Toolchain Used

- **React (with TypeScript):** Frontend framework for building the user interface.
- **Material UI (MUI):** Free, open-source React UI library for modern, responsive, and accessible components.
- **@emotion/react & @emotion/styled:** Styling dependencies required by Material UI.
- **@mui/icons-material:** Material UI icon set for enhanced UI/UX.
- **Node.js & npm:** JavaScript runtime and package manager for frontend development.
- **TypeScript:** Type-safe JavaScript for robust, maintainable code.
- **Python 3.x & Django:** Backend API and business logic (planned).
- **Git:** Version control.

---

Continue with the setup steps once these tools are installed.
