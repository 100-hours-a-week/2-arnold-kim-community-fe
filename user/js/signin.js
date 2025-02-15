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

    async function getUsers() {
        try {
            const response = await fetch("../data/user.json");
            if (!response.ok) throw new Error("사용자 데이터를 불러오는데 실패했습니다.");
            const jsonData = await response.json();
            const localData = JSON.parse(localStorage.getItem("users")) || [];
            users = [...jsonData, ...localData]; 
        } catch (error) {
            console.log(error);
        }
    }

    // 이메일 유효성 검사
    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // 비밀번호 유효성 검사
    function validatePassword(password) {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
        return passwordPattern.test(password);
    }

    // 에러 메시지 업데아트
    emailInput.addEventListener("input", () => {
        const user = users.find(user => user.email === emailInput.value);
        const email = emailInput.value;
        console.log(JSON.parse(localStorage.getItem("users")))

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

    usernameInput.addEventListener("input", () => {
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
    };

    // 프로필 이미지 변경
    profileUpload.addEventListener("change", async function (event) {
        const file = event.target.files[0];
        profileImageError.textContent = "*프로필 사진을 추가해주세요."

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profileImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
            validateProfile = true;
            profileImageError.textContent = ""
        } else {
            profileImage.src = "../assets/default_img.png"; // 기본 이미지로 변경
            profileImageError.textContent = "*프로필 사진을 추가해주세요."
            validateProfile = false;
        }

        updateButtonState();
    });

    // 회원가입 버튼 클릭 이벤트
    signinBtn.addEventListener("click", (e) => {
        e.preventDefault();
        
        const newUser = {
            email: emailInput.value,
            password: passwordInput.value,
            username: usernameInput.value,
            profileImage: profileImage.src
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        
        window.location.href = "login.html";
    });

    // 로그인하러 가기로 이동
    document.querySelectorAll("#back-to-login, #back").forEach(btn => {
        btn.addEventListener("click", () => window.location.href = "login.html");
    });
    
    await getUsers();
});