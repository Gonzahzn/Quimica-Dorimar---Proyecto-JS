let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let productos = [];

//Código para productos/carrito
async function obtenerProductos(){
    try{
        const response = await fetch("./data/productos.json");
        if(!response.ok) throw new Error ("Falló la conexion");

        productos = await response.json(); 
        productos.forEach(producto => crearCard(producto));
    } catch(error){
        Swal.fire({
            title: "Error de conexíon",
            text: "Error al cargar el catálogo. Intentelo más tarde",
            icon: "error"
        });
    }
}
function crearCard(producto){
    const col = document.createElement("div");
    col.className = "col";

    col.innerHTML = `
        <div class= "card">
            <img src="${producto.img}" alt="Imagen de ${producto.nombre}" class="img">
            <p class="nombre_prod">${producto.nombre}</p>
            <p class="precio_prod">$${producto.precio}</p>
            <button class="btn btn_agregar" id="btn-add-${producto.id}">Agregar al carrito</button>
        </div>`;

    let ctdProd = document.getElementById("contenedor_productos");
    if(ctdProd){
        ctdProd.appendChild(col);
        document.getElementById(`btn-add-${producto.id}`).onclick = () => agregarCarrito(producto.id);
    }

}


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
        dispararAlerta("Producto agregado", `Sumaste ${prodFinal.nombre} al carrito`);
    }
};

function verEnCarrito(){
    let contenedor_carrito = document.getElementById("verCarrito");
    contenedor_carrito.innerHTML = "";

    if(carrito.length === 0){
        return;
    }

    carrito.forEach(elemento => {
        const fila_compra = document.createElement("div");
        fila_compra.className = "row align-items-center mb-1 pb-2 text-start";

        fila_compra.innerHTML = `
            <div class="col-5">
                <p class="m-0">${elemento.nombre}</p>
            </div>
            <div class="col-3 d-flex align-items-center justify-content-center">
                <button class="btn btn_modificar" id="btn-restar-${elemento.id}">-</button>
                <span class="cantidades_prod mx-1">${elemento.cantidad}</span>
                <button class="btn btn_modificar" id="btn-sumar-${elemento.id}">+</button>
            </div>
            <div class="col-3 text-end">
                <p class="precioProd m-0"> $${elemento.precio * elemento.cantidad}</p>
            </div>
            <div class="col-1 text-end">
                <button class="btn btn-eliminar" id="btn-eliminar-${elemento.id}">X</button>
            </div>`;

        contenedor_carrito.appendChild(fila_compra);

        document.getElementById(`btn-restar-${elemento.id}`).onclick = () => restarCantidad(elemento.id);
        document.getElementById(`btn-sumar-${elemento.id}`).onclick = () => sumarCantidad(elemento.id);
        document.getElementById(`btn-eliminar-${elemento.id}`).onclick = () => eliminarProducto(elemento.id);
    });

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
            carrito = [];
            actualizarCarrito();
    };
};


//Código de filtrado y busqueda de productos
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

//Botones para vaciar carrito y finalizar compra de carrito
const vaciar = document.getElementById("btn_vaciar");
if(vaciar){
    vaciar.onclick = () => {
        vaciarCarrito();
    };
}

const btn_finalizar = document.getElementById("btn_fin");
if(btn_finalizar){
    btn_finalizar.onclick = () => {
        dispararAlerta("Compra finalizada", "Muchas gracias por elegirnos ");
        vaciarCarrito();
    }
}

//Mensaje de exito de procesos
function dispararAlerta(titulo, mensaje, icono){
    Swal.fire({
        title: titulo,
        text: mensaje,
        icon: "success",
        // draggable: true,
        timer:1500
    })
}

obtenerProductos();
verEnCarrito();