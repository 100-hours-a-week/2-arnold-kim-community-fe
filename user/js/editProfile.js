document.addEventListener("DOMContentLoaded", async () => {
    const userProfile = document.getElementById("user-profile");
    const profileDropdown = document.createElement("div");
    const usernameInput = document.getElementById("username");
    const usernameError = document.getElementById("username-error");
    const userEmail = document.getElementById("email");
    const editProfileBtn = document.getElementById("edit-profile-btn");
    const deleteAccountBtn = document.getElementById("delete-account-btn");
    const profileImage = document.getElementById("profile-image");
    const profileUpload = document.getElementById("profile-upload");
    const editCompleteBtn = document.getElementById("edit-profile-complete-btn");

    let users = [];

    async function getUsers() {
        try {
            const response = await fetch("../data/user.json");
            if (!response.ok) throw new Error("유저 데이터를 불러오는 데 실패했습니다.");
            users = await response.json();
        } catch (error) {
            console.error("유저 데이터 로딩 오류:", error);
        }
    }

    function getLoggedInUser() {
        return JSON.parse(localStorage.getItem("user")) || null;
    }

    function displayUserEmail() {
        const loggedInUser = getLoggedInUser();
        if (loggedInUser && loggedInUser.email) {
            userEmail.textContent = loggedInUser.email; 
        } else {
            userEmail.textContent = "로그인된 계정이 없습니다.";
        }
    }

    profileDropdown.classList.add("profile-dropdown");
    profileDropdown.innerHTML = `
        <ul>
            <li id="edit-profile-menu">회원정보수정</li>
            <li id="edit-password-menu">비밀번호수정</li>
            <li id="logout-menu">로그아웃</li>
        </ul>
    `;
    document.body.appendChild(profileDropdown);

    function updateDropdownPosition() {
        const rect = userProfile.getBoundingClientRect();
        profileDropdown.style.top = `${rect.bottom + window.scrollY + 5}px`; 
        profileDropdown.style.left = `${rect.left - profileDropdown.offsetWidth - 150}px`; 
    }

    userProfile.addEventListener("click", () => {
        if (profileDropdown.style.display === "block") {
            profileDropdown.style.display = "none";
        } else {
            updateDropdownPosition();
            profileDropdown.style.display = "block";
        }
    });

    document.getElementById("edit-profile-menu").addEventListener("click", () => {
        window.location.href = "editProfile.html"
    })

    document.getElementById("edit-password-menu").addEventListener("click", () => {
        window.location.href = "editPassword.html";
    });

    document.getElementById("logout-menu").addEventListener("click", () => {
        window.location.href = "login.html";
    });

    function updateButtonState() {
        if (usernameError.textContent === "" && usernameInput.value.trim() !== "") {
            editProfileBtn.classList.add("active"); 
            editProfileBtn.removeAttribute("disabled");
        } else {
            editProfileBtn.classList.remove("active"); 
            editProfileBtn.setAttribute("disabled", "true");
        }
    }

    usernameInput.addEventListener("input", () => {
        const username = usernameInput.value.trim();
        const isDuplicate = users.some(user => user.username === username);

        if (username === "") {
            usernameError.textContent = "*닉네임을 입력해주세요.";
        } else if (username.length > 10) {
            usernameError.textContent = "*닉네임은 최대 10자까지 작성 가능합니다.";
        } else if (isDuplicate) {
            usernameError.textContent = "*중복된 닉네임 입니다.";
        } else {
            usernameError.textContent = ""; 
        }

        updateButtonState();
    });

    profileUpload.addEventListener("change", function (event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profileImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    editProfileBtn.addEventListener("click", () => {
        if (usernameError.textContent === "") {
            editCompleteBtn.style.display = "block"; 
            setTimeout(() => {
                editCompleteBtn.style.display = "none";
            }, 2000);
        }
    });

    deleteAccountBtn.addEventListener("click", () => {
        setModal("<h3>회원탈퇴 하시겠습니까?</h3><br>작성된 게시글과 댓글은 삭제됩니다.", () => {
            alert("회원 탈퇴가 완료되었습니다.");
            window.location.href = "login.html";
        });
    });

    await getUsers(); 
    displayUserEmail();
});
