// Cada ejercicio contiene: pregunta, opciones y posición de la respuesta correcta.
const ejercicios = {
  html: [
    ["¿Qué etiqueta crea el título principal?", ["<h1>", "<p>", "<title>"], 0],
    ["¿Cuál etiqueta crea un enlace?", ["<a>", "<link>", "<url>"], 0],
    ["¿Qué atributo indica el destino de un enlace?", ["href", "src", "class"], 0],
    ["¿Qué etiqueta muestra una imagen?", ["<img>", "<picture>", "<image>"], 0],
    ["¿Cuál es la etiqueta para un párrafo?", ["<p>", "<text>", "<paragraph>"], 0],
    ["¿Qué etiqueta crea una lista con viñetas?", ["<ul>", "<ol>", "<li>"], 0],
    ["¿Qué etiqueta crea un botón?", ["<button>", "<click>", "<input-button>"], 0],
    ["¿Qué etiqueta contiene el contenido visible?", ["<body>", "<head>", "<meta>"], 0],
    ["¿Para qué sirve alt en una imagen?", ["Describe la imagen", "La agranda", "La enlaza"], 0],
    ["¿Qué etiqueta agrega JavaScript al HTML?", ["<script>", "<javascript>", "<code>"], 0],
  ],
  css: [
    ["¿Qué lenguaje da estilos a la web?", ["CSS", "HTML", "JavaScript"], 0],
    ["¿Qué propiedad cambia el color del texto?", ["color", "font-color", "text-color"], 0],
    ["¿Qué propiedad cambia el fondo?", ["background", "background-color", "fill"], 1],
    ["¿Qué selector busca una clase llamada tarjeta?", [".tarjeta", "#tarjeta", "tarjeta()"], 0],
    ["¿Qué propiedad cambia el tamaño de letra?", ["font-size", "text-size", "size"], 0],
    ["¿Qué propiedad separa contenido y borde?", ["padding", "margin", "gap"], 0],
    ["¿Qué propiedad separa elementos?", ["margin", "padding", "border"], 0],
    ["¿Qué valor activa Flexbox?", ["flex", "grid", "block"], 0],
    ["¿Qué propiedad redondea esquinas?", ["border-radius", "round", "corner-radius"], 0],
    ["¿Qué símbolo selecciona un id?", ["#", ".", "*"], 0],
  ],
  javascript: [
    ["¿Qué lenguaje agrega interacción?", ["JavaScript", "CSS", "HTML"], 0],
    ["¿Qué palabra crea una variable modificable?", ["let", "const", "string"], 0],
    ["¿Qué función busca un elemento?", ["document.querySelector()", "document.find()", "document.get()"], 0],
    ["¿Qué evento ocurre al hacer clic?", ["click", "hover", "load"], 0],
    ["¿Qué método agrega un evento?", ["addEventListener()", "addClick()", "listen()"], 0],
    ["¿Qué propiedad cambia texto?", ["textContent", "innerStyle", "textChange"], 0],
    ["¿Qué estructura toma decisiones?", ["if", "for", "array"], 0],
    ["¿Qué símbolo compara dos valores?", ["===", "=", "=>"], 0],
    ["¿Qué tipo es verdadero o falso?", ["boolean", "string", "number"], 0],
    ["¿Qué método recorre una lista?", ["forEach()", "repeat()", "loop()"], 0],
  ],
  python: [
    ["¿Qué función muestra texto en Python?", ["print()", "show()", "write()"], 0],
    ["¿Qué símbolo inicia un comentario?", ["#", "//", "<!--"], 0],
    ["¿Qué palabra crea una función?", ["def", "function", "func"], 0],
    ["¿Qué tipo de dato guarda texto?", ["str", "int", "bool"], 0],
    ["¿Qué tipo de dato guarda números enteros?", ["int", "str", "list"], 0],
    ["¿Qué estructura guarda varios valores?", ["list", "print", "if"], 0],
    ["¿Qué palabra se usa para una condición?", ["if", "for", "import"], 0],
    ["¿Qué bucle recorre una lista?", ["for", "while-if", "def"], 0],
    ["¿Qué valor representa verdadero?", ["True", "true", "YES"], 0],
    ["¿Qué extensión tienen los archivos Python?", [".py", ".python", ".pt"], 0],
  ],
};

const CLAVE_PROGRESO = "aprenderWebProgreso";
const crearProgreso = () => ({
  html: { pregunta: 0, aciertos: 0, respondida: false, seleccion: null, completado: false },
  css: { pregunta: 0, aciertos: 0, respondida: false, seleccion: null, completado: false, desbloqueado: false },
  javascript: { pregunta: 0, aciertos: 0, respondida: false, seleccion: null, completado: false, desbloqueado: false },
  python: { pregunta: 0, aciertos: 0, respondida: false, seleccion: null, completado: false, desbloqueado: false },
});
const progresoGuardado = JSON.parse(localStorage.getItem(CLAVE_PROGRESO) || "null");
let progreso = crearProgreso();
if (progresoGuardado) {
  Object.keys(progreso).forEach((lenguaje) => Object.assign(progreso[lenguaje], progresoGuardado[lenguaje] || {}));
}
if (progreso.html.completado) progreso.css.desbloqueado = true;
if (progreso.css.completado) progreso.javascript.desbloqueado = true;
if (progreso.javascript.completado) progreso.python.desbloqueado = true;

let sesionActiva = false;

function aplicarDesbloqueos() {
  if (progreso.html.completado) progreso.css.desbloqueado = true;
  if (progreso.css.completado) progreso.javascript.desbloqueado = true;
  if (progreso.javascript.completado) progreso.python.desbloqueado = true;
}

function pintarCuenta(nombre) {
  const anonima = document.querySelector("#cuenta-anonima");
  const sesion = document.querySelector("#cuenta-sesion");
  anonima.hidden = Boolean(nombre);
  sesion.hidden = !nombre;
  if (nombre) document.querySelector("#cuenta-nombre").textContent = nombre;
}

function mensajeCuenta(texto, esError = false) {
  const aviso = document.querySelector("#cuenta-mensaje");
  aviso.textContent = texto;
  aviso.classList.toggle("error", esError);
}

function estadoLocal() {
  return { progreso, proyectos: proyectosTerminados, desafio: respuestaGuardada };
}

function aplicarEstado(datos) {
  if (datos.progreso) {
    Object.keys(progreso).forEach((lenguaje) => Object.assign(progreso[lenguaje], datos.progreso[lenguaje] || {}));
    aplicarDesbloqueos();
    localStorage.setItem(CLAVE_PROGRESO, JSON.stringify(progreso));
  }
  if (Array.isArray(datos.proyectos)) {
    proyectosTerminados = datos.proyectos;
    localStorage.setItem(CLAVE_PROYECTOS, JSON.stringify(proyectosTerminados));
  }
  if ("desafio" in datos) {
    respuestaGuardada = datos.desafio;
    localStorage.setItem(CLAVE_DESAFIO, JSON.stringify(respuestaGuardada));
  }
  actualizarNiveles();
  actualizarResumenProgreso();
  mostrarPregunta();
  mostrarDesafioDiario();
  actualizarProyectos();
}

async function pedir(ruta, opciones = {}) {
  const respuesta = await fetch(ruta, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...(opciones.headers || {}) },
    ...opciones,
  });
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) throw new Error(datos.error || "No se pudo hablar con el servidor.");
  return datos;
}

async function sincronizarServidor() {
  if (!sesionActiva) return;
  try {
    await pedir("/api/estado", { method: "PUT", body: JSON.stringify(estadoLocal()) });
  } catch {
    mensajeCuenta("No pude guardar en el servidor. El progreso sigue en este navegador.", true);
  }
}

async function iniciarSesionGuardada() {
  try {
    const datos = await pedir("/api/yo");
    sesionActiva = true;
    pintarCuenta(datos.nombre);
    aplicarEstado(datos);
    mensajeCuenta("Sesión restaurada. El progreso está en el servidor.");
  } catch {
    sesionActiva = false;
    pintarCuenta(null);
  }
}

async function enviarCuenta(ruta) {
  const formulario = document.querySelector("#form-cuenta");
  const nombre = formulario.nombre.value.trim();
  const contrasena = formulario.contrasena.value;
  if (!nombre || !contrasena) {
    mensajeCuenta("Escribí un nombre y una contraseña.", true);
    return;
  }
  try {
    const datos = await pedir(ruta, {
      method: "POST",
      body: JSON.stringify({ nombre, contrasena, ...estadoLocal() }),
    });
    sesionActiva = true;
    pintarCuenta(datos.nombre);
    aplicarEstado(datos);
    mensajeCuenta(ruta.includes("registro") ? "Cuenta creada. Ya estás adentro." : "Entraste. Cargué tu progreso.");
  } catch (error) {
    mensajeCuenta(error.message, true);
  }
}

document.querySelector("#form-cuenta").addEventListener("submit", (evento) => {
  evento.preventDefault();
  enviarCuenta("/api/entrar");
});

document.querySelector("#registrar").addEventListener("click", () => {
  enviarCuenta("/api/registro");
});

document.querySelector("#salir").addEventListener("click", async () => {
  try {
    await pedir("/api/salir", { method: "POST", body: "{}" });
  } catch {
    /* si el servidor no está, igual cerramos la vista */
  }
  sesionActiva = false;
  pintarCuenta(null);
  mensajeCuenta("Saliste. El progreso de esta computadora sigue acá.");
});

const botonTema = document.querySelector("#cambiar-tema");
function aplicarTema(modoOscuro) {
  document.documentElement.classList.toggle("dark", modoOscuro);
  document.body.classList.toggle("modo-oscuro", modoOscuro);
  botonTema.textContent = modoOscuro ? "Modo claro" : "Modo oscuro";
  botonTema.setAttribute("aria-pressed", modoOscuro);
}
aplicarTema(localStorage.getItem("temaWeb") === "oscuro");
botonTema.addEventListener("click", () => {
  const modoOscuro = !document.body.classList.contains("modo-oscuro");
  aplicarTema(modoOscuro);
  localStorage.setItem("temaWeb", modoOscuro ? "oscuro" : "claro");
});

const botonesLenguaje = document.querySelectorAll(".lenguaje");
const contador = document.querySelector("#contador");
const pregunta = document.querySelector("#pregunta");
const respuestas = document.querySelector("#respuestas");
const resultado = document.querySelector("#resultado");
const siguiente = document.querySelector("#siguiente");
const reintentar = document.querySelector("#reintentar");
const barra = document.querySelector("#barra-progreso");
let lenguajeActual = "html";

function guardarProgreso() {
  localStorage.setItem(CLAVE_PROGRESO, JSON.stringify(progreso));
  sincronizarServidor();
}

function actualizarNiveles() {
  const css = document.querySelector('[data-lenguaje="css"]');
  const javascript = document.querySelector('[data-lenguaje="javascript"]');
  const python = document.querySelector('[data-lenguaje="python"]');
  css.disabled = !(progreso.html.completado || progreso.css.desbloqueado);
  javascript.disabled = !(progreso.css.completado || progreso.javascript.desbloqueado);
  python.disabled = !(progreso.javascript.completado || progreso.python.desbloqueado);
  css.classList.toggle("bloqueado", css.disabled);
  javascript.classList.toggle("bloqueado", javascript.disabled);
  python.classList.toggle("bloqueado", python.disabled);
  css.textContent = css.disabled ? "CSS · 🔒" : "CSS · 10";
  javascript.textContent = javascript.disabled ? "JavaScript · 🔒" : "JavaScript · 10";
  python.textContent = python.disabled ? "Python · 🔒" : "Python · 10";
}

function actualizarResumenProgreso() {
  Object.keys(ejercicios).forEach((lenguaje) => {
    const estado = progreso[lenguaje];
    const respondidas = Math.min(estado.pregunta + (estado.respondida ? 1 : 0), 10);
    const porcentaje = Math.round((respondidas / 10) * 100);
    const tarjeta = document.querySelector(`[data-resumen="${lenguaje}"]`);
    tarjeta.querySelector("strong").textContent = `${porcentaje}%`;
    tarjeta.querySelector(".barra-resumen div").style.width = `${porcentaje}%`;
    tarjeta.querySelector("p").textContent = `${respondidas} de 10 respondidas · ${estado.aciertos} aciertos`;
  });
}

function mostrarPregunta() {
  const estado = progreso[lenguajeActual];
  const preguntaActual = estado.pregunta;
  const aciertos = estado.aciertos;
  if (estado.completado) {
    contador.textContent = "Ejercicios completados";
    pregunta.textContent = `¡Terminaste ${lenguajeActual.toUpperCase()}! Obtuviste ${aciertos} de 10.`;
    respuestas.innerHTML = "";
    resultado.textContent = "Elegí el próximo nivel para continuar practicando.";
    resultado.className = "acierto";
    barra.style.width = "100%";
    siguiente.disabled = true;
    reintentar.hidden = false;
    return;
  }
  const [enunciado, opciones] = ejercicios[lenguajeActual][preguntaActual];
  contador.textContent = `Pregunta ${preguntaActual + 1} de 10 · ${aciertos} aciertos`;
  pregunta.textContent = enunciado;
  resultado.textContent = "";
  resultado.className = "";
  siguiente.disabled = true;
  reintentar.hidden = true;
  barra.style.width = `${preguntaActual * 10}%`;
  respuestas.innerHTML = "";

  opciones.forEach((opcion, opcionIndice) => {
    const respuesta = document.createElement("button");
    respuesta.className = "respuesta";
    respuesta.type = "button";
    respuesta.textContent = opcion;
    respuesta.addEventListener("click", () => revisarRespuesta(opcionIndice));
    respuestas.appendChild(respuesta);
  });

  if (estado.respondida) pintarRespuesta(estado.seleccion);
}

function revisarRespuesta(opcionIndice) {
  const estado = progreso[lenguajeActual];
  if (estado.respondida) return;
  const [, , correcta] = ejercicios[lenguajeActual][estado.pregunta];
  estado.respondida = true;
  estado.seleccion = opcionIndice;
  if (opcionIndice === correcta) estado.aciertos++;
  guardarProgreso();
  actualizarResumenProgreso();
  pintarRespuesta(opcionIndice);
}

function pintarRespuesta(opcionIndice) {
  const [, , correcta] = ejercicios[lenguajeActual][progreso[lenguajeActual].pregunta];
  const botonesRespuesta = document.querySelectorAll(".respuesta");
  botonesRespuesta.forEach((botonRespuesta, numero) => {
    botonRespuesta.disabled = true;
    if (numero === correcta) botonRespuesta.classList.add("correcta");
  });
  if (opcionIndice === correcta) {
    resultado.textContent = "¡Correcto! Muy bien.";
    resultado.className = "acierto";
  } else {
    botonesRespuesta[opcionIndice].classList.add("incorrecta");
    resultado.textContent = "Casi. La respuesta correcta está marcada en verde.";
    resultado.className = "error";
  }
  siguiente.disabled = false;
}

siguiente.addEventListener("click", () => {
  const estado = progreso[lenguajeActual];
  estado.pregunta++;
  estado.respondida = false;
  estado.seleccion = null;
  if (estado.pregunta === 10) estado.completado = true;
  if (estado.completado && lenguajeActual === "html") progreso.css.desbloqueado = true;
  if (estado.completado && lenguajeActual === "css") progreso.javascript.desbloqueado = true;
  if (estado.completado && lenguajeActual === "javascript") progreso.python.desbloqueado = true;
  guardarProgreso();
  actualizarNiveles();
  actualizarResumenProgreso();
  mostrarPregunta();
});

reintentar.addEventListener("click", () => {
  const estado = progreso[lenguajeActual];
  estado.pregunta = 0;
  estado.aciertos = 0;
  estado.respondida = false;
  estado.seleccion = null;
  estado.completado = false;
  guardarProgreso();
  actualizarNiveles();
  actualizarResumenProgreso();
  mostrarPregunta();
});

botonesLenguaje.forEach((botonLenguaje) => {
  botonLenguaje.addEventListener("click", () => {
    lenguajeActual = botonLenguaje.dataset.lenguaje;
    botonesLenguaje.forEach((boton) => boton.classList.remove("activo"));
    botonLenguaje.classList.add("activo");
    mostrarPregunta();
  });
});

const desafiosDiarios = [
  ["HTML", "¿Qué etiqueta se usa para crear un enlace?", ["<a>", "<p>", "<img>"], 0],
  ["CSS", "¿Qué propiedad cambia el color del texto?", ["background", "color", "font-size"], 1],
  ["JavaScript", "¿Qué evento sucede al hacer clic en un botón?", ["click", "load", "hover"], 0],
  ["Python", "¿Qué función imprime texto en pantalla?", ["print()", "text()", "show()"], 0],
  ["HTML", "¿Qué atributo describe una imagen?", ["alt", "href", "style"], 0],
  ["CSS", "¿Qué valor de display activa Flexbox?", ["flex", "inline", "none"], 0],
  ["JavaScript", "¿Qué palabra se usa para una variable modificable?", ["let", "const", "static"], 0],
  ["Python", "¿Qué símbolo inicia un comentario?", ["#", "//", "/*"], 0],
];
const hoy = new Date().toLocaleDateString("sv-SE");
const numeroDelDia = Math.floor(new Date(`${hoy}T00:00:00`).getTime() / 86400000);
const desafioActual = desafiosDiarios[numeroDelDia % desafiosDiarios.length];
const CLAVE_DESAFIO = "aprenderWebDesafioDiario";
let respuestaGuardada = JSON.parse(localStorage.getItem(CLAVE_DESAFIO) || "null");
const lenguajeDiario = document.querySelector("#lenguaje-diario");
const preguntaDiaria = document.querySelector("#pregunta-diaria");
const opcionesDiarias = document.querySelector("#opciones-diarias");
const resultadoDiario = document.querySelector("#resultado-diario");

function mostrarDesafioDiario() {
  const [lenguaje, preguntaDesafio, opciones] = desafioActual;
  lenguajeDiario.textContent = `Hoy practicamos ${lenguaje}`;
  preguntaDiaria.textContent = preguntaDesafio;
  opcionesDiarias.innerHTML = "";
  resultadoDiario.textContent = "";
  opciones.forEach((opcion, indiceOpcion) => {
    const botonOpcion = document.createElement("button");
    botonOpcion.className = "opcion-diaria";
    botonOpcion.type = "button";
    botonOpcion.textContent = opcion;
    botonOpcion.addEventListener("click", () => responderDesafio(indiceOpcion));
    opcionesDiarias.appendChild(botonOpcion);
  });
  if (respuestaGuardada?.fecha === hoy) pintarDesafio(respuestaGuardada.seleccion);
}

function responderDesafio(seleccion) {
  if (respuestaGuardada?.fecha === hoy) return;
  respuestaGuardada = { fecha: hoy, seleccion };
  localStorage.setItem(CLAVE_DESAFIO, JSON.stringify(respuestaGuardada));
  sincronizarServidor();
  pintarDesafio(seleccion);
}

function pintarDesafio(seleccion) {
  const correcta = desafioActual[3];
  document.querySelectorAll(".opcion-diaria").forEach((botonOpcion, indiceOpcion) => {
    botonOpcion.disabled = true;
    if (indiceOpcion === correcta) botonOpcion.classList.add("correcta-diaria");
  });
  if (seleccion === correcta) {
    resultadoDiario.textContent = "¡Correcto! Volvé mañana para un nuevo desafío.";
  } else {
    document.querySelectorAll(".opcion-diaria")[seleccion].classList.add("incorrecta-diaria");
    resultadoDiario.textContent = "Casi. La respuesta correcta quedó marcada en verde. Volvé mañana.";
  }
}

const CLAVE_PROYECTOS = "aprenderWebProyectos";
let proyectosTerminados = JSON.parse(localStorage.getItem(CLAVE_PROYECTOS) || "[]");
const botonesProyecto = document.querySelectorAll(".terminar-proyecto");

function actualizarProyectos() {
  botonesProyecto.forEach((botonProyecto) => {
    const proyecto = botonProyecto.closest(".proyecto");
    const terminado = proyectosTerminados.includes(proyecto.dataset.proyecto);
    proyecto.classList.toggle("terminado", terminado);
    botonProyecto.textContent = terminado ? "✓ Proyecto terminado" : "Marcar como terminado";
  });
}

botonesProyecto.forEach((botonProyecto) => {
  botonProyecto.addEventListener("click", () => {
    const nombreProyecto = botonProyecto.closest(".proyecto").dataset.proyecto;
    const posicion = proyectosTerminados.indexOf(nombreProyecto);
    if (posicion === -1) proyectosTerminados.push(nombreProyecto);
    else proyectosTerminados.splice(posicion, 1);
    localStorage.setItem(CLAVE_PROYECTOS, JSON.stringify(proyectosTerminados));
    sincronizarServidor();
    actualizarProyectos();
  });
});

actualizarNiveles();
actualizarResumenProgreso();
mostrarPregunta();
mostrarDesafioDiario();
actualizarProyectos();
iniciarSesionGuardada();
