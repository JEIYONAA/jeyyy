
// ==========================================
// PIXEL QUIZ ADVENTURE - ISLAMIC QUIZ
// ==========================================

// 1. DAFTAR PERTANYAAN
const questions = [
    {
        question: "Siapa nabi terakhir dalam agama Islam?",
        answers: [
            "Nabi Ibrahim AS",
            "Nabi Musa AS",
            "Nabi Muhammad SAW",
            "Nabi Isa AS"
        ],
        correct: 2
    },
    {
        question: "Berapa jumlah rukun Islam?",
        answers: [
            "3",
            "4",
            "5",
            "6"
        ],
        correct: 2
    },
    {
        question: "Apa kitab suci umat Islam?",
        answers: [
            "Taurat",
            "Injil",
            "Zabur",
            "Al-Qur'an"
        ],
        correct: 3
    },
    {
        question: "Pada bulan apa umat Islam wajib berpuasa?",
        answers: [
            "Syawal",
            "Ramadan",
            "Muharram",
            "Rajab"
        ],
        correct: 1
    },
    {
        question: "Ke arah manakah umat Islam menghadap saat salat?",
        answers: [
            "Masjid Nabawi",
            "Masjidil Aqsa",
            "Ka'bah",
            "Gunung Uhud"
        ],
        correct: 2
    }
];


// ==========================================
// 2. VARIABEL GAME
// ==========================================

let currentQuestion = 0;
let score = 0;
let player = "Player";


// ==========================================
// 3. SISTEM SOUND 8-BIT
// ==========================================

let audioContext = null;
let soundEnabled = true;
let musicTimer = null;
let musicStep = 0;

const melody = [
    523, 659, 784, 659,
    587, 698, 880, 698,
    523, 659, 784, 1047,
    784, 659, 587, 523
];

function initAudio() {
    if (!audioContext) {
        audioContext = new (
            window.AudioContext || window.webkitAudioContext
        )();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
}

function playTone(frequency, duration, type = "square", volume = 0.05) {
    if (!soundEnabled || !audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(volume, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}


// MUSIK LATAR
function startMusic() {
    if (!soundEnabled || musicTimer !== null) return;

    musicTimer = setInterval(() => {
        if (!soundEnabled) return;

        playTone(melody[musicStep], 0.15, "square", 0.018);

        musicStep = (musicStep + 1) % melody.length;
    }, 190);
}

function stopMusic() {
    if (musicTimer !== null) {
        clearInterval(musicTimer);
        musicTimer = null;
    }
}


// SUARA JAWABAN BENAR
function correctSound() {
    playTone(660, 0.12);
    setTimeout(() => playTone(880, 0.18), 120);
}


// SUARA JAWABAN SALAH
function wrongSound() {
    playTone(180, 0.3, "sawtooth", 0.06);
}


// SUARA KEMENANGAN
function victorySound() {
    [523, 659, 784, 1047].forEach((note, index) => {
        setTimeout(() => {
            playTone(note, 0.25);
        }, index * 180);
    });
}


// TOMBOL SOUND ON/OFF
function toggleSound() {
    soundEnabled = !soundEnabled;

    const button = document.getElementById("soundToggle");

    if (button) {
        button.textContent = soundEnabled
            ? "SOUND: ON"
            : "SOUND: OFF";
    }

    if (soundEnabled) {
        initAudio();
        startMusic();
    } else {
        stopMusic();
    }
}


// ==========================================
// 4. SISTEM PERPINDAHAN SLIDE
// ==========================================

function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    document.getElementById(screenId).classList.add("active");
}


// ==========================================
// 5. MEMULAI GAME
// ==========================================

function startGame() {
    const nameInput = document.getElementById("playerName").value.trim();

    player = nameInput || "Player";

    currentQuestion = 0;
    score = 0;

    initAudio();
    startMusic();

    showScreen("quiz");
    showQuestion();
}


// ==========================================
// 6. MENAMPILKAN PERTANYAAN
// ==========================================

function showQuestion() {
    const q = questions[currentQuestion];

    document.getElementById("progress").textContent =
        `QUESTION ${currentQuestion + 1} / ${questions.length}`;

    document.getElementById("question").textContent = q.question;

    document.getElementById("feedback").textContent = "";

    const answersContainer = document.getElementById("answers");

    answersContainer.innerHTML = "";

    q.answers.forEach((answer, index) => {
        const button = document.createElement("button");

        button.textContent = answer;

        button.onclick = () => checkAnswer(index);

        answersContainer.appendChild(button);
    });
}


// ==========================================
// 7. MEMERIKSA JAWABAN
// ==========================================

function checkAnswer(selected) {
    const buttons = document.querySelectorAll("#answers button");

    // Mencegah jawaban diklik berkali-kali
    buttons.forEach(button => {
        button.disabled = true;
    });

    if (selected === questions[currentQuestion].correct) {
        score += 100;

        document.getElementById("feedback").textContent =
            "CORRECT! +100 POINTS";

        correctSound();
    } else {
        document.getElementById("feedback").textContent =
            "WRONG ANSWER!";

        wrongSound();
    }

    currentQuestion++;

    setTimeout(() => {
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            showResult();
        }
    }, 700);
}


// ==========================================
// 8. HASIL AKHIR
// ==========================================

function showResult() {
    stopMusic();

    showScreen("result");

    document.getElementById("finalScore").textContent =
        `${player}, YOUR SCORE: ${score} / 500`;

    victorySound();
}


// ==========================================
// 9. PILIHAN ENDING
// ==========================================

function chooseEnding(choice) {
    const messages = {
        Explorer: "THE EXPLORER! Kamu berani menjelajahi dunia baru!",
        Scholar: "THE SCHOLAR! Teruslah mencari ilmu dan pengetahuan!",
        Hero: "THE HERO! Jadilah pribadi yang baik dan pantang menyerah!"
    };

    document.getElementById("ending").textContent =
        messages[choice];

    document.getElementById("choices").style.display = "none";

    document.getElementById("exitPrompt").style.display = "block";
}


// ==========================================
// 10. KELUAR DARI PERMAINAN
// ==========================================

function exitGame() {
    stopMusic();

    document.getElementById("exitPrompt").style.display = "none";

    document.getElementById("ending").textContent = "";

    document.getElementById("exitMessage").textContent =
        "THANK YOU FOR PLAYING! YOU CAN CLOSE THIS TAB NOW.";
}


// ==========================================
// 11. MAIN LAGI
// ==========================================

function playAgain() {
    currentQuestion = 0;
    score = 0;
    player = "Player";

    document.getElementById("playerName").value = "";

    document.getElementById("choices").style.display = "block";

    document.getElementById("exitPrompt").style.display = "none";

    document.getElementById("ending").textContent = "";

    document.getElementById("exitMessage").textContent = "";

    stopMusic();

    showScreen("opening");
}
