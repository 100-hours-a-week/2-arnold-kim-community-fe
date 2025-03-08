import CONFIG from "../config.js";
import { validatePassword } from "../../utils/validate.js";

document.addEventListener("DOMContentLoaded", async () => {
    const passwordInput = document.getElementById("password");
    const passwordCheckInput = document.getElementById("password-check");

    const editBtn = document.getElementById("edit-btn");
    const editCompleteBtn = document.getElementById("edit-profile-complete-btn");

    const passwordError = document.getElementById("password-error")
    const passwordCheckError = document.getElementById("password-check-error")


    let validatePasswordCheck = false;

    passwordInput.addEventListener("input", () => {
        if (passwordInput.value === "") {
            passwordError.textContent = "*비밀번호를 입력해주세요.";
        } else if (!validatePassword(passwordInput.value)) {
            passwordError.textContent = "*비밀번호는 8~20자, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.";
        } else if (passwordInput.value !== passwordCheckInput.value){
            passwordError.textContent = "*비밀번호가 다릅니다.";
        } else {
            passwordError.textContent = "";
            passwordCheckError.textContent = "";
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
            passwordError.textContent = "";
        }

        updateButtonState();
    });

    function updateButtonState() {
        if (validatePassword(passwordInput.value) && validatePasswordCheck) {
            editBtn.classList.add("active");
            editBtn.removeAttribute("disabled");
        } else {
            editBtn.classList.remove("active");
            editBtn.setAttribute("disabled", "true");
        }
    };

    editBtn.addEventListener("click", async () => {
        if (passwordError.textContent === "" && validatePasswordCheck) {
            editCompleteBtn.style.display = "block"; // 토스트 메시지 표시
    
            // fetch API를 이용하여 비밀번호 변경
            // try {
            //     const response = await fetch(`${CONFIG.API_BASE_URL}/users/password`, {
            //         method: "PATCH", 
            //         headers: {
            //             "Content-Type": "application/json",
            //             "Authorization": `Bearer ${localStorage.getItem("token")}` // 토큰이 필요하다면 추가
            //         },
            //         body: JSON.stringify({
            //             password: passwordInput.value
            //         })
            //     });

            //     setTimeout(() => {
            //         editCompleteBtn.style.display = "none";
            //     }, 2000);

            // } catch (error) {
            //     alert(`오류 발생: ${error.message}`);
            // }
        }
    });
});