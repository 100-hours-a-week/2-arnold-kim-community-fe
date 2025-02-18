document.addEventListener("DOMContentLoaded", async () => {
    const passwordInput = document.getElementById("password");
    const passwordCheckInput = document.getElementById("password-check");

    const editBtn = document.getElementById("edit-btn");
    const editCompleteBtn = document.getElementById("edit-profile-complete-btn");

    const passwordError = document.getElementById("password-error")
    const passwordCheckError = document.getElementById("password-check-error")


    let validatePasswordCheck = false;

    // 비밀번호 유효성 검사
    function validatePassword(password) {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
        return passwordPattern.test(password);
    }

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

    editBtn.addEventListener("click", () => {
        if (passwordError.textContent === "" && validatePasswordCheck) {
            editCompleteBtn.style.display = "block"; // 토스트 메시지 표시
            setTimeout(() => {
                editCompleteBtn.style.display = "none";
            }, 2000);
        }
    });
});