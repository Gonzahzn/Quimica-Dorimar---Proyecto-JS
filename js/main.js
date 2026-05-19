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
    const col = document.createElement("div");
    col.className = "col";

    const card = document.createElement("div");
    card.className = "card";

    const nombre = document.createElement("p");
    nombre.innerText = producto.nombre;
    nombre.className = "nombre_prod";

    const img = document.createElement("img");
    img.src = producto.img;
    img.alt = "A";
    img.className = "img";


    const precio = document.createElement("p");
    precio.innerText = `$${producto.precio}`
    precio.className = "precio_prod";

    const btn = document.createElement("button");
    btn.innerText = "Agregar al carrito";
    btn.className = "btn_agregar";
    // btn.onclick = () => agregarAlCarrito(producto.id);
    // btn.className = "btn";

    card.appendChild(img);
    card.appendChild(nombre);
    card.appendChild(precio);
    card.appendChild(btn);

    col.appendChild(card);

    let ctdProd = document.getElementById("contenedor-productos");
    ctdProd.appendChild(col);
}

const botonesFiltro = document.querySelectorAll(".btn-filtro");

function filtrarProductos(categoriaFiltro){
    let ctdProductos = document.getElementById("contenedor-productos");
    ctdProductos.innerHTML = "";

    if(categoriaFiltro === "todos"){
        productos.forEach(prod => crearCard(prod));
    }
    else{
        const prodFiltrados = productos.filter(prod => prod.categoria === categoriaFiltro);
        prodFiltrados.forEach(prod => crearCard(prod));
    }
}
botonesFiltro.forEach(boton => {
    boton.addEventListener("click", (e) =>{
        e.preventDefault();
        const categoria = e.target.dataset.categoria;
        filtrarProductos(categoria);
    });
});

obtenerProductos();

