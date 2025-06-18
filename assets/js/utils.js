// Hàm lấy dữ liệu từ file JSON
async function fetchData() {
    try {
        const response = await fetch('/data/accounts.json');
        const data = await response.json();
        return data.tai_khoan; // Trả về mảng tài khoản
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        return [];
    }
}

// Hàm phân trang
function paginateData(data, currentPage, itemsPerPage) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
}

// Hàm chuẩn hóa rank
function normalizeRank(rank) {
    if (!rank) return '';

    // Loại bỏ từ "Rank" nếu có
    rank = rank.replace(/^rank\s+/i, '').trim();

    // Chuẩn hóa các trường hợp đặc biệt
    const rankMap = {
        'kim cương': 'Kim cương',
        'kim cuong': 'Kim cương',
        'bạch kim': 'Bạch Kim',
        'bach kim': 'Bạch Kim',
        'tinh anh': 'Tinh Anh',
        'cao thủ': 'Cao thủ',
        'cao thu': 'Cao thủ',
        'thách đấu': 'Thách Đấu',
        'thach dau': 'Thách Đấu',
        'vàng': 'Vàng',
        'vang': 'Vàng',
        'bạc': 'Bạc',
        'bac': 'Bạc',
        'đồng': 'Đồng',
        'dong': 'Đồng'
    };

    return rankMap[rank.toLowerCase()] || rank;
}

// Hàm sắp xếp theo rank score (cao đến thấp)
function sortByRankScore(data) {
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

    return [...data].sort((a, b) => {
        // Chuẩn hóa rank trước khi so sánh
        const rankA = normalizeRank(a.rank?.split('*')[0].trim() || '');
        const rankB = normalizeRank(b.rank?.split('*')[0].trim() || '');

        const rankOrderA = rankOrder[rankA] || 999;
        const rankOrderB = rankOrder[rankB] || 999;

        // Sắp xếp rank từ cao xuống thấp
        if (rankOrderA !== rankOrderB) {
            return rankOrderA - rankOrderB;
        }

        // Nếu cùng rank thì rank_score lớn hơn đứng trước
        return (b.rank_score || 0) - (a.rank_score || 0);
    });
}

// Hàm sắp xếp theo giá (cao đến thấp)
function sortByPrice(data) {
    return [...data].sort((a, b) => b.gia - a.gia);
}

// Hàm chuẩn hóa chuỗi cho tìm kiếm
function normalizeString(str) {
    return (str || '').toString().trim().toLowerCase().replace(/\s+/g, ' ');
}

// Hàm tạo HTML cho một tài khoản
function createAccountCard(account) {
    const originalPrice = account.gia || 0;
    const discount = account.discount || 0;
    const discountedPrice = originalPrice * (1 - discount / 100);

    return `
        <div class="account-card">
            <img src="${account.hinh_anh?.[0] || '/assets/images/default-avatar.jpg'}" alt="Avatar" class="account-avatar">
            <div class="account-info">
                <h3>${account.ten || 'Chưa có tên'}</h3>
                <div class="account-stats">
                    <p><i class="bi bi-trophy"></i> Rank: ${account.rank || 'Chưa có'}</p>
                    <p><i class="bi bi-person"></i> Số tướng: ${account.so_tuong || '0'}</p>
                    <p><i class="bi bi-palette"></i> Số skin: ${account.so_skin || '0'}</p>
                </div>
                <div class="account-price">
                    ${discount > 0 ? `
                        <div class="original-price-info">
                            <span class="original-price">${originalPrice.toLocaleString('vi-VN')} VNĐ</span>
                            <span class="discount-badge">-${discount}%</span>
                        </div>
                        <p class="current-price">${discountedPrice.toLocaleString('vi-VN')} VNĐ</p>
                    ` : `
                        <p class="current-price">${originalPrice.toLocaleString('vi-VN')} VNĐ</p>
                    `}
                </div>
                <button class="btn-view-detail" onclick="window.location.href='/pages/accounts/detail.html?id=${account.id}'">
                    <i class="bi bi-eye"></i> Xem chi tiết
                </button>
            </div>
        </div>
    `;
}

// Hàm xử lý thay đổi trang
window.handlePageChange = function (page) {
    if (typeof window.onPageChange === 'function') {
        window.onPageChange(page);
    }
};

// Hàm xử lý lọc
window.handleFilter = function () {
    if (typeof window.onFilter === 'function') {
        const searchInput = document.getElementById('searchInput');
        const rankFilter = document.getElementById('rankFilter');
        const priceFilter = document.getElementById('priceFilter');

        window.onFilter({
            search: searchInput.value,
            rank: rankFilter.value,
            price: priceFilter.value
        });
    }
};

// Hàm tạo phân trang
function createPagination(totalItems, itemsPerPage, currentPage, onPageChange) {
    window.onPageChange = onPageChange;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let paginationHTML = '<div class="pagination">';

    // Nút Previous
    paginationHTML += `
        <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} 
                onclick="handlePageChange(${currentPage - 1})">
            <i class="bi bi-chevron-left"></i>
        </button>
    `;

    // Các số trang
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    if (startPage > 1) {
        paginationHTML += `
            <button class="pagination-btn" onclick="handlePageChange(1)">1</button>
            ${startPage > 2 ? '<span class="pagination-ellipsis">...</span>' : ''}
        `;
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}"
                    onclick="handlePageChange(${i})">
                ${i}
            </button>
        `;
    }

    if (endPage < totalPages) {
        paginationHTML += `
            ${endPage < totalPages - 1 ? '<span class="pagination-ellipsis">...</span>' : ''}
            <button class="pagination-btn" onclick="handlePageChange(${totalPages})">${totalPages}</button>
        `;
    }

    // Nút Next
    paginationHTML += `
        <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} 
                onclick="handlePageChange(${currentPage + 1})">
            <i class="bi bi-chevron-right"></i>
        </button>
    `;

    paginationHTML += '</div>';
    return paginationHTML;
}

// Hàm tạo bộ lọc
function createFilterForm(onFilter, currentFilters = {}) {
    window.onFilter = onFilter;
    return `
        <div class="filter-form">
            <div class="search-box">
                <input type="text" id="searchInput" placeholder="Tìm theo mã số hoặc tên tài khoản..." value="${currentFilters.search || ''}">
                <button class="search-btn" onclick="handleFilter()">
                    <i class="bi bi-search"></i>
                </button>
            </div>
            
            <select id="rankFilter" onchange="handleFilter()">
                <option value="">Tất cả Rank</option>
                <option value="Thách Đấu" ${currentFilters.rank === 'Thách Đấu' ? 'selected' : ''}>Thách Đấu</option>
                <option value="Cao thủ" ${currentFilters.rank === 'Cao thủ' ? 'selected' : ''}>Cao thủ</option>
                <option value="Tinh Anh" ${currentFilters.rank === 'Tinh Anh' ? 'selected' : ''}>Tinh Anh</option>
                <option value="Kim cương" ${currentFilters.rank === 'Kim cương' ? 'selected' : ''}>Kim cương</option>
                <option value="Bạch Kim" ${currentFilters.rank === 'Bạch Kim' ? 'selected' : ''}>Bạch Kim</option>
                <option value="Vàng" ${currentFilters.rank === 'Vàng' ? 'selected' : ''}>Vàng</option>
                <option value="Bạc" ${currentFilters.rank === 'Bạc' ? 'selected' : ''}>Bạc</option>
                <option value="Đồng" ${currentFilters.rank === 'Đồng' ? 'selected' : ''}>Đồng</option>
            </select>
            
            <select id="priceFilter" onchange="handleFilter()">
                <option value="">Tất cả Giá</option>
                <option value="0-1000000" ${currentFilters.price === '0-1000000' ? 'selected' : ''}>Dưới 1 triệu</option>
                <option value="1000000-5000000" ${currentFilters.price === '1000000-5000000' ? 'selected' : ''}>1-5 triệu</option>
                <option value="5000000-10000000" ${currentFilters.price === '5000000-10000000' ? 'selected' : ''}>5-10 triệu</option>
                <option value="10000000-999999999" ${currentFilters.price === '10000000-999999999' ? 'selected' : ''}>Trên 10 triệu</option>
            </select>
        </div>
    `;
}

// Export các hàm để sử dụng ở các file khác
export {
    fetchData,
    paginateData,
    sortByRankScore,
    sortByPrice,
    createAccountCard,
    createPagination,
    createFilterForm,
    normalizeString
}; 