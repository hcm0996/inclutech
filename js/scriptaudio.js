// Función para convertir texto en voz
function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text); // Crear el objeto de voz
  utterance.lang = 'es-ES'; // Establecer el idioma a español
  speechSynthesis.speak(utterance); // Reproducir el texto como voz
}

// Para anunciar dinámicamente los audiolibros
function announceAudiobook(bookTitle) {
  const message = `Estás escuchando ${bookTitle}. Disfruta del libro.`;
  speakText(message); // Llamar la función que reproduce la voz
}

// Lista de audiolibros
const audiobooks = [
  {
    title: "Alicia en el pais de las maravillas (seccíon 1) ",
    author: "Lewis Carroll",
    description: "Un clásico para todas las edades.",
    image: "imgs/audiolibros/alicia.jpg",
    audio: "imgs/audiolibros/aliciaaudio.mp3"
    
  },
  {
    title: "Alicia en el pais de las maravillas (seccíon 2)",
    author: "Lewis Carroll",
    description: "Un clásico para todas las edades",
    image: "imgs/audiolibros/alicia.jpg",
    audio: "imgs/audiolibros/aliciaaudio2.mp3"
  },
  {
    title: "Alicia en el pais de las maravillas (seccíon 3)",
    author: "Lewis Carroll",
    description: "Un clásico para todas las edades",
    image: "imgs/audiolibros/alicia.jpg",
    audio: "imgs/audiolibros/aliciaaudio3.mp3"
  },
   {
    title: "Alicia en el pais de las maravillas (seccíon 4)",
    author: "Lewis Carroll",
    description: "Un clásico para todas las edades.",
    image: "imgs/audiolibros/alicia.jpg",
    audio: "imgs/audiolibros/aliciaaudio4.mp3"
  },
   {
    title: "Alicia en el pais de las maravillas (seccíon 5)",
    author: "Lewis Carroll",
    description: "Un clásico para todas las edades.",
    image: "imgs/audiolibros/alicia.jpg",
    audio: "imgs/audiolibros/aliciaaudio5.mp3"
  },
  
   {
    title: "El ataque del molino (seccíon 1)",
    author: "Émile Zola",
    description: "Un clásico para todas las edades.",
    image: "imgs/audiolibros/molino.jpg",
    audio: "imgs/audiolibros/molinoaudio1.mp3"
  },
   {
    title: "El ataque del molino (seccíon 2) ",
    author: "Émile Zola",
    description: "Un clásico para todas las edades.",
    image: "imgs/audiolibros/molino.jpg",
    audio: "imgs/audiolibros/molinoaudio2.mp3"
  },
   {
    title: "El ataque del molino (seccíon 3) ",
    author: "Émile Zola",
    description: "Un clásico para todas las edades.",
    image: "imgs/audiolibros/molino.jpg",
    audio: "imgs/audiolibros/molinoaudio3.mp3"
  },
   {
    title: "El ataque del molino (seccíon 4) ",
    author: "Émile Zola",
    description: "Un clásico para todas las edades.",
    image: "imgs/audiolibros/molino.jpg",
    audio: "imgs/audiolibros/molinoaudio4.mp3"
  },
  {
    title: "El ataque del molino (seccíon 5) ",
    author: "Émile Zola",
    description: "Un clásico para todas las edades.",
    image: "imgs/audiolibros/molino.jpg",
    audio: "imgs/audiolibros/molinoaudio5.mp3"
  },  
   {
    title: "El caballero Carmelo (seccíon 1) ",
    author: "Abraham Valdedomar Pinto",
    description: "Un clásico para todas las edades.",
    image: "imgs/audiolibros/caballero.jpg",
    audio: "imgs/audiolibros/caballeroaudio1.mp3"
  }, 
   {
    title: "El caballero Carmelo (seccíon 2) ",
    author: "Abraham Valdedomar Pinto",
    description: "Un clásico para todas las edades.",
    image: "imgs/audiolibros/caballero.jpg",
    audio: "imgs/audiolibros/caballeroaudio2.mp3"
  }, 
   {
    title: "El caballero Carmelo (seccíon 3) ",
    author: "Abraham Valdedomar Pinto",
    description: "Un clásico para todas las edades.",
    image: "imgs/audiolibros/caballero.jpg",
    audio: "imgs/audiolibros/caballeroaudio3.mp3"
  }, 
   {
    title: "El caballero Carmelo (seccíon 4) ",
    author: "Abraham Valdedomar Pinto",
    description: "Un clásico para todas las edades.",
    image: "imgs/audiolibros/caballero.jpg",
    audio: "imgs/audiolibros/caballeroaudio4.mp3"
  }, 
   {
    title: "El caballero Carmelo (seccíon 5) ",
    author: "Abraham Valdedomar Pinto",
    description: "Un clásico para todas las edades.",
    image: "imgs/audiolibros/caballero.jpg",
    audio: "imgs/audiolibros/caballeroaudio5.mp3"
  }, 
    {
    title: "Cuentos de Hadas (Caperucita Roja) ",
    author: "Jacob & Wihelm Grimm",
    description: "Un clásico para todas las edades.",
    image: "imgs/audiolibros/hadas.jpg",
    audio: "imgs/audiolibros/caperucitaroja.mp3"
  }, 
    {
    title: "Cuentos de Hadas (El Sastrecillo Valiente) ",
    author: "Jacob & Wihelm Grimm",
    description: "Un clásico para todas las edades.",
    image: "imgs/audiolibros/hadas.jpg",
    audio: "imgs/audiolibros/sastrecillo.mp3"
  }, 
    {
    title: "Cuentos de Hadas (El Rey Rana) ",
    author: "Jacob & Wihelm Grimm",
    description: "Un clásico para todas las edades.",
    image: "imgs/audiolibros/hadas.jpg",
    audio: "imgs/audiolibros/reyrana.mp3"
  }, 
    {
    title: "Cuentos de Hadas (Monte Simeli) ",
    author: "Jacob & Wihelm Grimm",
    description: "Un clásico para todas las edades.",
    image: "imgs/audiolibros/hadas.jpg",
    audio: "imgs/audiolibros/montesimeli.mp3"
  }, 
    {
    title: "Cuentos de Hadas (El Rey Pico de Tordo) ",
    author: "Jacob & Wihelm Grimm",
    description: "Un clásico para todas las edades.",
    image: "imgs/audiolibros/hadas.jpg",
    audio: "imgs/audiolibros/reypico.mp3"
  }, 

  
];


// Contenedor de audiolibros
const container = document.getElementById("audiobooks-container");

// Generar tarjetas dinámicamente
audiobooks.forEach(book => {
  const card = document.createElement("div");
  card.classList.add("audiobook");

  card.innerHTML = `
    <img src="${book.image}" alt="Portada ${book.title}">
    <h3>${book.title}</h3>
    <p><strong>${book.author}</strong></p>
    <p>${book.description}</p>
    <audio class="audioPlayer" controls>
      <source src="${book.audio}" type="audio/mp3">
      
    </audio>
  `;
  
  // Añadir el evento 'click' para que se lea el nombre del libro
  card.addEventListener('click', () => {
    announceAudiobook(book.title); // Anunciar el nombre del audiolibro
  });

  container.appendChild(card);
});

// Obtener todos los reproductores de audio con la clase 'audioPlayer'
const audioPlayers = document.querySelectorAll('.audioPlayer');

// Añadir un evento de reproducción a cada reproductor
audioPlayers.forEach(player => {
  player.addEventListener('play', () => {
    // Pausar todos los demás reproductores
    audioPlayers.forEach(otherPlayer => {
      if (otherPlayer !== player) {
        otherPlayer.pause(); // Detener los otros reproductores
      }
    });
  });
});