const products = [
    {
        id: 1,
        name: 'Нощен нож',
        description: 'Стилен нож със светящо острие и бонус щети.',
        price: 120,
        tag: 'AWP',
        rarity: 'Legendary',
        image: 'https://img.icons8.com/color/256/knife.png'
    },
    {
        id: 2,
        name: 'Огнена броня',
        description: 'Премиум броня със защитни ефекти и стил.',
        price: 220,
        tag: 'Armor',
        rarity: 'Epic',
        image: 'https://img.icons8.com/color/256/chest-armor.png'
    },
    {
        id: 3,
        name: 'Легендарен скин за пушка',
        description: 'Ярък скин, който отличава твоята пушка на бойното поле.',
        price: 180,
        tag: 'Rifle',
        rarity: 'Rare',
        image: 'https://img.icons8.com/color/256/assault-rifle.png'
    },
    {
        id: 4,
        name: 'Епичен шлем',
        description: 'Шлем с магически символи и защита срещу критични удари.',
        price: 150,
        tag: 'Helmet',
        rarity: 'Epic',
        image: 'https://img.icons8.com/color/256/medieval-helmet.png'
    },
    {
        id: 5,
        name: 'Грижа за кученце',
        description: 'Козметичен аксесоар за твоя верен цифров партньор.',
        price: 80,
        tag: 'Pet',
        rarity: 'Common',
        image: 'https://img.icons8.com/color/256/dog.png'
    }
];

let coins = 500;
const inventory = [];

const coinsElement = document.getElementById('coins');
const productList = document.getElementById('product-list');
const inventoryList = document.getElementById('inventory-list');

function formatPrice(value) {
    return `${value} 🪙`;
}

function updateCoins() {
    coinsElement.textContent = coins;
}

function renderProducts() {
    productList.innerHTML = '';

    products.forEach((product) => {
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

        const price = document.createElement('span');
        price.className = 'product-price';
        price.textContent = formatPrice(product.price);

        const button = document.createElement('button');
        button.className = 'buy-button';
        button.textContent = 'BUY';
        button.disabled = coins < product.price;
        button.addEventListener('click', () => buyProduct(product));

        footer.appendChild(price);
        footer.appendChild(button);

        content.appendChild(title);
        content.appendChild(rarity);
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
        price.textContent = formatPrice(item.price);

        row.appendChild(name);
        row.appendChild(price);
        inventoryList.appendChild(row);
    });
}

function buyProduct(product) {
    if (coins < product.price) {
        alert('Нямаш достатъчно монети за тази покупка.');
        return;
    }

    coins -= product.price;
    inventory.push(product);

    updateCoins();
    renderInventory();
    renderProducts();
}

function initializeShop() {
    updateCoins();
    renderProducts();
    renderInventory();
}

initializeShop();
