const socket = io();

socket.on('products', (data) => {
    renderProducts(data);
});

// Se renderizan los productos con la función de socket
const renderProducts = (products) => {
    const productsList = document.getElementById("products-list")
    productsList.innerHTML = ""
    products.forEach(product => {
        const productCard = document.createElement("div")
        productCard.classList.add("productCard")
        // Se renderiza cada card
        productCard.innerHTML = `
            ${product.status === 'true' ? '<span class="productCard_available">AVAILABLE</span>' : '<span class="productCard_notAvailable">NOT AVAILABLE</span>'}
            <h3>${product.title}</h3>
            <div class="productCard_info">
                <div class="productCard_info_text">
                    <h4>From $${parseFloat(product.price).toFixed(2)}</h4>
                </div>
                <a id="scrollToForm"><button class="productCard_buttonHover" id="btn_update">Update</button></a>
            </div>
            <button id="boton-eliminar">Eliminar</button>
            `
        productsList.appendChild(productCard)
        // Se agrega el evento para actualizar el producto
        productCard.querySelector("#boton-eliminar").addEventListener("click", () => {
            socket.emit("deleteProduct", product._id);
        })
    })
}

const productForm = document.getElementById('product-form');

// Función para obtener los datos del formulario y enviarlo
const getProductData = () => {
    const product = {
        title: document.getElementById('product-title').value,
        description: document.getElementById('product-description').value,
        category: document.getElementById('product-category').value,
        price: document.getElementById('product-price').value,
        // thumbnails: document.getElementById("thumbnails").value,
        code: document.getElementById('product-code').value,
        stock: document.getElementById('product-stock').value,
        status: document.getElementById('product-status').value,
    };
    return product;
};

productForm.onsubmit = (e) => {
    e.preventDefault();
    socket.emit('addProduct', getProductData());
    productForm.reset();
};

socket.on('deleteError', (message) => {
    alert(message);
});