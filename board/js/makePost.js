document.addEventListener("DOMContentLoaded", async () => {
    const backToPosts = document.getElementById("back");
    const userProfile = document.getElementById("user-profile");

    const postTitle = document.getElementById("post-title");
    const postContent = document.getElementById("post-content");
    const postImage = document.getElementById("post-image");
    const postImageUpload = document.getElementById("post-image-upload");

    const saveMakeBtn = document.getElementById("save-make");
    const errorMessage = document.getElementById("error-message");

    userProfile.addEventListener("click", () => {
        window.location.href = "makeProfile.html";
    });

    backToPosts.addEventListener("click", () => {
        window.location.href = "posts.html";
    });

    postTitle.addEventListener("input", () => {
        if (postTitle.value.length > 26) {
            alert("제목은 최대 26자까지만 입력 가능합니다.");
            postTitle.value = postTitle.value.substring(0, 26);
        }

        updateButtonState();
    });

    postImageUpload.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                postImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    postContent.addEventListener("input", updateButtonState);

    function updateButtonState() {
        if (postTitle.value.trim() !== "" && postContent.value.trim() !== "") {
            saveMakeBtn.classList.add("active");
            saveMakeBtn.removeAttribute("disabled");
            errorMessage.style.display = "none";
        } else {
            saveMakeBtn.classList.remove("active");
            saveMakeBtn.setAttribute("disabled", "true");
        }
    }

    saveMakeBtn.addEventListener("click", () => {
        if (postTitle.value.trim() === "" || postContent.value.trim() === "") {
            errorMessage.textContent = "*제목, 내용을 모두 작성해주세요.";
            errorMessage.style.display = "block";
            return;
        }

        errorMessage.style.display = "none";

        // DB가 없어서 따로 저장하진 않고 alert만 함.
        alert("게시글이 작성되었습니다.");
        window.location.href = "posts.html";
    });

    await fetchPost();
})