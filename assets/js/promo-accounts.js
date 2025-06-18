import { fetchData, createAccountCard, createPagination } from '/assets/js/utils.js';

let promoAccounts = [];
let currentPage = 1;
const itemsPerPage = 8;

function renderPage(page = 1) {
    currentPage = page;
    const container = document.getElementById('promo-accounts-container');
    if (!container) return;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = promoAccounts.slice(startIndex, endIndex);

    let html = '';
    if (paginated.length === 0) {
        html = '<div class="alert alert-info text-center w-100">Chưa có tài khoản khuyến mãi nào!</div>';
    } else {
        html = `<div class="accounts-grid">${paginated.map(acc => createAccountCard(acc)).join('')}</div>`;
    }
    container.innerHTML = html;

    // Render phân trang
    if (promoAccounts.length > itemsPerPage) {
        const pagination = createPagination(
            promoAccounts.length,
            itemsPerPage,
            currentPage,
            (page) => renderPage(page)
        );
        container.appendChild(document.createElement('div')).innerHTML = pagination;
    }
}

async function initializePromoAccounts() {
    const container = document.getElementById('promo-accounts-container');
    if (!container) return;
    const accounts = await fetchData();
    promoAccounts = accounts.filter(acc => acc.discount && acc.discount > 0);
    renderPage(1);
}

document.addEventListener('DOMContentLoaded', initializePromoAccounts); 