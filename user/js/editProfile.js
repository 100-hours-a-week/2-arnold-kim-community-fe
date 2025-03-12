import CONFIG from "../../config.js";

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

    let user;
    let file;

    const storedUrl = localStorage.getItem("profileImgUrl");
    if (storedUrl) {
        userProfile.src = storedUrl;
    }

    async function getUser() {
        // fetch API를 이용하여 유저 정보 가져오기
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/users/`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                user = data.data;
                userEmail.textContent = user.email;
                profileImage.src = `${CONFIG.API_BASE_URL}/images/` + user.filePath;
                console.log(user)
            }
        } catch (error) {
            alert(error);
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
        localStorage.clear();
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
        } else if (username == user.username){
            usernameError.textContent = "*현재 사용중인 닉네임으로는 변경할 수 없습니다."
        } else {
            usernameError.textContent = ""; 
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
        file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profileImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    editProfileBtn.addEventListener("click", async () => {
        const username = usernameInput.value;

        const editUser = {
            username : username
        }
        const formData = new FormData();
        const userJson = new Blob(
            [JSON.stringify(editUser)],
            { type: "application/json" }
        )

        formData.append("file", file);
        formData.append("userRequestDTO", userJson);

        // fetchAPI를 이용한 닉네임 변경 요청
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/users/`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: formData
            });

            if (response.ok) {
                updateButtonState();

                if (usernameError.textContent === "") {
                    editCompleteBtn.style.display = "block"; 
                    setTimeout(() => {
                        editCompleteBtn.style.display = "none";
                    }, 2000);
                }
            } else {
                const errorData = await response.json();
                usernameError.textContent = errorData.error;
                console.log(`${JSON.stringify(errorData)}`);
            }
        } catch (error) {
            usernameError.textContent = `${error.message}`;
            updateButtonState();
        } 

        
    });

    deleteAccountBtn.addEventListener("click", () => {
        setModal("<h3>회원탈퇴 하시겠습니까?</h3><br>작성된 게시글과 댓글은 삭제됩니다.", async () => {
            // fetch API를 이용한 회원 탈퇴
            // try {
            //     const response = await fetch(`${CONFIG.API_BASE_URL}/users`, {
            //         method: "DELETE",
            //         headers: {
            //             "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            //         }
            //     });

            //     if (!response.ok) {
            //         const resBody = await response.json();
            //         throw new Error(resBody.message);
            //     }

            //     localStorage.removeItem("accessToken");
            //     window.location.href = "login.html";

            // } catch (error) {
            //     console.error(error);
            //     alert(error.message);
            // }
        });
    });

    await getUser(); 
    // displayUserEmail();
});
