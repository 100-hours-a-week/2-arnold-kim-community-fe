import CONFIG from "../../config.js";

document.addEventListener("DOMContentLoaded", async () => {
    const postTitle = document.getElementById("post-title");
    const postContent = document.getElementById("post-content");
    const postImage = document.getElementById("post-image");
    const postImageUpload = document.getElementById("post-image-upload");

    const saveEditBtn = document.getElementById("save-edit");

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    async function fetchPost() {
        try {
            const response = await fetch("../data/posts.json");
            if (!response.ok) throw new Error("게시글 데이터를 불러오는 데 실패했습니다.");
            const posts = await response.json();

            const post = posts.find(p => p.id == postId);
            if (!post) {
                alert("게시글을 찾을 수 없습니다.");
                window.location.href = "posts.html";
                return;
            }

            postTitle.value = post.title;
            postContent.value = post.content;
            postImage.src = post.image || "../assets/userProfile.jpg";

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
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                postImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    saveEditBtn.addEventListener("click", () => {
        alert("게시글이 수정되었습니다.");
        window.location.href = `post.html?id=${postId}`;

        // fetch API를 이용한 게시글 수정
        // try {
        //     const response = await fetch(`${CONFIG.API_BASE_URL}/posts/{postId}`, {
        //         method: "PATCH",
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        //         },
        //         body: JSON.stringify({
        //             title: postTitle.value.trim(),
        //             content: postContent.value.trim(),
        //             image: postImage.src 
        //         })
        //     });

        //     if (!response.ok) {
        //         const resData = await response.json();
        //         throw new Error(resData.message);
        //     }

        //     const result = await response.json();
        //     if (result.message === "post_success") {
        //        window.location.href = `post.html?id=${postId}`;
        //     } else {
        //         throw new Error(result.message);
        //     }

        // } catch (error) {
        //     console.error("게시글 등록 오류:", error);
        //     errorMessage.textContent = error.message;
        //     errorMessage.style.display = "block";
        // }
    });

    await fetchPost();
})