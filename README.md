
# Spring Boot Advertisement Management

## 1. Database Setup:

### Step 1: Download and install MySQL

### Step 2: Create and login to MySQL

### Step 3: Run the SQL script
- Navigate to the directory where the `ads_management.sql` file is located.
- Execute the script to set up the database.

## 2. Backend Setup:

### Step 1: Download and install Java

### Step 2: Configure `application.properties`
- Go to the file `...\spring-boot-advertisement-management\backend\backend\src\main\resources\application.properties`.
- Replace `root` on lines 7 and 8 with your MySQL username and password.

### Step 3: Configure Logging
- Create a directory `IdeaProjects`.
  - Inside this directory, create another folder named `logs`.
    - Inside the `logs` folder, create a file named `main.log`.
- Go to the file `...\spring-boot-advertisement-management\backend\backend\src\main\resources\log4j.properties`.
  - Replace the path on line 12 with the absolute path to the `main.log` file you just created. Note: Use double backslashes `\\` instead of single backslashes `\` to specify the path.
- Go to the file `...\spring-boot-advertisement-management\backend\backend\src\main\java\com\example\backend\controller\LoggerController.java`.
  - Replace the string within the quotation marks on line 20 with the absolute path to the `logs` folder you created. Again, use double backslashes `\\` instead of single backslashes `\` to specify the path.

### Step 4: Run the Backend
- Install Visual Studio Code (VS Code)
- Install the following extensions for VS Code:
  - "Debugger for Java" by Microsoft
  - "Extension Pack for Java" by Microsoft
  - "Maven for Java" by Microsoft
  - "Project Manager for Java" by Microsoft
- Open the folder `...\spring-boot-advertisement-management\backend\backend` in VS Code.
- Navigate through the following directories:
  - `backend`
  - `src`
  - `main`
  - `java`
  - `com`
  - `example`
  - `backend`
- Open the file `BackendApplication.java`.
- Click "Run" in the Terminal at the top navbar of VS Code.
- Select "Run without Debug" to start the application.

### Backend Notes:
- To view the API documentation:
  - Run the application.
  - Go to the URL: `http://localhost:8081/swagger-ui/index.html`
  - Enter `/api-docs` in the search bar and click "Explore".

- To view the API logs:
  - Run the application.
  - Access the URL: `http://localhost:8081/api/logs?date=X&type=Y`
    - Replace `X` with the desired date (format: yyyy-mm-dd).
    - Replace `Y` with the log types: DEBUG, WARN, ERROR, INFO.

## 3. Frontend Setup:

### React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with Hot Module Replacement (HMR) and some ESLint rules.

### Install dependencies
```bash
yarn install
```
## Start

Add .env, .env.production

```
VITE_GG_MAP_API_KEY=YOUR_KEY
VITE_API_URL=http://localhost:8081/api/v1
VITE_APP_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=AIzaSyCUXgIgC1D4uWnhcWWdIoCCIHlcc8gU8_s
VITE_FIREBASE_AUTH_DOMAIN=poetic-tube-407505.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=poetic-tube-407505
VITE_FIREBASE_STORAGE_BUCKET=poetic-tube-407505.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=242361811898
VITE_FIREBASE_APP_ID=1:242361811898:web:a31c12fd8396028caf5383
VITE_FIREBASE_MEASUREMENT_ID=G-96N2S8RD81
VITE_WEB_SOCKET_URL=ws://localhost:8080/gs-guide-websocket
```

```bash
yarn run dev
```

## Build

```bash
yarn run build
yarn run preview
```

