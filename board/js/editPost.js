document.addEventListener("DOMContentLoaded", async () => {
    const backToPosts = document.getElementById("back");
    const userProfile = document.getElementById("user-profile");

    const postTitle = document.getElementById("post-title");
    const postContent = document.getElementById("post-content");
    const postImage = document.getElementById("post-image");
    const postImageUpload = document.getElementById("post-image-upload");

    const saveEditBtn = document.getElementById("save-edit");

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");


    userProfile.addEventListener("click", () => {
        window.location.href = "editProfile.html";
    });

    backToPosts.addEventListener("click", () => {
        // 수정 버튼을 눌러서 온 포스트의 id로 가야함. 더미데이터로 일단 1로 고정
        window.location.href = "post.html?id=1";
    });

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
    });

    await fetchPost();
})