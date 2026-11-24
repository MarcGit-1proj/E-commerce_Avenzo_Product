
    // ======================================================
    // QUANTITY SELECTOR LOGIC
    // ======================================================



    // divs button class name//
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

    // ===================================================
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
// ditoooooo
                const itemKey = `watchs1 ${config.color}-${config.storage}-${config.care}`;
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
                        <p style="margin:0; font-weight:600; font-size:13px;"> watchs1 (${config.storage})</p>
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

