const products = [
    { id: 1, name: "iPhone 15 Pro", price: 999, image: "https://via.placeholder.com/200" },
    { id: 2, name: "Samsung S24 Ultra", price: 1199, image: "https://via.placeholder.com/200" },
    { id: 3, name: "Google Pixel 8", price: 699, image: "https://via.placeholder.com/200" },
    { id: 4, name: "OnePlus 12", price: 799, image: "https://via.placeholder.com/200" }
];

const productGrid = document.getElementById('product-grid');
const cartCountElement = document.getElementById('cart-count');
let cartCount = 0;

// Display Products
function displayProducts() {
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">$${product.price}</p>
            <button class="btn-add" onclick="addToCart()">Add to Cart</button>
        `;
        productGrid.appendChild(card);
    });
}

function addToCart() {
    cartCount++;
    cartCountElement.innerText = cartCount;
    alert("Item added to cart!");
}

displayProducts();