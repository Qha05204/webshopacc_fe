// Hàm hiển thị form thanh toán
function showPaymentForm(method) {
    document.querySelectorAll('.payment-form').forEach(form => form.classList.add('d-none'));
    document.querySelectorAll('.method-card').forEach(card => card.classList.remove('active'));

    // Xử lý đặc biệt cho Zalo Pay
    document.getElementById(`${method}-form`).classList.remove('d-none');
    document.getElementById(method).classList.add('active');
}

// Xử lý hash URL khi load trang
function handleHashChange() {
    const hash = window.location.hash;
    if (hash) {
        const method = hash.replace('#', '').replace('-form', '');
        showPaymentForm(method);
    } else {
        showPaymentForm('card');
    }
}

// Chạy khi trang load
document.addEventListener('DOMContentLoaded', handleHashChange);

// Chạy khi hash thay đổi
window.addEventListener('hashchange', handleHashChange); 