// === Elementos base ===
const video = document.getElementById('video');
const canvas = document.getElementById('output');
const ctx = canvas.getContext('2d');
const labelEl = document.getElementById('label');
const labelE2 = document.getElementById('label2');

// === Configurar MediaPipe Hands ===
const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.6,
  minTrackingConfidence: 0.6,
});
        const letterInfo = {
      'A': { img: '/imgs/lsc/A.png', desc: 'Puño cerrado con el pulgar extendido hacia el lado.' },
      'B': { img: '/imgs/lsc/B.png', desc: 'Mano abierta con los dedos juntos y el pulgar doblado hacia la palma.' },
      'C': { img: '/imgs/lsc/C.png', desc: 'Forma de “C” con la mano como si sujetaras un vaso.' },
      'D': { img: '/imgs/lsc/D.png', desc: 'Mano cerrada con el pulgar sobre el dedo medio y el indice hacia arriba.' },
      'E': { img: '/imgs/lsc/E.png', desc: 'Dedos doblado hacia la palma de la mano.' },
      'F': { img: '/imgs/lsc/F.png', desc: 'Pulgar junto al indice extendidos y los demas dedos doblados.' },
      'G': { img: '/imgs/lsc/G.png', desc: 'Mano cerrada con indice extendido paralelo al pulgar.' },
      'H': { img: '/imgs/lsc/H.png', desc: 'Indice y medio extendidos y el pulgar sobre el anular.' },
      'I': { img: '/imgs/lsc/I.png', desc: 'Mano cerrada con el meñique extendido hacia arriba y el pulgar sobre indice.' },
      'J': { img: '/imgs/lsc/J.png', desc: 'Mano cerrada con el meñique extendido hacia arriba y el pulgar extendido junto al indice.' },
      'K': { img: '/imgs/lsc/K.png', desc: 'Indice y medio extendidos formando angulo de 90 grados y pulgar en la mitad.' },
      'L': { img: '/imgs/lsc/L.png', desc: 'Indice y pulgar forman una "L".' },
      'M': { img: '/imgs/lsc/M.png', desc: 'Anular, medio e indice forman una "M" con la mano hacia abajo.' },
      'N': { img: '/imgs/lsc/N.png', desc: 'Medio e indice forman una "N" con la mano hacia abajo.' },
      'Ñ': { img: '/imgs/lsc/Ñ.png', desc: 'Medio e indice forman una "N" con la mano hacia abajo y pulgar extendido.' },
      'O': { img: '/imgs/lsc/O.png', desc: 'Mano cerrada con indice y pulgar juntos formando una "O".' },
      'P': { img: '/imgs/lsc/P.png', desc: 'Indice y pulgar extendidos con la mano hacia abajo.' },
      'Q': { img: '/imgs/lsc/Q.png', desc: 'Dedos extendidos juntandose arriba.' },
      'R': { img: '/imgs/lsc/R.png', desc: 'Medio extendido por detras de indice tambien extendido y pulgar sobre anular.' },
      'S': { img: '/imgs/lsc/S.png', desc: 'Mano cerrada en forma de puño y pulgar sobre medio e indice.' },
      'T': { img: '/imgs/lsc/T.png', desc: 'Indice y pulgar forman un circulo y los demas dedos extendidos levemente separados.' },
      'U': { img: '/imgs/lsc/U.png', desc: 'Meñique e indice extendidos y pulgar sobre medio y anular.' },
      'V': { img: '/imgs/lsc/V.png', desc: 'Medio e indice extendidos y separados formando una "V"  y pulgar sobre anular.' },
      'W': { img: '/imgs/lsc/W.png', desc: 'Anular, medio e indice extendidos y separados formando una "W" y pulgar sobre meñique.' },
      'X': { img: '/imgs/lsc/X.png', desc: 'Indice y pulgar extendido recostado sobre medio y los demas dedos cerrados.' },
      'Y': { img: '/imgs/lsc/Y.png', desc: 'Meñique y pulgar extendidos hacia afuera y los demas dedos cerrados.' },
      'Z': { img: '/imgs/lsc/Z.png', desc: 'Indice extendido apuntando hacia arriba y pulgar sobre meñique con los demas dedos cerrados.' }
    };

          // === Creación de botones (reemplaza tu bloque actual) ===
    const letters = [
      'A','B','C','D','E','F','G','H','I','J','K','L','M',
      'N','Ñ','O','P','Q','R','S','T','U','V','W','X','Y','Z','ABECEDARIO'
    ];

    let selectedLetter = '';       // '' = ninguna seleccionada
    let abecedarioMode = false;    // modo especial para “todas”

    const container = document.getElementById('letterButtons');

    function markSelected(btn) {
      container.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
      if (btn) btn.classList.add('selected');
    }

    letters.forEach(letter => {
      const btn = document.createElement('button');
      btn.textContent = letter;
      btn.classList.add('letter-btn');

      btn.addEventListener('click', () => {
        if (letter === 'ABECEDARIO') {
          // Toggle del modo “todas las lsc”
          abecedarioMode = !abecedarioMode;
          if (abecedarioMode) {
            selectedLetter = 'ABECEDARIO';   // <-- importante
            markSelected(btn);
            
          } else {
            selectedLetter = '';             // desactivar -> ninguna seleccionada
            markSelected(null);
           
          }
          return;
        }

        // Selección de una letra específica (apaga ABECEDARIO si estaba)
        abecedarioMode = false;
        if (selectedLetter === letter) {
          selectedLetter = '';
          markSelected(null);
          
        } else {
          selectedLetter = letter;
          markSelected(btn);
         
        }
      });

      container.appendChild(btn);
    });

// === Bucle de resultados ===
hands.onResults(onResults);

// === Cámara ===
const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 640,
  height: 480,
});

camera.start().catch(err => {
  console.error('No se pudo iniciar la cámara:', err);
  labelEl.textContent = 'Permite la cámara';
});

// === Dibujo y clasificación ===
let stableLabel = '…';
let lastLabel = null;
let sameCount = 0;
const THRESH_STABLE = 4; // frames para estabilizar

// ----- onResults corregida (incluye debug dentro) -----
function onResults(results) {
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (results.image) ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

  let current = '—';
  let lm = null;
  let hd = null;

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    lm = results.multiHandLandmarks[0];
    hd = results.multiHandedness?.[0];

    // Dibuja la mano y clasifica
    drawLandmarksAndConnectors(ctx, lm);
    current = classifyGesture(lm, hd);
  }

  // Estabilización
  if (current === lastLabel) {
    sameCount++;
  } else {
    lastLabel = current;
    sameCount = 1;
  }
  const isStable = sameCount >= THRESH_STABLE;
  if (isStable) stableLabel = current; // <-- importante: fijar stableLabel cuando estable

  // --- LÓGICA DE SELECCIÓN ROBUSTA ---
  if (!abecedarioMode && selectedLetter === '') {
    labelE2.textContent = 'SELECCIONA UNA LETRA';
    labelEl.textContent = '…';
   
    ctx.restore();
    return;
  }

  if (abecedarioMode) {
    labelE2.textContent = 'MODO ABECEDARIO';
    labelEl.textContent = isStable ? stableLabel : '…';
  } else {
    if (selectedLetter) labelE2.textContent = 'Seleccionaste la letra: ' + selectedLetter;
    labelEl.textContent = (isStable && current === selectedLetter) ? stableLabel : '…';
  }


  ctx.restore();
}

document.querySelectorAll('.letter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const letra = btn.textContent.trim();
    selectedLetter = letra; // guardamos la letra seleccionada

    // mostramos en panel usando updateDebugPanel
  
  });
});



function updateInfoPanel(letter) {
  const panel = document.getElementById('infoPanel');
  if (!panel) return;

  let html = `<h4>📖 Información de la letra</h4><hr style="border: none; height: 1px; background-color: black;" />`;

  if (!letter || !letterInfo[letter]) {
    html += `<em>Selecciona una letra para ver su explicación</em>`;
  } else {
    const { img, desc } = letterInfo[letter];
    html += `
      <div style="text-align:center">
        <img src="${img}" alt="${letter}" width="208" 
             style="border:1px solid #475569; border-radius:8px; margin:0px 0"/>
        <p><strong>${letter}</strong>: ${desc}</p>
      </div>
    `;
  }

  panel.innerHTML = html;
}

document.querySelectorAll('.letter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const letra = btn.textContent.trim();
    selectedLetter = letra;
    updateInfoPanel(letra); // 👈 actualiza el panel de información
  });
});


function drawLandmarksAndConnectors(ctx, lm) {
  // Conectores
  drawConnectors(ctx, lm, HAND_CONNECTIONS, { lineWidth: 3 });
  // Puntos
  drawLandmarks(ctx, lm, { lineWidth: 1, radius: 3 });

  
}

// === Utilidades de geometría ===
function dist(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

// ¿Dedo extendido? (heurística simple con eje Y; mejor con palma vertical)
function fingerExtended(lm, tipIdx, pipIdx) {
  return lm[tipIdx].y < lm[pipIdx].y; // y menor = más arriba en la imagen
}

// Pulgar extendido lateral (usa eje X y mano)
function thumbExtended(lm, handedness) {
  if (!handedness) return false;
  const isRight = handedness.label === 'Right';
  // Tip (4) vs IP (3): en derecha, extendido si tip está más a la izquierda (x menor); en izquierda, al revés
  return isRight ? (lm[4].x < lm[3].x) : (lm[4].x > lm[3].x);
}

// Función que detecta si los dedos están hacia abajo (palma hacia arriba)
function isFingersDown(lm) {
  const wristY = lm[0].y;      // Coordenada Y de la muñeca (lm[0])
  const thumbY = lm[4].y;      // Coordenada Y del pulgar (lm[4])
  const indexY = lm[8].y;      // Coordenada Y del índice (lm[8])
  
  // Si la muñeca está más abajo que el pulgar e índice, significa que los dedos están hacia abajo
  const fingersDown = wristY > thumbY && wristY > indexY;

  return fingersDown;
}

// Función para detectar si la mano está con la palma hacia abajo (dedos hacia abajo)
function isFingersUp(lm) {
  // Obtener las coordenadas Y de los puntos clave
  const wristY = lm[0].y;      // Coordenada Y de la muñeca (lm[0])
  const thumbY = lm[4].y;      // Coordenada Y del pulgar (lm[4])
  const indexY = lm[8].y;      // Coordenada Y del índice (lm[8])
  const middleY = lm[12].y;    // Coordenada Y del medio (lm[12])
  const ringY = lm[16].y;      // Coordenada Y del anular (lm[16])
  const pinkyY = lm[20].y;     // Coordenada Y del meñique (lm[20])

  // Si la muñeca está más cerca de la parte superior que los dedos (dedos hacia abajo)
  // Es decir, la muñeca tiene un valor Y mayor que los dedos
  const palmDown = wristY > thumbY && wristY > indexY && wristY > middleY && wristY > ringY && wristY > pinkyY;

  return palmDown;  // Si la palma está hacia abajo, retorna true
}

function isBackOfHandFacingCamera(lm) {
  const wristZ = lm[0].z;
  const indexTipZ = lm[8].z;

  // Si la punta del índice está más lejos que la palma, vemos el dorso
  return indexTipZ > wristZ;
}

function drawLandmarkLabels(ctx, lm) {
  const labels = [
    'wrist', 'thumb_cmc', 'thumb_mcp', 'thumb_ip', 'thumb_tip',
    'index_mcp', 'index_pip', 'index_dip', 'index_tip',
    'middle_mcp', 'middle_pip', 'middle_dip', 'middle_tip',
    'ring_mcp', 'ring_pip', 'ring_dip', 'ring_tip',
    'pinky_mcp', 'pinky_pip', 'pinky_dip', 'pinky_tip'
  ];

  ctx.font = '10px monospace';
  ctx.fillStyle = 'yellow';

  lm.forEach((point, i) => {
    const x = point.x * canvas.width;
    const y = point.y * canvas.height;
    ctx.fillText(labels[i], x + 5, y + 5);
  });
}


function classifyGesture(lm, handedness) {
  // Estados de los dedos
  const indexExt = fingerExtended(lm, 8, 6);
  const middleExt = fingerExtended(lm, 12, 10);
  const ringExt = fingerExtended(lm, 16, 14);
  const pinkyExt = fingerExtended(lm, 20, 18);
  const thumbExt = thumbExtended(lm, handedness);

  const extendedCount = [indexExt, middleExt, ringExt, pinkyExt].filter(Boolean).length;
  const thumbIndexDist = dist(lm[4], lm[8]); // distancia entre pulgar e índice
  const thumbPinkyDist = dist(lm[4], lm[20]); // distancia entre pulgar y meñique
  const thumbRingDist = dist(lm[4], lm[16]); // distancia entre pulgar y anular
  const wristIndexDist = dist(lm[8], lm[0]); // distancia entre indice y muñeca
  const wristMiddleDist = dist(lm[12], lm[0]); // distancia entre medio y muñeca
  const indexMiddleDist = dist(lm[8], lm[12]); // distancia entre indice y medio
  

  // Detectar orientación de la palma
  const isPalmDown = lm[0].y > lm[5].y; // muñeca y base del índice

   // Detectar si los dedos están hacia abajo (palm up, dedos abajo)
  const fingersDown = isFingersDown(lm);

    // Detectar si los dedos están hacia abajo (palma hacia abajo)
  const fingersUp = isFingersUp(lm);  // Cambiamos el nombre aquí

   const backFacing = isBackOfHandFacingCamera(lm);


  // === Letra A: Puño cerrado con pulgar hacia afuera
  if (thumbIndexDist < 0.3 && thumbPinkyDist < 0.4 && thumbRingDist < 0.3 && !indexExt && !middleExt && !ringExt && !pinkyExt && thumbExt) return 'A';

  // === Letra B: Mano abierta, dedos extendidos y pulgar hacia adentro
  if (indexExt && middleExt && ringExt && pinkyExt && !thumbExt) return 'B';

  // === Letra C: Forma de "C"
  if (thumbIndexDist > 0.06 &&thumbIndexDist < 0.07 && !middleExt) return 'C';

  // === Letra D: Solo índice extendido
  if ( thumbPinkyDist > 0.1 && indexExt && !middleExt && !ringExt && !pinkyExt && !thumbExt) return 'D';

 // === Letra E: Puño cerrado con pulgar hacia afuera
  if (thumbIndexDist > 0.1 && thumbPinkyDist >0.1 && thumbRingDist >0.1 && !indexExt && !middleExt && !ringExt && !pinkyExt) return 'E';

  // === Letra F: Pulgar y dedo índice formando un círculo, los demás extendidos
  if ( thumbPinkyDist > 0.2 && thumbIndexDist < 0.2 && wristIndexDist > 0.3 && indexExt && thumbExt && !middleExt && !ringExt && !pinkyExt ) return 'F';

  // === Letra G: Pulgar e índice extendidos en línea
  if (thumbRingDist < 0.2 && thumbPinkyDist < 0.2 && thumbIndexDist < 0.2 && wristIndexDist < 0.4 && indexExt && thumbExt && !middleExt && !ringExt && !pinkyExt) return 'G';

  // === Letra H: Índice y medio extendidos
  if (indexMiddleDist < 0.1 && wristMiddleDist >0.5 && wristIndexDist > 0.5 && indexExt && middleExt && !ringExt && !pinkyExt && !thumbExt) return 'H';

  // === Letra I: Solo dedo meñique extendido
  if ( thumbPinkyDist > 0.1 && pinkyExt && !indexExt && !middleExt && !ringExt && !thumbExt) return 'I';

  // === Letra J: Dibuja una "J" con el dedo meñique
  if ( thumbPinkyDist < 0.3 && pinkyExt && !indexExt && !middleExt && !ringExt && thumbExt) return 'J';

  // === Letra K: Dedo índice y medio extendidos, pulgar también extendido
  if (indexExt && middleExt && thumbExt && !ringExt && !pinkyExt) return 'K';

  // === Letra L: Índice y pulgar formando "L"
  if ( wristMiddleDist < 0.2 && indexExt && thumbExt && !middleExt && !ringExt && !pinkyExt && thumbIndexDist > 0.1) return 'L';

   // Letra M: pulgar, índice y medio doblados, anular y meñique extendidos
  if (thumbIndexDist < 0.3 && thumbPinkyDist < 0.090 && pinkyExt && indexExt == false && middleExt == false && ringExt == false && thumbExt == false ) return 'M';

  // === Letra N: Dos dedos (índice y medio) doblados
  if (thumbIndexDist < 0.3 && thumbPinkyDist < 0.090 && thumbRingDist < 0.050 && pinkyExt && indexExt == false  && middleExt == false && ringExt && thumbExt == false) return 'N';

  // === Letra Ñ: Variación de la "N"
  if (thumbIndexDist < 0.2 && thumbPinkyDist < 0.2 && thumbRingDist < 0.2 && pinkyExt && indexExt == false  && middleExt == false && ringExt && thumbExt) return 'Ñ';

  // === Letra O: Mano cerrada, dedos doblados en forma de "O"
  if (wristMiddleDist > 0.2 && !indexExt && !middleExt && !ringExt && !pinkyExt && !thumbExt) return 'O';

  // === Letra P: Similar a "K", pero con los dedos hacia abajo
  if (wristMiddleDist < 0.3 && indexExt == false && middleExt && thumbExt && ringExt && pinkyExt) return 'P';

  // === Letra Q: Similar a la "G", pero con el pulgar e índice más abiertos
  if ( wristIndexDist > 0.4 &&  indexExt && thumbExt && middleExt && ringExt && pinkyExt) return 'Q';

  // === Letra R: Índice y medio cruzados, los demás dedos cerrados
  if (wristMiddleDist <0.5 && wristIndexDist < 0.5 && indexExt && middleExt && !ringExt && !pinkyExt && !thumbExt) return 'R';

  // === Letra S: Mano cerrada en puño, pulgar cerrando los otros dedos
  if (wristMiddleDist < 0.2 && !indexExt && !middleExt && !ringExt && !pinkyExt && !thumbExt) return 'S';

  // === Letra T: Pulgar colocado entre el índice y medio, todos los dedos doblados
  if ( wristMiddleDist > 0.4 && indexExt == false && middleExt && thumbExt && ringExt && pinkyExt) return 'T';

  // === Letra U: Índice y medio extendidos, los demás doblados
  if (indexExt && middleExt == false && ringExt == false && pinkyExt && thumbExt == false) return 'U';

  // === Letra V: Índice y medio en forma de "V"
  if (indexMiddleDist > 0.1 && wristMiddleDist >0.5 && wristIndexDist > 0.5 && indexExt && middleExt && !ringExt && !pinkyExt && !thumbExt) return 'V';

  // === Letra W: Tres dedos extendidos (índice, medio y anular)
  if (indexExt && middleExt && ringExt && !pinkyExt && !thumbExt) return 'W';

  // === Letra X: Dedo índice doblado en forma de gancho
  if (wristMiddleDist > 0.2 && indexExt && thumbExt && !middleExt && !ringExt && !pinkyExt && thumbIndexDist > 0.1) return 'X';

  // === Letra Y: Pulgar y meñique extendidos, los demás dedos doblados
  if ( thumbPinkyDist > 0.3 && pinkyExt && !indexExt && !middleExt && !ringExt && thumbExt) return 'Y';

  // === Letra Z: Dibuja una "Z" con el dedo índice
  if (thumbPinkyDist < 0.1 && indexExt && !middleExt && !ringExt && !pinkyExt && !thumbExt) return 'Z';

  // Si no coincide con ningún gesto, devuelve "…"
  return '…';
}


