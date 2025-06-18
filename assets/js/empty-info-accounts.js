import {
    fetchData,
    paginateData,
    sortByRankScore,
    createAccountCard,
    createPagination,
    createFilterForm,
    normalizeString
} from './utils.js';

let accounts = [];
let currentPage = 1;
let currentFilters = {
    search: '',
    rank: '',
    price: ''
};
const itemsPerPage = 8;

// Hàm kiểm tra tài khoản trắng thông tin
function isEmptyInfo(account) {
    if (!Array.isArray(account.thong_tin) || account.thong_tin.length === 0) return true;
    // Nếu tất cả các trường đều chứa từ 'không' (không phân biệt hoa thường, dấu cách)
    return account.thong_tin.every(item => normalizeString(item).includes('không'));
}

// Hàm lọc tài khoản
function filterAccounts(filters) {
    const filtered = accounts.filter(account => {
        // Chỉ lấy tài khoản trắng thông tin
        if (!isEmptyInfo(account)) return false;

        // Lọc theo tìm kiếm (chuẩn hóa)
        if (filters.search) {
            const searchLower = normalizeString(filters.search);
            const accountName = normalizeString(account.ten);
            const accountId = normalizeString(account.id);
            if (!accountName.includes(searchLower) && !accountId.includes(searchLower)) {
                return false;
            }
        }

        // Lọc theo rank
        if (filters.rank) {
            const filterRank = filters.rank.split('*')[0].trim();
            const accountRank = account.rank?.split('*')[0].trim() || '';
            if (accountRank !== filterRank) {
                return false;
            }
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

    // Sắp xếp theo rank từ cao xuống thấp
    return sortByRankScore(filtered);
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
    if (paginatedAccounts.length === 0) {
        accountsGrid.innerHTML = '<div class="alert alert-info w-100 text-center">Không tìm thấy tài khoản nào phù hợp với bộ lọc.</div>';
    } else {
        accountsGrid.innerHTML = paginatedAccounts.map(account => createAccountCard(account)).join('');
    }
    accountsContainer.appendChild(accountsGrid);

    // Render phân trang
    if (filteredAccounts.length > 0) {
        const pagination = createPagination(
            filteredAccounts.length,
            itemsPerPage,
            currentPage,
            (page) => renderPage(page)
        );
        accountsContainer.appendChild(document.createElement('div')).innerHTML = pagination;
    }
}

// Khởi tạo trang
async function initializePage() {
    try {
        accounts = await fetchData();
        // KHÔNG lọc ở đây nữa, đã lọc ở filterAccounts
        console.log('Loaded empty info accounts:', accounts.length);
        renderPage();
    } catch (error) {
        console.error('Error initializing page:', error);
        alert('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
    }
}

document.addEventListener('DOMContentLoaded', initializePage); 