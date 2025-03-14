// Sample Student Data
const students = [
    { name: "Alice Johnson", skills: ["JavaScript", "React", "CSS"], experience: "2 years" },
    { name: "Bob Smith", skills: ["Python", "Flask", "Machine Learning"], experience: "3 years" },
    
];

// Function to display student profiles
function displayStudents(filteredStudents = students) {
    const studentList = document.getElementById("student-list");
    studentList.innerHTML = ""; // Clear previous results

    if (filteredStudents.length === 0) {
        studentList.innerHTML = "<p>No matching students found.</p>";
        return;
    }

    filteredStudents.forEach(student => {
        const studentDiv = document.createElement("div");
        studentDiv.classList.add("student-card");
        studentDiv.innerHTML = `
            <h3>${student.name}</h3>
            <p><strong>Skills:</strong> ${student.skills.join(", ")}</p>
            <p><strong>Experience:</strong> ${student.experience}</p>
        `;
        studentList.appendChild(studentDiv);
    });
}

// Display all students on page load
window.onload = () => displayStudents();

document.addEventListener("DOMContentLoaded", function() {
    fetchEmployerJobs();
});

// Function to fetch and display employer's job posts
async function fetchEmployerJobs() {
    try {
        let response = await fetch("http://127.0.0.1:5000/get-jobs");
        let jobs = await response.json();

        let jobsList = document.getElementById("employerJobsList");
        if (!jobsList) {
            console.error("Error: 'employerJobsList' element not found in HTML.");
            return;
        }

        jobsList.innerHTML = ""; // Clear previous data

        if (jobs.length === 0) {
            jobsList.innerHTML = "<p class='no-jobs'>You haven't posted any jobs yet.</p>";
            return;
        }

        jobs.forEach(job => {
            let jobItem = document.createElement("div");
            jobItem.classList.add("job-card");
            jobItem.innerHTML = `
                <h3>📌 ${job.title}</h3>
                <p><strong>🏢 Company:</strong> ${job.company}</p>
                <p><strong>📍 Location:</strong> ${job.location}</p>
                <p>${job.description}</p>
                <div class="skills">
                    <strong>🔹 Skills Required:</strong>
                    ${Array.isArray(job.skills) ? job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join(' ') : "<span class='skill-tag'>Not specified</span>"}
                </div>
            `;
            jobsList.appendChild(jobItem);
        });

    } catch (error) {
        console.error("Error fetching jobs:", error);
        let jobsList = document.getElementById("employerJobsList");
        if (jobsList) {
            jobsList.innerHTML = "<p class='error'>⚠️ Error loading jobs.</p>";
        }
    }
}

// Call function after page loads
document.addEventListener("DOMContentLoaded", fetchEmployerJobs);
async function fetchStudents() {
    try {
        let response = await fetch("http://127.0.0.1:5000/get-students");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let students = await response.json();
        let studentList = document.getElementById("studentProfilesList");

        if (!studentList) {
            console.error("Error: 'studentProfilesList' element not found.");
            return;
        }

        studentList.innerHTML = "";

        if (students.length === 0) {
            studentList.innerHTML = "<p>No student profiles found.</p>";
            return;
        }

        students.forEach(student => {
            let studentDiv = document.createElement("div");
            studentDiv.classList.add("student-card");

            // Placeholder for profile image
            let profileImage = student.image_url ? student.image_url : "../static/images/man.jpg";

            studentDiv.innerHTML = `
                <img src="${profileImage}" alt="Profile Image">
                <h3>${student.full_name}</h3>
                <p><strong>Email:</strong> ${student.email}</p>
                <p><strong>Academic:</strong> ${student.academic ? student.academic : "Not specified"}</p>
                <p><strong>Experience:</strong> ${student.experience ? student.experience : "Not specified"}</p>
                <div class="skill-tags">
                    ${student.skills ? student.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join(' ') : "No skills listed"}
                </div>
            `;
            studentList.appendChild(studentDiv);
        });

    } catch (error) {
        console.error("Error fetching student profiles:", error);
    }
}

// Call function after page loads
document.addEventListener("DOMContentLoaded", fetchStudents);




function searchStudentsBySkill() {
    let searchInput = document.getElementById("searchSkill");

    if (!searchInput) {
        console.error("Error: Element with ID 'searchSkill' not found.");
        return; // Exit the function if input is missing
    }

    let skill = searchInput.value.toLowerCase().trim();

    if (!skill) {
        fetchStudents(); // If input is empty, reload all students
        return;
    }

    async function fetchFilteredStudents() {
        try {
            let response = await fetch("http://127.0.0.1:5000/get-students");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            let students = await response.json();
            let filteredStudents = students.filter(student =>
                student.skills && student.skills.some(s => s.toLowerCase().includes(skill))
            );

            let studentList = document.getElementById("studentProfilesList");

            if (!studentList) {
                console.error("Error: 'studentProfilesList' element not found.");
                return;
            }

            studentList.innerHTML = "";

            if (filteredStudents.length === 0) {
                studentList.innerHTML = "<p>No students match this skill.</p>";
                return;
            }

            filteredStudents.forEach(student => {
                let studentItem = document.createElement("div");
                studentItem.classList.add("student-card");
                studentItem.innerHTML = `
                    <h3>${student.full_name}</h3>
                    <p><strong>Email:</strong> ${student.email}</p>
                    <p><strong>Skills:</strong> ${student.skills ? student.skills.join(", ") : "Not specified"}</p>
                    <p><strong>Academic:</strong> ${student.academic ? student.academic : "Not specified"}</p>
                    <p><strong>Experience:</strong> ${student.experience ? student.experience : "Not specified"}</p>
                    <hr>
                `;
                studentList.appendChild(studentItem);
            });

        } catch (error) {
            console.error("Error fetching student profiles:", error);
        }
    }

    fetchFilteredStudents();
}

document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.getElementById("logout-btn");
    
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
           
            // Redirect to login page
            window.location.href = "/login";
        });
    }
});
