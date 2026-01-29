console.log("JavaScript conectado correctamente");

const input = document.getElementById("tareaInput");
const boton = document.getElementById("btnAgregar");
const lista = document.getElementById("listaTareas");
const mensaje = document.getElementById("mensaje");

class Tarea {
    constructor(nombre) {
        this.id = Date.now();
        this.nombre = nombre;
        this.completa = false;
    }

    toggle() {
        this.completa = !this.completa;
    }

    editar(nuevoNombre) {
        this.nombre = nuevoNombre;
    }
}

class GestorDeTareas {
    constructor() {
        this.tareas = JSON.parse(localStorage.getItem("tareas")) || [];
    }

    guardar() {
        localStorage.setItem("tareas", JSON.stringify(this.tareas));
    }

    agregar(nombre) {
        const nueva = new Tarea(nombre);
        this.tareas.push(nueva);
        this.guardar();
    }

    eliminar(id) {
        this.tareas = this.tareas.filter(t => t.id !== id);
        this.guardar();
    }

    editar(id, nuevoNombre) {
        const tarea = this.tareas.find(t => t.id === id);
        if (tarea) tarea.editar(nuevoNombre);
        this.guardar();
    }

    toggle(id) {
        const tarea = this.tareas.find(t => t.id === id);
        if (tarea) tarea.toggle();
        this.guardar();
    }

    obtenerTodas() {
        return this.tareas;
    }
}

const gestor = new GestorDeTareas();

function renderLista() {
    lista.innerHTML = "";

    gestor.obtenerTodas().forEach(tarea => {
        const li = document.createElement("li");
        li.textContent = tarea.nombre;

        if (tarea.completa) {
            li.classList.add("completada");
        }

        li.addEventListener("click", () => {
            gestor.toggle(tarea.id);
            renderLista();
        });

        li.addEventListener("dblclick", () => {
            gestor.eliminar(tarea.id);
            renderLista();
        });

        li.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            const nuevo = prompt("Editar tarea:", tarea.nombre);
            if (nuevo && nuevo.trim() !== "") {
                gestor.editar(tarea.id, nuevo.trim());
                renderLista();
            }
        });

        lista.appendChild(li);
    });
}

boton.addEventListener("click", () => {
    const texto = input.value.trim();

    if (texto === "") {
        mensaje.textContent = "No puedes agregar una tarea vacía.";
        mensaje.classList.add("mensaje-error");
        return;
    }

    mensaje.textContent = "";
    mensaje.classList.remove("mensaje-error");

    gestor.agregar(texto);
    input.value = "";
    renderLista();
});


renderLista();
