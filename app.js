import { classes, getClassById, getStationById } from "./data.js";
import { hydrateClass, markClassChanged, refreshClassFromCloud } from "./cloud.js";

const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const hydratedClasses = new Set();

const translations = {
  ru: {
    schoolEvent: "Школьный спортивный праздник", stationsCount: "7 станций", routesCount: "4 маршрута", oneTeam: "1 команда",
    step: "Шаг", chooseClass: "Выберите свой класс", chooseHint: "Выберите класс, чтобы увидеть маршрут и следующую станцию.",
    class: "Класс", moveTogether: "Двигайтесь вместе", allClasses: "Все классы", yourRoute: "Ваш маршрут", ofSeven: "из 7",
    current: "Сейчас", lastStation: "Последняя станция", routeComplete: "Маршрут завершён", greatWork: "Отличная работа!",
    goToStation: "Идите на станцию", finish: "Финиш", allPassed: "Все 7 станций пройдены", nextStation: "Далее: станция {id}",
    thisIsFinish: "Это финиш! 🏆", openStation: "ОТКРЫТЬ СТАНЦИЮ {id}", restartRoute: "НАЧАТЬ МАРШРУТ ЗАНОВО",
    route: "Маршрут", allStations: "Все станции", restart: "Начать заново", passed: "Пройдено", station: "Станция",
    qrLink: "Ссылка для QR-кода", qrHint: "Открывает маршрут {className} напрямую.", copy: "Копировать", whatToDo: "Что нужно делать",
    time: "Время", equipment: "Инвентарь", video: "Видео", howTo: "Как выполнять задание", videoInstruction: "Видео с инструкцией",
    comingSoon: "Скоро появится", back: "Назад", next: "НА СЛЕДУЮЩУЮ", complete: "ЗАВЕРШИТЬ", viewRoute: "Посмотреть весь маршрут",
    wrongPlace: "Не та площадка", missingPage: "Такой страницы или маршрута нет.", chooseClassButton: "К выбору класса", error: "Ошибка 404",
    resetToast: "Маршрут начат заново", completeToast: "Маршрут пройден! Отличная работа 🏆", copiedToast: "Ссылка скопирована",
    copyFallback: "Скопируйте адрес из строки браузера", eventTimer: "Общий таймер", timerReady: "Готов к старту",
    timerRunning: "Время идёт", timerStopped: "Время остановлено", startTimer: "СТАРТ", stopTimer: "СТОП", resetTimer: "Сбросить",
    result: "Результат", classResults: "Результаты класса", savedAutomatically: "Сохраняется автоматически", noResult: "Нет результата",
    markCompleted: "ОТМЕТИТЬ ВЫПОЛНЕННЫМ", completed: "ВЫПОЛНЕНО", minutesShort: "мин", secondsShort: "сек", totalTime: "Общее время",
    startsAutomatically: "Запускается автоматически", stopsOnExit: "Остановится при переходе дальше", stationTimer: "Таймер станции",
    stationTimerReady: "Нажмите START перед заданием", stationTimerRunning: "Таймер запущен", stationStart: "START", stationStop: "STOP",
    timeSaved: "Время сохранено в отчёт", stopTimerFirst: "Сначала остановите таймер станции"
  },
  et: {
    schoolEvent: "Kooli spordipäev", stationsCount: "7 jaama", routesCount: "4 marsruuti", oneTeam: "1 meeskond",
    step: "Samm", chooseClass: "Valige oma klass", chooseHint: "Valige klass, et näha marsruuti ja järgmist jaama.",
    class: "Klass", moveTogether: "Liigume koos", allClasses: "Kõik klassid", yourRoute: "Teie marsruut", ofSeven: "7-st",
    current: "Hetkel", lastStation: "Viimane jaam", routeComplete: "Marsruut lõpetatud", greatWork: "Suurepärane töö!",
    goToStation: "Minge jaama", finish: "Finiš", allPassed: "Kõik 7 jaama on läbitud", nextStation: "Järgmisena: jaam {id}",
    thisIsFinish: "See on finiš! 🏆", openStation: "AVA JAAM {id}", restartRoute: "ALUSTA MARSRUUTI UUESTI",
    route: "Marsruut", allStations: "Kõik jaamad", restart: "Alusta uuesti", passed: "Läbitud", station: "Jaam",
    qrLink: "QR-koodi link", qrHint: "Avab klassi {className} marsruudi otse.", copy: "Kopeeri", whatToDo: "Mida tuleb teha",
    time: "Aeg", equipment: "Vahendid", video: "Video", howTo: "Kuidas ülesannet täita", videoInstruction: "Videojuhend",
    comingSoon: "Tulekul", back: "Tagasi", next: "JÄRGMISSE JAAMA", complete: "LÕPETA", viewRoute: "Vaata kogu marsruuti",
    wrongPlace: "Vale väljak", missingPage: "Sellist lehte või marsruuti pole.", chooseClassButton: "Klassi valikusse", error: "Viga 404",
    resetToast: "Marsruut algas uuesti", completeToast: "Marsruut läbitud! Suurepärane töö 🏆", copiedToast: "Link kopeeritud",
    copyFallback: "Kopeerige aadress brauseri aadressiribalt", eventTimer: "Üldtaimer", timerReady: "Stardiks valmis",
    timerRunning: "Aeg jookseb", timerStopped: "Aeg peatatud", startTimer: "START", stopTimer: "STOPP", resetTimer: "Lähtesta",
    result: "Tulemus", classResults: "Klassi tulemused", savedAutomatically: "Salvestatakse automaatselt", noResult: "Tulemus puudub",
    markCompleted: "MÄRGI TEHTUKS", completed: "TEHTUD", minutesShort: "min", secondsShort: "sek", totalTime: "Koguaeg",
    startsAutomatically: "Käivitub automaatselt", stopsOnExit: "Peatub järgmisele liikudes", stationTimer: "Jaama taimer",
    stationTimerReady: "Vajutage enne ülesannet START", stationTimerRunning: "Taimer töötab", stationStart: "START", stationStop: "STOPP",
    timeSaved: "Aeg salvestati aruandesse", stopTimerFirst: "Peatage kõigepealt jaama taimer"
  }
};

let language = localStorage.getItem("sport-day-language") || (navigator.language.toLowerCase().startsWith("et") ? "et" : "ru");

function tr(key, values = {}) {
  return Object.entries(values).reduce((text, [name, value]) => text.replace(`{${name}}`, value), translations[language][key]);
}

function localized(value) {
  return typeof value === "object" ? value[language] : value;
}

function languageSwitch() {
  return `<div class="language-switch" aria-label="Language / Язык">
    <button type="button" data-language="et" class="${language === "et" ? "is-active" : ""}" aria-pressed="${language === "et"}">EST</button>
    <button type="button" data-language="ru" class="${language === "ru" ? "is-active" : ""}" aria-pressed="${language === "ru"}">RUS</button>
  </div>`;
}

function progressKey(classId) {
  return `sport-day-progress-${classId}`;
}

function completionKey(classId) {
  return `sport-day-complete-${classId}`;
}

function timerKey(classId) {
  return `sport-day-timer-${classId}`;
}

function readTimer(classId) {
  try {
    const stored = JSON.parse(localStorage.getItem(timerKey(classId)) || "null");
    if (stored && Number.isFinite(stored.elapsed) && (!stored.running || Number.isFinite(stored.startedAt))) return stored;
  } catch {
    // Invalid saved data is safely replaced with a fresh timer.
  }
  return { running: false, startedAt: null, elapsed: 0 };
}

function saveTimer(classId, timer) {
  localStorage.setItem(timerKey(classId), JSON.stringify(timer));
  markClassChanged(classId);
}

function elapsedMilliseconds(timer) {
  return timer.elapsed + (timer.running ? Math.max(0, Date.now() - timer.startedAt) : 0);
}

function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map(value => String(value).padStart(2, "0")).join(":");
}

function timerPanel(classId) {
  const timer = readTimer(classId);
  const status = timer.running ? tr("timerRunning") : timer.elapsed > 0 ? tr("timerStopped") : tr("timerReady");
  return `
    <section class="event-timer ${timer.running ? "event-timer--running" : ""}" aria-label="${tr("eventTimer")}">
      <div class="event-timer__header"><span>${tr("eventTimer")}</span><span class="event-timer__status"><i></i>${status}</span></div>
      <div class="event-timer__body">
        <time data-timer-value data-timer-class="${classId}">${formatTime(elapsedMilliseconds(timer))}</time>
        <span class="timer-auto-label">${timer.running ? tr("timerRunning") : timer.elapsed > 0 ? tr("timerStopped") : tr("startsAutomatically")}</span>
      </div>
    </section>
  `;
}

function startOverallTimer(classId) {
  const timer = readTimer(classId);
  if (!timer.running && timer.elapsed === 0) saveTimer(classId, { running: true, startedAt: Date.now(), elapsed: 0 });
}

function stopOverallTimer(classId) {
  const timer = readTimer(classId);
  if (timer.running) saveTimer(classId, { running: false, startedAt: null, elapsed: elapsedMilliseconds(timer) });
}

function updateTimerDisplays() {
  document.querySelectorAll("[data-timer-value]").forEach(element => {
    const timer = readTimer(element.dataset.timerClass);
    element.textContent = formatTime(elapsedMilliseconds(timer));
  });
  document.querySelectorAll("[data-station-timer-value]").forEach(element => {
    const timer = readStationTimer(element.dataset.timerClass, element.dataset.stationId);
    element.textContent = formatStationTime(elapsedMilliseconds(timer));
  });
}

function stationTimerKey(classId, stationId) {
  return `sport-day-station-timer-${classId}-${stationId}`;
}

function readStationTimer(classId, stationId) {
  try {
    const stored = JSON.parse(localStorage.getItem(stationTimerKey(classId, stationId)) || "null");
    if (stored && Number.isFinite(stored.elapsed) && (!stored.running || Number.isFinite(stored.startedAt))) return stored;
  } catch {
    // Invalid data is replaced with a fresh station timer.
  }
  return { running: false, startedAt: null, elapsed: 0 };
}

function saveStationTimer(classId, stationId, timer) {
  localStorage.setItem(stationTimerKey(classId, stationId), JSON.stringify(timer));
  markClassChanged(classId);
}

function formatStationTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  return `${String(Math.floor(totalSeconds / 60)).padStart(2, "0")}:${String(totalSeconds % 60).padStart(2, "0")}`;
}

function startStationTimer(classId, stationId) {
  localStorage.removeItem(resultKey(classId, stationId));
  saveStationTimer(classId, stationId, { running: true, startedAt: Date.now(), elapsed: 0 });
}

function stopStationTimer(classId, stationId) {
  const station = getStationById(stationId);
  if (!station || station.result.type !== "duration") return false;
  const timer = readStationTimer(classId, stationId);
  if (!timer.running) return false;
  const elapsed = elapsedMilliseconds(timer);
  const totalSeconds = Math.floor(elapsed / 1000);
  saveStationTimer(classId, stationId, { running: false, startedAt: null, elapsed });
  saveResult(classId, stationId, { minutes: Math.floor(totalSeconds / 60), seconds: totalSeconds % 60 });
  return true;
}

function resultKey(classId, stationId) {
  return `sport-day-result-${classId}-${stationId}`;
}

function emptyResult(station) {
  if (station.result.type === "counter") return { value: 0 };
  if (station.result.type === "measurement") return { value: "" };
  if (station.result.type === "duration") return { minutes: "", seconds: "" };
  return { value: false };
}

function readResult(classId, stationId) {
  try {
    const stored = localStorage.getItem(resultKey(classId, stationId));
    return stored === null ? null : JSON.parse(stored);
  } catch {
    return null;
  }
}

function saveResult(classId, stationId, result) {
  localStorage.setItem(resultKey(classId, stationId), JSON.stringify(result));
  markClassChanged(classId);
}

function clearClassSession(classId) {
  saveProgress(classId, 0);
  saveComplete(classId, false);
  saveTimer(classId, { running: false, startedAt: null, elapsed: 0 });
  const classData = getClassById(classId);
  for (const stationId of classData.route) {
    localStorage.removeItem(resultKey(classId, stationId));
    localStorage.removeItem(stationTimerKey(classId, stationId));
  }
  markClassChanged(classId);
}

function formattedResult(classId, stationId) {
  const station = getStationById(stationId);
  const result = readResult(classId, stationId);
  if (!result) return tr("noResult");
  if (station.result.type === "status") return result.value ? `✓ ${tr("completed")}` : tr("noResult");
  if (station.result.type === "counter") return `${result.value ?? 0} ${localized(station.result.unit)}`;
  if (station.result.type === "measurement") return result.value === "" ? tr("noResult") : `${result.value} ${localized(station.result.unit)}`;
  const minutes = Math.max(0, Number(result.minutes) || 0);
  const seconds = Math.min(59, Math.max(0, Number(result.seconds) || 0));
  return result.minutes === "" && result.seconds === "" ? tr("noResult") : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function resultEditor(classId, stationId, station) {
  const result = readResult(classId, stationId) || emptyResult(station);
  let control = "";

  if (station.result.type === "counter") {
    const minus = [...station.result.steps].reverse().map(step => `<button type="button" data-result-delta="-${step}" data-class-id="${classId}" data-station-id="${stationId}">−${step}</button>`).join("");
    const plus = station.result.steps.map(step => `<button type="button" data-result-delta="${step}" data-class-id="${classId}" data-station-id="${stationId}">+${step}</button>`).join("");
    control = `<div class="score-control"><div class="score-buttons">${minus}</div><output>${result.value ?? 0}<small>${localized(station.result.unit)}</small></output><div class="score-buttons">${plus}</div></div>`;
  } else if (station.result.type === "measurement") {
    control = `<label class="measurement-control"><input type="number" inputmode="decimal" min="0" step="${station.result.step}" value="${result.value}" data-result-measurement data-class-id="${classId}" data-station-id="${stationId}" aria-label="${tr("result")}"><span>${localized(station.result.unit)}</span></label>`;
  } else if (station.result.type === "duration") {
    const stationTimer = readStationTimer(classId, stationId);
    const savedMilliseconds = ((Number(result.minutes) || 0) * 60 + (Number(result.seconds) || 0)) * 1000;
    control = `<div class="automatic-station-timer">
      <span>${tr("stationTimer")}</span>
      <time data-station-timer-value data-timer-class="${classId}" data-station-id="${stationId}">${formatStationTime(stationTimer.running ? elapsedMilliseconds(stationTimer) : savedMilliseconds)}</time>
      <small>${stationTimer.running ? tr("stationTimerRunning") : readResult(classId, stationId) ? `✓ ${tr("timeSaved")}` : tr("stationTimerReady")}</small>
      <button class="station-timer-button ${stationTimer.running ? "station-timer-button--stop" : "station-timer-button--start"}" type="button" ${stationTimer.running ? "data-station-timer-stop" : "data-station-timer-start"} data-class-id="${classId}" data-station-id="${stationId}">${stationTimer.running ? tr("stationStop") : tr("stationStart")}</button>
    </div>`;
  } else {
    control = `<button class="status-result ${result.value ? "is-complete" : ""}" type="button" data-result-status data-class-id="${classId}" data-station-id="${stationId}">${result.value ? `✓ ${tr("completed")}` : tr("markCompleted")}</button>`;
  }

  return `<section class="result-section" aria-labelledby="result-title">
    <div class="result-section__heading"><div><p class="step-label">SPORT DAY</p><h2 id="result-title">${tr("result")}</h2></div><span>${tr("savedAutomatically")}</span></div>
    ${control}
  </section>`;
}

function updateResultEditor(classId, stationId) {
  const current = document.querySelector(".result-section");
  if (current) current.outerHTML = resultEditor(classId, stationId, getStationById(stationId));
}

function classResults(classId, classData) {
  const timer = readTimer(classId);
  const rows = classData.route.map(stationId => {
    const station = getStationById(stationId);
    const hasResult = readResult(classId, stationId) !== null;
    return `<a class="result-row ${hasResult ? "has-result" : ""}" href="${routeFor(classId, stationId)}" data-link>
      <span class="result-row__number">${stationId}</span>
      <span class="result-row__name">${localized(station.name)}</span>
      <strong>${formattedResult(classId, stationId)}</strong>
      <span aria-hidden="true">›</span>
    </a>`;
  }).join("");

  return `<section class="results-summary" aria-labelledby="results-title">
    <div class="section-title-row"><div><p class="step-label">SPORT DAY</p><h2 id="results-title">${tr("classResults")}</h2></div></div>
    <div class="total-time"><span>${tr("totalTime")}</span><strong data-timer-value data-timer-class="${classId}">${formatTime(elapsedMilliseconds(timer))}</strong></div>
    <div class="results-list">${rows}</div>
  </section>`;
}

export function readProgress(classId) {
  const classData = getClassById(classId);
  if (!classData) return 0;
  const value = Number(localStorage.getItem(progressKey(classId)) || 0);
  return Number.isInteger(value) && value >= 0 && value < classData.route.length ? value : 0;
}

function saveProgress(classId, routeIndex) {
  localStorage.setItem(progressKey(classId), String(routeIndex));
  markClassChanged(classId);
}

function isComplete(classId) {
  return localStorage.getItem(completionKey(classId)) === "true";
}

function saveComplete(classId, value) {
  localStorage.setItem(completionKey(classId), String(value));
  markClassChanged(classId);
}

async function ensureClassHydrated(classId) {
  if (!classId || hydratedClasses.has(classId)) return;
  hydratedClasses.add(classId);
  try {
    await hydrateClass(classId);
  } catch (error) {
    console.error(error);
  }
}

async function navigate(path, { replace = false } = {}) {
  const destination = parseRoute(path);
  await ensureClassHydrated(destination.classId);
  if (replace) history.replaceState({}, "", path);
  else history.pushState({}, "", path);
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function routeFor(classId, stationId) {
  return `/class/${classId}/station/${stationId}`;
}

function parseRoute(pathname = window.location.pathname) {
  const parts = pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  if (!parts.length) return { page: "home" };
  if (parts[0] === "class" && parts[1] && parts[2] === "station" && parts[3]) {
    return { page: "station", classId: parts[1], stationId: Number(parts[3]) };
  }
  if (parts[0] === "class" && parts[1] && parts.length === 2) {
    return { page: "class", classId: parts[1] };
  }
  return { page: "not-found" };
}

function classBadge(classData) {
  return `<span class="class-pill class-pill--${classData.color}">${tr("class")} ${classData.name}</span>`;
}

function shell(content, options = {}) {
  const { compact = false } = options;
  return `
    <main class="site-shell ${compact ? "site-shell--compact" : ""}">
      ${content}
    </main>
    <footer class="footer"><span>SPORT DAY</span><span>${tr("moveTogether")} ✦</span></footer>
  `;
}

function renderHome() {
  document.title = `Sport Day — ${tr("chooseClass")}`;
  document.documentElement.lang = language;
  const buttons = Object.entries(classes)
    .map(([id, item], index) => `
      <a class="class-card class-card--${item.color}" href="/class/${id}" data-link style="--delay:${index * 60}ms">
        <span class="class-card__label">${tr("class").toUpperCase()}</span>
        <strong>${item.name}</strong>
        <span class="class-card__arrow" aria-hidden="true">↗</span>
      </a>
    `).join("");

  app.innerHTML = shell(`
    <section class="hero">
      <div class="home-language">${languageSwitch()}</div>
      <div class="hero__marks" aria-hidden="true"><span>●</span><span>✦</span><span>●</span></div>
      <p class="eyebrow">${tr("schoolEvent")}</p>
      <h1>SPORT<br><em>DAY</em></h1>
      <div class="hero__runner" aria-hidden="true">🏃</div>
      <p class="hero__date">${tr("stationsCount")} <span></span> ${tr("routesCount")} <span></span> ${tr("oneTeam")}</p>
    </section>
    <section class="selection" aria-labelledby="select-title">
      <div class="section-heading">
        <div>
          <p class="step-label">${tr("step").toUpperCase()} 01</p>
          <h2 id="select-title">${tr("chooseClass")}</h2>
        </div>
        <p>${tr("chooseHint")}</p>
      </div>
      <div class="class-grid">${buttons}</div>
    </section>
  `);
}

function renderRouteStrip(classId, classData, currentIndex, interactive = true) {
  return classData.route.map((stationId, index) => {
    const state = index < currentIndex ? "done" : index === currentIndex ? "active" : "upcoming";
    const label = state === "done" ? tr("passed") : state === "active" ? tr("current") : `${tr("step")} ${index + 1}`;
    const body = `
      <span class="route-card__state">${state === "done" ? "✓ " : ""}${label}</span>
      <strong>${stationId}</strong>
      <span>${tr("station")}</span>
    `;
    return `
      <li class="route-step route-step--${state}">
        ${interactive ? `<a class="route-card" href="${routeFor(classId, stationId)}" data-station-jump data-route-index="${index}" data-link>${body}</a>` : `<div class="route-card">${body}</div>`}
        ${index < classData.route.length - 1 ? '<span class="route-arrow" aria-hidden="true">→</span>' : ""}
      </li>
    `;
  }).join("");
}

function renderClass(classId) {
  const classData = getClassById(classId);
  if (!classData) return renderNotFound();
  const currentIndex = readProgress(classId);
  const currentId = classData.route[currentIndex];
  const nextId = classData.route[currentIndex + 1];
  const isLast = currentIndex === classData.route.length - 1;
  const completed = isComplete(classId);
  document.title = `${classData.name} — ${tr("route")} Sport Day`;
  document.documentElement.lang = language;

  app.innerHTML = shell(`
    <nav class="topbar" aria-label="Navigation">
      <a href="/" data-link class="back-link">← ${tr("allClasses")}</a>
      <div class="topbar__right">${languageSwitch()}${classBadge(classData)}</div>
    </nav>
    ${timerPanel(classId)}
    <header class="route-hero">
      <div>
        <p class="eyebrow">${tr("yourRoute")}</p>
        <h1>${tr("class")} ${classData.name}</h1>
      </div>
      <div class="route-count"><strong>${completed ? 7 : currentIndex + 1}</strong><span>${tr("ofSeven")}</span></div>
    </header>
    <section class="direction-card direction-card--${classData.color}">
      <div class="direction-card__top">
        <span class="pulse-dot"></span>
        <span>${completed ? tr("routeComplete") : isLast ? tr("lastStation") : tr("current")}</span>
      </div>
      <div class="direction-card__main">
        <span class="direction-card__icon">${completed ? "🏆" : getStationById(currentId).icon}</span>
        <div>
          <p>${completed ? tr("greatWork") : tr("goToStation")}</p>
          <strong>${completed ? tr("finish") : currentId}</strong>
        </div>
      </div>
      <div class="direction-card__bottom">
        <span>${completed ? tr("allPassed") : localized(getStationById(currentId).name)}</span>
        <span>${completed ? "SPORT DAY ✓" : nextId ? tr("nextStation", { id: nextId }) : tr("thisIsFinish")}</span>
      </div>
    </section>
    ${completed
      ? `<button class="primary-button" type="button" data-reset>${tr("restartRoute")} <span>↻</span></button>`
      : `<a class="primary-button" href="${routeFor(classId, currentId)}" data-link>${tr("openStation", { id: currentId })} <span>→</span></a>`}
    <section class="route-section" aria-labelledby="full-route-title">
      <div class="section-title-row">
        <div><p class="step-label">${tr("route").toUpperCase()}</p><h2 id="full-route-title">${tr("allStations")}</h2></div>
        <button class="text-button" type="button" data-reset>${tr("restart")}</button>
      </div>
      <ol class="route-list">${renderRouteStrip(classId, classData, completed ? classData.route.length : currentIndex)}</ol>
    </section>
    ${classResults(classId, classData)}
    <aside class="share-card">
      <div class="share-card__icon">▦</div>
      <div><strong>${tr("qrLink")}</strong><p>${tr("qrHint", { className: classData.name })}</p></div>
      <button class="copy-button" type="button" data-copy-link>${tr("copy")}</button>
    </aside>
  `, { compact: true });

  requestAnimationFrame(() => {
    const list = document.querySelector(".route-list");
    const active = document.querySelector(".route-step--active");
    if (list && active) list.scrollLeft = Math.max(0, active.offsetLeft - list.clientWidth / 2 + active.clientWidth / 2);
  });
}

function videoBlock(station) {
  if (station.video) {
    return `<div class="video-frame"><iframe src="${station.video}" title="${tr("videoInstruction")}" allowfullscreen loading="lazy"></iframe></div>`;
  }
  return `
    <div class="video-placeholder">
      <span class="play-icon">▶</span>
      <div><strong>${tr("videoInstruction")}</strong><p>${tr("comingSoon")}</p></div>
    </div>
  `;
}

function renderStation(classId, stationId) {
  const classData = getClassById(classId);
  const station = getStationById(stationId);
  if (!classData || !station || !classData.route.includes(Number(stationId))) return renderNotFound();

  const routeIndex = classData.route.indexOf(Number(stationId));
  const previousId = classData.route[routeIndex - 1];
  const nextId = classData.route[routeIndex + 1];
  const isLast = routeIndex === classData.route.length - 1;
  if (routeIndex === 0) startOverallTimer(classId);
  document.title = `${tr("station")} ${stationId} — ${classData.name}`;
  document.documentElement.lang = language;

  app.innerHTML = shell(`
    <nav class="topbar topbar--station" aria-label="Navigation">
      <a href="/class/${classId}" data-link class="back-link">← ${tr("route")}</a>
      <div class="topbar__right">${languageSwitch()}${classBadge(classData)}</div>
    </nav>
    ${timerPanel(classId)}
    <header class="station-hero station-hero--${classData.color}">
      <div class="station-hero__number"><span>${tr("station").toUpperCase()}</span><strong>${stationId}</strong></div>
      <div class="station-hero__content"><span class="station-hero__emoji">${station.icon}</span><h1>${localized(station.name)}</h1></div>
      <span class="station-hero__step">${routeIndex + 1} / 7</span>
    </header>
    <section class="station-content">
      <div class="info-panel info-panel--description">
        <p class="step-label">${tr("whatToDo").toUpperCase()}</p>
        <p class="description">${localized(station.description)}</p>
        <ul class="task-details">${localized(station.details).map(item => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div class="facts-grid">
        <div class="fact"><span class="fact__icon">⏱</span><div><span>${tr("time")}</span><strong>${localized(station.time)}</strong></div></div>
        <div class="fact"><span class="fact__icon">🎒</span><div><span>${tr("equipment")}</span><strong>${localized(station.equipment)}</strong></div></div>
      </div>
      ${resultEditor(classId, stationId, station)}
      <div class="video-section">
        <div class="section-title-row"><div><p class="step-label">${tr("video").toUpperCase()}</p><h2>${tr("howTo")}</h2></div></div>
        ${videoBlock(station)}
      </div>
    </section>
    <div class="station-actions">
      ${previousId ? `<a class="secondary-button" href="${routeFor(classId, previousId)}" data-prev-station data-link>← ${tr("back")}</a>` : `<a class="secondary-button" href="/class/${classId}" data-link>← ${tr("route")}</a>`}
      ${nextId ? `<a class="primary-button primary-button--next" href="${routeFor(classId, nextId)}" data-next-station data-next-index="${routeIndex + 1}" data-link>${tr("next")} <span>→</span></a>` : `<button class="primary-button primary-button--finish" type="button" data-finish>${tr("complete")} <span>🏆</span></button>`}
    </div>
    <a class="route-return" href="/class/${classId}" data-link>${tr("viewRoute")}</a>
  `, { compact: true });
}

function renderNotFound() {
  document.title = `404 — Sport Day`;
  document.documentElement.lang = language;
  app.innerHTML = shell(`
    <section class="not-found">
      <div class="not-found__language">${languageSwitch()}</div>
      <span>🏀</span><p class="eyebrow">${tr("error")}</p><h1>${tr("wrongPlace")}</h1>
      <p>${tr("missingPage")}</p>
      <a class="primary-button" href="/" data-link>${tr("chooseClassButton")} →</a>
    </section>
  `, { compact: true });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("toast--visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("toast--visible"), 2200);
}

function playResultAnimation(stationId, label = "✓") {
  const celebration = document.createElement("div");
  celebration.className = "score-celebration";
  celebration.innerHTML = `<span>${Number(stationId) === 2 ? "🏀" : Number(stationId) === 3 ? "⚽" : "⭐"}</span><strong>${label}</strong><i></i><i></i><i></i><i></i>`;
  document.body.append(celebration);
  requestAnimationFrame(() => celebration.classList.add("is-playing"));
  setTimeout(() => celebration.remove(), 1000);
}

function render() {
  const route = parseRoute();
  if (route.page === "home") renderHome();
  else if (route.page === "class") renderClass(route.classId);
  else if (route.page === "station") renderStation(route.classId, route.stationId);
  else renderNotFound();
}

document.addEventListener("click", async (event) => {
  const languageButton = event.target.closest("[data-language]");
  if (languageButton) {
    language = languageButton.dataset.language;
    localStorage.setItem("sport-day-language", language);
    render();
    return;
  }

  const stationTimerStart = event.target.closest("[data-station-timer-start]");
  if (stationTimerStart) {
    const classId = stationTimerStart.dataset.classId;
    const stationId = Number(stationTimerStart.dataset.stationId);
    startStationTimer(classId, stationId);
    updateResultEditor(classId, stationId);
    return;
  }

  const stationTimerStop = event.target.closest("[data-station-timer-stop]");
  if (stationTimerStop) {
    const classId = stationTimerStop.dataset.classId;
    const stationId = Number(stationTimerStop.dataset.stationId);
    if (stopStationTimer(classId, stationId)) {
      updateResultEditor(classId, stationId);
      showToast(tr("timeSaved"));
      playResultAnimation(stationId);
    }
    return;
  }

  const resultDelta = event.target.closest("[data-result-delta]");
  if (resultDelta) {
    const classId = resultDelta.dataset.classId;
    const stationId = Number(resultDelta.dataset.stationId);
    const current = readResult(classId, stationId) || { value: 0 };
    const delta = Number(resultDelta.dataset.resultDelta);
    saveResult(classId, stationId, { value: Math.max(0, (Number(current.value) || 0) + delta) });
    updateResultEditor(classId, stationId);
    if (delta > 0) playResultAnimation(stationId, `+${delta}`);
    return;
  }

  const resultStatus = event.target.closest("[data-result-status]");
  if (resultStatus) {
    const classId = resultStatus.dataset.classId;
    const stationId = Number(resultStatus.dataset.stationId);
    const current = readResult(classId, stationId) || { value: false };
    saveResult(classId, stationId, { value: !current.value });
    updateResultEditor(classId, stationId);
    if (!current.value) playResultAnimation(stationId);
    return;
  }

  const stationJump = event.target.closest("[data-station-jump]");
  if (stationJump) {
    const { classId } = parseRoute();
    saveProgress(classId, Number(stationJump.dataset.routeIndex));
    saveComplete(classId, false);
  }

  const next = event.target.closest("[data-next-station]");
  if (next) {
    const { classId } = parseRoute();
    saveProgress(classId, Number(next.dataset.nextIndex));
    saveComplete(classId, false);
  }

  const previous = event.target.closest("[data-prev-station]");
  if (previous) {
    const route = parseRoute();
    const classData = getClassById(route.classId);
    saveProgress(route.classId, Math.max(0, classData.route.indexOf(route.stationId) - 1));
    saveComplete(route.classId, false);
  }

  const reset = event.target.closest("[data-reset]");
  if (reset) {
    const { classId } = parseRoute();
    clearClassSession(classId);
    renderClass(classId);
    showToast(tr("resetToast"));
    return;
  }

  const finish = event.target.closest("[data-finish]");
  if (finish) {
    const { classId, stationId } = parseRoute();
    if (readStationTimer(classId, stationId).running) {
      showToast(tr("stopTimerFirst"));
      return;
    }
    stopOverallTimer(classId);
    saveComplete(classId, true);
    showToast(tr("completeToast"));
    setTimeout(() => navigate(`/class/${classId}`), 500);
    return;
  }

  const copy = event.target.closest("[data-copy-link]");
  if (copy) {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast(tr("copiedToast"));
    } catch {
      showToast(tr("copyFallback"));
    }
    return;
  }

  const link = event.target.closest("a[data-link]");
  if (link && link.origin === window.location.origin && !event.metaKey && !event.ctrlKey) {
    event.preventDefault();
    navigate(link.pathname);
  }
});

document.addEventListener("input", event => {
  const measurement = event.target.closest("[data-result-measurement]");
  if (measurement) {
    const value = measurement.value === "" ? "" : Math.max(0, Number(measurement.value));
    saveResult(measurement.dataset.classId, Number(measurement.dataset.stationId), { value });
  }
});

window.addEventListener("popstate", async () => {
  const route = parseRoute();
  await ensureClassHydrated(route.classId);
  render();
});

async function initialize() {
  const route = parseRoute();
  await ensureClassHydrated(route.classId);
  render();
}

initialize();
setInterval(updateTimerDisplays, 250);
setInterval(async () => {
  const route = parseRoute();
  if (!route.classId || !hydratedClasses.has(route.classId)) return;
  try {
    if (await refreshClassFromCloud(route.classId)) render();
  } catch (error) {
    console.error(error);
  }
}, 5000);

export { formatTime, parseRoute };
