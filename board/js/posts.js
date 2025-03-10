document.addEventListener("DOMContentLoaded", async () => {
    const postList = document.getElementById("post-list");
    const userProfile = document.getElementById("user-profile");
    const makePostBtn = document.getElementById("make-post-btn");
    const postListContainer = document.getElementById("post-list-container"); 
    let posts = [];
    let currentPage = 1;
    const postsPerPage = 5;
    let isFetching = false; 

    userProfile.addEventListener("click", () => {
        window.location.href = "../../user/editProfile.html";
    });

    makePostBtn.addEventListener("click", () => {
        window.location.href = "makePost.html";
    });

    async function fetchPosts() {
        try {
            const response = await fetch("../data/posts.json");
            if (!response.ok) throw new Error("게시글 데이터를 불러오는 데 실패했습니다.");
            posts = await response.json();
            loadMorePosts(); 
        } catch (error) {
            console.error("데이터 로딩 오류:", error);
        }

        // fetch API를 이용하여 게시글 목록 가져오기
        // try {
        //     const response = await fetch(`${CONFIG.API_BASE_URL}/posts`, {
        //         method: "GET",
        //         headers: {
        //             "Content-Type": "application/json"
        //             // "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        //         }
        //     });

        //     if (!response.ok) {
        //         const errorData = await response.json();
        //         throw new Error(errorData.message);
        //     }

        //     const result = await response.json(); 
        //     posts = result.data;

        //     loadMorePosts(); 
        // } catch (error) {
        //     console.error("데이터 로딩 오류:", error);
        // }
    }

    function formatCount(count) {
        if (count >= 1000) return (count / 1000).toFixed(0) + "k";
        return count;
    }

    function renderPost(postData) {
        const postElement = document.createElement("div");
        postElement.classList.add("post-card");

        const defaultProfileImg = "../assets/default_img.png"; 

        postElement.innerHTML = `
            <h3 class="post-title">${postData.title.length > 26 ? postData.title.substring(0, 26) + "..." : postData.title}</h3>
            <div class="post-info">
                <span>좋아요 ${formatCount(postData.likes)} 댓글 ${formatCount(postData.comments.length)} 조회수 ${formatCount(postData.views)}</span>
                <span>${postData.date}</span>
            </div>
            <div class="post-divider"></div>
            <div class="post-author">
                <img class="author-img" src="${postData.authorProfile ? postData.authorProfile : defaultProfileImg}">
                <span>${postData.author}</span>
            </div>
        `;

        postElement.addEventListener("click", () => {
            window.location.href = `post.html?id=${postData.id}`;
        });

        postList.appendChild(postElement);
    }

    function loadMorePosts() {
        if (isFetching) return;
        isFetching = true;
        const start = (currentPage - 1) * postsPerPage;
        const end = start + postsPerPage;
        const newPosts = posts.slice(start, end);

        if (newPosts.length === 0) {
            postListContainer.removeEventListener("scroll", handleScroll); 
            return;
        }

        newPosts.forEach(renderPost);
        currentPage++;
        isFetching = false;
    }

    function handleScroll() {
        const { scrollTop, scrollHeight, clientHeight } = postListContainer;

        if (scrollTop + clientHeight >= scrollHeight - 10) {
            loadMorePosts();
        }
    }

    postListContainer.addEventListener("scroll", handleScroll);

    await fetchPosts();
});
