from bson import ObjectId
from flask import Flask, jsonify, render_template, request
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Connect to MongoDB Atlas
client = MongoClient("mongodb+srv://admin:admin123@cluster0.jutbv.mongodb.net/?retryWrites=true&w=majority")
db = client["job_portal"]
users_collection = db["users"]
jobs_collection = db["jobs"]

# Serve index.html as the default page
@app.route("/")
def home():
    return render_template("index.html")

# Serve Login Page
@app.route("/login")
def login_page():
    return render_template("login.html")

# Serve Signup Page
@app.route("/register")
def signup_page():
    return render_template("register.html")

@app.route("/studentDashboard")
def student_dashboard():
    return render_template("studentDashboard.html")

@app.route("/employerDashboard")
def employer_dashboard():
    return render_template("employerDashboard.html")


@app.route('/studentProfile')
def student_profile():
    return render_template('studentProfile.html')

@app.route('/createJobPost')
def create_job_page():  # Renamed function
    return render_template('createJobPost.html')

# Register API
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    role = data.get("role")
    email = data.get("email")
    phone = data.get("phone")

    existing_user = users_collection.find_one({"email": email})
    if existing_user:
        return jsonify({"message": "User already exists"}), 400

    user_data = {"role": role, "email": email, "phone": phone}

    if role == "student":
        # Convert skills to a list (if not already)
        skills = data.get("skills", [])
        if isinstance(skills, str):
            skills = [s.strip() for s in skills.split(",")]

        user_data.update({
            "full_name": data.get("full_name"),
            "skills": skills,  # Store skills as a list
            "academic": data.get("academic"),
            "experience": data.get("experience"),
        })
    elif role == "employer":
        user_data.update({
            "company_name": data.get("company_name"),
            "website": data.get("website"),
        })
    
    inserted_user = users_collection.insert_one(user_data)
    
    return jsonify({
        "message": "Registration successful",
        "role": role,
        "user_id": str(inserted_user.inserted_id)  # Convert ObjectId to string
    }), 201

# Login API
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    phone = data.get("phone")

    user = users_collection.find_one({"email": email, "phone": phone})
    
    if user:
        return jsonify({"message": "Login successful", "role": user["role"], "user_id": str(user["_id"])}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401
    
@app.route('/get-profile', methods=['GET'])
def get_profile():
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({"error": "User ID required"}), 400

    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404

        user["_id"] = str(user["_id"])
        return jsonify(user), 200
    except Exception as e:
        print("Error:", str(e))  # Debugging
        return jsonify({"error": str(e)}), 500

@app.route("/search-jobs", methods=["GET"])
def search_jobs():
    search_query = request.args.get("query", "").lower()
    
    jobs = list(users_collection.find({
    "$or": [
        {"title": {"$regex": search_query, "$options": "i"}},
        {"skills": {"$in": [search_query]}}
    ]
}))


    for job in jobs:
        job["_id"] = str(job["_id"])  # Convert ObjectId to string
    
    return jsonify(jobs)

@app.route('/update-profile', methods=['POST'])
def update_profile():
    data = request.json
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "User ID required"}), 400

    try:
        result = users_collection.update_one(
            {"_id": ObjectId(user_id)},  # Find by _id
            {"$set": {
                "full_name": data.get("full_name"),
                "email": data.get("email"),
                "phone": data.get("phone"),
                "academic": data.get("academic"),
                "experience": data.get("experience"),
                "skills": data.get("skills", [])
            }}
        )

        if result.matched_count == 0:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"message": "Profile updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Route to create a job post
@app.route("/create-job", methods=["POST"])
def create_job():
    data = request.json
    required_fields = ["title", "company", "location", "description", "skills"]

    # Check if all required fields are present and not empty
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"'{field}' is required"}), 400

    # Convert skills to a list if provided as a string
    if isinstance(data["skills"], str):
        data["skills"] = [s.strip() for s in data["skills"].split(",") if s.strip()]

    # Validate data types
    if not all(isinstance(data[field], str) for field in ["title", "company", "location", "description"]):
        return jsonify({"error": "Fields 'title', 'company', 'location', and 'description' must be strings"}), 400
    
    if not isinstance(data["skills"], list):
        return jsonify({"error": "'skills' must be a list"}), 400

    try:
        job_id = jobs_collection.insert_one(data).inserted_id
        return jsonify({"message": "Job posted successfully", "job_id": str(job_id)}), 201
    except PyMongoError as e: # type: ignore
        return jsonify({"error": "Database error", "details": str(e)}), 500
    
@app.route("/get-jobs", methods=["GET"])
def get_jobs():
    jobs = list(jobs_collection.find({}, {"_id": 0}))  # Exclude MongoDB _id field
    return jsonify(jobs)
 
@app.route("/get-students", methods=["GET"])
def get_students():
    students = list(users_collection.find({"role": "student"}))
    for student in students:
        student["_id"] = str(student["_id"])  # Convert ObjectId to string
    return jsonify(students)

if __name__ == "__main__":
    app.run(debug=True)
