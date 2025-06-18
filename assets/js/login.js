// Tab switching
document.addEventListener('DOMContentLoaded', function () {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // Xử lý chuyển tab từ URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam === 'register') {
        switchTab('register');
    }

    // Xử lý click vào tab
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Hàm chuyển tab
    function switchTab(tabId) {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));

        const activeButton = document.querySelector(`[data-tab="${tabId}"]`);
        const activePane = document.getElementById(tabId);

        if (activeButton && activePane) {
            activeButton.classList.add('active');
            activePane.classList.add('active');
        }
    }
});
