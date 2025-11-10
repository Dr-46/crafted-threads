// Sample products data
let products = [
    {
        id: 1,
        category: 'men',
        subcategory: 'T-Shirts',
        name: 'Men\'s Cotton T-Shirt',
        description: 'Comfortable cotton t-shirt perfect for everyday wear',
        price: 599,
        image: 'https://via.placeholder.com/300x400?text=Men+T-Shirt'
    },
    {
        id: 2,
        category: 'women',
        subcategory: 'T-Shirts',
        name: 'Women\'s Cotton T-Shirt',
        description: 'Stylish and comfortable cotton t-shirt',
        price: 549,
        image: 'https://via.placeholder.com/300x400?text=Women+T-Shirt'
    }
];

let cart = [];
let sales = JSON.parse(localStorage.getItem('sales')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    displayProducts(products);
    updateCartCount();
});

// Load products from localStorage
function loadProducts() {
    const saved = localStorage.getItem('products');
    if (saved) {
        products = JSON.parse(saved);
    } else {
        localStorage.setItem('products', JSON.stringify(products));
    }
}

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Display products
function displayProducts(productsToShow) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    
    if (productsToShow.length === 0) {
        grid.innerHTML = '<p>No products found.</p>';
        return;
    }
    
    productsToShow.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = () => showProductDetails(product);
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x400?text=No+Image'">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category} - ${product.subcategory}</div>
                <div class="product-price">₹${product.price}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Show category
function showCategory(category) {
    const filtered = products.filter(p => p.category === category);
    document.getElementById('section-title').textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} Products`;
    displayProducts(filtered);
    showSection('products-section');
}

// Filter products
function filterProducts(category, subcategory) {
    const filtered = products.filter(p => 
        p.category === category && p.subcategory === subcategory
    );
    document.getElementById('section-title').textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} - ${subcategory}`;
    displayProducts(filtered);
    showSection('products-section');
}

// Show product details
function showProductDetails(product) {
    const modal = document.getElementById('product-modal');
    const details = document.getElementById('product-details');
    
    details.innerHTML = `
        <div class="product-details-content">
            <img src="${product.image}" alt="${product.name}" class="product-details-image" onerror="this.src='https://via.placeholder.com/300x400?text=No+Image'">
            <h2>${product.name}</h2>
            <p><strong>Category:</strong> ${product.category} - ${product.subcategory}</p>
            <p><strong>Description:</strong> ${product.description}</p>
            <p><strong>Price:</strong> ₹${product.price}</p>
            <button onclick="addToCart(${product.id})" class="btn-primary">Add to Cart</button>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('product-modal').style.display = 'none';
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({...product, quantity: 1});
        }
        updateCart();
        closeModal();
        alert('Product added to cart!');
    }
}

// Update cart
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    if (!document.getElementById('cart-section').classList.contains('hidden')) {
        displayCart();
    }
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// Show cart
function showCart() {
    showSection('cart-section');
    displayCart();
}

// Display cart
function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const total = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty.</p>';
        total.textContent = '0';
        return;
    }
    
    cartItems.innerHTML = '';
    let totalAmount = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/80x80?text=No+Image'">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>₹${item.price} x ${item.quantity} = ₹${itemTotal}</p>
            </div>
            <div>
                <button onclick="updateQuantity(${index}, ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                <span style="margin: 0 10px;">${item.quantity}</span>
                <button onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
                <button onclick="removeFromCart(${index})" class="btn-danger" style="margin-left: 10px;">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    total.textContent = totalAmount.toFixed(2);
}

// Update quantity
function updateQuantity(index, newQuantity) {
    if (newQuantity < 1) return;
    cart[index].quantity = newQuantity;
    updateCart();
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Clear cart
function clearCart() {
    if (confirm('Are you sure you want to clear the cart?')) {
        cart = [];
        updateCart();
        displayCart();
    }
}

// Proceed to billing
function proceedToBilling() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    showSection('billing-section');
    displayBilling();
}

// Display billing
function displayBilling() {
    const billingItems = document.getElementById('billing-items');
    const total = document.getElementById('billing-total');
    
    billingItems.innerHTML = '';
    let totalAmount = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;
        
        const billingItem = document.createElement('div');
        billingItem.className = 'billing-item';
        billingItem.innerHTML = `
            <div class="billing-item-info">
                <h3>${item.name}</h3>
                <p>₹${item.price} x ${item.quantity} = ₹${itemTotal}</p>
            </div>
        `;
        billingItems.appendChild(billingItem);
    });
    
    total.textContent = totalAmount.toFixed(2);
}

// Show QR code
function showQRCode() {
    const total = document.getElementById('billing-total').textContent;
    document.getElementById('qr-amount').textContent = total;
    document.getElementById('qr-modal').style.display = 'block';
}

// Close QR modal
function closeQRModal() {
    document.getElementById('qr-modal').style.display = 'none';
}

// Print bill
function printBill() {
    window.print();
}

// Complete order
function completeOrder() {
    const total = parseFloat(document.getElementById('billing-total').textContent);
    const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: [...cart],
        total: total
    };
    
    sales.push(order);
    localStorage.setItem('sales', JSON.stringify(sales));
    
    cart = [];
    updateCart();
    
    alert('Order completed successfully!');
    showSection('products-section');
    displayProducts(products);
}

// Show section
function showSection(sectionId) {
    document.querySelectorAll('section, .cart-section, .billing-section, .manage-section, .sales-section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

// Manage Menu
function showManageMenu() {
    showSection('manage-menu-section');
    displayManageProducts();
}

// Display manage products
function displayManageProducts() {
    const list = document.getElementById('manage-products-list');
    list.innerHTML = '<h3>All Products</h3>';
    
    products.forEach(product => {
        const item = document.createElement('div');
        item.className = 'manage-product-item';
        item.innerHTML = `
            <div>
                <h4>${product.name}</h4>
                <p>${product.category} - ${product.subcategory} | ₹${product.price}</p>
            </div>
            <div>
                <button onclick="editProduct(${product.id})" class="btn-secondary">Edit</button>
                <button onclick="deleteProduct(${product.id})" class="btn-danger">Delete</button>
            </div>
        `;
        list.appendChild(item);
    });
}

// Save product
function saveProduct(event) {
    event.preventDefault();
    
    const id = document.getElementById('product-id').value;
    const product = {
        id: id ? parseInt(id) : Date.now(),
        category: document.getElementById('product-category').value,
        subcategory: document.getElementById('product-subcategory').value,
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        price: parseFloat(document.getElementById('product-price').value),
        image: document.getElementById('product-image').value
    };
    
    if (id) {
        const index = products.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            products[index] = product;
        }
    } else {
        products.push(product);
    }
    
    saveProducts();
    resetForm();
    displayManageProducts();
    alert('Product saved successfully!');
}

// Edit product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-subcategory').value = product.subcategory;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-image').value = product.image;
        
        document.getElementById('product-form').scrollIntoView({ behavior: 'smooth' });
    }
}

// Delete product
function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        saveProducts();
        displayManageProducts();
        alert('Product deleted successfully!');
    }
}

// Reset form
function resetForm() {
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
}

// Sales Report
function showSalesReport() {
    showSection('sales-report-section');
    const currentMonth = new Date().toISOString().slice(0, 7);
    document.getElementById('report-month').value = currentMonth;
    generateReport();
}

// Generate report
function generateReport() {
    const month = document.getElementById('report-month').value;
    const filteredSales = sales.filter(sale => {
        const saleMonth = sale.date.slice(0, 7);
        return saleMonth === month;
    });
    
    const content = document.getElementById('sales-report-content');
    
    if (filteredSales.length === 0) {
        content.innerHTML = '<p>No sales found for this month.</p>';
        return;
    }
    
    let totalRevenue = 0;
    let totalOrders = filteredSales.length;
    let totalItems = 0;
    
    filteredSales.forEach(sale => {
        totalRevenue += sale.total;
        totalItems += sale.items.reduce((sum, item) => sum + item.quantity, 0);
    });
    
    content.innerHTML = `
        <div class="sales-stats">
            <div class="stat-card">
                <h3>Total Orders</h3>
                <div class="stat-value">${totalOrders}</div>
            </div>
            <div class="stat-card">
                <h3>Total Revenue</h3>
                <div class="stat-value">₹${totalRevenue.toFixed(2)}</div>
            </div>
            <div class="stat-card">
                <h3>Total Items Sold</h3>
                <div class="stat-value">${totalItems}</div>
            </div>
        </div>
        <h3 style="margin-top: 30px;">Order Details</h3>
        <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
            <thead>
                <tr style="background: #667eea; color: white;">
                    <th style="padding: 10px; text-align: left;">Order ID</th>
                    <th style="padding: 10px; text-align: left;">Date</th>
                    <th style="padding: 10px; text-align: left;">Items</th>
                    <th style="padding: 10px; text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${filteredSales.map(sale => `
                    <tr style="border-bottom: 1px solid #ddd;">
                        <td style="padding: 10px;">${sale.id}</td>
                        <td style="padding: 10px;">${new Date(sale.date).toLocaleDateString()}</td>
                        <td style="padding: 10px;">${sale.items.length} items</td>
                        <td style="padding: 10px; text-align: right;">₹${sale.total.toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Load cart from localStorage
function loadCart() {
    const saved = localStorage.getItem('cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartCount();
    }
}

// Initialize cart on load
loadCart();

// Close modals when clicking outside
window.onclick = function(event) {
    const productModal = document.getElementById('product-modal');
    const qrModal = document.getElementById('qr-modal');
    if (event.target === productModal) {
        productModal.style.display = 'none';
    }
    if (event.target === qrModal) {
        qrModal.style.display = 'none';
    }
}