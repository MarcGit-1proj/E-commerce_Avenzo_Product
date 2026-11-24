// ==========================================
// SEARCH BAR
// ==========================================
function toggleSearch() {
    const searchBar = document.getElementById('searchBar');
    if (searchBar) searchBar.classList.toggle('active');
}

// ==========================================
// CART DROPDOWN
// ==========================================
function toggleCart() {
    const cartDropdown = document.getElementById('cartDropdown');
    if (cartDropdown) cartDropdown.classList.toggle('active');
}

document.addEventListener('click', (event) => {
    const searchContainer = document.querySelector('.search-container');
    const searchBar = document.getElementById('searchBar');
    if (searchContainer && searchBar && !searchContainer.contains(event.target)) {
        searchBar.classList.remove('active');
    }

    const cartContainer = document.querySelector('.cart-container');
    const cartDropdown = document.getElementById('cartDropdown');
    if (cartContainer && cartDropdown && !cartContainer.contains(event.target)) {
        cartDropdown.classList.remove('active');
    }
});

// ==========================================
// NAVBAR DROPDOWNS (Products & Support)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const dropdown1 = document.querySelector('.dropdown1');
    const dropdown2 = document.querySelector('.dropdown2');
    const dropdownHome = document.getElementById('dropdownHome');
    const dropdownSupport = document.getElementById('dropdownSupport');
    let hideTimeout;

    function closeAllDropdowns() {
        if (dropdownHome) dropdownHome.classList.remove('open');
        if (dropdownSupport) dropdownSupport.classList.remove('open');
    }

    function bindDropdown(trigger, panel, otherPanel) {
        if (!trigger || !panel) return;
        trigger.addEventListener('mouseenter', () => {
            clearTimeout(hideTimeout);
            if (otherPanel) otherPanel.classList.remove('open');
            panel.classList.add('open');
        });
        trigger.addEventListener('mouseleave', () => {
            hideTimeout = setTimeout(closeAllDropdowns, 150);
        });
        panel.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
        panel.addEventListener('mouseleave', () => {
            hideTimeout = setTimeout(closeAllDropdowns, 150);
        });
    }

    bindDropdown(dropdown1, dropdownHome, dropdownSupport);
    bindDropdown(dropdown2, dropdownSupport, dropdownHome);
    window.addEventListener('scroll', closeAllDropdowns);
});