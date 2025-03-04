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

    let currentUser;

    // fetch API를 이용하여 유저 정보 가져오기
    async function getUser() {
        try {
            const response = await fetch("${CONFIG.API_BASE_URL/users/info}", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.ok) {
                const data = await response.json();

                currentUser = data.username;
            }
        } catch (error) {
            alert(error);
        }

    }


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

        // fetch api를 이용하여 게시물 정보 가져오기
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/posts/${postId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message);
            }

            const result = await response.json();

            const post = result.data;
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

            // 댓글이 배열로 온다고 가정 => commentCount 계산
            // (명세서에 comments가 배열 형태)
            commentCount.textContent = formatCount(post.comments.length);
            comments = post.comments;

            postBtnDisplay();
            renderComments(post.comments);
        } catch (error) {
            console.error("데이터 로딩 오류:", error);
            postTitle.textContent = error.message;
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
            deleteLike();
        } else {
            likeBtn.classList.add("active");
            likeBtn.style.backgroundColor = "#ACA0EB";
            likeCount.textContent = formatCount(count + 1);
            postLike();
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
        setModal("<h3>게시글을 삭제하시겠습니까?</h3>삭제한 내용은 복구할 수 없습니다.", async () => {
            alert("게시글이 삭제되었습니다.");
            window.location.href = "posts.html";

            // fetch api를 사용하여 게시글 삭제하기
            // try {
            //     const response = await fetch(`${CONFIG.API_BASE_URL}/posts/${postId}`, {
            //         method: "DELETE",
            //         headers: {
            //             "Authorization": `Bearer ${localStorage.getItem("token")}`
            //         }
            //     });

            //     if (!response.ok) {
            //         const resBody = await response.json();
            //         throw new Error(resBody.message);
            //     }

            //     window.location.href = "posts.html";

            // } catch (error) {
            //     console.error(error);
            //     alert(error.message);
            // }
        });
    });

    function postBtnDisplay(){
        if (currentUser === authorName.textContent){
            editPostBtn.style.display = "inline-block";
            deletePostBtn.style.display = "inline-block";
        }
    }

    async function postLike() {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/posts/${postId}/like`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message);
            }

            const result = await response.json();
            likeCount.textContent = result.data.likes;

        } catch (error) {
            console.error("댓글 로딩 오류:", error);
        }
    }

    async function deleteLike() {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/posts/${postId}/like`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message);
            }

            const result = await response.json();
            likeCount.textContent = result.data.likes;

        } catch (error) {
            console.error("댓글 로딩 오류:", error);
        }
    }

    async function fetchComments() {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/posts/${postId}/comments`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "댓글 데이터를 불러오는 데 실패했습니다.");
            }

            const result = await response.json();
            comments = result.data || [];
            renderComments();
        } catch (error) {
            console.error("댓글 로딩 오류:", error);
        }
    }

    async function postComment(newContent){
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/posts/${postId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    content: newContent
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message);
            }

            await fetchComments();
        } catch (error) {
            console.error("댓글 작성 오류:", error);
            alert(error.message);
        }
    }

    async function editComment(commentId, newContent) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/posts/${postId}/comments/${commentId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    content: newContent
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message);
            }

            await fetchComments();
        } catch (error) {
            console.error("댓글 수정 오류:", error);
            alert(error.message);
        }
    }

    async function deleteComment(commentId) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/posts/${postId}/comments/${commentId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message);
            }

            await fetchComments();
            alert("댓글이 삭제되었습니다.");
        } catch (error) {
            console.error("댓글 삭제 오류:", error);
            alert(error.message);
        }
    }
    

    function renderComments(comments) {
        const commentList = document.getElementById("comment-list");
        commentList.innerHTML = ""; 
    
        let editingComment = null;
        let editingCommentId = null;
    
        comments.forEach(comment => {
            const commentElement = document.createElement("div");
            commentElement.classList.add("comment");

            commentElement.dataset.commentId = comment.commentId;
    
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
                const commentId = commentElement.dataset.commentId;

                commentInput.value = commentContent.textContent.trim(); 
                commentSubmit.textContent = "댓글 수정"; 
                commentSubmit.classList.add("active"); 
                commentSubmit.removeAttribute("disabled");
    
                editingComment = commentContent; 
                editingCommentId = commentId;
            });

            deleteButton.addEventListener("click", () => {
                setModal("<h3>댓글을 삭제하시겠습니까?</h3>삭제한 내용은 복구할 수 없습니다.", async () => {
                    alert("댓글이 삭제되었습니다.");
                    // const commentId = commentElement.dataset.commentId;
                    // await deleteComment(commentId); 
                });
            });
    
            commentList.appendChild(commentElement);
        });

        commentSubmit.addEventListener("click", async () => {
            if (editingComment) {
                editingComment.textContent = commentInput.value.trim(); 
                alert("댓글이 수정되었습니다.");
                // editComment(editingCommentId, editingComment);
                commentSubmit.textContent = "댓글 등록";
                editingComment = null; 
            } else {
                // postComment(commentInput.value);
                alert("댓글이 등록되었습니다.");
            }

            commentInput.value = "";
            commentSubmit.classList.remove("active");
            commentSubmit.setAttribute("disabled", "true");
        });
    }

    await fetchPost();
    await getUser();
    await fetchComments();
});
