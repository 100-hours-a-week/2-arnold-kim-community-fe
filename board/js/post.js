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
    const postDeleteModal = document.getElementById("post-delete-modal");
    const commentDeleteModal = document.getElementById("comment-delete-modal");
    const confirmPostDelete = document.getElementById("confirm-post-delete");
    const confirmCommentDelete = document.getElementById("confirm-comment-delete");
    const modalCancels = document.querySelectorAll(".modal-cancel");

    const backToPosts = document.getElementById("back");
    const userProfile = document.getElementById("user-profile");

    const commentInput = document.getElementById("comment-input");
    const commentSubmit = document.getElementById("comment-submit");

    userProfile.addEventListener("click", () => {
        window.location.href = "editProfile.html";
    });

    backToPosts.addEventListener("click", () => {
        window.location.href = "posts.html";
    });

    // ✅ JSON 데이터 가져오기
    async function fetchPost() {
        try {
            const response = await fetch("../data/posts.json");
            if (!response.ok) throw new Error("게시글 데이터를 불러오는 데 실패했습니다.");
            const posts = await response.json();

            // ✅ 현재 postId와 일치하는 게시글 찾기
            const post = posts.find(p => p.id == postId);

            if (!post) {
                postTitle.textContent = "게시글을 찾을 수 없습니다.";
                return;
            }

            // ✅ JSON 데이터 적용
            postTitle.textContent = post.title;
            postContent.textContent = post.content;
            authorProfile.src = post.authorProfile || "../assets/userProfile.jpg";
            authorName.textContent = post.author;
            postDate.textContent = post.date;
            postImage.src = post.image || "../assets/userProfile.jpg";
            likeCount.textContent = formatCount(post.likes);
            viewCount.textContent = formatCount(post.views);
            commentCount.textContent = formatCount(post.comments.length); // 댓글 개수 적용

            // ✅ 댓글 데이터 렌더링
            renderComments(post.comments);
        } catch (error) {
            console.error("데이터 로딩 오류:", error);
        }
    }

    // ✅ 숫자를 k 단위로 변환 (1000 → 1k, 10000 → 10k)
    function formatCount(count) {
        if (count >= 100000) return (count / 100000).toFixed(0) + "k";
        if (count >= 10000) return (count / 10000).toFixed(0) + "k";
        if (count >= 1000) return (count / 1000).toFixed(0) + "k";
        return count;
    }

    // ✅ 좋아요 버튼 클릭 이벤트
    likeBtn.addEventListener("click", () => {
        let count = parseInt(likeCount.textContent.replace("k", "")) || 0;
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
        window.location.href = "editPost.html";
    });

    // ✅ 삭제 버튼 클릭 시 모달 표시
    deletePostBtn.addEventListener("click", () => {
        postDeleteModal.classList.add("show");
    });

    // ✅ 게시글 삭제 확인
    confirmPostDelete.addEventListener("click", () => {
        // 저장소가 따로 없어서 alert만 함
        alert("게시글이 삭제되었습니다.");
        window.location.href = "posts.html";
    });

    // ✅ 모든 취소 버튼 클릭 시 모달 닫기
    modalCancels.forEach(button => {
        button.addEventListener("click", () => {
            postDeleteModal.classList.remove("show");
            commentDeleteModal.classList.remove("show");
        });
    });

    // ✅ 댓글 렌더링
    function renderComments(comments) {
        const commentList = document.getElementById("comment-list");
        commentList.innerHTML = ""; 
    
        const commentInput = document.getElementById("comment-input");
        const commentSubmit = document.getElementById("comment-submit");
    
        // 현재 로그인한 사용자 가져오기
        const currentUser = JSON.parse(sessionStorage.getItem("user"))?.username || "";
    
        let editingComment = null; // 현재 수정 중인 댓글 저장 변수
    
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
    
            // 버튼 요소 가져오기
            const editButton = commentElement.querySelector(".edit-comment");
            const deleteButton = commentElement.querySelector(".delete-comment");
            const commentContent = commentElement.querySelector(".comment-content");
    
            // 현재 로그인한 사용자와 댓글 작성자가 같으면 버튼 표시
            if (currentUser === comment.author) {
                editButton.style.display = "inline-block";
                deleteButton.style.display = "inline-block";
            }
    
            // ✅ "수정" 버튼 클릭 이벤트
            editButton.addEventListener("click", () => {
                commentInput.value = commentContent.textContent.trim(); // 기존 댓글을 입력창에 표시
                commentSubmit.textContent = "댓글 수정"; // 버튼 텍스트 변경
                commentSubmit.classList.add("active"); // 버튼 활성화
                commentSubmit.removeAttribute("disabled");
    
                editingComment = commentContent; // 현재 수정 중인 댓글 저장
            });
    
            // ✅ "삭제" 버튼 클릭 이벤트
            deleteButton.addEventListener("click", () => {
                commentDeleteModal.classList.add("show");
            });
    
            confirmCommentDelete.addEventListener("click", () => {
                alert("댓글이 삭제되었습니다.");
                commentDeleteModal.classList.remove("show");
            });
    
            commentList.appendChild(commentElement);
        });
    
        // ✅ "댓글 등록/수정" 버튼 클릭 이벤트
        commentSubmit.addEventListener("click", () => {
            if (editingComment) {
                // ✅ 댓글 수정 기능
                editingComment.textContent = commentInput.value.trim(); // 기존 댓글 내용 변경
                alert("댓글이 수정되었습니다.");
                commentSubmit.textContent = "댓글 등록"; // 버튼 텍스트 원래대로 변경
                editingComment = null; // 수정 상태 해제
            } else {
                // ✅ 새 댓글 등록 기능 (저장소가 없어서 alert만)
                alert("댓글이 등록되었습니다.");
            }
    
            // 입력창 초기화 & 버튼 비활성화
            commentInput.value = "";
            commentSubmit.classList.remove("active");
            commentSubmit.setAttribute("disabled", "true");
        });
    }

    await fetchPost();
});
