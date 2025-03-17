import CONFIG from "../../config.js";

document.addEventListener("DOMContentLoaded", async () => {
    const postTitle = document.getElementById("post-title");
    const postContent = document.getElementById("post-content");
    const postImage = document.getElementById("post-image");
    const postImageUpload = document.getElementById("post-image-upload");

    const saveEditBtn = document.getElementById("save-edit");

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    let file;

    async function fetchPost() {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/posts/${postId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                }
            });
            
            if (!response.ok) throw new Error("게시글 데이터를 불러오는 데 실패했습니다.");
            const result = await response.json();

            const post = result.data;
            if (!post) {
                alert("게시글을 찾을 수 없습니다.");
                // window.location.href = "posts.html";
                return;
            }

            postTitle.value = post.title;
            postContent.value = post.content;
            postImage.src = `${CONFIG.IMAGE_URL}` + post.image;

        } catch (error) {
            console.error("데이터 로딩 오류:", error);
        }
    }
    

    postTitle.addEventListener("input", () => {
        if (postTitle.value.length > 26) {
            alert("제목은 최대 26자까지만 입력 가능합니다.");
            postTitle.value = postTitle.value.substring(0, 26);
        }
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

    saveEditBtn.addEventListener("click", async () => {
        // fetch API를 이용한 게시글 수정

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
        formData.append("postEditRequestDTO", postJson);

        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/posts/${postId}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: formData
            });

            if (response.ok) {
                window.location.href = `post.html?id=${postId}`;
            } else {
                const result = await response.json();
                console.log(result.message);
                throw new Error(result.message);
            }

        } catch (error) {
            console.error("게시글 등록 오류:", error);
            errorMessage.textContent = error.message;
            errorMessage.style.display = "block";
        }
    });

    await fetchPost();
})