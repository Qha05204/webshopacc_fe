// Hàm load header và footer
async function loadLayout() {
    try {
        // Load header
        const headerResponse = await fetch('/includes/header.html');
        const headerHtml = await headerResponse.text();
        document.getElementById('header-container').innerHTML = headerHtml;

        // Load footer
        const footerResponse = await fetch('/includes/footer.html');
        const footerHtml = await footerResponse.text();
        document.getElementById('footer-container').innerHTML = footerHtml;

        // Khởi tạo lại các components Bootstrap sau khi load
        initializeBootstrapComponents();
    } catch (error) {
        console.error('Lỗi khi load layout:', error);
    }
}

// Hàm khởi tạo lại các components Bootstrap
function initializeBootstrapComponents() {
    // Khởi tạo tất cả tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Khởi tạo tất cả popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Khởi tạo tất cả modals
    const modalTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="modal"]'));
    modalTriggerList.map(function (modalTriggerEl) {
        return new bootstrap.Modal(modalTriggerEl);
    });
}

// Thêm event listener khi DOM đã load xong
document.addEventListener('DOMContentLoaded', loadLayout);

// Export các hàm để có thể sử dụng ở các file khác nếu cần
export { loadLayout, initializeBootstrapComponents };
