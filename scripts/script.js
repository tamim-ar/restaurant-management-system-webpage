document.addEventListener('DOMContentLoaded', function () {
    loadFoodItems();
    loadOrderHistory();
    loadCartItems();

    const foodForm = document.getElementById('food-form');
    if (foodForm) {
        foodForm.addEventListener('submit', function (event) {
            event.preventDefault();
            saveFoodItem();
        });
    }

    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function () {
            checkout();
        });
    }
});

function loadFoodItems() {
    const foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];
    if (foodItems.length === 0) {
        initializeDefaultFoodItems();
    } else {
        displayFoodItems(foodItems);
        displayManageFoodItems(foodItems);
    }
}

function initializeDefaultFoodItems() {
    const defaultItems = [
        { "id": "1", "name": "Pizza", "price": 250, "image": "pizza.jpg" },
        { "id": "2", "name": "Burger", "price": 150, "image": "burger.jpg" },
        { "id": "3", "name": "French Fries", "price": 100, "image": "fries.jpg" }
    ];
    localStorage.setItem('foodItems', JSON.stringify(defaultItems));
    displayFoodItems(defaultItems);
    displayManageFoodItems(defaultItems);
}

function displayFoodItems(items) {
    const foodGrid = document.getElementById('food-grid');
    if (!foodGrid) return;
    foodGrid.innerHTML = '';
    items.forEach(item => {
        const foodItem = document.createElement('div');
        foodItem.classList.add('food-item');
        foodItem.innerHTML = `
            <img src="images/${item.image}" alt="${item.name}" />
            <h3>${item.name}</h3>
            <p>${item.price} BDT</p>
            <button onclick="addToCart('${item.id}')">Add to Cart</button>
        `;
        foodGrid.appendChild(foodItem);
    });
}

function displayManageFoodItems(items) {
    const manageFoodGrid = document.getElementById('manage-food-grid');
    if (!manageFoodGrid) return;
    manageFoodGrid.innerHTML = '';
    items.forEach(item => {
        const foodItem = document.createElement('div');
        foodItem.classList.add('food-item');
        foodItem.innerHTML = `
            <img src="images/${item.image}" alt="${item.name}" />
            <h3>${item.name}</h3>
            <p>${item.price} BDT</p>
            <button onclick="editFoodItem('${item.id}')">Edit</button>
            <button class="delete" onclick="deleteFoodItem('${item.id}')">Delete</button>
        `;
        manageFoodGrid.appendChild(foodItem);
    });
}

function saveFoodItem() {
    const id = document.getElementById('food-id').value;
    const name = document.getElementById('food-name').value;
    const price = document.getElementById('food-price').value;
    const image = document.getElementById('food-image').value;

    let foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];

    if (id) {
        const index = foodItems.findIndex(item => item.id === id);
        foodItems[index] = { id, name, price, image };
    } else {
        const newItem = {
            id: generateId(),
            name,
            price,
            image
        };
        foodItems.push(newItem);
    }

    localStorage.setItem('foodItems', JSON.stringify(foodItems));
    resetFoodForm();
    loadFoodItems();
}

function editFoodItem(id) {
    const foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];
    const item = foodItems.find(item => item.id === id);
    document.getElementById('food-id').value = item.id;
    document.getElementById('food-name').value = item.name;
    document.getElementById('food-price').value = item.price;
    document.getElementById('food-image').value = item.image;
}

function deleteFoodItem(id) {
    let foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];
    foodItems = foodItems.filter(item => item.id !== id);
    localStorage.setItem('foodItems', JSON.stringify(foodItems));
    loadFoodItems();
}

function resetFoodForm() {
    document.getElementById('food-id').value = '';
    document.getElementById('food-name').value = '';
    document.getElementById('food-price').value = '';
    document.getElementById('food-image').value = '';
}

function loadOrderHistory() {
    const orders = JSON.parse(localStorage.getItem('orderHistory')) || [];
    const orderHistoryDiv = document.getElementById('order-history');
    if (!orderHistoryDiv) return;
    orderHistoryDiv.innerHTML = '';
    orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.classList.add('order-item');
        orderDiv.innerHTML = `
            <h3>Order ID: ${order.id}</h3>
            <p>Total Price: ${order.totalPrice} BDT</p>
            <p>Date: ${order.date}</p>
            <button class="delete" onclick="deleteOrder('${order.id}')">Delete</button>
        `;
        orderHistoryDiv.appendChild(orderDiv);
    });
}

function deleteOrder(orderId) {
    let orders = JSON.parse(localStorage.getItem('orderHistory')) || [];
    orders = orders.filter(order => order.id !== orderId);
    localStorage.setItem('orderHistory', JSON.stringify(orders));
    loadOrderHistory();
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

function addToCart(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const foodItems = JSON.parse(localStorage.getItem('foodItems')) || [];
    const item = foodItems.find(item => item.id === itemId);
    if (item) {
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`Added ${item.name} to cart!`);
        loadCartItems();
    } else {
        alert("Item not found!");
    }
}

function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartGrid = document.getElementById('cart-grid');
    if (!cartGrid) return;
    cartGrid.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('food-item');
        cartItem.innerHTML = `
            <img src="images/${item.image}" alt="${item.name}" />
            <h3>${item.name}</h3>
            <p>${item.price} BDT</p>
        `;
        cartGrid.appendChild(cartItem);
    });
}

function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items to your cart before checking out.");
        return;
    }

    const totalPrice = cart.reduce((total, item) => total + parseFloat(item.price), 0);
    const orderId = generateId();
    const orderDate = new Date().toISOString().split('T')[0];

    const order = {
        id: orderId,
        totalPrice: totalPrice,
        date: orderDate
    };

    let orders = JSON.parse(localStorage.getItem('orderHistory')) || [];
    orders.push(order);
    localStorage.setItem('orderHistory', JSON.stringify(orders));

    alert(`Checkout successful! Total price: ${totalPrice} BDT. Order ID: ${orderId}`);
    localStorage.removeItem('cart');
    loadCartItems();
    loadOrderHistory();
}
