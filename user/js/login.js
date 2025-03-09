import CONFIG from "../../config.js";
import { validateEmail, validatePassword } from "../../utils/validate.js";


document.addEventListener("DOMContentLoaded", async () => {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginBtn = document.getElementById("login-btn");
    const signupBtn = document.getElementById("signup-btn");

    const errorMessage = document.getElementById("error-message");
    const loginFailError = document.getElementById("login-fail");

    // fetchAPI 적용시 필요 없는 코드
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
    // 까지

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
    //loginBtn.addEventListener("click", async (e) => {
    loginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        
        const email = emailInput.value;
        const password = passwordInput.value;

        // fetchAPI 적용시 필요 없는 코드
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            window.location.href = "../board/posts.html";
            sessionStorage.setItem("user", JSON.stringify(user));
        } else {
            loginFailError.textContent = "*아이디 또는 비밀번호를 확인해주세요"
        }
        // 까지
        
        // fetch API를 이용하여 로그인 확인
        // try {
        //     const response = await fetch("${CONFIG.API_BASE_URL}/users/login", {
        //         method: "GET",
        //         headers: {
        //             "Content-Type": "application/json"
        //         },
        //         // 리소스를 body에 담아서 전송
        //         body: JSON.stringify({ email, password })
        //     });
            
        //     if (response.ok) {
        //         const data = await response.json();
        //         // 성공 시 받은 토큰을 localStorage에 저장
        //         localStorage.setItem("token", data.token);
        //         window.location.href = "../board/posts.html";
        //     } else {
        //         const errorData = await response.json();
        //         loginFailError.textContent = `*아이디 또는 비밀번호를 확인해주세요`;
        //         console.log("${errorData.message}");
        //     }
        // } catch (error) {
        //     console.error("로그인 요청 실패:", error);
        // }
    });

    // 회원가입 버튼 클릭 시 이동
    signupBtn.addEventListener("click", () => {
        window.location.href = "signin.html";
    });

    await getUsers();
});
