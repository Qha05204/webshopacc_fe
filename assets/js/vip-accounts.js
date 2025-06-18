import {
    fetchData,
    paginateData,
    sortByPrice,
    createAccountCard,
    createPagination,
    createFilterForm
} from './utils.js';

let accounts = [];
let currentPage = 1;
let currentFilters = {
    search: '',
    rank: '',
    price: ''
};
const itemsPerPage = 8;

// Hàm lọc tài khoản
function filterAccounts(filters) {
    return accounts.filter(account => {
        // Lọc theo tìm kiếm
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const accountName = (account.ten || '').toLowerCase();
            const accountId = (account.id || '').toString();
            if (!accountName.includes(searchLower) && !accountId.includes(searchLower)) {
                return false;
            }
        }

        // Lọc theo rank
        if (filters.rank && account.rank !== filters.rank) {
            return false;
        }

        // Lọc theo giá
        if (filters.price) {
            const [minPrice, maxPrice] = filters.price.split('-').map(Number);
            const accountPrice = account.gia || 0;
            if (accountPrice < minPrice || accountPrice > maxPrice) {
                return false;
            }
        }

        return true;
    });
}

// Hàm render trang
function renderPage(page = 1) {
    currentPage = page;
    const filteredAccounts = filterAccounts(currentFilters);
    const paginatedAccounts = paginateData(filteredAccounts, currentPage, itemsPerPage);
    const accountsContainer = document.getElementById('accounts-container');

    if (!accountsContainer) return;

    // Render bộ lọc
    accountsContainer.innerHTML = createFilterForm((filters) => {
        currentFilters = filters;
        renderPage(1);
    }, currentFilters);

    // Render danh sách tài khoản
    const accountsGrid = document.createElement('div');
    accountsGrid.className = 'accounts-grid';
    accountsGrid.innerHTML = paginatedAccounts.map(account => createAccountCard(account)).join('');
    accountsContainer.appendChild(accountsGrid);

    // Render phân trang
    const pagination = createPagination(
        filteredAccounts.length,
        itemsPerPage,
        currentPage,
        (page) => renderPage(page)
    );
    accountsContainer.appendChild(document.createElement('div')).innerHTML = pagination;
}

// Khởi tạo trang
async function initializePage() {
    try {
        accounts = await fetchData();
        // Sắp xếp theo giá từ cao xuống thấp
        accounts = sortByPrice(accounts);
        console.log('Loaded VIP accounts:', accounts.length);
        renderPage();
    } catch (error) {
        console.error('Error initializing page:', error);
        alert('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
    }
}

// Khởi tạo trang khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', initializePage); 