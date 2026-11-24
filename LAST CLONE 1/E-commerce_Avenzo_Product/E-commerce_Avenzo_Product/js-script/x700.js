document.addEventListener('DOMContentLoaded', () => {
    const swatches = document.querySelectorAll('.swatch');
    const storageOptions = document.querySelectorAll('.storage-product1, .storage-product2, .storage-product3');
    const careOptions = document.querySelectorAll('.care-product1, .care-product2, .care-product3');
    const colorNameDisplay = document.getElementById('selected-color-name');
    const summaryText = document.getElementById('summaryText');
    const summaryTotal = document.getElementById('summaryTotal');
    const summaryMonthly = document.getElementById('summaryMonthly');
    const addToBagBtn = document.getElementById('addToBagBtn');

    // --- QUANTITY SELECTOR ELEMENT REFERENCES ---
    const qtyMinusBtn = document.getElementById('qtyMinus');
    const qtyPlusBtn = document.getElementById('qtyPlus');
    const qtyValueDisplay = document.getElementById('qtyValue');
    let quantity = 1;

    // Valid na kulay at storage ay kinukuha na mismo sa HTML (data-*),
    // kaya hindi na magkakaiba ang pangalan sa JS at HTML.
    const validColors = Array.from(swatches).map((s) => s.dataset.color);
    const validStorage = Array.from(storageOptions).map((c) => c.dataset.storage);
    const validCare = Array.from(careOptions).map((c) => c.dataset.care);

    const defaultConfig = {
        color: 'Cloud Purple',
        storage: '256GB',
        storagePrice: 56999,
        care: 'No AvenzoCare Coverage',
        carePrice: 0
    };

    let config = { ...defaultConfig };
    try {
        const saved = JSON.parse(localStorage.getItem('avenzoX700Config'));
        if (saved && typeof saved === 'object') {
            config = { ...defaultConfig, ...saved };
            if (!validColors.includes(config.color)) config.color = defaultConfig.color;
            if (!validStorage.includes(config.storage)) {
                config.storage = defaultConfig.storage;
                config.storagePrice = defaultConfig.storagePrice;
            }
            if (!validCare.includes(config.care)) {
                config.care = defaultConfig.care;
                config.carePrice = defaultConfig.carePrice;
            }
        }
    } catch {
        config = { ...defaultConfig };
    }

    function renderSummary() {
        const storagePrice = Number(config.storagePrice) || 0;
        const carePrice = Number(config.carePrice) || 0;
        const total = storagePrice + carePrice;
        const monthly = (total / 24).toLocaleString('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        if (colorNameDisplay) colorNameDisplay.textContent = `– ${config.color}`;
        if (summaryText) summaryText.textContent = `${config.storage} • ${config.color} • ${config.care}`;
        if (summaryTotal) summaryTotal.textContent = `₱${total.toLocaleString('en-PH')}`;
        if (summaryMonthly) summaryMonthly.textContent = `or ₱${monthly}/mo. for 24 mo.`;

        swatches.forEach((s) => {
            const active = s.dataset.color === config.color;
            s.classList.toggle('active', active);
            s.setAttribute('aria-checked', active ? 'true' : 'false');
        });

        storageOptions.forEach((card) => {
            card.classList.toggle('active', card.dataset.storage === config.storage);
        });

        careOptions.forEach((card) => {
            card.classList.toggle('active', card.dataset.care === config.care);
        });

        localStorage.setItem('avenzoX700Config', JSON.stringify(config));
    }

    swatches.forEach((swatch) => {
        swatch.addEventListener('click', () => {
            config.color = swatch.dataset.color || defaultConfig.color;
            renderSummary();
        });
    });

    storageOptions.forEach((card) => {
        card.addEventListener('click', () => {
            config.storage = card.dataset.storage || '256GB';
            config.storagePrice = Number(card.dataset.price) || 0;
            renderSummary();
        });
    });

    careOptions.forEach((card) => {
        card.addEventListener('click', () => {
            config.care = card.dataset.care || 'No AvenzoCare Coverage';
            config.carePrice = Number(card.dataset.price) || 0;
            renderSummary();
        });
    });

    // ======================================================
    // QUANTITY SELECTOR LOGIC
    // ======================================================
    if (qtyMinusBtn && qtyPlusBtn && qtyValueDisplay) {
        qtyMinusBtn.addEventListener('click', () => {
            if (quantity > 1) {
                quantity -= 1;
                qtyValueDisplay.textContent = quantity;
            }
        });

        qtyPlusBtn.addEventListener('click', () => {
            quantity += 1;
            qtyValueDisplay.textContent = quantity;
        });
    }

    // ======================================================
    // ADD TO BAG LOGIC (naka-save sa account via cart.js)
    // ======================================================
    if (addToBagBtn) {
        let adding = false;

        addToBagBtn.addEventListener('click', async () => {
            if (adding) return;

            if (!window.AvenzoCart || typeof window.AvenzoCart.addItem !== 'function') {
                console.error('AvenzoCart is not loaded. Check that cart.js is included in the <head>.');
                alert('Hindi naka-load ang cart. Pakisuri ang cart.js sa HTML.');
                return;
            }

            adding = true;
            addToBagBtn.disabled = true;

            try {
                const unitPrice = (Number(config.storagePrice) || 0) + (Number(config.carePrice) || 0);
                const itemKey = `X700-${config.storage}-${config.color}-${config.care}`;

                const success = await window.AvenzoCart.addItem({
                    itemKey,
                    productName: 'Avenzo X700',
                    color: config.color,
                    storage: config.storage,
                    care: config.care,
                    unitPrice,
                    quantity,
                });

                if (success) {
                    quantity = 1;
                    if (qtyValueDisplay) qtyValueDisplay.textContent = quantity;

                    addToBagBtn.textContent = 'Added to Bag ✓';
                    setTimeout(() => {
                        addToBagBtn.textContent = 'Add to Bag';
                    }, 1500);
                }
            } catch (err) {
                console.error('Add to Bag failed:', err);
                alert('Hindi naidagdag sa cart. Tingnan ang console para sa error.');
            } finally {
                addToBagBtn.disabled = false;
                adding = false;
            }
        });
    }

    const video = document.getElementById('myVideo');
    if (video) {
        video.muted = true;
        video.play().catch(() => {});

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(video);
    }

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

    document.addEventListener('click', (event) => {
        const cartContainer = document.querySelector('.cart-container');
        const cartDropdown = document.getElementById('cartDropdown');
        if (cartContainer && cartDropdown && !cartContainer.contains(event.target)) {
            cartDropdown.classList.remove('active');
        }

        const searchContainer = document.querySelector('.search-container');
        const searchBar = document.getElementById('searchBar');
        if (searchContainer && searchBar && !searchContainer.contains(event.target)) {
            searchBar.classList.remove('active');
        }
    });

    renderSummary();
});

function toggleCart() {
    const cartDropdown = document.getElementById('cartDropdown');
    if (cartDropdown) cartDropdown.classList.toggle('active');
}

function toggleSearch() {
    const searchBar = document.getElementById('searchBar');
    if (searchBar) searchBar.classList.toggle('active');
}