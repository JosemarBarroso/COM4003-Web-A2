**Project Overview**
The Job Portal Web App is a full-stack web application that connects students and employers. It enables students to create profiles, list skills, academic history, and 
experience while allowing employers to search for candidates and post job openings. The backend is built with Flask and MongoDB, while the frontend is developed using HTML,
CSS, and JavaScript.
**Project Goals and Objectives**
Provide a seamless job search and candidate discovery experience.
Allow students to build and maintain profiles that highlight their skills and experiences.
Enable employers to post jobs and search for potential hires.
Ensure scalability and performance with cloud deployment options.
**Scope of the Project**
Student Features: Register, login, create/edit profile, search for jobs.
Employer Features: Register, login, post jobs, search for student profiles.
Database Integration: Store user data and job postings in MongoDB.
Middleware: Use Flask to handle API requests, authentication, and data retrieval.
**Installation Instructions**
Prerequisites
Ensure you have the following installed:
•	Python (>=3.8)
•	Node.js (for optional frontend enhancements)
•	MongoDB (local or cloud instance like MongoDB Atlas)
•	Flask
•	Templates folder contain all html files
•	Static folder contain 3 folders(styles and images and javascript)

**Step 1: Clone the Repository**
•	 https://github.com/JosemarBarroso/COM4003-Web-A2.git 
•	 cd jobportal-web-app

**Step 2: Set Up a Virtual Environment**
•	python -m venv venv
•	source venv/bin/activate   # On macOS/Linux
•	venv\Scripts\activate      # On Windows

**Step 3: Install Backend Dependencies**
pip install -r requirements.txt

**Step 4: Set Up MongoDB Database**
Local Setup (Ensure MongoDB is installed and running):
client = MongoClient("mongodb+srv://username:password@cluster0.jutbv.mongodb.net/?retryWrites=true&w=majority")
the connection string is mentioned in app.py

**Step 5: Run the Flask Server**
python app.py

**Basic Architecture of the Application**
**Frontend (HTML, CSS, JS)**
•	Handles UI and User interactions.
•	Uses JavaScript Fetch API to communicate with Flask API.
**Backend (Flask & MongoDB)**
•	Flask serves as the middleware to process HTTP requests.
•	MongoDB stores user profiles, job postings, and employer details.
**Data Flow:**
1.	The frontend sends an API request (e.g., fetching a student profile).
2.	Flask processes the request and queries MongoDB.
3.	MongoDB returns the data to Flask, which sends it back to the frontend.
4.	The frontend dynamically updates the UI with the retrieved data.
**API Endpoints**
Authentication & User Management
Method	Endpoint	Description
**POST	/register	Registers a new student or employer
POST	/login	Authenticates user login
GET	/get-profile	Retrieves user profile details
POST	/update-profile	Updates student or employer profile**

**Job Management**
Method	Endpoint	Description
**POST	/create-job	Employer creates a new job listing
GET	/get-jobs	Fetches all available jobs
GET	/search-jobs	Searches jobs by title or required skills**

**Student Management**
Method	Endpoint	Description
**GET	/get-students	Fetches all students with their profiles**

**Deploying on Microsoft Azure**
Create an Azure App Service.
Use Azure Cosmos DB for MongoDB integration.
Deploy Flask backend using Azure Web Apps.
**Legal and Ethical Considerations**
•	Data Privacy: Securely store and handle user data.
•	Ethical Hiring: Ensure fair job postings and candidate selection.
•	Security Measures: Prevent unauthorized access and data breaches.

**Risk Assessment**
Risk	Impact	Mitigation Strategy
Database failure	High	Use cloud-hosted MongoDB with backups
Security breach	High	Implement authentication & authorization
UI/UX issues	Medium	Gather user feedback and improve UI
**Future Considerations for Scaling**
•	Implement AI-based job recommendations.
•	Add real-time messaging between students and employers.
•	Introduce payment processing for premium job listings.
•	Improve API rate-limiting and security features.

**Gannt Chart**
![image](https://github.com/user-attachments/assets/101d14e6-8e87-440c-964f-5746c96ac152)
