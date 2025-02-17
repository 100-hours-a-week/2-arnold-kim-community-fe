async function loadModal() {
    try {
        const response = await fetch("../component/modal.html"); 
        if (!response.ok) throw new Error("모달 파일을 불러오는 데 실패했습니다.");

        const modalHtml = await response.text();
        document.body.insertAdjacentHTML("beforeend", modalHtml);

        const modal = document.getElementById("custom-modal");
        const modalMessage = document.getElementById("modal-message");
        const modalCancel = document.getElementById("modal-cancel");
        const modalConfirm = document.getElementById("modal-confirm");

        window.setModal = (message, confirmCallback) => {
            modalMessage.innerHTML = message;
            modal.style.display = "flex"; 
            modalConfirm.onclick = () => {
                confirmCallback();
                modal.style.display = "none";
            };

            modalCancel.onclick = () => {
                modal.style.display = "none";
            };
        };

    } catch (error) {
        alert("모달 로딩 오류");
    }
}

document.addEventListener("DOMContentLoaded", loadModal);