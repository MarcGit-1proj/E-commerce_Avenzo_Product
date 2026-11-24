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

    const defaultConfig = {
        color: 'Ice Blue',
        storage: '256GB',
        storagePrice: 35000,
        care: 'No AvenzoCare Coverage',
        carePrice: 0
    };

    let config = { ...defaultConfig };
    try {
        const saved = JSON.parse(localStorage.getItem('avenzoPhoneX1Config'));
        if (saved && typeof saved === 'object') {
            config = { ...defaultConfig, ...saved };
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

        if (colorNameDisplay) {
            colorNameDisplay.textContent = `– ${config.color}`;
        }
        if (summaryText) {
            summaryText.textContent = `${config.storage} • ${config.color} • ${config.care}`;
        }
        if (summaryTotal) {
            summaryTotal.textContent = `₱${total.toLocaleString('en-PH')}`;
        }
        if (summaryMonthly) {
            summaryMonthly.textContent = `or ₱${monthly}/mo. for 24 mo.`;
        }

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

        localStorage.setItem('avenzoPhoneX1Config', JSON.stringify(config));
    }

    swatches.forEach((swatch) => {
        swatch.addEventListener('click', () => {
            config.color = swatch.dataset.color || 'Ice Blue';
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

     if (addToBagBtn) {
        addToBagBtn.addEventListener('click', () => {
            const total = (Number(config.storagePrice) || 0) + (Number(config.carePrice) || 0);
            const cartCount = document.querySelector('.cart-count');
            const cartDropdown = document.getElementById('cartDropdown');

            if (cartCount) {
                cartCount.textContent = (Number(cartCount.textContent) || 0) + 1;
            }

            if (cartDropdown) {
                const emptyMsg = cartDropdown.querySelector('.cart-empty-msg');
                if (emptyMsg) emptyMsg.remove();

                const row = document.createElement('div');
                row.style.padding = '10px 0';
                row.style.borderBottom = '1px solid rgba(255,255,255,0.15)';
                row.innerHTML = `
                    <p style="margin:0; font-weight:600; font-size:13px;">Phantom 1 Pro (${config.storage})</p>
                    <p style="margin:2px 0 0; font-size:12px; color:#a1a1a6;">${config.color} • ${config.care}</p>
                    <p style="margin:4px 0 0; font-size:13px; color:#fff;">₱${total.toLocaleString('en-PH')}</p>
                `;
                cartDropdown.appendChild(row);
            }

            addToBagBtn.textContent = 'Added to Bag ✓';
            setTimeout(() => {
                addToBagBtn.textContent = 'Add to Bag';
            }, 1500);
        });
    }

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
    // END OF QUANTITY SELECTOR LOGIC
    // ======================================================

    // ======================================================
    // ADD TO BAG LOGIC
    // ======================================================
    if (addToBagBtn) {
        addToBagBtn.addEventListener('click', () => {
            const unitPrice = (Number(config.storagePrice) || 0) + (Number(config.carePrice) || 0);
            const total = unitPrice * quantity;

            const cartCount = document.querySelector('.cart-count');
            const cartDropdown = document.getElementById('cartDropdown');

            if (cartCount) {
                cartCount.textContent = (Number(cartCount.textContent) || 0) + quantity;
            }

            if (cartDropdown) {
                const emptyMsg = cartDropdown.querySelector('.cart-empty-msg');
                if (emptyMsg) emptyMsg.remove();

                const itemKey = `AvenzoX1-${config.storage}-${config.color}-${config.care}`;
                let existingRow = cartDropdown.querySelector(`[data-key="${itemKey}"]`);

                if (existingRow) {
                    const newQty = (Number(existingRow.dataset.qty) || 1) + quantity;
                    existingRow.dataset.qty = newQty;
                    existingRow.querySelector('.item-price').textContent =
                        `₱${(unitPrice * newQty).toLocaleString('en-PH')}`;
                    existingRow.querySelector('.item-qty-badge').textContent = `x${newQty}`;
                } else {
                    const row = document.createElement('div');
                    row.dataset.key = itemKey;
                    row.dataset.qty = quantity;
                    row.style.padding = '10px 0';
                    row.style.borderBottom = '1px solid rgba(255,255,255,0.15)';
                    row.innerHTML = `
                        <p style="margin:0; font-weight:600; font-size:13px;">Avenzo X1 (${config.storage})</p>
                        <p style="margin:2px 0 0; font-size:12px; color:#a1a1a6;">${config.color} • ${config.care}</p>
                        <div style="margin:4px 0 0; display:flex; justify-content:space-between; align-items:center;">
                            <span class="item-price" style="font-size:13px; color:#fff;">₱${total.toLocaleString('en-PH')}</span>
                            <span class="item-qty-badge" style="font-size:12px; color:#a1a1a6;">x${quantity}</span>
                        </div>
                    `;
                    cartDropdown.appendChild(row);
                }
            }

            // Reset quantity back to 1 after adding to the cart
            quantity = 1;
            if (qtyValueDisplay) qtyValueDisplay.textContent = quantity;
        });
    }
    // ======================================================
    // END OF ADD TO BAG LOGIC
    // ======================================================

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