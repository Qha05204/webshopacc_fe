import {
    fetchData,
    paginateData,
    sortByRankScore,
    createAccountCard,
    createPagination,
    createFilterForm,
    normalizeString
} from '/assets/js/utils.js';

let accounts = [];
let currentPage = 1;
let currentFilters = {
    search: '',
    rank: '',
    price: ''
};
const itemsPerPage = 8;

// Danh sách rank từ cao xuống thấp
const rankOrder = {
    'Thách Đấu': 1,
    'Cao thủ': 2,
    'Tinh Anh': 3,
    'Kim cương': 4,
    'Bạch Kim': 5,
    'Vàng': 6,
    'Bạc': 7,
    'Đồng': 8
};

// Hàm lọc tài khoản
function filterAccounts(filters) {
    console.log('Filtering accounts with filters:', filters);
    console.log('Total accounts before filtering:', accounts.length);

    const filtered = accounts.filter(account => {
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

    // Sử dụng hàm sortByRankScore từ utils.js
    return sortByRankScore(filtered);
}

// Hàm render trang
function renderPage(page = 1) {
    currentPage = page;
    const filteredAccounts = filterAccounts(currentFilters);
    const paginatedAccounts = paginateData(filteredAccounts, currentPage, itemsPerPage);
    const accountsContainer = document.getElementById('accounts-container');

    if (!accountsContainer) {
        console.error('Không tìm thấy container');
        return;
    }

    // Render bộ lọc
    accountsContainer.innerHTML = createFilterForm((filters) => {
        currentFilters = filters;
        renderPage(1);
    }, currentFilters);

    // Render danh sách tài khoản
    const accountsGrid = document.createElement('div');
    accountsGrid.className = 'accounts-grid';

    if (paginatedAccounts.length === 0) {
        accountsGrid.innerHTML = `
            <div class="alert alert-info w-100 text-center">
                Không tìm thấy tài khoản nào phù hợp với bộ lọc.
            </div>
        `;
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
        console.log('Raw accounts data:', accounts);

        // Sắp xếp theo rank score
        accounts = sortByRankScore(accounts);
        console.log('Sorted accounts:', accounts);

        // Kiểm tra rank của các tài khoản
        const rankCounts = accounts.reduce((acc, account) => {
            acc[account.rank] = (acc[account.rank] || 0) + 1;
            return acc;
        }, {});
        console.log('Rank distribution:', rankCounts);

        renderPage();
    } catch (error) {
        console.error('Error initializing page:', error);
        alert('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
    }
}

// Khởi tạo trang khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', initializePage); 