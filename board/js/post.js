document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    const postTitle = document.getElementById("post-title");
    const postContent = document.getElementById("post-content");
    const authorProfile = document.getElementById("author-profile");
    const authorName = document.getElementById("author-name");
    const postDate = document.getElementById("post-date");
    const postImage = document.getElementById("post-image");
    const likeBtn = document.getElementById("like-btn");
    const likeCount = document.getElementById("like-count");
    const viewCount = document.getElementById("view-count");
    const commentCount = document.getElementById("comment-count");

    const editPostBtn = document.getElementById("edit-post");
    const deletePostBtn = document.getElementById("delete-post");

    const backToPosts = document.getElementById("back");
    const userProfile = document.getElementById("user-profile");

    const commentInput = document.getElementById("comment-input");
    const commentSubmit = document.getElementById("comment-submit");

    const currentUser = JSON.parse(sessionStorage.getItem("user"))?.username || "";

    userProfile.addEventListener("click", () => {
        window.location.href = "editProfile.html";
    });

    backToPosts.addEventListener("click", () => {
        window.location.href = "posts.html";
    });

    async function fetchPost() {
        try {
            const response = await fetch("../data/posts.json");
            if (!response.ok) throw new Error("게시글 데이터를 불러오는 데 실패했습니다.");
            const posts = await response.json();

            const post = posts.find(p => p.id == postId);

            if (!post) {
                postTitle.textContent = "게시글을 찾을 수 없습니다.";
                return;
            }

            postTitle.textContent = post.title;
            postContent.textContent = post.content;
            authorProfile.src = post.authorProfile || "../assets/userProfile.jpg";
            authorName.textContent = post.author;
            postDate.textContent = post.date;
            postImage.src = post.image || "../assets/userProfile.jpg";
            likeCount.textContent = formatCount(post.likes);
            viewCount.textContent = formatCount(post.views);
            commentCount.textContent = formatCount(post.comments.length);

            postBtnDisplay();
            renderComments(post.comments);
        } catch (error) {
            console.error("데이터 로딩 오류:", error);
        }
    }

    function formatCount(count) {
        if (count >= 1000) return (count / 1000).toFixed(0) + "k";
        return count;
    }

    likeBtn.addEventListener("click", () => {
        let count = parseInt(likeCount.textContent.replace("k", "000")) || 0;
        if (likeBtn.classList.contains("active")) {
            likeBtn.classList.remove("active");
            likeBtn.style.backgroundColor = "#d9d9d9";
            likeCount.textContent = formatCount(count - 1);
        } else {
            likeBtn.classList.add("active");
            likeBtn.style.backgroundColor = "#ACA0EB";
            likeCount.textContent = formatCount(count + 1);
        }
    });

    commentInput.addEventListener("input", () => {
        if (commentInput.value.trim() !== "") {
            commentSubmit.classList.add("active");
            commentSubmit.removeAttribute("disabled");
        } else {
            commentSubmit.classList.remove("active");
            commentSubmit.setAttribute("disabled", "true");
        }
    });

    editPostBtn.addEventListener("click", () => {
        window.location.href = `editPost.html?id=${postId}`;
    });

    deletePostBtn.addEventListener("click", () => {
        setModal("<h3>게시글을 삭제하시겠습니까?</h3>삭제한 내용은 복구할 수 없습니다.", () => {
            alert("게시글이 삭제되었습니다.");
            window.location.href = "posts.html";
        });
    });

    function postBtnDisplay(){
        if (currentUser === authorName.textContent){
            editPostBtn.style.display = "inline-block";
            deletePostBtn.style.display = "inline-block";
        }
    }

    function renderComments(comments) {
        const commentList = document.getElementById("comment-list");
        commentList.innerHTML = ""; 
    
        let editingComment = null;
    
        comments.forEach(comment => {
            const commentElement = document.createElement("div");
            commentElement.classList.add("comment");
    
            commentElement.innerHTML = `
                <div class="comment-header">
                    <!-- 작성자 정보 (왼쪽 정렬) -->
                    <div class="comment-info">
                        <img class="comment-profile" src="${comment.authorProfile || "../assets/userProfile.jpg"}">
                        <p class="comment-author">${comment.author}</p>
                        <p class="comment-date">${comment.date}</p>
                    </div>
    
                    <!-- 수정/삭제 버튼 (기본적으로 숨김) -->
                    <div class="comment-actions">
                        <button class="edit-comment" style="display: none;">수정</button>
                        <button class="delete-comment" style="display: none;">삭제</button>
                    </div>
                </div>
    
                <!-- 댓글 내용 (왼쪽 정렬, 다음 줄) -->
                <p class="comment-content">${comment.content}</p>
            `;

            const editButton = commentElement.querySelector(".edit-comment");
            const deleteButton = commentElement.querySelector(".delete-comment");
            const commentContent = commentElement.querySelector(".comment-content");

            if (currentUser === comment.author) {
                editButton.style.display = "inline-block";
                deleteButton.style.display = "inline-block";
            }

            editButton.addEventListener("click", () => {
                commentInput.value = commentContent.textContent.trim(); 
                commentSubmit.textContent = "댓글 수정"; 
                commentSubmit.classList.add("active"); 
                commentSubmit.removeAttribute("disabled");
    
                editingComment = commentContent; 
            });

            deleteButton.addEventListener("click", () => {
                setModal("<h3>댓글을 삭제하시겠습니까?</h3>삭제한 내용은 복구할 수 없습니다.", () => {
                    alert("댓글이 삭제되었습니다.");
                });
            });
    
            commentList.appendChild(commentElement);
        });

        commentSubmit.addEventListener("click", () => {
            if (editingComment) {
                editingComment.textContent = commentInput.value.trim(); 
                alert("댓글이 수정되었습니다.");
                commentSubmit.textContent = "댓글 등록";
                editingComment = null; 
            } else {
                alert("댓글이 등록되었습니다.");
            }

            commentInput.value = "";
            commentSubmit.classList.remove("active");
            commentSubmit.setAttribute("disabled", "true");
        });
    }

    await fetchPost();
});
