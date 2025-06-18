document.addEventListener('DOMContentLoaded', () => {
    // Lấy ID tài khoản từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('id');

    if (!accountId) {
        window.location.href = '/pages/accounts/list.html';
        return;
    }

    // Lấy thông tin tài khoản
    fetch('/data/accounts.json')
        .then(response => response.json())
        .then(data => {
            const account = data.tai_khoan.find(acc => acc.id === accountId);
            if (!account) {
                window.location.href = '/pages/accounts/list.html';
                return;
            }
            displayAccountDetails(account);
        })
        .catch(error => {
            console.error('Error:', error);
            window.location.href = '/pages/accounts/list.html';
        });

    function displayAccountDetails(account) {
        // Hiển thị tên tài khoản
        document.getElementById('accountName').textContent = account.ten_tai_khoan;

        // Hiển thị giá và giảm giá
        const priceElement = document.getElementById('accountPrice');
        const originalPriceElement = document.getElementById('originalPrice');
        const discountBadgeElement = document.getElementById('discountBadge');

        if (account.discount > 0) {
            const discountedPrice = account.gia * (1 - account.discount / 100);
            originalPriceElement.textContent = `${formatPrice(account.gia)}đ`;
            discountBadgeElement.textContent = `-${account.discount}%`;
            priceElement.textContent = `${formatPrice(discountedPrice)}đ`;
            priceElement.style.display = 'block';
            priceElement.style.fontSize = '1.5rem';
            priceElement.style.marginTop = '5px';
        } else {
            priceElement.textContent = `${formatPrice(account.gia)}đ`;
            originalPriceElement.style.display = 'none';
            discountBadgeElement.style.display = 'none';
        }

        // Hiển thị thông tin cơ bản
        document.getElementById('accountRank').textContent = account.rank;
        document.getElementById('accountHeroes').textContent = account.so_tuong || '0';
        document.getElementById('accountSkins').textContent = account.so_skin || '0';

        // Hiển thị thông tin chi tiết
        const detailsList = document.getElementById('accountDetails');
        detailsList.innerHTML = ''; // Xóa nội dung cũ

        if (account.thong_tin && Object.keys(account.thong_tin).length > 0) {
            Object.entries(account.thong_tin).forEach(([key, value]) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <i class="bi ${getIconForInfo(key)}"></i>
                    <span>${key}:</span>
                    <strong>${value}</strong>
                `;
                detailsList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.innerHTML = '<i class="bi bi-info-circle"></i> Không có thông tin chi tiết';
            detailsList.appendChild(li);
        }

        // Hiển thị ảnh
        displayImages(account.hinh_anh || [account.avatar]);
    }

    function displayImages(images) {
        const mainImage = document.getElementById('mainImage');
        const thumbnailContainer = document.getElementById('thumbnailImages');
        thumbnailContainer.innerHTML = ''; // Xóa thumbnails cũ

        // Hiển thị ảnh chính
        mainImage.src = images[0];
        mainImage.alt = document.getElementById('accountName').textContent;

        // Hiển thị thumbnails
        images.forEach((image, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
            thumbnail.innerHTML = `<img src="${image}" alt="Thumbnail ${index + 1}">`;

            thumbnail.addEventListener('click', () => {
                // Cập nhật ảnh chính
                mainImage.src = image;

                // Cập nhật trạng thái active của thumbnail
                document.querySelectorAll('.thumbnail').forEach(thumb => {
                    thumb.classList.remove('active');
                });
                thumbnail.classList.add('active');
            });

            thumbnailContainer.appendChild(thumbnail);
        });
    }

    function getIconForInfo(label) {
        const icons = {
            'Số điện thoại': 'bi-telephone',
            'Email/Gmail': 'bi-envelope',
            'Số chứng minh nhân dân': 'bi-person-badge',
            'Kết nối với Facebook': 'bi-facebook',
            'Ngày sinh': 'bi-calendar',
            'Địa chỉ': 'bi-geo-alt',
            'Giới tính': 'bi-gender-ambiguous'
        };
        return icons[label] || 'bi-info-circle';
    }

    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
}); 