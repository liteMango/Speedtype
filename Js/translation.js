// ---------------- TRANSLATION LOGIC ---------------------
const LECTO_API_KEY = "HQV0Q3X-HSZ4MA8-H78HQCX-QXWANF9";
const LECTO_ENDPOINT = "https://api.lecto.ai/v1/translate/text";
const UI_TEXTS = {
  "start-msg": "Start typing to begin!",
  tryAgainBtn: "Try Again",
  timerLeft: "Time Left:",
  mistakes: "Mistakes:",
  wpm: "WPM:",
  cpm: "CPM:",
  "end-done": "🎉 Well done! You finished typing the entire passage!",
  "end-timeout": "⏰ Time's up! Try again to improve your speed.",
};
// --------- 2000+ word content: --------------
const TYPING_PARAGRAPHS = [
  // Each string should be a paragraph, aim for about 300-400+ words per paragraph, repeat, and vary as needed
  // For brevity, only a few are pasted here. You'd want to paste 6-8 long paragraphs, real essays, etc.
  `In the rapidly evolving landscape of technology, it has become increasingly vital for individuals from all walks of life to familiarize themselves with the digital tools that are shaping our world. From communication and collaboration to innovation and creativity, technology serves as the backbone of modern civilization. Those who master the art of utilizing technology effectively not only thrive in their personal lives but also gain a competitive advantage in their professional pursuits. The pace at which technological advancements are occurring is truly staggering, with new developments emerging almost daily. This constant evolution necessitates a commitment to lifelong learning, as the skills that are relevant today may become obsolete tomorrow. As a result, individuals must cultivate an adaptable mindset, embracing change and seeking opportunities to expand their knowledge base. Whether it's learning to code, understanding data analytics, or leveraging artificial intelligence, those who are proactive in their pursuit of digital literacy will be well-positioned to succeed in the twenty-first century. Beyond personal and professional growth, technology also offers unprecedented opportunities for social impact. With the power to connect people across continents, amplify voices that might otherwise go unheard, and solve some of the world's most pressing challenges, technology holds immense potential to drive positive change. By harnessing the power of innovation and collaboration, we can build a brighter, more equitable future for all. Ultimately, the journey to mastering technology is not just about acquiring technical skills but also about cultivating the curiosity, resilience, and empathy needed to navigate an increasingly complex world.`,
  `Building a successful product in today's competitive market requires not just technical expertise, but also the ability to communicate clearly, collaborate effectively, and adapt to ever-changing circumstances. Developers must be willing to step outside their comfort zones, embracing new frameworks and programming languages as needed to deliver innovative solutions. Teams that foster a culture of openness and feedback are better equipped to identify potential pitfalls early and make the adjustments necessary to achieve their goals. This collaborative spirit is what drives progress, fueling creativity and ensuring that everyone feels invested in the outcome. One of the key lessons learned from working in high-performing teams is the importance of transparency and trust. `,
  `Continuous learning is at the heart of personal and professional growth in the technology industry. The rapid pace of change means that what was considered best practice just a few years ago may now be outdated or even obsolete. As a result, those who are serious about advancing their careers must make a habit of seeking out new information, experimenting with emerging tools, and reflecting on their experiences. This commitment to growth extends beyond technical skills; it also encompasses the development of soft skills such as communication, problem-solving, and emotional intelligence. By embracing a mindset of curiosity and experimentation, developers can stay ahead of the curve, anticipating changes in the industry and adapting their approaches as needed..`,

  `Effective time management is essential for achieving success both individually and as a team. By breaking large projects into smaller, more manageable tasks and setting clear priorities, professionals are able to maintain focus and momentum even when faced with competing demands. The ability to adapt to changing circumstances and re-evaluate priorities is a hallmark of effective leaders, who understand that flexibility is just as important as discipline. Regular reflection and adaptation help refine workflows and identify areas for improvement, enabling teams to continually optimize their performance. Time management is not just about productivity—it's also about maintaining a healthy work-life balance, preventing burnout, and ensuring that individuals have the energy and motivation to perform at their best. `,
  `The importance of accessibility in technology and design cannot be overstated. By considering the diverse needs of users, developers can create inclusive products that empower people of all abilities to participate fully in society. Accessibility is not just a technical requirement; it is a reflection of empathy and respect for all users. From implementing keyboard navigation and screen reader compatibility to designing interfaces with high contrast and readable fonts, every decision made in the development process has an impact on user experience. The most successful products are those that prioritize accessibility from the outset, embedding it into the core of their design philosophy. `,
  `High-performing teams understand the value of transparency, trust, and open communication. These qualities form the foundation of a collaborative environment where creativity thrives and innovation flourishes. Open discussions, knowledge sharing, and constructive feedback encourage team members to push boundaries and experiment with new ideas. When challenges arise, resilient teams work together to adapt and overcome obstacles, supporting each other through periods of uncertainty and change. Leadership plays a critical role in fostering this culture, setting the tone for how success is defined and celebrated. By recognizing and rewarding contributions, leaders build morale and motivate teams to reach new heights.`,
  `User experience is the cornerstone of every successful application. Designers and developers work hand-in-hand to craft intuitive interfaces that provide seamless interactions from start to finish. By listening to user feedback and observing real-world usage patterns, products can be continually refined and improved to better meet the needs of their audiences. The best user experiences are those that anticipate potential pain points and proactively address them, minimizing friction and maximizing satisfaction.`,
  `Embracing failure as a learning opportunity is essential for growth, both at the individual and organizational level. Every mistake, setback, or challenge encountered on the journey provides valuable insights that can be leveraged to develop better solutions in the future. Organizations that encourage a culture of experimentation and risk-taking are more likely to innovate and adapt to changing market conditions. Rather than viewing failure as a negative outcome, it should be seen as a stepping stone on the path to success. By analyzing what went wrong and identifying lessons learned, teams can improve their processes and avoid repeating the same mistakes.`,
  // Add more text as needed for desired length.
];
// ----------------- END of PARAGRAPHS ---------------------

// UI references
const langSelect = document.getElementById("lang-select");
const typingText = document.getElementById("paragraph");
const startMsg = document.getElementById("start-msg");
const endMsg = document.getElementById("end-msg");
const tryAgainBtn = document.getElementById("tryAgainBtn");
const mistakeTag = document.querySelector(".mistake span");
const wpmTag = document.querySelector(".wpm span");
const cpmTag = document.querySelector(".cpm span");
const visualTimer = document.getElementById("visual-timer");
const inContainerTimer = document.querySelector(".timer-in-container");
const loader = document.getElementById("loader");
const typingContainer = document.getElementById("typing-container");

// Typing test state
let maxTime = 60;
let timeLeft = maxTime;
let timer = null;
let charIndex = 0,
  mistakes = 0,
  isTyping = false,
  finished = false;
let timerPresetValue = 30;
let timerPresetUnit = "minutes";
let currentWordSpans = [];
let currentChars = [];
let currentText = "";
let uiLang = "en";
let uiTranslations = {};

function formatMMSS(secs) {
  const m = String(Math.floor(secs / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return `${m}:${s}`;
}
function updateTimers() {
  visualTimer.textContent = formatMMSS(timeLeft);
  inContainerTimer.textContent = formatMMSS(timeLeft);
}
function setStatsToZero() {
  mistakeTag.textContent = 0;
  wpmTag.textContent = 0;
  cpmTag.textContent = 0;
}
function showLoader() {
  loader.style.display = "flex";
}
function hideLoader() {
  loader.style.display = "none";
}
function randomParagraph() {
  const ranIndex = Math.floor(Math.random() * TYPING_PARAGRAPHS.length);
  return TYPING_PARAGRAPHS[ranIndex];
}
async function loadParagraph() {
  showLoader();
  setTimeout(async () => {
    currentText = randomParagraph();
    let displayText = currentText;
    // If not English, translate
    if (uiLang !== "en") {
      displayText = await translateViaLecto([currentText], uiLang, "en");
      displayText =
        displayText && displayText[0] ? displayText[0] : currentText;
    }
    typingText.innerHTML = "";
    // Group 3-4 words together (random for natural look)
    let idx = 0;
    const words = displayText.split(/\s+/);
    let html = "";
    while (idx < words.length) {
      let n = Math.floor(Math.random() * 2) + 3; // 3 or 4 words
      let group = words.slice(idx, idx + n).join(" ");
      html += `<span class="word">${[...group]
        .map((c) => `<span>${c}</span>`)
        .join("")}</span>`;
      idx += n;
    }
    typingText.innerHTML = html;
    currentWordSpans = Array.from(typingText.querySelectorAll(".word"));
    currentChars = [];
    currentWordSpans.forEach((word) => {
      word.querySelectorAll("span").forEach((span) => {
        currentChars.push(span);
      });
    });
    if (currentChars.length > 0) currentChars[0].classList.add("active");
    hideLoader();
    setStatsToZero();
  }, 700);
}
function showEndMsg(msg) {
  endMsg.style.display = "block";
  endMsg.textContent = msg;
}
function clearEndMsg() {
  endMsg.style.display = "none";
}
function startTest(e) {
  if (isTyping || loader.style.display === "flex" || finished) return;
  isTyping = true;
  finished = false;
  startMsg.style.display = "none";
  clearEndMsg();
  inpHandler(e); // handle first character typed
  startTimer();
}
function inpHandler(e) {
  if (finished || loader.style.display === "flex") return;
  if (e.key.length !== 1 && e.key !== " " && e.key !== "Enter") return;
  if (e.key === "Enter") {
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    return false;
  }
  if (e.key === " ") {
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
  }
  if (e.key === " " && charIndex === 0) return;
  let inputChar = e.key === "Enter" ? "\n" : e.key === " " ? " " : e.key;
  if (charIndex < currentChars.length && timeLeft > 0) {
    if (currentChars[charIndex].innerText === inputChar) {
      currentChars[charIndex].classList.add("correct");
    } else {
      mistakes++;
      currentChars[charIndex].classList.add("incorrect");
    }
    currentChars[charIndex].classList.remove("active");
    charIndex++;
    if (charIndex < currentChars.length) {
      currentChars[charIndex].classList.add("active");
    }
    let wpm = Math.round(
      (charIndex - mistakes) / 5 / ((maxTime - timeLeft) / 60)
    );
    wpmTag.textContent = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
    mistakeTag.textContent = mistakes;
    cpmTag.textContent = charIndex - mistakes;
    if (charIndex >= currentChars.length) {
      finishTest(true);
    }
  }
}
function startTimer() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimers();
      let wpm = Math.round(
        (charIndex - mistakes) / 5 / ((maxTime - timeLeft) / 60)
      );
      wpmTag.textContent = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
    } else {
      finishTest(false);
    }
  }, 1000);
}
function finishTest(success) {
  clearInterval(timer);
  finished = true;
  isTyping = false;
  showEndMsg(
    success
      ? uiTranslations["end-done"] || UI_TEXTS["end-done"]
      : uiTranslations["end-timeout"] || UI_TEXTS["end-timeout"]
  );
}
function resetGame() {
  clearInterval(timer);
  maxTime = convertToSeconds(timerPresetValue, timerPresetUnit);
  timeLeft = maxTime;
  charIndex = mistakes = 0;
  isTyping = false;
  finished = false;
  updateTimers();
  loadParagraph();
  startMsg.style.display = "block";
  clearEndMsg();
  setStatsToZero();
}
function convertToSeconds(val, unit) {
  if (unit === "seconds") return val;
  if (unit === "minutes") return val * 60;
  if (unit === "hours") return val * 3600;
  return val;
}

document.querySelectorAll(".controls button[data-time]").forEach((btn) => {
  btn.addEventListener("click", function () {
    timerPresetValue = parseInt(this.getAttribute("data-time"));
    timerPresetUnit = this.getAttribute("data-unit");
    document
      .querySelectorAll(".controls button[data-time]")
      .forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
    resetGame();
  });
});
document.getElementById("resetButton").addEventListener("click", resetGame);
tryAgainBtn.addEventListener("click", resetGame);

document.addEventListener("keydown", function (e) {
  if (
    loader.style.display === "flex" ||
    [
      "Shift",
      "Alt",
      "Control",
      "Meta",
      "CapsLock",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Escape",
    ].includes(e.key)
  )
    return;
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
  }
  if (!isTyping && !finished) {
    startTest(e);
  } else {
    inpHandler(e);
  }
});
typingContainer.setAttribute("tabindex", "0");
typingContainer.addEventListener("click", () => typingContainer.focus());
setTimeout(() => typingContainer.focus(), 400);
