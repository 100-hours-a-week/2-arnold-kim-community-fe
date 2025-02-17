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

    /** 📌 ✅ 유저 데이터 불러오기 */
    async function getUsers() {
        try {
            const response = await fetch("../data/user.json");
            if (!response.ok) throw new Error("유저 데이터를 불러오는 데 실패했습니다.");
            users = await response.json();
        } catch (error) {
            console.error("유저 데이터 로딩 오류:", error);
        }
    }

    /** 📌 ✅ 로그인된 유저 정보 가져오기 */
    function getLoggedInUser() {
        return JSON.parse(localStorage.getItem("user")) || null;
    }

    /** 📌 ✅ 로그인된 유저 정보가 있다면 이메일 표시 */
    function displayUserEmail() {
        const loggedInUser = getLoggedInUser();
        if (loggedInUser && loggedInUser.email) {
            userEmail.textContent = loggedInUser.email; // ✅ 이메일 표시
        } else {
            userEmail.textContent = "로그인된 계정이 없습니다."; // 기본 메시지
        }
    }

    /** 📌 ✅ 드롭다운 메뉴 생성 */
    profileDropdown.classList.add("profile-dropdown");
    profileDropdown.innerHTML = `
        <ul>
            <li id="edit-profile-menu">회원정보수정</li>
            <li id="edit-password-menu">비밀번호수정</li>
            <li id="logout-menu">로그아웃</li>
        </ul>
    `;
    document.body.appendChild(profileDropdown);

    /** 📌 ✅ 프로필 클릭 시 드롭다운 메뉴 표시 */
    function updateDropdownPosition() {
        const rect = userProfile.getBoundingClientRect();
        profileDropdown.style.top = `${rect.bottom + window.scrollY + 5}px`; // 아이콘 아래 위치
        profileDropdown.style.left = `${rect.left - profileDropdown.offsetWidth - 150}px`; // 아이콘 왼쪽 정렬
    }

    userProfile.addEventListener("click", () => {
        if (profileDropdown.style.display === "block") {
            profileDropdown.style.display = "none";
        } else {
            updateDropdownPosition();
            profileDropdown.style.display = "block";
        }
    });

    /** 📌 ✅ 드롭다운 항목 클릭 이벤트 */
    document.getElementById("edit-password-menu").addEventListener("click", () => {
        window.location.href = "editPassword.html";
    });

    document.getElementById("logout-menu").addEventListener("click", () => {
        window.location.href = "login.html";
    });

    function updateButtonState() {
        if (usernameError.textContent === "" && usernameInput.value.trim() !== "") {
            editProfileBtn.classList.add("active"); // ✅ 버튼 활성화
            editProfileBtn.removeAttribute("disabled");
        } else {
            editProfileBtn.classList.remove("active"); // ✅ 버튼 비활성화
            editProfileBtn.setAttribute("disabled", "true");
        }
    }

    /** 📌 ✅ 닉네임 입력 이벤트 리스너 */
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
            usernameError.textContent = ""; // ✅ 에러 메시지가 없으면 버튼 활성화 가능
        }

        updateButtonState(); // ✅ 버튼 활성화 상태 업데이트
    });


    /** 📌 ✅ 프로필 사진 변경 */
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

    /** 📌 ✅ 수정하기 버튼 클릭 시 성공 메시지 */
    editProfileBtn.addEventListener("click", () => {
        if (usernameError.textContent === "") {
            editCompleteBtn.style.display = "block"; // 토스트 메시지 표시
            setTimeout(() => {
                editCompleteBtn.style.display = "none";
            }, 2000);
        }
    });

    /** 📌 ✅ 회원탈퇴 버튼 클릭 시 모달 표시 */
    deleteAccountBtn.addEventListener("click", () => {
        setModal("<h3>회원탈퇴 하시겠습니까?</h3><br>작성된 게시글과 댓글은 삭제됩니다.", () => {
            alert("회원 탈퇴가 완료되었습니다.");
            window.location.href = "login.html";
        });
    });

    await getUsers(); // ✅ 유저 정보 불러오기
    displayUserEmail();
});
