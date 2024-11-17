
# Assignment Submission Portal

- The Assignment Submission Portal is a web application that allows users (students) to upload assignments and assign them to admins for review. Admins can manage these assignments by accepting or rejecting them. The platform utilizes Node.js for the backend, MongoDB for data storage, and JWT for secure authentication. It provides an easy-to-use API for user and admin management, assignment submission, and task handling.

- The project is built with a focus on scalability, using Zod for validation and bcryptjs for secure password storage.


## 1. Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB Atlas account for a cloud-based MongoDB instance (or MongoDB locally)
- Postman or any API testing tool for interacting with the backend
## 2. Clone the Repository

Start by cloning the project repository. You can use Git to clone the repository:

```bash
git clone https://github.com/Abhayaj247/Assignment-Submission-Portal.git 
```
## 3. Install Dependencies

Once you have cloned the repository, navigate to the project folder and run the following command to install all necessary dependencies:

```
npm install
```
This will install the required dependencies listed in 
```package.json```.
## 4. Set Up Environment Variables

The application relies on environment variables to configure the MongoDB connection and the JWT secret.

- Create a ```.env``` file in the root directory of the project if it doesn't already exist.
- Add the following content to your ```.env``` file:

```
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
PORT=5000
```
- MONGO_URI: Replace <your-mongodb-uri> with the connection string for your MongoDB instance. If using MongoDB Atlas, you can get the connection string from the Atlas dashboard.
- JWT_SECRET: Replace <your-jwt-secret> with a strong, random string that will be used to sign your JWT tokens.

Example:
```
MONGO_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/assignment-submission-portal
JWT_SECRET=your-secret-key
PORT=5000
```
## 5. Setting Up MongoDB Database

If you are using MongoDB Atlas:

- Go to the MongoDB Atlas website.
- Create an account if you don't have one.
- Create a new cluster and get the connection URI.
- Ensure the cluster has a database user with the necessary permissions.
## 6. Running the Application

Once the dependencies are installed and the environment variables are set, you can run the application.

To start the server, use the following command:
```
npx nodemon app.js or node app.js
```

This will start the Express server on ``` http://localhost:5000 ```.
## 7. Test the API with Postman

To interact with the API, you can use Postman or any other API testing tool. Here are the endpoints:

## User Routes


- ## User Registration
    - ```POST /api/users/register```
    - Request body :
    ```
    {
        "name": "User Name",
        "email": "user@example.com",
        "password": "userPassword123",
        "role": "User"
    }
    ```
- ## User Logi
    - ```POST  /api/users/login```
    - Request body :
    ```
    {
        "email": "user@example.com",
        "password": "userPassword123"
    }

    ```
    - Response   :  JWT token for authentication.
- ##  Upload Assignment
    - ```POST  /api/users/upload```
    - Request body :
    ```
    {
        "task": "Assignment Task Description",
        "adminId": "<Admin-ID>"
    }


    ```
    - Requires authentication via ```Authorization```  header with the token obtained from login.
- ## Get All Admins
   ``` GET /api/users/admins```
   - Requires authentication via ```Authorization```   header with the token obtained from login.

## Admin Routes

- ## Admin Registration
    - ```POST /api/admins/register```
    - Request body :
    ```
    {
        "name": "Admin Name",
        "email": "admin@example.com",
        "password": "adminPassword123",
        "role": "Admin"
    }
    ```
- ## Admin Login
    - ```POST /api/admins/login ```
    - Request body :
    ```
    {
        "email": "admin@example.com",
        "password": "adminPassword123"
    }
    ```
    - Response: JWT token for authentication.
- ## Get Assignments
   ``` GET /api/admins/assignments```
   - Requires authentication via ```Authorization```  header with the token obtained from login.
- ## Accept Assignment
   ``` POST /api/admins/assignments/:id/accept```
   - Parameters: Assignment id (in URL)
   - Requires Rauthentication.
- ## Accept Assignment
   ``` POST /api/admins/assignments/:id/reject```
   - Parameters: Assignment id (in URL)
   - Requires Rauthentication.

## 8. Testing the Application

Here’s how to use Postman to test the application:

- ##  Register User:
    -   First, use the User Registration endpoint to create a new user. This will store the user’s information (name, email, password) in the database.
    - The password will be hashed before storage.
- ## Login User:
    - To authenticate, send a POST request to ```/api/users/login``` with the user's email and password.
    - If successful, the server will respond with a JWT token. You need to store this token, as it will be required for subsequent requests to protected routes (e.g., uploading assignments).
- ## User Upload Assignment:
    - Use the Upload Assignment endpoint to upload assignments. Ensure you pass the correct ```adminId``` in the request body.
- ## Register a new Admin:
    - Use the Admin Registration endpoint to create an admin.
- ## Login Admin:
    - Use the Admin Login endpoint to log in and receive a JWT token.
    - The token should be passed in the Authorization header as ```<token>``` for subsequent requests.
- ## Accept/Reject Assignment:
    - Use the Accept Assignment and Reject Assignment endpoints as an admin to manage the tasks.


## 9. Validation and Error Handling

- Input Validation: Both admin and user registration use Zod schemas for input validation. If any input is invalid, a detailed error response will be returned.
- JWT Authentication: All protected routes require authentication. Make sure to include the JWT token in the ```Authorization``` header when accessing these routes.
## 10. Possible Errors

- Missing Token: If you try to access a protected route without the ```Authorization``` header, you will get a ```401 Unauthorized``` error.
- Invalid Credentials: If the login credentials are incorrect, you will get a ```400 Bad Request``` error.
- Validation Error: If the input data does not pass validation, you will receive a ```400 Bad Request``` error with details of the validation issues.
## 10. Database Structure

- ## Users Collection
    The ```Users```  collection stores details about users and admins. It includes basic information like name, email, password, and role.
    
   - User Document Schema:
   ```
   {
        "_id": "ObjectId",                   // Auto-generated ID
        "name": "String",                     // User's name
        "email": "String",                    // User's email (must be unique)
        "password": "String",                 // Hashed password
        "role": "String"                      // Role: "User" or "Admin"
    }
- ## Assignments Collection
    The ```Assignments```  collection stores information about the tasks that users upload. Each assignment is linked to a user (creator) and an admin (who will manage the task). The status of each assignment is tracked.
    
   - Assignment Document Schema:
   ```
   {
        "_id": "ObjectId",                   // Auto-generated ID
        "userId": "ObjectId",                 // Reference to the user who created the assignment
        "task": "String",                     // Description of the assignment
        "admin": "ObjectId",                  // Reference to the admin who is handling the task
        "status": "String",                   // Status of the assignment: "Pending", "Accepted", or "Rejected"
        "createdAt": "Date"                   // Date when the assignment was created
    }
