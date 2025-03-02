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

    // 기존 닉네임 변경 코드
    usernameInput.addEventListener("input", async () => {
        const username = usernameInput.value.trim();

        if (username === "") {
            usernameError.textContent = "*닉네임을 입력해주세요.";
        } else if (username.length > 10) {
            usernameError.textContent = "*닉네임은 최대 10자까지 작성 가능합니다.";
        } else {
            usernameError.textContent = ""; 

            // fetchAPI를 이용한 닉네임 변경 요청
            // try {
            //     const response = await fetch("${CONFIG.API_BASE_URL/users/username", {
            //         method: "PATCH",
            //         headers: {
            //             "Content-Type": "application/json",
            //             "Authorization": `Bear ${localStorage.getItem("token")}`
            //         },
            //         body: JSON.stringify({
            //             username: usernameInput.value
            //         })
            //     });
    
            //     if (response.ok) {
            //         updateButtonState();
            //     } else {
            //         const result = await response.json();
            //         usernameError.textContent = result.message;
            //     }
                
            // } catch (error) {
            //     usernameError.textContent = "${error.message}";
            //     updateButtonState();
            // } 
        }

        updateButtonState();
    });

    // fetchAPI를 이용항 프로필 이미지 업로드
    // profileUpload.addEventListener("click", async (e) => {
    //     e.preventDefault();
    //     const file = profileImage.files[0];
    //     if (!file){
    //         profileImage.src = "../assets/default_img.png"; // 기본 이미지로 변경
    //         profileImageError.textContent = "*프로필 사진을 추가해주세요."
    //         validateProfile = false;
    //     }

    //     const formData = new formData();
    //     formData.append("image", file);

    //     try{
    //         const response = await fetch("${CONFIG.API_BASE_URL}/users/image", {
    //             method: "POST",
    //             body: formData
    //         });

    //     } catch (error){
    //         console.error("이미지 업로드 에러 ", error);
    //         profileImageError.textContent = "*이미지 업로드 중 알 수 없는 에러가 발생했습니다."
    //     }
    // });
    
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
        setModal("<h3>회원탈퇴 하시겠습니까?</h3><br>작성된 게시글과 댓글은 삭제됩니다.", async () => {
            // fetch API를 이용한 회원 탈퇴
            // try {
            //     // 실제 API 엔드포인트에 맞게 수정 필요
            //     const response = await fetch(`${CONFIG.API_BASE_URL}/users`, {
            //         method: "DELETE",
            //         headers: {
            //             "Authorization": `Bearer ${localStorage.getItem("token")}`
            //         }
            //     });

            //     if (!response.ok) {
            //         const resBody = await response.json();
            //         throw new Error(resBody.message);
            //     }

            //     localStorage.removeItem("token");
            //     window.location.href = "login.html";

            // } catch (error) {
            //     console.error(error);
            //     alert(error.message);
            // }
        });
    });

    await getUsers(); 
    displayUserEmail();
});
