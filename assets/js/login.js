// Add event listeners to toggle password visibility
document.getElementById('togglePassword')?.addEventListener('click', function () {
    const passwordInput = document.getElementById('loginPassword');
    const icon = this.querySelector('i');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    }
});

document.getElementById('toggleRegisterPassword')?.addEventListener('click', function () {
    const passwordInput = document.getElementById('registerPassword');
    const icon = this.querySelector('i');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    }
});

document.getElementById('toggleConfirmPassword')?.addEventListener('click', function () {
    const passwordInput = document.getElementById('confirmPassword');
    const icon = this.querySelector('i');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    }
});

// Function to get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '=([^&#]*)');
    const results = regex.exec(window.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Check for tab parameter on page load
window.addEventListener('load', function () {
    const tab = getUrlParameter('tab');
    if (tab === 'register') {
        const registerTabButton = document.getElementById('register-tab');
        if (registerTabButton) {
            const tab = new bootstrap.Tab(registerTabButton);
            tab.show();
        }
    }
});
