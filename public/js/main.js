document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    const ticketButtons = document.querySelectorAll('.btn-primary');
    ticketButtons.forEach(button => {
        button.addEventListener('click', () => {
            updateCartCount();
        });
    });

    const dates = document.querySelectorAll('.performance-date');
    dates.forEach(date => {
        const rawDate = new Date(date.getAttribute('data-date'));
        date.textContent = new Intl.DateTimeFormat('uk-UA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(rawDate);
    });

    const profileLink = document.querySelector('a[href="/profile"]');
    if (profileLink) {
        profileLink.addEventListener('click', async (e) => {
            if (!document.cookie.includes('connect.sid')) {
                e.preventDefault();
                const choice = confirm('Для доступу до профілю потрібно увійти. Бажаєте увійти зараз?');
                if (choice) {
                    window.location.href = '/auth/login';
                }
            }
        });
    }

    document.querySelectorAll('.payment-form input[placeholder="•••• •••• •••• ••••"]').forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = value.substring(0, 19);
        });
    });

    document.querySelectorAll('.payment-form input[placeholder="MM/РР"]').forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2);
            }
            e.target.value = value.substring(0, 5);
        });
    });

    document.querySelectorAll('.payment-form input[placeholder="•••"]').forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
        });
    });

    const modals = document.querySelectorAll('.modal');
    modals.forEach(modalEl => {
        const existingBackdrop = document.querySelector('.modal-backdrop');
        if (existingBackdrop) {
            existingBackdrop.remove();
        }

        modalEl.classList.remove('show');
        document.body.classList.remove('modal-open');
        
        const modal = new bootstrap.Modal(modalEl, {
            backdrop: true,
            keyboard: true,
            focus: true
        });

        modalEl.addEventListener('show.bs.modal', () => {
            document.body.classList.add('modal-open');
            modalEl.style.display = 'block';
        });

        modalEl.addEventListener('hide.bs.modal', () => {
            document.body.classList.remove('modal-open');
            modalEl.style.display = 'none';
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
        });

        modalEl.querySelector('.modal-content').addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });
    });
});

function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        const unpaidCount = parseInt(sessionStorage.getItem('cartCount')) || parseInt(cartCountElement.textContent) || 0;
        if (unpaidCount > 0) {
            cartCountElement.textContent = unpaidCount;
            cartCountElement.style.display = 'inline';
        } else {
            cartCountElement.style.display = 'none';
        }
    }
}

window.updateGlobalCartCount = function(count) {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        if (count > 0) {
            cartCountElement.textContent = count;
            cartCountElement.style.display = 'inline';
            sessionStorage.setItem('cartCount', count.toString());
        } else {
            cartCountElement.style.display = 'none';
            sessionStorage.removeItem('cartCount');
        }
    }
}