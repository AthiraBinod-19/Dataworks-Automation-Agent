# DataWorks Automation Agent

This is an automation agent for processing tasks for DataWorks Solutions.

## Run the Application

1. Build the Docker image:

2. Run the container:

3. Access the application at `http://localhost:8000`.

## Endpoints

- **POST** `/run?task=<task_description>`: Executes the task specified in the `task` query parameter.

## Server Ports
- **API server (port 3000)**: All tasks are executed through an API running on this server. 
  - Example: `http://localhost:3000/run?task=YOUR_TASK_DESCRIPTION`
  - Tasks like fetching data from APIs, running SQL queries, manipulating files, etc., are handled here.

- **Docker image server (port 8000)**: The application packaged in the Docker image runs on this server. It listens for task requests and handles them based on the provided description.
  - Example: `http://localhost:8000/run?task=YOUR_TASK_DESCRIPTION`
<<<<<<< HEAD
  - This server serves the API related to the containerized version of the app.
=======
  - This server serves the API related to the containerized version of the app.
>>>>>>> cc585c6841fcce0a1a781c134744062f14577bc0


