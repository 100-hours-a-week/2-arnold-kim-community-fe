document.addEventListener("DOMContentLoaded", () => {
    const headerPlaceholder = document.getElementById("header-placeholder");

    fetch("../component/header.html")
      .then((response) => response.text())
      .then((html) => {
        headerPlaceholder.innerHTML = html;

        const userProfile = document.getElementById("user-profile");
        const backToPosts = document.getElementById("back");
        const profileDropdown = document.createElement("div");

        const storedUrl = localStorage.getItem("profileImgUrl");
        if (storedUrl) {
            // 이미지 URL이 localStorage에 있으면 그것으로 설정
            userProfile.src = storedUrl;
        }
        
        backToPosts.addEventListener("click", () => {
            window.location.href = "../board/posts.html";
        });

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
            window.location.href = "../user/editProfile.html"
        })
    
        document.getElementById("edit-password-menu").addEventListener("click", () => {
            window.location.href = "../user/editPassword.html";
        });
    
        document.getElementById("logout-menu").addEventListener("click", () => {
            window.location.href = "../user/login.html";
            localStorage.clear();
        });
      })
      .catch((err) => console.error(err));
  });