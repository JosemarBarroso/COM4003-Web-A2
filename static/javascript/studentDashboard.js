document.addEventListener("DOMContentLoaded", function () {
    fetchStudentJobs();
    loadUserProfile();
});

// Toggle Dropdown
function toggleDropdown() {
    let dropdown = document.getElementById("profileDropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

// Fetch Jobs from Backend
async function fetchStudentJobs() {
    try {
        let response = await fetch("http://127.0.0.1:5000/get-jobs"); 
        let jobs = await response.json();
        displayJobs(jobs);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        document.getElementById("studentJobsList").innerHTML = "<p>Error loading jobs.</p>";
    }
}

// Display Jobs in HTML
function displayJobs(filteredJobs = jobs) {
    const jobListings = document.getElementById("studentJobsList"); // Corrected ID
    if (!jobListings) {
        console.error("Error: 'studentJobsList' element not found in HTML.");
        return;
    }

    jobListings.innerHTML = ""; // Clear previous jobs

    if (filteredJobs.length === 0) {
        jobListings.innerHTML = "<p>No matching jobs found.</p>";
        return;
    }

    filteredJobs.forEach(job => {
        const jobCard = document.createElement("div");
        jobCard.classList.add("job-card");
        jobCard.innerHTML = `
            <h3>${job.title}</h3>
            <h4>${job.company}</h4>
            <p>${job.description}</p>
            <p><strong>Skills:</strong> ${job.skills.join(", ")}</p>
        `;
        jobListings.appendChild(jobCard);
    });
}

// Search Jobs by Skill
function searchJobsBySkill() {
    let skillInput = document.getElementById("search");
    if (!skillInput) {
        console.error("Error: 'search' input field not found in HTML.");
        return;
    }

    let skill = skillInput.value.toLowerCase().trim();
    if (!skill) {
        fetchStudentJobs(); // If empty, show all jobs again
        return;
    }

    async function fetchFilteredJobs() {
        try {
            let response = await fetch("http://127.0.0.1:5000/get-jobs");
            let jobs = await response.json();

            let filteredJobs = jobs.filter(job => 
                job.skills && job.skills.some(s => s.toLowerCase().includes(skill))
            );

            let jobList = document.getElementById("studentJobsList");
            if (!jobList) return;
            jobList.innerHTML = "";

            if (filteredJobs.length === 0) {
                jobList.innerHTML = "<p>No jobs match this skill.</p>";
                return;
            }

            filteredJobs.forEach(job => {
                let jobItem = document.createElement("div");
                jobItem.classList.add("job-card");
                jobItem.innerHTML = `
                    <h3>${job.title}</h3>
                    <p><strong>Company:</strong> ${job.company}</p>
                    <p><strong>Location:</strong> ${job.location}</p>
                    <p><strong>Required Skills:</strong> ${job.skills ? job.skills.join(", ") : "Not specified"}</p>
                    <p>${job.description}</p>
                    <hr>
                `;
                jobList.appendChild(jobItem);
            });

        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
    }

    fetchFilteredJobs();
}

// Load User Profile
async function loadUserProfile() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        alert("User not logged in.");
        return;
    }

    try {
        let response = await fetch(`http://127.0.0.1:5000/get-profile?user_id=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch profile data");

        let userData = await response.json();
        document.getElementById("fullName").value = userData.full_name || "";
        document.getElementById("skills").value = userData.skills ? userData.skills.join(", ") : "";
        document.getElementById("academic").value = userData.academic || "";
        document.getElementById("experience").value = userData.experience || "";
    } catch (error) {
        console.error("Error loading profile:", error);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    displayJobs();
    loadUserProfile();
    fetchStudentJobs();
});

document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.getElementById("logout-btn");
    
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
           
            // Redirect to login page
            window.location.href = "/login";
        });
    }
});