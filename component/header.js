document.addEventListener("DOMContentLoaded", () => {
    const headerPlaceholder = document.getElementById("header-placeholder");

    fetch("../component/header.html")
      .then((response) => response.text())
      .then((html) => {
        headerPlaceholder.innerHTML = html;

        const userProfile = document.getElementById("user-profile");
        const backToPosts = document.getElementById("back");

        const storedUrl = localStorage.getItem("profileImgUrl");
        if (storedUrl) {
            // 이미지 URL이 localStorage에 있으면 그것으로 설정
            userProfile.src = storedUrl;
        }
        
        userProfile.addEventListener("click", () => {
            window.location.href = "../user/editProfile.html";
        });

        backToPosts.addEventListener("click", () => {
            window.history.back();
        });
      })
      .catch((err) => console.error(err));
  });