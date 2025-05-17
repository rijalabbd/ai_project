// app.js

// 0. Konfigurasi direktori gambar
const IMAGE_DIR = 'images';

// 1. Utility: slugify nama kartu → three_of_pentacles
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

// 2. State global
let tarotDeck = [];
let selectedReadingType = 1;
let shuffledCards = [];
let selectedCards = [];

// 3. Elemen DOM
const readingOptions   = document.querySelectorAll('.reading-option');
const shuffleButton    = document.getElementById('shuffle-button');
const cardsArea        = document.getElementById('cards-area');
const resultContainer  = document.getElementById('result-container');
const resultContent    = document.getElementById('result-content');
const newReadingButton = document.getElementById('new-reading');
const questionInput    = document.getElementById('question');

// 4. Load data dari tarot.json
fetch('tarot.json')
  .then(res => res.json())
  .then(data => { tarotDeck = data; })
  .catch(err => console.error('Gagal load tarot.json:', err));

// 5. Event Listeners
readingOptions.forEach(option => {
  option.addEventListener('click', () => {
    readingOptions.forEach(btn => btn.classList.remove('active'));
    option.classList.add('active');
    selectedReadingType = parseInt(option.getAttribute('data-cards'), 10);
  });
});
shuffleButton.addEventListener('click', setupReading);
newReadingButton.addEventListener('click', resetReading);

// 6. Fungsi utama

function setupReading() {
  if (!questionInput.value.trim()) {
    alert('Silakan masukkan pertanyaan atau fokus untuk pembacaan Anda terlebih dahulu.');
    return;
  }
  shuffledCards = shuffleCards(tarotDeck);
  renderCards(selectedReadingType);
  shuffleButton.style.display = 'none';
}

function shuffleCards(cards) {
  const arr = [...cards];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function renderCards(count) {
  cardsArea.innerHTML = '';
  selectedCards = [];

  for (let i = 0; i < count; i++) {
    const card = shuffledCards[i];
    const slug = slugify(card.name);
    const imgSrc = `${IMAGE_DIR}/${slug}.png`;

    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.dataset.index = i;
    cardEl.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back"></div>
        <div class="card-face card-front">
          <img
            src="${imgSrc}"
            alt="${card.name}"
            class="w-full h-auto rounded-md"
            onerror="this.src='${IMAGE_DIR}/placeholder.png';"
          />
          <h3 class="mt-2 text-center font-semibold text-white">${card.name}</h3>
        </div>
      </div>
    `;
    cardEl.addEventListener('click', () => flipCard(cardEl, card));
    cardsArea.appendChild(cardEl);
  }
}

function flipCard(cardEl, cardObj) {
  if (!cardEl.classList.contains('flipped')) {
    cardEl.classList.add('flipped');
    const isUpright = Math.random() < 0.5;
    selectedCards.push({ ...cardObj, isUpright });
    if (selectedCards.length === selectedReadingType) {
      setTimeout(generateReading, 800);
    }
  }
}

function generateReading() {
  const question = questionInput.value.trim();
  let readingHTML = '';

  if (selectedReadingType === 1) {
    readingHTML = generateSingleCardReading(question, selectedCards[0]);
  } else if (selectedReadingType === 3) {
    readingHTML = generateThreeCardReading(question, selectedCards);
  } else {
    readingHTML = generateCelticCrossReading(question, selectedCards);
  }

  resultContent.innerHTML = readingHTML;
  resultContainer.classList.remove('hidden');
  resultContainer.scrollIntoView({ behavior: 'smooth' });
}

function resetReading() {
  selectedCards = [];
  shuffledCards = [];
  cardsArea.innerHTML = '';
  resultContainer.classList.add('hidden');
  shuffleButton.style.display = 'inline-block';
  readingOptions.forEach(btn => btn.classList.remove('active'));
  questionInput.value = '';
}

// --- Rule-based text generators ---

function generateSingleCardReading(question, card) {
  const meaning = card.isUpright ? card.upright : card.reversed;
  const starters = [
    `Kartu "${card.name}" menunjukkan bahwa `,
    `Dengan "${card.name}", energi utama yang muncul adalah `,
    `"${card.name}" muncul sebagai jawaban atas pertanyaan Anda, ini berarti `,
  ];
  const insights = [
    `Anda sedang berada dalam fase yang berhubungan dengan ${meaning}.`,
    `Energi ${meaning} sangat kuat dalam situasi Anda.`,
    `Penting untuk memperhatikan aspek ${meaning} dalam hidup Anda.`,
  ];
  const advices = [
    `Cobalah untuk menerima energi ini dan biarkan ia membimbing Anda.`,
    `Pertimbangkan bagaimana Anda dapat menerapkan kualitas ini dalam situasi Anda saat ini.`,
    `Refleksikan bagaimana aspek ini mungkin memengaruhi keputusan Anda ke depan.`,
  ];
  const starter = randomPick(starters);
  const insight = randomPick(insights);
  const advice  = randomPick(advices);

  return `
    <p class="font-medium text-white mb-4"><strong>Pertanyaan:</strong> ${question}</p>
    <p class="mb-3">${starter}${insight}</p>
    <p class="mb-3">${advice}</p>
    <p>Kartu ini membawa pesan bahwa ${generateUniqueInsight(meaning)}.</p>
  `;
}

function generateThreeCardReading(question, cards) {
  const positions = ['Masa Lalu','Masa Sekarang','Masa Depan'];
  let html = `<p class="font-medium text-white mb-4"><strong>Pertanyaan:</strong> ${question}</p>`;
  html += `<p class="mb-4">Pembacaan 3 kartu Anda mewakili perjalanan masa lalu, sekarang, dan masa depan:</p>`;

  cards.forEach((card, idx) => {
    const posText = generatePositionalInsight(card, positions[idx]);
    html += `
      <div class="mb-4 p-3 bg-background bg-opacity-30 rounded-lg">
        <p class="font-semibold text-white"><strong>${positions[idx]} – ${card.name} (${card.isUpright ? 'Upright' : 'Reversed'}):</strong></p>
        <p>${posText}</p>
      </div>`;
  });

  html += `
    <div class="mt-6 p-4 bg-primary bg-opacity-20 rounded-lg">
      <p class="font-semibold text-white mb-2"><strong>Rangkuman:</strong></p>
      <p>${generateThreeCardSummary(cards)}</p>
    </div>`;
  return html;
}

function generateCelticCrossReading(question, cards) {
  const positions = ['Situasi Saat Ini','Tantangan','Masa Lalu','Masa Depan','Aspirasi'];
  let html = `<p class="font-medium text-white mb-4"><strong>Pertanyaan:</strong> ${question}</p>`;
  html += `<p class="mb-4">Pembacaan Celtic Cross memberikan pandangan mendalam tentang situasi Anda:</p>`;

  cards.forEach((card, idx) => {
    const pos = positions[idx] || `Posisi ${idx+1}`;
    const posText = generatePositionalInsight(card, pos);
    html += `
      <div class="mb-4 p-3 bg-background bg-opacity-30 rounded-lg">
        <p class="font-semibold text-white"><strong>${pos} – ${card.name} (${card.isUpright ? 'Upright' : 'Reversed'}):</strong></p>
        <p>${posText}</p>
      </div>`;
  });

  html += `
    <div class="mt-6 p-4 bg-primary bg-opacity-20 rounded-lg">
      <p class="font-semibold text-white mb-2"><strong>Rangkuman:</strong></p>
      <p>${generateCelticCrossSummary(cards)}</p>
    </div>`;
  return html;
}

// --- Helper insight generators ---

function generateUniqueInsight(meaning) {
  const opts = [
    `Anda perlu menemukan keseimbangan dalam aspek ${meaning}.`,
    `Waktunya untuk merangkul energi ${meaning} dengan lebih terbuka.`,
    `Kesadaran akan pentingnya ${meaning} dapat membuka pintu baru bagi Anda.`,
    `Memahami makna ${meaning} dalam konteks situasi Anda akan memberikan wawasan berharga.`,
  ];
  return randomPick(opts);
}

function generatePositionalInsight(card, pos) {
const m = card.isUpright ? card.upright : card.reversed;
  switch (pos) {
    case 'Masa Lalu':      return `Pengalaman masa lalu yang berkaitan dengan ${m} membentuk situasi Anda saat ini.`;
    case 'Masa Sekarang':  return `Saat ini Anda sedang mengalami energi ${m}, yang memengaruhi keputusan dan perasaan Anda.`;
    case 'Masa Depan':     return `Ke depannya, aspek ${m} akan menjadi penting dalam perjalanan Anda.`;
    case 'Situasi Saat Ini': return `Inti dari situasi Anda berkaitan dengan energi ${m}.`;
    case 'Tantangan':      return `Tantangan yang Anda hadapi berhubungan dengan aspek ${m}.`;
    case 'Aspirasi':       return `Harapan atau keinginan bawah sadar Anda terkait dengan energi ${m}.`;
    default:               return `Energi ${m} sangat penting untuk diperhatikan dalam konteks ${pos}.`;
  }
}

function generateThreeCardSummary(cards) {
  const   themes = cards.map(card => card.isUpright ? card.upright : card.reversed);
  return `Perjalanan Anda dipengaruhi oleh ${themes[0]} di masa lalu, dihadapkan oleh ${themes[1]} saat ini, dan mengarah pada ${themes[2]} di masa depan.`;
}

function generateCelticCrossSummary(cards) {
  const summary = cards.slice(0, 5).map(card => card.isUpright ? card.upright : card.reversed).join(', ');
  return `Inti pembacaan Anda mencakup tema: ${summary}. Ini menggambarkan dinamika yang sedang Anda alami secara menyeluruh.`;
}

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
