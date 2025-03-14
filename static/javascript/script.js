document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    const roleSelect = document.getElementById("role");
    const studentFields = document.getElementById("studentFields");
    const employerFields = document.getElementById("employerFields");
    let screenWidth = window.innerWidth;

    // Define heights for different screen sizes
    let studentHeight = screenWidth <= 768 ? "515px" : "400px"; // Mobile vs Web
    let employerHeight = screenWidth <= 768 ? "400px" : "300px";
    const container = document.querySelector(".container");

    const skillsInput = document.getElementById("skills-input");
    const skillsContainer = document.getElementById("skills-container");
    let skills = [];

    // 🔹 Handle Login Form Submission
    if (loginForm) {
        if (loginForm) {
            loginForm.addEventListener("submit", async function (event) {
                event.preventDefault();
    
                const email = document.getElementById("email").value;
                const phone = document.getElementById("phone").value;
    
                if (email === "" || phone === "") {
                    alert("Please enter both email and phone number.");
                    return;
                }
    
                try {
                    const response = await fetch("http://127.0.0.1:5000/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, phone }),
                    });
    
                    const result = await response.json();
    
                    if (response.ok) {
                        alert(result.message);
                        localStorage.setItem("userRole", result.role);
                        localStorage.setItem("userId", result.user_id);
    
                        if (result.role === "student") {
                            window.location.href = "/studentDashboard";
                        } else if (result.role === "employer") {
                            window.location.href = "/employerDashboard";
                        }
                    } else {
                        alert(result.message);
                    }
                } catch (error) {
                    console.error("Login Error:", error);
                    alert("Login failed. Please try again later.");
                }
        });
    }
    }
    // 🔹 Handle Role Selection in Registration Form
    if (registerForm && roleSelect) {
        roleSelect.addEventListener("change", function () {
            if (roleSelect.value === "student") {
                studentFields.classList.remove("hidden");
                employerFields.classList.add("hidden");
                studentFields.style.height = studentHeight;
            } else if (roleSelect.value === "employer") {
                employerFields.classList.remove("hidden");
                studentFields.classList.add("hidden");
                studentFields.style.height = employerHeight;
            } else {
                studentFields.classList.add("hidden");
                employerFields.classList.add("hidden");
            }
        });

        // 🔹 Skills Input Handling
        skillsInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                const skill = skillsInput.value.trim();

                if (skill && !skills.includes(skill)) {
                    skills.push(skill);
                    addSkillTag(skill);
                    skillsInput.value = ""; // Clear input after adding
                    moveCursorToEnd();
                }
            }
        });

        function addSkillTag(skill) {
            const tag = document.createElement("div");
            tag.classList.add("skill-tag");
            tag.innerHTML = `${skill} <span class="remove" onclick="removeSkill('${skill}')">×</span>`;
            skillsContainer.insertBefore(tag, skillsInput); // Insert before input field
        }

        window.removeSkill = function (skill) {
            skills = skills.filter(s => s !== skill);
            renderSkills();
        };

        function renderSkills() {
            skillsContainer.innerHTML = ""; // Clear container
            skills.forEach(skill => addSkillTag(skill));
            skillsContainer.appendChild(skillsInput); // Keep input field at the end
        }

        function moveCursorToEnd() {
            skillsInput.focus();
        }

        // 🔹 Handle Registration Form Submission
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const role = document.getElementById("role").value;
            const email = document.getElementById("email").value;
            const phone = document.getElementById("phone").value;

            if (!role) {
                alert("Please select a role.");
                return;
            }

            let data = { role, email, phone };

            if (role === "student") {
                const fullName = document.getElementById("fullName").value;
                const academic = document.getElementById("academic").value;
                const experience = document.getElementById("experience").value;
                const skills = Array.from(document.querySelectorAll(".skill-tag")).map(tag => tag.textContent.trim());

                if (!fullName || skills.length === 0 || !academic) {
                    alert("Please fill in all required fields for students.");
                    return;
                }

                data = { ...data, full_name: fullName, skills, academic, experience };
            } else if (role === "employer") {
                const companyName = document.getElementById("companyName").value;
                const website = document.getElementById("website").value;

                if (!companyName) {
                    alert("Please enter your company name.");
                    return;
                }

                data = { ...data, company_name: companyName, website };
            }

            try {
                const response = await fetch("http://127.0.0.1:5000/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });

                const result = await response.json();
                console.log(result);

                if (response.ok) {
                    alert(result.message);
                    
                    // Store user data and redirect based on role
                    localStorage.setItem("userRole", result.role);
                    localStorage.setItem("userId", result.user_id);
        
                    if (result.role === "student") {
                        window.location.href = "/studentDashboard";
                    } else if (result.role === "employer") {
                        window.location.href = "/employerDashboard";
                    }
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error("Registration Error:", error);
                alert("Registration failed. Please try again later.");
            }
        });
    }

    
});
function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.getElementById("profilePicPreview");
            img.src = e.target.result;
            img.classList.remove("hidden"); // Show image
        };
        reader.readAsDataURL(file);
    }
}

function deleteImage() {
    const img = document.getElementById("profilePicPreview");
    img.src = "";
    img.classList.add("hidden"); // Hide image
    document.getElementById("profilePic").value = ""; // Reset file input
}
