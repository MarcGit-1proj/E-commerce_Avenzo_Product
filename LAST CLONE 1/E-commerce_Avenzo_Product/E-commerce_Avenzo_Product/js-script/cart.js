// cart.js — shared cart logic, kasama ang Supabase sync
window.AvenzoCart = (function () {
  const supabaseUrl = 'https://gzwlnhgpqtghmlutsgvn.supabase.co';
  const supabaseKey = 'sb_publishable_MD2Bfh-QkiFsPjFXyKt8uQ_qLoNclYK';
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  async function getUser() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
  }

  function showEmpty(cartDropdown, cartCount) {
    cartDropdown.innerHTML = '';
    const msg = document.createElement('p');
    msg.className = 'cart-empty-msg';
    msg.textContent = 'No order yet';
    cartDropdown.appendChild(msg);
    if (cartCount) cartCount.textContent = '0';
  }

  // Gumagamit ng textContent (hindi innerHTML) para ligtas sa XSS
  function buildRow(item) {
    const row = document.createElement('div');
    row.dataset.key = item.item_key;
    row.dataset.qty = item.quantity;
    row.style.padding = '10px 0';
    row.style.borderBottom = '1px solid rgba(255,255,255,0.15)';

    const title = document.createElement('p');
    title.style.cssText = 'margin:0; font-weight:600; font-size:13px;';
    title.textContent = `${item.product_name} (${item.storage || ''})`;

    const details = document.createElement('p');
    details.style.cssText = 'margin:2px 0 0; font-size:12px; color:#a1a1a6;';
    details.textContent = `${item.color || ''} • ${item.care || ''}`;

    const bottom = document.createElement('div');
    bottom.style.cssText = 'margin:4px 0 0; display:flex; justify-content:space-between; align-items:center;';

    const price = document.createElement('span');
    price.className = 'item-price';
    price.style.cssText = 'font-size:13px; color:#fff;';
    price.textContent = `₱${(Number(item.unit_price) * item.quantity).toLocaleString('en-PH')}`;

    const qty = document.createElement('span');
    qty.className = 'item-qty-badge';
    qty.style.cssText = 'font-size:12px; color:#a1a1a6;';
    qty.textContent = `x${item.quantity}`;

    bottom.appendChild(price);
    bottom.appendChild(qty);
    row.appendChild(title);
    row.appendChild(details);
    row.appendChild(bottom);
    return row;
  }

  // Tawagin pag load ng page — kinukuha ang laman ng cart mula sa DB
  async function loadCart() {
    const user = await getUser();
    const cartDropdown = document.getElementById('cartDropdown');
    const cartCount = document.querySelector('.cart-count');
    if (!cartDropdown) return;

    if (!user) {
      // Walang session — walang maipapakitang cart
      showEmpty(cartDropdown, cartCount);
      return;
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      showEmpty(cartDropdown, cartCount);
      return;
    }

    cartDropdown.innerHTML = '';
    let totalQty = 0;

    data.forEach((item) => {
      totalQty += item.quantity;
      cartDropdown.appendChild(buildRow(item));
    });

    if (cartCount) cartCount.textContent = totalQty;
  }

  // Tawagin pag click ng Add to Bag
  async function addItem({ itemKey, productName, color, storage, care, unitPrice, quantity }) {
    const user = await getUser();

    if (!user) {
      alert('Please sign in to add items to your cart.');
      return false;
    }

    // Atomic na increment sa database (tingnan ang add_to_cart sa cart.sql)
    const { error } = await supabase.rpc('add_to_cart', {
      p_item_key: itemKey,
      p_product_name: productName,
      p_color: color,
      p_storage: storage,
      p_care: care,
      p_unit_price: unitPrice,
      p_quantity: quantity,
    });

    if (error) {
      console.error(error);
      alert('Error adding to cart: ' + error.message);
      return false;
    }

    await loadCart();
    return true;
  }

  // Mag-refresh ng cart pag nag-login/logout (hindi na kailangan mag-reload ng page)
  // setTimeout para hindi mag-await ng Supabase call sa loob mismo ng auth callback
  supabase.auth.onAuthStateChange(() => {
    setTimeout(loadCart, 0);
  });

  return { loadCart, addItem };
})();

document.addEventListener('DOMContentLoaded', () => {
  window.AvenzoCart.loadCart();
});