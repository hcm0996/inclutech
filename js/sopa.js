const palabras = [
  "INCLUSION", "ACCESIBLE", "CARIÑO", "BRAILLE", "DIVERSIDAD",
  "RESPETO", "IGUALDAD", "EMPATIA", "COMUNICAR", "VISUAL",
  "AUDITIVA", "TECNOLOGIA", "LENGUAJE", "APOYO", "EDUCACION"
];

const tamanio = 15;
let sopa = Array.from({ length: tamanio }, () => Array(tamanio).fill(""));


function colocarPalabra(palabra) {
  let colocada = false;
  let intentos = 0;

  while (!colocada && intentos < 100) {
    const horizontal = Math.random() < 0.5;
    const x = Math.floor(Math.random() * (horizontal ? tamanio - palabra.length : tamanio));
    const y = Math.floor(Math.random() * (horizontal ? tamanio : tamanio - palabra.length));

    let puedeColocar = true;
    for (let i = 0; i < palabra.length; i++) {
      const dx = horizontal ? x + i : x;
      const dy = horizontal ? y : y + i;
      const letraExistente = sopa[dy][dx];

      if (letraExistente !== "" && letraExistente !== palabra[i]) {
        puedeColocar = false;
        break;
      }
    }

    if (puedeColocar) {
      for (let i = 0; i < palabra.length; i++) {
        const dx = horizontal ? x + i : x;
        const dy = horizontal ? y : y + i;
        sopa[dy][dx] = palabra[i];
      }
      colocada = true;
    }

    intentos++;
  }
}


function llenarSopa() {
  for (let palabra of palabras) {
    colocarPalabra(palabra);
  }

  const letras = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
  for (let y = 0; y < tamanio; y++) {
    for (let x = 0; x < tamanio; x++) {
      if (sopa[y][x] === "") {
        sopa[y][x] = letras[Math.floor(Math.random() * letras.length)];
      }
    }
  }
}


function mostrarSopa() {
  const contenedor = document.getElementById("sopa");
  contenedor.innerHTML = "";

  for (let y = 0; y < tamanio; y++) {
    for (let x = 0; x < tamanio; x++) {
      const celda = document.createElement("div");
      celda.classList.add("celda");
      celda.textContent = sopa[y][x];
      celda.dataset.x = x;
      celda.dataset.y = y;
      celda.addEventListener("click", seleccionarCelda);
      contenedor.appendChild(celda);
    }
  }

  const lista = document.getElementById("lista-palabras");
  lista.innerHTML = "";
  for (let palabra of palabras) {
    const item = document.createElement("li");
    item.textContent = palabra;
    item.id = `palabra-${palabra}`;
    lista.appendChild(item);
  }
}

let seleccion = [];


function seleccionarCelda(e) {
  const celda = e.target;
  celda.classList.toggle("seleccionada");

  const x = parseInt(celda.dataset.x);
  const y = parseInt(celda.dataset.y);

  const index = seleccion.findIndex(c => c.x === x && c.y === y);
  if (index >= 0) {
    seleccion.splice(index, 1);
  } else {
    seleccion.push({ x, y, letra: celda.textContent });
  }

  verificarSeleccion();
}

function verificarSeleccion() {
  const palabraSeleccionada = seleccion.map(c => c.letra).join("");

  for (let palabra of palabras) {
    if (
      palabra === palabraSeleccionada ||
      palabra === palabraSeleccionada.split("").reverse().join("")
    ) {
      
      document.getElementById(`palabra-${palabra}`).style.textDecoration = "line-through";

      
      for (let celda of seleccion) {
        const div = document.querySelector(
          `.celda[data-x="${celda.x}"][data-y="${celda.y}"]`
        );
        if (div) {
          div.classList.remove("seleccionada");  
          div.classList.add("encontrada");         
        }
      }

      seleccion = [];
      break;
    }
  }
}

function seleccionarCelda(e) {
  const celda = e.target;

 
  if (celda.classList.contains("encontrada")) return;

  celda.classList.toggle("seleccionada");

  const x = parseInt(celda.dataset.x);
  const y = parseInt(celda.dataset.y);

  const index = seleccion.findIndex(c => c.x === x && c.y === y);
  if (index >= 0) {
    seleccion.splice(index, 1);
  } else {
    seleccion.push({ x, y, letra: celda.textContent });
  }

  verificarSeleccion();
}


// Llenar y mostrar la sopa de letras
llenarSopa();
mostrarSopa();
