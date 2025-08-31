const options = [
  { emoji: "🌙", name: "la luna", label: "Botón con una luna" },
  { emoji: "🌞", name: "el sol", label: "Botón con un sol" },
  { emoji: "☁️", name: "la nube", label: "Botón con una nube" },
  { emoji: "🍎", name: "la manzana", label: "Botón con una manzana" },
  { emoji: "🐶", name: "el perrito", label: "Botón con un perrito" },
  { emoji: "🚗", name: "el carro", label: "Botón con un carro" },
  { emoji: "🌳", name: "el árbol", label: "Botón con un árbol" },
  { emoji: "🧸", name: "el oso de peluche", label: "Botón con un oso de peluche" },
  { emoji: "⚽", name: "el balón de fútbol", label: "Botón con un balón de fútbol" },
  { emoji: "🎈", name: "el globo", label: "Botón con un globo" },
];

const instruction = document.getElementById('instruction');
const buttonContainer = document.getElementById('button-container');
const feedback = document.getElementById('feedback');
const restartBtn = document.getElementById('restart-btn');

function startGame() {
  
  buttonContainer.innerHTML = '';
  feedback.textContent = '';
  restartBtn.style.display = 'none';

  
  const shuffled = [...options].sort(() => 0.5 - Math.random());
  const choices = shuffled.slice(0, 9);

 
  const correct = choices[Math.floor(Math.random() * choices.length)];

  
  instruction.textContent = `Haz clic en el botón con ${correct.name}`;

  
  choices.forEach(opt => {
    const btn = document.createElement('button');
    btn.classList.add('option');
    btn.setAttribute('aria-label', opt.label);
    btn.textContent = opt.emoji;

    btn.addEventListener('click', () => {
      if (opt === correct) {
        feedback.textContent = '¡Correcto! 🎉';
        restartBtn.style.display = 'inline-block';
      } else {
        feedback.textContent = 'Intenta de nuevo ❌';
      }
    });

    buttonContainer.appendChild(btn);
  });
}


restartBtn.addEventListener('click', startGame);


startGame();
