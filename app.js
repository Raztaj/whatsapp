document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.getElementById('products-grid');
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceEl = document.getElementById('total-price');
    const sendWhatsappBtn = document.getElementById('send-whatsapp');
    const regionSelect = document.getElementById('region');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function addToCart(product) {
        const existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
        updateCartCount();
        alert(`${product.name} أضيف إلى السلة!`);
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        updateCartCount();
        if (cartItemsContainer) {
            renderCartItems();
        }
    }

    function renderCartItems() {
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="padding: 15px; text-align: center;">سلة التسوق فارغة.</p>';
            if(totalPriceEl) totalPriceEl.textContent = 0;
            return;
        }

        let totalPrice = 0;
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>${item.price * item.quantity} د.ل</span>
                <button>🗑️</button>
            `;
            cartItem.querySelector('button').addEventListener('click', () => {
                removeFromCart(item.id);
            });
            cartItemsContainer.appendChild(cartItem);
            totalPrice += item.price * item.quantity;
        });

        if(totalPriceEl) totalPriceEl.textContent = totalPrice;
    }

    function sendWhatsAppMessage() {
        const whatsappNumbers = {
            "الخرطوم - الكلاكلة": "249991530042",
            "الخرطوم - أم درمان": "249927466829",
            "الخرطوم - بحري": "249918230741",
            "مدني": "249129499679",
            "القضارف": "249916013132",
            "بورتسودان وسواكن": "249113077428",
            "عطبرة / بربر / الدامر": "249119769189",
            "مصر": "201032188315",
            "السعودية": "249910580879",
            "الإمارات": "971504510090"
        };

        if (cart.length === 0) {
            alert("سلة التسوق فارغة!");
            return;
        }

        const selectedRegion = regionSelect.value;
        const whatsappNumber = whatsappNumbers[selectedRegion];

        if (!whatsappNumber) {
            alert("الرجاء اختيار منطقة صحيحة.");
            return;
        }

        let message = "📝 *طلب جديد*\n\n";
        message += "*المنتجات:*\n";
        let totalPrice = 0;

        cart.forEach(item => {
            message += `- ${item.name} (x${item.quantity}) - ${item.price * item.quantity} د.ل\n`;
            totalPrice += item.price * item.quantity;
        });

        message += `\n*الإجمالي:* ${totalPrice} د.ل\n`;
        message += `*المنطقة:* ${selectedRegion}\n\n`;
        message += "شكرًا لطلبك!";

        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank');
    }

    // --- Page Specific Logic ---

    // Home Page
    if (productsGrid) {
        fetch('products.json')
            .then(response => response.json())
            .then(products => {
                products.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.className = 'product-card';
                    productCard.innerHTML = `
                        <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.png';">
                        <div class="product-card-info">
                            <h3>${product.name}</h3>
                            <p>${product.price} د.ل</p>
                            <button>أضف إلى السلة</button>
                        </div>
                    `;
                    productCard.querySelector('button').addEventListener('click', () => {
                        addToCart(product);
                    });
                    productsGrid.appendChild(productCard);
                });
            });
    }

    // Checkout Page
    if (cartItemsContainer) {
        renderCartItems();
    }

    if (sendWhatsappBtn) {
        sendWhatsappBtn.addEventListener('click', sendWhatsAppMessage);
    }

    updateCartCount();
});
