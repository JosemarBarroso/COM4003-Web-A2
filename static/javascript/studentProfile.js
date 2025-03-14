function enableEdit(textId) {
    let textElement = document.getElementById(textId);
    let inputElement = document.getElementById(textId.replace("profile-", "")); // Get corresponding input field
    let saveBtn = document.getElementById("saveChangesBtn");

    if (!textElement || !inputElement) {
        console.error("Element not found:", textId);
        return;
    }

    textElement.style.display = "none";
    inputElement.style.display = "inline-block"; // Ensure visibility
    inputElement.value = textElement.textContent.trim();
    inputElement.focus();
    saveBtn.style.display = "block";
}



async function loadUserProfile() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        alert("User not logged in.");
        return;
    }

    try {
        const apiUrl = `http://127.0.0.1:5000/get-profile?user_id=${userId}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch profile data");

        const userData = await response.json();

        document.getElementById("profile-name").textContent = userData.full_name || "N/A";
        document.getElementById("profile-email").textContent = userData.email || "N/A";
        document.getElementById("profile-phone").textContent = userData.phone || "N/A";
        document.getElementById("profile-skills").textContent = userData.skills ? userData.skills.join(", ") : "N/A";
        document.getElementById("profile-academic").textContent = userData.academic || "N/A";
        document.getElementById("profile-experience").textContent = userData.experience || "N/A";

        // Populate hidden input fields with existing data
        document.getElementById("fullName").value = userData.full_name || "";
        document.getElementById("email").value = userData.email || "";
        document.getElementById("phone").value = userData.phone || "";
        document.getElementById("skills").value = userData.skills ? userData.skills.join(", ") : "";
        document.getElementById("academic").value = userData.academic || "";
        document.getElementById("experience").value = userData.experience || "";

    } catch (error) {
        console.error("Error loading profile:", error);
    }
}



// Update profile
async function updateProfile() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        alert("User ID is missing.");
        return;
    }

    const profileData = {
        user_id: userId,
        full_name: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        academic: document.getElementById("academic").value,
        experience: document.getElementById("experience").value,
        skills: document.getElementById("skills").value.split(",").map(s => s.trim())
    };

    try {
        const response = await fetch("http://127.0.0.1:5000/update-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profileData)
        });

        if (!response.ok) throw new Error("Failed to update profile");

        alert("Profile updated successfully!");
        location.reload(); // Reload profile page

    } catch (error) {
        console.error("Error updating profile:", error);
    }
}

// Load profile when page loads
window.onload = loadUserProfile;
