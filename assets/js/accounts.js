// Format số tiền
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Tính giá sau khi giảm
function calculateDiscountedPrice(price, discount) {
    return price - (price * discount / 100);
}

// Tạo thẻ tài khoản từ template
function createAccountCard(account) {
    const template = document.getElementById('accountCardTemplate');
    const card = template.content.cloneNode(true);
    const discountedPrice = calculateDiscountedPrice(account.price, account.discount);

    // Cập nhật thông tin
    card.querySelector('.account-card').dataset.id = account.id;
    card.querySelector('.account-image img').src = account.images[0];
    card.querySelector('.account-image img').alt = account.title;
    card.querySelector('.account-badge').textContent = account.category;
    card.querySelector('.account-badge').classList.add(account.category === 'VIP' ? 'badge-vip' : 'badge-trang');
    card.querySelector('.account-title').textContent = account.title;
    card.querySelector('.rank').textContent = account.rank;
    card.querySelector('.heroes').textContent = `${account.heroes} tướng`;
    card.querySelector('.skins').textContent = `${account.skins} skin`;
    card.querySelector('.level').textContent = `Cấp ${account.level}`;
    card.querySelector('.price').textContent = formatPrice(discountedPrice);

    if (account.discount > 0) {
        card.querySelector('.discount').textContent = formatPrice(account.price);
    }

    // Thêm sự kiện click
    card.querySelector('.view-details').addEventListener('click', () => showAccountDetails(account.id));

    return card;
}

// Hiển thị chi tiết tài khoản trong modal
function showAccountDetails(accountId) {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return;

    const modal = document.getElementById('accountModal');
    const modalTitle = modal.querySelector('.modal-title');
    const carouselInner = modal.querySelector('.carousel-inner');
    const detailsContainer = modal.querySelector('.account-details');
    const discountedPrice = calculateDiscountedPrice(account.price, account.discount);

    // Cập nhật tiêu đề
    modalTitle.textContent = account.title;

    // Cập nhật hình ảnh
    const carouselTemplate = document.getElementById('carouselItemTemplate');
    carouselInner.innerHTML = '';
    account.images.forEach((img, index) => {
        const item = carouselTemplate.content.cloneNode(true);
        const carouselItem = item.querySelector('.carousel-item');
        if (index === 0) carouselItem.classList.add('active');
        carouselItem.querySelector('img').src = img;
        carouselItem.querySelector('img').alt = `Hình ảnh ${index + 1} của ${account.title}`;
        carouselInner.appendChild(item);
    });

    // Cập nhật thông tin chi tiết
    const detailsTemplate = document.getElementById('accountDetailsTemplate');
    const details = detailsTemplate.content.cloneNode(true);

    details.querySelector('.category').textContent = account.category;
    details.querySelector('.rank').textContent = account.rank;
    details.querySelector('.heroes').textContent = account.heroes;
    details.querySelector('.skins').textContent = account.skins;
    details.querySelector('.level').textContent = account.level;
    details.querySelector('.original-price').textContent = formatPrice(account.price);
    details.querySelector('.description').textContent = account.description;

    if (account.discount > 0) {
        const discountItems = details.querySelectorAll('.discount-item');
        discountItems.forEach(item => item.style.display = 'flex');
        details.querySelector('.discount-percent').textContent = `${account.discount}%`;
        details.querySelector('.final-price').textContent = formatPrice(discountedPrice);
    }

    detailsContainer.innerHTML = '';
    detailsContainer.appendChild(details);

    // Hiển thị modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}

// Lọc và sắp xếp tài khoản
function filterAndSortAccounts() {
    const selectedCategory = document.querySelector('input[name="category"]:checked').value;
    const sortBy = document.getElementById('sortBy').value;

    let filteredAccounts = [...accounts];

    // Lọc theo loại
    if (selectedCategory !== 'all') {
        filteredAccounts = filteredAccounts.filter(account => account.category === selectedCategory);
    }

    // Sắp xếp
    switch (sortBy) {
        case 'price-asc':
            filteredAccounts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredAccounts.sort((a, b) => b.price - a.price);
            break;
        case 'rank':
            const rankOrder = ['Thách Đấu', 'Cao Thủ', 'Kim Cương', 'Tinh Anh', 'Vàng', 'Đồng'];
            filteredAccounts.sort((a, b) => rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank));
            break;
        case 'heroes':
            filteredAccounts.sort((a, b) => b.heroes - a.heroes);
            break;
    }

    return filteredAccounts;
}

// Cập nhật hiển thị danh sách tài khoản
function updateAccountsDisplay() {
    const accountsGrid = document.getElementById('accountsGrid');
    const filteredAccounts = filterAndSortAccounts();

    accountsGrid.innerHTML = '';
    filteredAccounts.forEach(account => {
        accountsGrid.appendChild(createAccountCard(account));
    });
}

// Khởi tạo
let accounts = [];

async function initialize() {
    try {
        const response = await fetch('/data/accounts.json');
        const data = await response.json();
        accounts = data.accounts;

        // Hiển thị danh sách ban đầu
        updateAccountsDisplay();

        // Thêm sự kiện lắng nghe cho bộ lọc và sắp xếp
        document.querySelectorAll('input[name="category"]').forEach(input => {
            input.addEventListener('change', updateAccountsDisplay);
        });

        document.getElementById('sortBy').addEventListener('change', updateAccountsDisplay);

    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
    }
}

// Khởi chạy khi trang đã tải xong
document.addEventListener('DOMContentLoaded', initialize); 