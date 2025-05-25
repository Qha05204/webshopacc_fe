document.addEventListener('DOMContentLoaded', loadSaleAccounts);

const ITEMS_PER_PAGE = 8;
let currentPage = 1;
let allSaleAccounts = [];

async function loadSaleAccounts() {
    try {
        const response = await fetch('/data/accounts.json');
        const data = await response.json();
        allSaleAccounts = data.accounts
            .filter(account => account.discount > 0)
            .sort((a, b) => b.discount - a.discount);
        displaySaleAccounts();
        displayPagination();
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
    }
}

function displaySaleAccounts() {
    const container = document.querySelector('#saleAccountsContainer');
    const template = document.querySelector('#accountTemplate');
    if (!container || !template) return;

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const accountsToShow = allSaleAccounts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    container.innerHTML = '';
    accountsToShow.forEach(account => {
        const clone = template.content.cloneNode(true);

        // Set sale badge
        clone.querySelector('.sale-badge').textContent = `-${account.discount}%`;

        // Set image
        const img = clone.querySelector('.card-img-top');
        img.src = account.images[0];
        img.alt = account.title;

        // Set title
        clone.querySelector('.card-title').textContent = account.title;

        // Set badges
        const badgesContainer = clone.querySelector('.badges');
        badgesContainer.innerHTML = getCategoryBadge(account.category) + getRankBadge(account.rank);

        // Set price
        clone.querySelector('.price').innerHTML = formatPrice(account.price, account.discount);

        // Set stats
        const stats = clone.querySelectorAll('.stat-item .value');
        stats[0].textContent = account.heroes;
        stats[1].textContent = account.skins;
        stats[2].textContent = account.level;

        // Set links
        const links = clone.querySelectorAll('.btn-group a');
        links[0].href = `/pages/accounts/detail.html?id=${account.id}`;
        links[1].href = `/pages/checkout.html?id=${account.id}`;

        container.appendChild(clone);
    });
}

function displayPagination() {
    const container = document.querySelector('.pagination-container');
    const template = document.querySelector('#paginationTemplate');
    if (!container || !template) return;

    const totalPages = Math.ceil(allSaleAccounts.length / ITEMS_PER_PAGE);
    const clone = template.content.cloneNode(true);
    const pagination = clone.querySelector('.pagination');

    // Add page numbers
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${currentPage === i ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
        pagination.insertBefore(li, pagination.lastElementChild);
    }

    // Set prev/next states
    const prevLink = pagination.querySelector('.prev').parentElement;
    const nextLink = pagination.querySelector('.next').parentElement;
    prevLink.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    nextLink.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;

    container.innerHTML = '';
    container.appendChild(clone);

    // Add event listeners
    container.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const page = parseInt(e.target.closest('.page-link').dataset.page);
            if (page && page !== currentPage && page > 0 && page <= totalPages) {
                currentPage = page;
                displaySaleAccounts();
                displayPagination();
                document.querySelector('.sale-accounts').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function getCategoryBadge(category) {
    const badges = {
        'VIP': 'bg-primary',
        'Trắng Thông Tin': 'bg-secondary'
    };
    return `<span class="badge ${badges[category] || 'bg-info'}">${category}</span>`;
}

function getRankBadge(rank) {
    const badges = {
        'Thách Đấu': 'bg-danger',
        'Đại Cao Thủ': 'bg-warning',
        'Cao Thủ': 'bg-info',
        'Kim Cương': 'bg-primary',
        'Tinh Anh': 'bg-success',
        'Vàng': 'bg-warning',
        'Bạc': 'bg-secondary',
        'Đồng': 'bg-dark'
    };
    return `<span class="badge ${badges[rank] || 'bg-secondary'}">${rank}</span>`;
}

function formatPrice(price, discount) {
    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    });

    if (discount > 0) {
        const discountedPrice = price * (1 - discount / 100);
        return `
            <span class="original">${formatter.format(price)}</span>
            <span class="current">${formatter.format(discountedPrice)}</span>
        `;
    }
    return `<span class="current">${formatter.format(price)}</span>`;
} 