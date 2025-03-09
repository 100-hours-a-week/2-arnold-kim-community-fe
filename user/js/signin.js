import CONFIG from "../../config.js";
import { validateEmail, validatePassword } from "../../utils/validate.js";

document.addEventListener("DOMContentLoaded", async () => {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const passwordCheckInput = document.getElementById("password-check");
    const usernameInput = document.getElementById("username");

    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error")
    const passwordCheckError = document.getElementById("password-check-error")
    const usernameError = document.getElementById("username-error")
    const profileImageError = document.getElementById("profile-error")

    const signinBtn = document.getElementById("signin-btn");

    const profileUpload = document.getElementById("profile-upload")
    const profileImage = document.getElementById("profile-image")

    let users = [];
    let validatePasswordCheck = false;
    let validateUsername = false;
    let validateProfile = false;

    async function getUsers(){
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/users/info`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const result = await response.json();
            users = result.data;
            console.log()

        } catch (error) {
            alert("회원 정보 불러오기 오류");
        }
    }

    // 에러 메시지 업데아트
    emailInput.addEventListener("input", async () => {
        const user = users.find(user => user.email === emailInput.value);
        const email = emailInput.value;

        if (email === "") {
            emailError.textContent = "*이메일을 입력해주세요.";
        } else if (email.length < 5 || !validateEmail(email)) {
            emailError.textContent = "*올바른 이메일 주소 형식을 입력해주세요.";
        } else if (user){
            emailError.textContent = "*중복된 이메일입니다.";
        } else {
            emailError.textContent = "";
        }
        updateButtonState();
    });

    passwordInput.addEventListener("input", () => {
        if (passwordInput.value === "") {
            passwordError.textContent = "*비밀번호를 입력해주세요.";
        } else if (!validatePassword(passwordInput.value)) {
            passwordError.textContent = "*비밀번호는 8~20자, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.";
        } else {
            passwordError.textContent = "";
        }
        
        updateButtonState();
    });

    passwordCheckInput.addEventListener("input", () => {
        if (passwordCheckInput.value === "") {
            passwordCheckError.textContent = "*비밀번호를 한번더 입력해주세요";
        } else if (passwordInput.value !== passwordCheckInput.value){
            passwordCheckError.textContent = "*비밀번호가 다릅니다.";
        } else {
            validatePasswordCheck = true;
            passwordCheckError.textContent = "";
        }

        updateButtonState();
    });

    usernameInput.addEventListener("input", async () => {
        const username = usernameInput.value;
        const user = users.find(user => user.username === username);

        if (username === "") {
            usernameError.textContent = "*닉네임을 입력해주세요";
        } else if (username.length > 10){
            usernameError.textContent = "*닉네임은 최대 10자 까지 작성 가능합니다.";
        } else if (username.includes(" ")) {
            usernameError.textContent = "*띄어쓰기를 없애주세요";
        } else if (user) {
            usernameError.textContent = "*중복된 닉네임 입니다.";
        }
        else {
            validateUsername = true;
            usernameError.textContent = "";
        }

        updateButtonState();
    });

    function updateButtonState() {
        if (validateEmail(emailInput.value) && validatePassword(passwordInput.value) && validatePasswordCheck && validateUsername && validateProfile) {
            signinBtn.classList.add("active");
            signinBtn.removeAttribute("disabled");
        } else {
            signinBtn.classList.remove("active");
            signinBtn.setAttribute("disabled", "true");
        }
    }

    // fetchAPI를 이용항 프로필 이미지 업로드

    profileUpload.addEventListener('change', (e) => {
        const file = profileUpload.files[0];
        profileImageError.textContent = "*프로필 사진을 추가해주세요."

        if (file){
            const reader = new FileReader();
            reader.onload = (ev) => {
                profileImage.src = ev.target.result;
                validateProfile = true;
                profileImageError.textContent = "";
            };
            reader.readAsDataURL(file);
            
        } else {
            profileImage.src = "../assets/default_img.png";
            profileImageError.textContent = "*프로필 사진을 추가해주세요."
            validateProfile = false;
        }

        updateButtonState();
    });

    // 회원가입 버튼 클릭 이벤트
    signinBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const file = profileUpload.files[0];
        const newUser = {
            email: emailInput.value,
            password: passwordInput.value,
            passwordCheck: passwordCheckInput.value,
            username: usernameInput.value,
        };

        const formData = new FormData();
        const userJson = new Blob(
            [JSON.stringify(newUser)],
            { type: "application/json" }
        )

        formData.append("file", file);
        formData.append("userRequestDTO", userJson);

        // fetch API를 이용하여 로그인 확인
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/users/signup`, {
                method: "POST",
                // 리소스를 body에 담아서 전송
                body: formData
            });
            
            if (response.ok) {
                window.location.href = "login.html";
            } else {
                const errorData = await response.json();
                emailError.textContent = errorData.error.email;
                usernameError.textContent = errorData.error.username;
                console.log("${errorData.message}");
            }
        } catch (error) {
            console.error("회원가입 요청 실패:", error);
        }
    });

    // 로그인하러 가기로 이동
    document.querySelectorAll("#back-to-login, #back").forEach(btn => {
        btn.addEventListener("click", () => window.location.href = "login.html");
    });
    
    await getUsers();
});