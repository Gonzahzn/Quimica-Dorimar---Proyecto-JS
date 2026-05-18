let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

let productos = [];

async function obtenerProductos(){
    const response = await fetch("./data/productos.json");
    const data = await response.json(); 
    productos = data;
    productos.forEach(producto => {
        crearCard(producto);
        
    });
};

function crearCard(producto){
    const card = document.createElement("div");
    card.className = "card";

    const nombre = document.createElement("p");
    nombre.innerText = producto.nombre;

    const img = document.createElement("img");
    img.src = producto.img;
    img.alt = "A";
    img.className = "img";

    const precio = document.createElement("p");
    precio.innerText = `$${producto.precio}`

    const btn = document.createElement("button");
    btn.innerText = "Agregar al carrito";
    // btn.onclick = () => agregarAlCarrito(producto.id);
    // btn.className = "btn";

    card.appendChild(img);
    card.appendChild(nombre);
    card.appendChild(precio);
    card.appendChild(btn);

    let ctdProd = document.getElementById("contenedor-productos");
    ctdProd.appendChild(card);
}

obtenerProductos();

