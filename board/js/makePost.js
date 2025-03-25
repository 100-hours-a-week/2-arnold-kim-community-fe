import CONFIG from "../../config.js";

document.addEventListener("DOMContentLoaded", async () => {
    const postTitle = document.getElementById("post-title");
    const postContent = document.getElementById("post-content");
    const postImage = document.getElementById("post-image");
    const postImageUpload = document.getElementById("post-image-upload");

    const saveMakeBtn = document.getElementById("save-make");
    const errorMessage = document.getElementById("error-message");

    let file;

    postTitle.addEventListener("input", () => {
        if (postTitle.value.length > 26) {
            alert("제목은 최대 26자까지만 입력 가능합니다.");
            postTitle.value = postTitle.value.substring(0, 26);
        }

        updateButtonState();
    });

    postImageUpload.addEventListener("change", (event) => {
        file = event.target.files[0];
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

    saveMakeBtn.addEventListener("click", async () => {
        if (postTitle.value.trim() === "" || postContent.value.trim() === "") {
            errorMessage.textContent = "*제목, 내용을 모두 작성해주세요.";
            errorMessage.style.display = "block";
            return;
        }

        errorMessage.style.display = "none";

        // fetch API를 이용한 게시글 등록
        const newPost = {
            title: postTitle.value,
            content: postContent.value
        };

        const formData = new FormData();
        const postJson = new Blob(
            [JSON.stringify(newPost)],
            { type: "application/json" }
        )


        formData.append("image", file);
        formData.append("postRequestDTO", postJson);

        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/posts/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: formData
            });

            if (response.ok) {
                window.location.href = "posts.html";
            } else {
                const result = await response.json();
                console.log(JSON.stringify(result));
                alert(JSON.stringify(result.error));
                throw new Error(result.message);
            }

        } catch (error) {
            console.error("게시글 등록 오류:", error);
            errorMessage.textContent = error.message;
            errorMessage.style.display = "block";
        }
    });
})