/* =========================================================
   데이트 신청 페이지 - 스크립트
   ========================================================= */

/* 사용자의 모든 선택을 담는 객체 */
const answers = {
  date: null,        // "2026-06-15"
  time: null,        // "19:30"
  place: null,       // "성수 / 서울숲" (추가)
  food: null,        // "🍣 스시"
  accepted: true,
  createdAt: null,
};

/* ---------- 단계 전환 ---------- */
function goStep(n) {
  document.querySelectorAll(".step").forEach((el) => el.classList.remove("is-active"));
  const target = document.getElementById("step" + n);
  if (target) target.classList.add("is-active");

  const no = document.getElementById("noBtn");
  if (no) no.style.display = n === 1 ? "" : "none";
}

/* =========================================================
   1단계: 좋아 / 싫어(도망)
   ========================================================= */
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

yesBtn.addEventListener("click", () => {
  goStep(2);
  setTimeout(launchConfetti, 150);
});

let noPlaceholder = null;

function moveNoButton(cx, cy) {
  if (!noBtn.classList.contains("is-running")) {
    const w = noBtn.offsetWidth;
    const h = noBtn.offsetHeight;
    noPlaceholder = document.createElement("span");
    noPlaceholder.style.display = "inline-block";
    noPlaceholder.style.width = w + "px";
    noPlaceholder.style.height = h + "px";
    noBtn.parentNode.insertBefore(noPlaceholder, noBtn);

    noBtn.classList.add("is-running");
    document.body.appendChild(noBtn);
  }
  const pad = 12;
  const bw = noBtn.offsetWidth;
  const bh = noBtn.offsetHeight;
  const maxX = window.innerWidth - bw - pad;
  const maxY = window.innerHeight - bh - pad;

  let x, y;
  if (typeof cx === "number" && typeof cy === "number") {
    const rect = noBtn.getBoundingClientRect();
    const bcx = rect.left + bw / 2;
    const bcy = rect.top + bh / 2;
    let dx = bcx - cx;
    let dy = bcy - cy;
    const dist = Math.hypot(dx, dy) || 1;
    const jump = 55 + Math.random() * 35;
    x = bcx + (dx / dist) * jump - bw / 2;
    y = bcy + (dy / dist) * jump - bh / 2;

    if (x < pad || x > maxX || y < pad || y > maxY) {
      const slide = (Math.random() < 0.5 ? -1 : 1) * (50 + Math.random() * 40);
      if (Math.abs(dx) > Math.abs(dy)) {
        y = bcy + slide - bh / 2;
        x = bcx + (dx >= 0 ? 1 : -1) * jump - bw / 2;
      } else {
        x = bcx + slide - bw / 2;
        y = bcy + (dy >= 0 ? 1 : -1) * jump - bh / 2;
      }
    }
  } else {
    x = Math.random() * maxX;
    y = Math.random() * maxY;
  }

  x = Math.min(Math.max(pad, x), maxX);
  y = Math.min(Math.max(pad, y), maxY);

  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
}

const DODGE_RADIUS = 55;
document.addEventListener("mousemove", (e) => {
  if (!document.getElementById("step1").classList.contains("is-active")) return;
  const rect = noBtn.getBoundingClientRect();
  const bcx = rect.left + rect.width / 2;
  const bcy = rect.top + rect.height / 2;
  const dist = Math.hypot(e.clientX - bcx, e.clientY - bcy);
  if (dist < DODGE_RADIUS) moveNoButton(e.clientX, e.clientY);
});

noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  const t = e.touches[0];
  moveNoButton(t.clientX, t.clientY);
}, { passive: false });

noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  moveNoButton();
});

/* =========================================================
   2단계: 수락 확인 + 컨페티
   ========================================================= */
const reallyYesBtn = document.getElementById("reallyYesBtn");
reallyYesBtn.addEventListener("click", () => goStep(3));

function launchConfetti() {
  const emojis = ["🎉", "🎊", "✨", "💖", "💕", "🌸"];
  for (let i = 0; i < 70; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.fontSize = 18 + Math.random() * 18 + "px";
    piece.style.animationDuration = 2.2 + Math.random() * 1.8 + "s";
    piece.style.animationDelay = Math.random() * 0.6 + "s";
    document.body.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }
}

/* =========================================================
   3단계: 날짜 / 시간 선택
   ========================================================= */
const dateInput = document.getElementById("dateInput");
const timeInput = document.getElementById("timeInput");
const dateNextBtn = document.getElementById("dateNextBtn");
const step3Hint = document.getElementById("step3Hint");

dateNextBtn.addEventListener("click", () => {
  if (!dateInput.value && !timeInput.value) {
    step3Hint.textContent = "날짜랑 시간을 골라줘야 만날 수 있어 🥺";
    return;
  }
  if (!dateInput.value) {
    step3Hint.textContent = "앗, 날짜를 안 골랐어! 📆";
    return;
  }
  if (!timeInput.value) {
    step3Hint.textContent = "앗, 시간을 안 골랐어! ⏰";
    return;
  }
  step3Hint.textContent = "";
  answers.date = dateInput.value;
  answers.time = timeInput.value;
  goStep(4); // 4단계(장소 선택)로 이동
});

/* =========================================================
   4단계: 장소 선택 (신규)
   ========================================================= */
const placeInput = document.getElementById("placeInput");
const placeNextBtn = document.getElementById("placeNextBtn");
const step4Hint = document.getElementById("step4Hint");

// 장소 칩 클릭 시 입력창에 값 채워넣기
document.querySelectorAll(".btn--chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    placeInput.value = chip.dataset.place;
    step4Hint.textContent = "";
  });
});

placeNextBtn.addEventListener("click", () => {
  const val = placeInput.value.trim();
  if (!val) {
    step4Hint.textContent = "어디서 볼지 정해줘! 🥺 (직접 적어도 좋아)";
    return;
  }
  step4Hint.textContent = "";
  answers.place = val;
  goStep(5); // 5단계(음식 선택)로 이동
});

/* =========================================================
   5단계: 음식 선택 (버튼 클릭 / 랜덤 / 직접 입력)
   ========================================================= */
const foodInput = document.getElementById("foodInput");
const foodCustomBtn = document.getElementById("foodCustomBtn");
const step5Hint = document.getElementById("step5Hint");

// 1) 그리드 음식 버튼 클릭 시
document.querySelectorAll(".btn--food").forEach((btn) => {
  btn.addEventListener("click", () => {
    answers.food = btn.dataset.food;
    showFinal();
  });
});

// 2) 랜덤 버튼 클릭 시
const randomFoodBtn = document.getElementById("randomFoodBtn");
if (randomFoodBtn) {
  randomFoodBtn.addEventListener("click", () => {
    const foodButtons = document.querySelectorAll(".btn--food");
    const randomIndex = Math.floor(Math.random() * foodButtons.length);
    const selectedFood = foodButtons[randomIndex].dataset.food;
    
    randomFoodBtn.textContent = "🎰 고르는 중...";
    setTimeout(() => {
      answers.food = selectedFood;
      showFinal();
      randomFoodBtn.textContent = "🎲 아무거나 골라줘!";
    }, 400);
  });
}

// 3) 직접 입력 처리 함수
function handleCustomFoodSubmit() {
  const val = foodInput.value.trim();
  if (!val) {
    step5Hint.textContent = "먹고 싶은 메뉴를 적어줘! 🥺";
    return;
  }
  step5Hint.textContent = "";
  // 사용자가 적은 메뉴 앞에 이모지가 없으면 깔끔하게 🍽️를 붙여줌
  answers.food = val.startsWith("🍽️") ? val : `🍽️ ${val}`;
  showFinal();
}

if (foodCustomBtn) {
  foodCustomBtn.addEventListener("click", handleCustomFoodSubmit);
}

// 키보드 엔터(Enter) 키 입력 시에도 바로 제출
if (foodInput) {
  foodInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCustomFoodSubmit();
    }
  });
}

/* =========================================================
   6단계: 최종 화면 (요약 + 떠다니는 하트)
   ========================================================= */
const finalTitle = document.getElementById("finalTitle");
const sumDate = document.getElementById("sumDate");
const sumTime = document.getElementById("sumTime");
const sumPlace = document.getElementById("sumPlace");
const sumFood = document.getElementById("sumFood");

function formatKoreanDate(value) {
  if (!value) return "-";
  const [y, m, d] = value.split("-");
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}

function showFinal() {
  answers.createdAt = new Date().toISOString();

  // 최종 안내 타이틀 (장소와 시간 반영)
  finalTitle.textContent =
    `서아랑 보는건 언제나 기대대❤️,\n${answers.time}에 ${answers.place} 에서 만나자! 🚶🏻‍♀️`;

  // 화면 요약 카드
  sumDate.textContent = formatKoreanDate(answers.date);
  sumTime.textContent = answers.time || "-";
  sumPlace.textContent = answers.place || "-";
  sumFood.textContent = answers.food || "-";

  // 이미지 캡처용 카드
  const capDate = document.getElementById("capDate");
  const capTime = document.getElementById("capTime");
  const capPlace = document.getElementById("capPlace");
  const capFood = document.getElementById("capFood");
  if (capDate) capDate.textContent = formatKoreanDate(answers.date);
  if (capTime) capTime.textContent = answers.time || "-";
  if (capPlace) capPlace.textContent = answers.place || "-";
  if (capFood) capFood.textContent = answers.food || "-";

  goStep(6); // 6단계(최종 화면) 표시
  startFloatingHearts();
}

let heartTimer = null;
function startFloatingHearts() {
  const layer = document.getElementById("floatingLayer");
  const hearts = ["💖", "💕", "💗", "🌸", "✨"];
  if (heartTimer) clearInterval(heartTimer);
  heartTimer = setInterval(() => {
    if (!document.getElementById("step6").classList.contains("is-active")) {
      clearInterval(heartTimer);
      heartTimer = null;
      return;
    }
    const h = document.createElement("span");
    h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    h.style.left = Math.random() * 100 + "vw";
    h.style.fontSize = 18 + Math.random() * 18 + "px";
    h.style.animationDuration = 4 + Math.random() * 3 + "s";
    layer.appendChild(h);
    h.addEventListener("animationend", () => h.remove());
  }, 450);
}

/* =========================================================
   답장 이미지 저장 & 직접 공유 (Web Share API)
   ========================================================= */
const saveBtn = document.getElementById("saveBtn");
const shareBtn = document.getElementById("shareBtn");
const saveHint = document.getElementById("saveHint");
const restartBtn = document.getElementById("restartBtn");
const captureStage = document.getElementById("captureStage");

function getCaptureBlob() {
  return new Promise((resolve, reject) => {
    if (typeof html2canvas !== "function") {
      return reject(new Error("html2canvas not loaded"));
    }
    html2canvas(captureStage, {
      backgroundColor: "#ffeef4",
      scale: 2,
      useCORS: true,
    })
      .then((canvas) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Blob 생성 실패"));
        }, "image/jpeg", 0.95);
      })
      .catch(reject);
  });
}

if (shareBtn) {
  shareBtn.addEventListener("click", async () => {
    saveHint.textContent = "공유 창 준비 중... 💌";
    try {
      const blob = await getCaptureBlob();
      const fileName = `데이트약속_${answers.date || "약속"}.jpg`;
      const file = new File([blob], fileName, { type: "image/jpeg" });

      const shareText = `우리 ${formatKoreanDate(answers.date)} ${answers.time}에 ${answers.place}에서 만나서 ${answers.food} 먹자! 💕`;

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "우리의 데이트 약속 💌",
          text: shareText,
        });
        saveHint.textContent = "공유 창이 열렸어! 💕";
      } else if (navigator.share) {
        await navigator.share({
          title: "우리의 데이트 약속 💌",
          text: shareText,
        });
        saveHint.textContent = "공유 완료! 💕";
      } else {
        saveHint.textContent = "직접 공유가 지원되지 않는 환경이라 '이미지 저장'을 눌러줘! 🥺";
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        saveHint.textContent = "공유 중 오류가 발생했어 😢 아래 '이미지 저장'을 이용해줘!";
      } else {
        saveHint.textContent = "";
      }
    }
  });
}

saveBtn.addEventListener("click", () => {
  if (typeof html2canvas !== "function") {
    saveHint.textContent = "이미지 저장 도구를 불러오지 못했어 😢";
    return;
  }
  saveHint.textContent = "이미지 만드는 중... 🎀";
  html2canvas(captureStage, {
    backgroundColor: "#ffeef4",
    scale: 2,
    useCORS: true,
  })
    .then((canvas) => {
      const jpg = canvas.toDataURL("image/jpeg", 0.95);
      const link = document.createElement("a");
      link.download = `데이트약속_${answers.date || "약속"}.jpg`;
      link.href = jpg;
      document.body.appendChild(link);
      link.click();
      link.remove();
      saveHint.textContent = "이미지 저장 완료! 이걸 답장으로 보내줘 💌";
    })
    .catch((err) => {
      saveHint.textContent = "저장에 실패했어 😢 다시 한 번 눌러줘";
    });
});

/* 다시하기 */
restartBtn.addEventListener("click", () => {
  answers.date = null;
  answers.time = null;
  answers.place = null;
  answers.food = null;
  answers.createdAt = null;

  dateInput.value = "";
  timeInput.value = "";
  placeInput.value = "";
  step3Hint.textContent = "";
  step4Hint.textContent = "";
  if (foodInput) foodInput.value = "";
  if (step5Hint) step5Hint.textContent = "";
  if (saveHint) saveHint.textContent = "";

  noBtn.classList.remove("is-running");
  noBtn.style.left = "";
  noBtn.style.top = "";
  document.getElementById("playground").appendChild(noBtn);
  if (noPlaceholder) {
    noPlaceholder.remove();
    noPlaceholder = null;
  }

  goStep(1);
});