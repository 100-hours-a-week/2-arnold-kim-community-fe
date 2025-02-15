document.addEventListener("DOMContentLoaded", async () => {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginBtn = document.getElementById("login-btn");
    const signupBtn = document.getElementById("signup-btn");

    const errorMessage = document.getElementById("error-message");
    const loginFailError = document.getElementById("login-fail");

    let users = [];

    async function getUsers() {
        try {
            const response = await fetch("../data/user.json");
            if (!response.ok) throw new Error("사용자 데이터를 불러오는데 실패했습니다.");
            users = await response.json();

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

    // 에러 메시지 출력
    function updateErrorMessage() {
        let errorText = "";

        if (emailInput.value === "" || emailInput.value.length < 5 || !validateEmail(emailInput.value)) {
            errorText = "*올바른 이메일 주소 형식을 입력해주세요.";
        }

        if (passwordInput.value === "") {
            errorText = errorText ? `${errorText} / *비밀번호를 입력해주세요.` : "*비밀번호를 입력해주세요.";
        } else if (!validatePassword(passwordInput.value)) {
            errorText = errorText ? `${errorText} / *비밀번호는 8~20자, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.` 
                                  : "*비밀번호는 8~20자, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.";
        }

        errorMessage.textContent = errorText;
        updateButtonState();
    }

    function updateButtonState() {
        if (validateEmail(emailInput.value) && validatePassword(passwordInput.value)) {
            loginBtn.classList.add("active");
            loginBtn.removeAttribute("disabled");
        } else {
            loginBtn.classList.remove("active");
            loginBtn.setAttribute("disabled", "true");
        }
    }

    // 입력 필드 이벤트 리스너
    emailInput.addEventListener("input", updateErrorMessage);
    passwordInput.addEventListener("input", updateErrorMessage);

    // 로그인 버튼 클릭 이벤트
    loginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        
        const email = emailInput.value;
        const password = passwordInput.value;

        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            window.location.href = "../board/post.html";
        } else {
            loginFailError.textContent = "*아이디 또는 비밀번호를 확인해주세요"
        }
    });

    // 회원가입 버튼 클릭 시 이동
    signupBtn.addEventListener("click", () => {
        window.location.href = "signup.html";
    });

    await getUsers();
});
