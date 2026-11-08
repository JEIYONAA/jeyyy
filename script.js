
/* =====================================
   MUSLIM CILIK PIXEL ADVENTURE
===================================== */

// HALAMAN
const home = document.getElementById("home");
const menu = document.getElementById("menu");
const quiz = document.getElementById("quiz");
const finish = document.getElementById("finish");

const nameInput = document.getElementById("playerName");

let playerName = "";
let score = 0;
let currentQuestion = 0;
let activeQuestions = [];

// =====================================
// AUDIO SYSTEM
// =====================================

let audioContext = null;
let soundEnabled = true;
let musicTimer = null;
let musicStep = 0;

const melody = [
  523, 659, 784, 659,
  587, 698, 880, 698,
  523, 659, 784, 880,
  784, 659, 587, 523
];

function setupAudio() {
  if (!audioContext) {
    audioContext = new (
      window.AudioContext ||
      window.webkitAudioContext
    )();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

function playTone(
  frequency,
  duration = 0.2,
  type = "sine",
  volume = 0.06
) {
  if (!soundEnabled) return;

  setupAudio();

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;

  gain.gain.setValueAtTime(
    0.001,
    audioContext.currentTime
  );

  gain.gain.linearRampToValueAtTime(
    volume,
    audioContext.currentTime + 0.03
  );

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
  if (!soundEnabled || musicTimer) return;

  setupAudio();
  musicStep = 0;

  musicTimer = setInterval(() => {
    if (!soundEnabled) return;

    const note = melody[musicStep];

    playTone(note, 0.22, "triangle", 0.025);

    if (musicStep % 4 === 0) {
      playTone(note / 2, 0.35, "sine", 0.012);
    }

    musicStep = (musicStep + 1) % melody.length;

  }, 280);
}

function stopMusic() {
  clearInterval(musicTimer);
  musicTimer = null;
}

// SOUND EFFECT

function clickSound() {
  playTone(700, 0.09);
}

function startSound() {
  playTone(440, 0.12);
  setTimeout(() => playTone(660, 0.2), 130);
}

function correctSound() {
  playTone(523, 0.15);
  setTimeout(() => playTone(659, 0.15), 120);
  setTimeout(() => playTone(784, 0.3), 240);
}

function wrongSound() {
  playTone(280, 0.2, "triangle", 0.04);
  setTimeout(() => playTone(220, 0.25, "triangle", 0.04), 170);
}

function victorySound() {
  [523, 659, 784, 1046].forEach((note, index) => {
    setTimeout(() => {
      playTone(note, 0.4, "sine", 0.08);
    }, index * 180);
  });
}

// TOMBOL MUSIK

const soundButton = document.getElementById("soundToggle");

soundButton.addEventListener("click", () => {
  soundEnabled = !soundEnabled;

  if (soundEnabled) {
    soundButton.textContent = "🔊 SUARA ON";
    setupAudio();
    startMusic();
    clickSound();
  } else {
    soundButton.textContent = "🔇 SUARA OFF";
    stopMusic();
  }
});

// =====================================
// DATABASE PERTANYAAN
// =====================================

const questions = {

  salam: [
    {
      icon: "👋",
      question: "Apa ucapan saat bertemu teman Muslim?",
      answers: [
        "Halo saja",
        "Assalamu'alaikum",
        "Selamat tidur",
        "Dadah"
      ],
      correct: 1
    },
    {
      icon: "🤲",
      question: "Apa jawaban salam?",
      answers: [
        "Wa'alaikumussalam",
        "Terima kasih",
        "Selamat pagi",
        "Sampai jumpa"
      ],
      correct: 0
    },
    {
      icon: "🍚",
      question: "Sebelum makan kita membaca apa?",
      answers: [
        "Alhamdulillah",
        "Bismillah",
        "Astaghfirullah",
        "Selamat malam"
      ],
      correct: 1
    }
  ],

  islam: [
    {
      icon: "🕌",
      question: "Apa agama kita?",
      answers: [
        "Islam",
        "Kristen",
        "Hindu",
        "Buddha"
      ],
      correct: 0
    },
    {
      icon: "📖",
      question: "Apa kitab suci umat Islam?",
      answers: [
        "Koran",
        "Al-Qur'an",
        "Buku cerita",
        "Majalah"
      ],
      correct: 1
    },
    {
      icon: "🌙",
      question: "Siapa Tuhan umat Islam?",
      answers: [
        "Malaikat",
        "Nabi",
        "Allah",
        "Manusia"
      ],
      correct: 2
    }
  ],

  ibadah: [
    {
      icon: "🕌",
      question: "Berapa kali salat wajib sehari?",
      answers: [
        "1 kali",
        "3 kali",
        "5 kali",
        "10 kali"
      ],
      correct: 2
    },
    {
      icon: "💧",
      question: "Sebelum salat kita melakukan apa?",
      answers: [
        "Makan",
        "Wudu",
        "Tidur",
        "Bermain"
      ],
      correct: 1
    },
    {
      icon: "🤲",
      question: "Saat berdoa kita mengangkat apa?",
      answers: [
        "Kaki",
        "Tangan",
        "Buku",
        "Sepatu"
      ],
      correct: 1
    }
  ],

  akhlak: [
    {
      icon: "💖",
      question: "Jika teman jatuh, kita harus?",
      answers: [
        "Menertawakan",
        "Membantu",
        "Meninggalkan",
        "Marah"
      ],
      correct: 1
    },
    {
      icon: "😊",
      question: "Jika diberi sesuatu, kita mengucapkan?",
      answers: [
        "Terima kasih",
        "Pergi",
        "Diam",
        "Tidak mau"
      ],
      correct: 0
    },
    {
      icon: "👨‍👩‍👧",
      question: "Bagaimana sikap kepada orang tua?",
      answers: [
        "Membentak",
        "Tidak peduli",
        "Hormat dan sayang",
        "Marah"
      ],
      correct: 2
    }
  ]

};

// =====================================
// NAVIGASI HALAMAN
// =====================================

function showScreen(screen) {

  [home, menu, quiz, finish].forEach(item => {
    item.classList.add("hidden");
  });

  screen.classList.remove("hidden");
}

// =====================================
// MULAI GAME
// =====================================

document.getElementById("startBtn").addEventListener("click", () => {

  playerName = nameInput.value.trim();

  if (!playerName) {
    alert("Isi namamu dulu ya! 😊");
    nameInput.focus();
    return;
  }

  setupAudio();
  startSound();

  document.getElementById("welcomeName").textContent =
    "Halo, " + playerName + "! 🌟";

  showScreen(menu);

  startMusic();

});

// =====================================
// PILIH KATEGORI
// =====================================

document.querySelectorAll(".level-card").forEach(button => {

  button.addEventListener("click", () => {

    const category = button.dataset.category;

    activeQuestions = questions[category];

    currentQuestion = 0;
    score = 0;

    updateScore();

    clickSound();

    showScreen(quiz);

    showQuestion();

  });

});

// =====================================
// TAMPILKAN PERTANYAAN
// =====================================

function showQuestion() {

  const q = activeQuestions[currentQuestion];

  document.getElementById("questionIcon").textContent =
    q.icon;

  document.getElementById("questionText").textContent =
    q.question;

  document.getElementById("questionNumber").textContent =
    `${currentQuestion + 1}/${activeQuestions.length}`;

  const answerContainer =
    document.getElementById("answers");

  answerContainer.innerHTML = "";

  document.getElementById("feedback").textContent = "";

  document.getElementById("nextBtn").classList.add("hidden");

  q.answers.forEach((answer, index) => {

    const button = document.createElement("button");

    button.className = "answer-btn";
    button.textContent = answer;

    button.addEventListener("click", () => {
      checkAnswer(index, button);
    });

    answerContainer.appendChild(button);

  });

}

// =====================================
// PERIKSA JAWABAN
// =====================================

function checkAnswer(selected, button) {

  const q = activeQuestions[currentQuestion];

  const allButtons =
    document.querySelectorAll(".answer-btn");

  allButtons.forEach(btn => {
    btn.disabled = true;
  });

  if (selected === q.correct) {

    score += 10;

    button.classList.add("correct");

    document.getElementById("feedback").textContent =
      "🎉 MASYAALLAH! BENAR SEKALI! ⭐";

    correctSound();

  } else {

    button.classList.add("wrong");

    allButtons[q.correct].classList.add("correct");

    document.getElementById("feedback").textContent =
      "💖 Tidak apa-apa! Yuk belajar lagi!";

    wrongSound();

  }

  updateScore();

  document.getElementById("nextBtn").classList.remove("hidden");

}

// =====================================
// UPDATE NILAI
// =====================================

function updateScore() {

  document.getElementById("score").textContent =
    "⭐ " + score;

  document.getElementById("quizScore").textContent =
    "⭐ " + score;

}

// =====================================
// LANJUT PERTANYAAN
// =====================================

document.getElementById("nextBtn").addEventListener("click", () => {

  currentQuestion++;

  clickSound();

  if (currentQuestion < activeQuestions.length) {

    showQuestion();

  } else {

    showFinish();

  }

});

// =====================================
// HALAMAN HASIL
// =====================================

function showFinish() {

  showScreen(finish);

  document.getElementById("finalMessage").textContent =
    `Hebat ${playerName}! Kamu mendapat ${score} poin!`;

  const stars = Math.round(score / 10);

  document.getElementById("finalStars").textContent =
    "⭐".repeat(stars) + "☆".repeat(3 - stars);

  victorySound();

}

// =====================================
// KEMBALI KE MENU
// =====================================

document.getElementById("backBtn").addEventListener("click", () => {

  clickSound();

  showScreen(menu);

});

// =====================================
// MAIN LAGI
// =====================================

document.getElementById("againBtn").addEventListener("click", () => {

  currentQuestion = 0;
  score = 0;

  updateScore();

  startSound();

  showScreen(quiz);

  showQuestion();

});

// =====================================
// MENU UTAMA
// =====================================

document.getElementById("homeBtn").addEventListener("click", () => {

  clickSound();

  showScreen(menu);

});
