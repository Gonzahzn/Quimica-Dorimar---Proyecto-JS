// const { createElement } = require("react");

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

function agregarCarrito(idCompra){
    const prodFinal = productos.find(prod => prod.id === idCompra);
    if(prodFinal){
        if(carrito.some(elemento => elemento.id === prodFinal.id)){
            carrito = carrito.map(elemento => {
                if(elemento.id === prodFinal.id){
                    return{
                        ...elemento,
                        cantidad: elemento.cantidad + 1,
                    };
                }
                else{
                    return elemento;
                };
            });
        }
        else{
            carrito.push({...prodFinal, cantidad: 1});
        }
        localStorage.setItem("carrito", JSON.stringify(carrito));

        verEnCarrito();

        alert(`Agregaste ${prodFinal.nombre} al carrito`);
    }
    else{
        alert("Ese prod no está en tu catálgoo")
    };
};

function verEnCarrito(){
    let contenedor_carrito = document.getElementById("verCarrito");
    contenedor_carrito.innerHTML = "";

    if(carrito.length === 0){
        // alert(`Tu carrito está vacío`); //Tengo que modificarlo por un cartel
        return;
    }

    carrito.forEach(elemento => {
        const fila_compra = document.createElement("div");
        fila_compra.className = "row align-items-center mb-1 pb-2 text-start";

        const nombre = document.createElement("div");
        nombre.className = "col-6";

        const info_pedido = document.createElement("p");
        info_pedido.className = "m-0";
        info_pedido.innerHTML = `${elemento.nombre}`;
        nombre.appendChild(info_pedido);

        const modificador_cant = document.createElement("div");
        modificador_cant.className = "col-2 d-flex align-items-center justify-content-center";

        const menos = document.createElement("button");
        menos.className = "btn btn_modificar";
        menos.innerText = "-";
        menos.onclick = () => restarCantidad(elemento.id);

        const mas = document.createElement("button");
        mas.className = "btn btn_modificar";
        mas.innerText = "+";
        mas.onclick = () => sumarCantidad(elemento.id);

        const cantidad_prod = document.createElement("span");
        cantidad_prod.className = "cantidades_prod mx-1";
        cantidad_prod.innerText = elemento.cantidad;

        modificador_cant.appendChild(menos);
        modificador_cant.appendChild(cantidad_prod);
        modificador_cant.appendChild(mas);

        const precio = document.createElement("div");
        precio.className = "col-3 text-end";

        const totalProd = document.createElement("p");
        totalProd.className = "precioProd m-0";
        totalProd.innerText = `Total: $${elemento.precio * elemento.cantidad}`;
        precio.appendChild(totalProd);

        const eliminar = document.createElement("div");
        eliminar.className = "col-1 text-end";

        const btn_eliminar = document.createElement("button");
        btn_eliminar.className = "btn btn_eliminar";
        btn_eliminar.innerText = "X";
        btn_eliminar.onclick = () => eliminarProducto(elemento.id);
        eliminar.appendChild(btn_eliminar);

        // const precio = document.createElement("p");
        // precio.className = "m-0";
        // precio.innerText = `$${elemento.precio * elemento.cantidad}`

        fila_compra.appendChild(nombre);
        fila_compra.appendChild(modificador_cant);
        fila_compra.appendChild(precio);
        // fila_compra.appendChild(precio);
        fila_compra.appendChild(eliminar);

        contenedor_carrito.appendChild(fila_compra);
    })

    const precioFinal = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);

    const fila_precioFinal = document.createElement("div");
    fila_precioFinal.className = "d-flex justify-content-end mt-4 pt-2 fw-semibold";
    fila_precioFinal.innerText = `Total: $${precioFinal}`;

    contenedor_carrito.appendChild(fila_precioFinal);
}

function sumarCantidad(id){
    carrito = carrito.map(elemento => {
        if(elemento.id === id){
            return {...elemento, cantidad: elemento.cantidad + 1};
        }
        return elemento;
    });
    actualizarCarrito();
}

function restarCantidad(id){
    const producto = carrito.find(elem => elem.id === id);
    if(producto.cantidad > 1){
        carrito = carrito.map(elemento => {
        if(elemento.id === id){
            return {...elemento, cantidad: elemento.cantidad - 1};
        }
        return elemento;
    });
    }
    else{
        carrito = carrito.filter(elem => elem.id !== id);
        actualizarCarrito();
    }
    actualizarCarrito();
}

function eliminarProducto(id){
    carrito = carrito.filter(elem => elem.id !== id);
    actualizarCarrito();
}

function actualizarCarrito(){
    localStorage.setItem("carrito", JSON.stringify(carrito));
    verEnCarrito();
}

function vaciarCarrito() {
    if (carrito.length > 0) {
        // const confirmar = confirm("Estás seguro de vaciar el carrito?");
        // if(confirmar){
            carrito = [];
            actualizarCarrito();
            alert("Carrito vaciado correctamente!");
    //     } else {
    //         alert("Ok, no borramos nada!");
    //     }
    // } else {
    //     alert("El carrito ya está vacío, no te puedo ayudar");
    };
};

// function finalizar(){
//     const btn_finalizar = document.getElementById("btn_fin");
//     if(btn_finalizar){
//         btn_finalizar.onclick = () => {
//             alert("Compra finalizada");
//             vaciarCarrito();
//         }
//     }
// }

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
    img.alt = "Imagen de producto";
    img.className = "img";


    const precio = document.createElement("p");
    precio.innerText = `$${producto.precio}`
    precio.className = "precio_prod";

    const btn = document.createElement("button");
    btn.innerText = "Agregar al carrito";
    btn.className = "btn btn_agregar";
    btn.onclick = () => agregarCarrito(producto.id);
    // btn.className = "btn";

    card.appendChild(img);
    card.appendChild(nombre);
    card.appendChild(precio);
    card.appendChild(btn);

    col.appendChild(card);

    let ctdProd = document.getElementById("contenedor_productos");
    ctdProd.appendChild(col);
}

const botonesFiltro = document.querySelectorAll(".btn_filtro");

function filtrarProductos(categoriaFiltro){
    let ctdProd = document.getElementById("contenedor_productos");
    ctdProd.innerHTML = "";

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

function buscarProducto(txtBusqueda){
    let contenedor_prod = document.getElementById("contenedor_productos");
    contenedor_prod.innerHTML = "";

    const buscado = txtBusqueda.toLowerCase();

    const result = productos.filter(prod => prod.nombre.toLowerCase().includes(buscado));

    if(result.length > 0){
        result.forEach(prod => crearCard(prod));
    }
    else{
        contenedor_prod.innerHTML = 
        `<div class="prod_noHallado">
            <p class="noExiste">Este producto no se encuentra disponible</p>
        </div>`;
    }
}


const barraBusqueda = document.getElementById("barra_busqueda");
const inputBusq = document.getElementById("busqueda");

if(barraBusqueda && inputBusq){
    barraBusqueda.addEventListener("submit", (e) => {
        e.preventDefault();
        const valorBusq = inputBusq.value;
        buscarProducto(valorBusq);
    });
}



const vaciar = document.getElementById("btn_vaciar");
if(vaciar){
    vaciar.onclick = () => {
        vaciarCarrito();
    };
}

const btn_finalizar = document.getElementById("btn_fin");
if(btn_finalizar){
    btn_finalizar.onclick = () => {
        alert("Compra finalizada");
        vaciarCarrito();
    }
}

obtenerProductos();
verEnCarrito();
