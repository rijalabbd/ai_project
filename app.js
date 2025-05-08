// Variabel global
let selectedReadingType = 1;
let shuffledCards = [];
let selectedCards = [];

// Elemen DOM
const readingOptions = document.querySelectorAll('.reading-option');
const shuffleButton = document.getElementById('shuffle-button');
const cardsArea = document.getElementById('cards-area');
const resultContainer = document.getElementById('result-container');
const resultContent = document.getElementById('result-content');
const newReadingButton = document.getElementById('new-reading');
const questionInput = document.getElementById('question');

// Event Listeners
readingOptions.forEach(option => {
    option.addEventListener('click', () => {
        readingOptions.forEach(btn => btn.classList.remove('active'));
        option.classList.add('active');
        selectedReadingType = parseInt(option.getAttribute('data-cards'));
    });
});

shuffleButton.addEventListener('click', setupReading);
newReadingButton.addEventListener('click', resetReading);

// Fungsi-fungsi
function setupReading() {
    if (!questionInput.value.trim()) {
        alert('Silakan masukkan pertanyaan atau fokus untuk pembacaan Anda terlebih dahulu.');
        return;
    }
    
    shuffledCards = shuffleCards(tarotCards);
    renderCards(selectedReadingType);
    shuffleButton.style.display = 'none';
}

function shuffleCards(cards) {
    const cardsCopy = [...cards];
    
    for (let i = cardsCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardsCopy[i], cardsCopy[j]] = [cardsCopy[j], cardsCopy[i]];
    }
    
    return cardsCopy;
}

function renderCards(count) {
    cardsArea.innerHTML = '';
    selectedCards = [];
    
    for (let i = 0; i < count; i++) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = i;
        
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-back"></div>
                <div class="card-face card-front">
                    <div class="card-image">${shuffledCards[i].symbol}</div>
                    <div class="text-tertiary font-semibold text-center mt-1">${shuffledCards[i].name}</div>
                    <div class="text-textLight text-xs text-center mt-1">${shuffledCards[i].meaning}</div>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => flipCard(card, i));
        cardsArea.appendChild(card);
    }
}

function flipCard(card, index) {
    if (!card.classList.contains('flipped')) {
        card.classList.add('flipped');
        selectedCards.push(shuffledCards[index]);
        
        if (selectedCards.length === selectedReadingType) {
            setTimeout(generateReading, 1000);
        }
    }
}

function generateReading() {
    const question = questionInput.value.trim();
    let readingText = '';
    
    // Logika AI sederhana untuk menghasilkan pembacaan
    if (selectedReadingType === 1) {
        readingText = generateSingleCardReading(question, selectedCards[0]);
    } else if (selectedReadingType === 3) {
        readingText = generateThreeCardReading(question, selectedCards);
    } else {
        readingText = generateCelticCrossReading(question, selectedCards);
    }
    
    resultContent.innerHTML = readingText;
    resultContainer.classList.remove('hidden');
    
    // Scroll ke hasil
    resultContainer.scrollIntoView({ behavior: 'smooth' });
}

function generateSingleCardReading(question, card) {
    const sentenceStarters = [
        `Kartu "${card.name}" menunjukkan bahwa `,
        `Dengan "${card.name}", energi utama yang muncul adalah `,
        `"${card.name}" muncul sebagai jawaban atas pertanyaan Anda, ini berarti `
    ];
    
    const insights = [
        `saat ini Anda sedang berada dalam fase yang berhubungan dengan ${card.meaning.toLowerCase()}.`,
        `energi ${card.meaning.toLowerCase()} sangat kuat dalam situasi Anda.`,
        `penting untuk memperhatikan aspek ${card.meaning.toLowerCase()} dalam hidup Anda.`
    ];
    
    const advice = [
        `Cobalah untuk menerima energi ini dan biarkan ia membimbing Anda.`,
        `Pertimbangkan bagaimana Anda dapat menerapkan kualitas ini dalam situasi Anda saat ini.`,
        `Refleksikan bagaimana aspek ini mungkin memengaruhi keputusan Anda ke depan.`
    ];
    
    const starter = sentenceStarters[Math.floor(Math.random() * sentenceStarters.length)];
    const insight = insights[Math.floor(Math.random() * insights.length)];
    const adviceText = advice[Math.floor(Math.random() * advice.length)];
    
    return `
        <p class="font-medium text-white mb-4"><strong>Pertanyaan:</strong> ${question}</p>
        <p class="mb-3">${starter}${insight}</p>
        <p class="mb-3">${adviceText}</p>
        <p>Kartu ini membawa pesan bahwa ${generateUniqueInsight(card)}.</p>
    `;
}

function generateThreeCardReading(question, cards) {
    const positions = ['Masa Lalu', 'Masa Sekarang', 'Masa Depan'];
    let reading = `<p class="font-medium text-white mb-4"><strong>Pertanyaan:</strong> ${question}</p>`;
    
    reading += `<p class="mb-4">Pembacaan 3 kartu Anda mewakili perjalanan dari masa lalu, melalui masa sekarang, menuju ke masa depan:</p>`;
    
    cards.forEach((card, index) => {
        reading += `
            <div class="mb-4 p-3 bg-background bg-opacity-30 rounded-lg">
                <p class="font-semibold text-white"><strong>${positions[index]} - ${card.name}:</strong></p>
                <p>${generatePositionalInsight(card, positions[index])}</p>
            </div>
        `;
    });
    
    reading += `
        <div class="mt-6 p-4 bg-primary bg-opacity-20 rounded-lg">
            <p class="font-semibold text-white mb-2"><strong>Rangkuman:</strong></p>
            <p>${generateThreeCardSummary(cards)}</p>
        </div>
    `;
    
    return reading;
}

function generateCelticCrossReading(question, cards) {
    const positions = [
        'Situasi Saat Ini', 
        'Tantangan', 
        'Masa Lalu', 
        'Masa Depan', 
        'Aspirasi'
    ];
    
    let reading = `<p class="font-medium text-white mb-4"><strong>Pertanyaan:</strong> ${question}</p>`;
    
    reading += `<p class="mb-4">Pembacaan Celtic Cross memberikan pandangan mendalam tentang situasi Anda:</p>`;
    
    cards.forEach((card, index) => {
        reading += `
            <div class="mb-4 p-3 bg-background bg-opacity-30 rounded-lg">
                <p class="font-semibold text-white"><strong>${positions[index]} - ${card.name}:</strong></p>
                <p>${generatePositionalInsight(card, positions[index])}</p>
            </div>
        `;
    });
    
    reading += `
        <div class="mt-6 p-4 bg-primary bg-opacity-20 rounded-lg">
            <p class="font-semibold text-white mb-2"><strong>Rangkuman:</strong></p>
            <p>${generateCelticCrossSummary(cards)}</p>
        </div>
    `;
    
    return reading;
}

function generateUniqueInsight(card) {
    const insights = [
        `Anda perlu menemukan keseimbangan dalam aspek ${card.meaning.toLowerCase()} dari hidup Anda`,
        `waktunya untuk merangkul energi ${card.meaning.toLowerCase()} dengan lebih terbuka`,
        `kesadaran akan pentingnya ${card.meaning.toLowerCase()} dapat membuka pintu baru bagi Anda`,
        `memahami makna ${card.meaning.toLowerCase()} dalam konteks situasi Anda akan memberikan wawasan berharga`
    ];
    
    return insights[Math.floor(Math.random() * insights.length)];
}

function generatePositionalInsight(card, position) {
    if (position === 'Masa Lalu') {
        return `Pengalaman masa lalu yang berkaitan dengan ${card.meaning.toLowerCase()} membentuk situasi Anda saat ini.`;
    } else if (position === 'Masa Sekarang') {
        return `Saat ini Anda sedang mengalami energi ${card.meaning.toLowerCase()}, yang memengaruhi keputusan dan perasaan Anda.`;
    } else if (position === 'Masa Depan') {
        return `Ke depannya, aspek ${card.meaning.toLowerCase()} akan menjadi penting dalam perjalanan Anda.`;
    } else if (position === 'Situasi Saat Ini') {
        return `Inti dari situasi Anda berkaitan dengan energi ${card.meaning.toLowerCase()}.`;
    } else if (position === 'Tantangan') {
        return `Tantangan yang Anda hadapi berhubungan dengan aspek ${card.meaning.toLowerCase()}.`;
    } else if (position === 'Aspirasi') {
        return `Harapan atau keinginan bawah sadar Anda terkait dengan energi ${card.meaning.toLowerCase()}.`;
    }
    
    return `Energi ${card.meaning.toLowerCase()} sangat penting untuk diperhatikan.`;
}

function generateThreeCardSummary(cards) {
    return `Perjalanan Anda menunjukkan transformasi dari ${cards[0].meaning.toLowerCase()}, melalui ${cards[1].meaning.toLowerCase()}, menuju ${cards[2].meaning.toLowerCase()}. Perhatikan bagaimana ketiga energi ini saling berhubungan dan memberikan wawasan tentang situasi Anda.`;
}

function generateCelticCrossSummary(cards) {
    return `Pembacaan ini menunjukkan bahwa situasi Anda dipengaruhi oleh interaksi antara ${cards[0].meaning.toLowerCase()} dan ${cards[1].meaning.toLowerCase()}. Pengalaman masa lalu berkaitan dengan ${cards[2].meaning.toLowerCase()} akan memengaruhi bagaimana Anda bergerak menuju masa depan yang menunjukkan energi ${cards[3].meaning.toLowerCase()}. Aspirasi Anda terhubung dengan ${cards[4].meaning.toLowerCase()}.`;
}

function resetReading() {
    cardsArea.innerHTML = '';
    resultContainer.classList.add('hidden');
    shuffleButton.style.display = 'block';
    selectedCards = [];
}