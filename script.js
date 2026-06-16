const products = [
    {
        id: 1,
        name: 'Нощен нож',
        description: 'Стилен нож със светещо острие и бонус щети.',
        price: 120,
        tag: 'AWP',
        rarity: 'Legendary',
        category: 'Weapons',
        image: 'https://img.icons8.com/color/256/knife.png'
    },
    {
        id: 2,
        name: 'Огнена броня',
        description: 'Премиум броня със защитни ефекти и стил.',
        price: 220,
        tag: 'Armor',
        rarity: 'Epic',
        category: 'Armor',
        image: 'https://img.icons8.com/color/256/chest-armor.png'
    },
    {
        id: 3,
        name: 'Легендарен скин за пушка',
        description: 'Ярък скин, който отличава твоята пушка на бойното поле.',
        price: 180,
        tag: 'Rifle',
        rarity: 'Rare',
        category: 'Weapons',
        image: 'https://img.icons8.com/color/256/assault-rifle.png'
    },
    {
        id: 4,
        name: 'Епичен шлем',
        description: 'Шлем с магически символи и защита срещу критични удари.',
        price: 150,
        tag: 'Helmet',
        rarity: 'Epic',
        category: 'Armor',
        image: 'https://img.icons8.com/color/256/medieval-helmet.png'
    },
    {
        id: 5,
        name: 'Грижа за кученце',
        description: 'Козметичен аксесоар за твоя верен цифров партньор.',
        price: 80,
        tag: 'Pet',
        rarity: 'Common',
        category: 'Skins',
        image: 'https://img.icons8.com/color/256/dog.png'
    }
];

let coins = 500;
const inventory = [];
const cart = [];
let activeCategory = 'All';
const discountOptions = [0, 10, 25, 50];

const coinsElement = document.getElementById('coins');
const productList = document.getElementById('product-list');
const inventoryList = document.getElementById('inventory-list');
const categoryFilters = document.getElementById('category-filters');
const searchInput = document.getElementById('search-input');
const cartList = document.getElementById('cart-list');
const cartTotalElement = document.getElementById('cart-total');
const checkoutButton = document.getElementById('checkout-button');

function assignRandomDiscounts() {
    products.forEach((product) => {
        if (product.discount === undefined) {
            product.discount = discountOptions[Math.floor(Math.random() * discountOptions.length)];
        }
    });
}

function getDiscountedPrice(product) {
    return product.discount > 0
        ? Math.round(product.price * (1 - product.discount / 100))
        : product.price;
}

function formatPrice(value) {
    return `${value} 🪙`;
}

function updateCoins() {
    coinsElement.textContent = coins;
}

function renderProducts() {
    productList.innerHTML = '';

    const query = searchInput?.value.trim().toLowerCase() || '';
    const visibleProducts = products.filter((product) => {
        const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
        const matchesSearch =
            query === '' ||
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.tag.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
    });

    visibleProducts.forEach((product) => {
        const card = document.createElement('article');
        card.className = 'product-card';

        const image = document.createElement('div');
        image.className = 'product-image';

        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;
        image.appendChild(img);

        const content = document.createElement('div');
        content.className = 'product-content';

        const title = document.createElement('h3');
        title.className = 'product-name';
        title.textContent = product.name;

        const rarity = document.createElement('span');
        rarity.className = `rarity-badge rarity-${product.rarity.toLowerCase()}`;
        rarity.textContent = product.rarity;

        const description = document.createElement('p');
        description.className = 'product-description';
        description.textContent = product.description;

        const footer = document.createElement('div');
        footer.className = 'product-footer';

        const discountedPrice = getDiscountedPrice(product);
        const price = document.createElement('span');
        price.className = 'product-price';

        if (product.discount > 0) {
            price.innerHTML = `<span class="original-price">${formatPrice(product.price)}</span> ${formatPrice(discountedPrice)}`;
        } else {
            price.textContent = formatPrice(product.price);
        }

        const button = document.createElement('button');
        button.className = 'buy-button';
        button.textContent = 'BUY';
        button.disabled = coins < product.price;
        button.addEventListener('click', () => buyProduct(product));

        const addToCartButton = document.createElement('button');
        addToCartButton.className = 'cart-add-button';
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.addEventListener('click', () => addToCart(product));

        const discountBadge = document.createElement('span');
        if (product.discount > 0) {
            discountBadge.className = 'discount-badge';
            discountBadge.textContent = `-${product.discount}%`;
        }

        footer.appendChild(price);
        footer.appendChild(addToCartButton);
        footer.appendChild(button);

        content.appendChild(title);
        content.appendChild(rarity);
        if (product.discount > 0) content.appendChild(discountBadge);
        content.appendChild(description);
        content.appendChild(footer);

        card.appendChild(image);
        card.appendChild(content);
        productList.appendChild(card);
    });
}

function renderInventory() {
    inventoryList.innerHTML = '';

    if (inventory.length === 0) {
        const emptyNote = document.createElement('p');
        emptyNote.className = 'empty-note';
        emptyNote.textContent = 'Все още нямаш закупени предмети.';
        inventoryList.appendChild(emptyNote);
        return;
    }

    inventory.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'inventory-item';

        const name = document.createElement('p');
        name.className = 'inventory-name';
        name.textContent = item.name;

        const price = document.createElement('span');
        price.textContent = formatPrice(getDiscountedPrice(item));

        row.appendChild(name);
        row.appendChild(price);
        inventoryList.appendChild(row);
    });
}

function renderCart() {
    cartList.innerHTML = '';

    if (cart.length === 0) {
        const emptyNote = document.createElement('p');
        emptyNote.className = 'empty-note';
        emptyNote.textContent = 'Кошницата е празна. Добави предмети.';
        cartList.appendChild(emptyNote);
        checkoutButton.disabled = true;
        updateCartTotal();
        return;
    }

    cart.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'cart-item';

        const itemLabel = document.createElement('p');
        itemLabel.textContent = `${item.name} (${item.rarity})`;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => removeFromCart(index));

        row.appendChild(itemLabel);
        row.appendChild(removeButton);
        cartList.appendChild(row);
    });

    checkoutButton.disabled = false;
    updateCartTotal();
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + getDiscountedPrice(item), 0);
    cartTotalElement.textContent = formatPrice(total);
}

function addToCart(product) {
    cart.push(product);
    renderCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

function buyProduct(product) {
    const cost = getDiscountedPrice(product);
    if (coins < cost) {
        alert('Нямаш достатъчно монети за тази покупка.');
        return;
    }

    coins -= cost;
    inventory.push(product);

    updateCoins();
    renderInventory();
    renderProducts();
}

function getRandomProduct() {
    const randomIndex = Math.floor(Math.random() * products.length);
    return products[randomIndex];
}

function openLootBox() {
    const product = getRandomProduct();
    inventory.push(product);
    renderInventory();

    const toast = document.createElement('div');
    toast.className = 'lootbox-toast';
    toast.textContent = `Отворихте Loot Box и получихте: ${product.name} (${product.rarity})`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('visible');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 2600);
}

function renderCategoryFilters() {
    const categories = ['All', ...new Set(products.map((product) => product.category))];
    categoryFilters.innerHTML = '';

    categories.forEach((category) => {
        const chip = document.createElement('button');
        chip.className = 'category-chip';
        chip.textContent = category;
        if (category === activeCategory) {
            chip.classList.add('active');
        }
        chip.addEventListener('click', () => {
            activeCategory = category;
            renderCategoryFilters();
            renderProducts();
        });
        categoryFilters.appendChild(chip);
    });
}

function checkout() {
    const total = cart.reduce((sum, item) => sum + getDiscountedPrice(item), 0);

    if (total === 0) {
        alert('Кошницата е празна.');
        return;
    }

    if (coins < total) {
        alert('Нямаш достатъчно монети за checkout.');
        return;
    }

    coins -= total;
    inventory.push(...cart);
    cart.length = 0;

    updateCoins();
    renderInventory();
    renderCart();
    renderProducts();

    alert(`Успешно купи за ${formatPrice(total)}! Предметите са в инвентара.`);
}

function initializeShop() {
    assignRandomDiscounts();
    updateCoins();
    renderCategoryFilters();
    renderProducts();
    renderInventory();
    renderCart();

    const lootboxButton = document.getElementById('open-lootbox');
    lootboxButton.addEventListener('click', openLootBox);

    checkoutButton.addEventListener('click', checkout);
    if (searchInput) {
        searchInput.addEventListener('input', renderProducts);
    }
}

initializeShop();
