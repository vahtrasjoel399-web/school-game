import { classes, getClassById, getStationById } from "./data.js";

const app = document.querySelector("#app");
const toast = document.querySelector("#toast");

function progressKey(classId) {
  return `sport-day-progress-${classId}`;
}

function completionKey(classId) {
  return `sport-day-complete-${classId}`;
}

export function readProgress(classId) {
  const classData = getClassById(classId);
  if (!classData) return 0;
  const value = Number(localStorage.getItem(progressKey(classId)) || 0);
  return Number.isInteger(value) && value >= 0 && value < classData.route.length ? value : 0;
}

function saveProgress(classId, routeIndex) {
  localStorage.setItem(progressKey(classId), String(routeIndex));
}

function isComplete(classId) {
  return localStorage.getItem(completionKey(classId)) === "true";
}

function saveComplete(classId, value) {
  localStorage.setItem(completionKey(classId), String(value));
}

function navigate(path, { replace = false } = {}) {
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
  return `<span class="class-pill class-pill--${classData.color}">Класс ${classData.name}</span>`;
}

function shell(content, options = {}) {
  const { compact = false } = options;
  return `
    <main class="site-shell ${compact ? "site-shell--compact" : ""}">
      ${content}
    </main>
    <footer class="footer"><span>SPORT DAY</span><span>Двигайтесь вместе ✦</span></footer>
  `;
}

function renderHome() {
  document.title = "Sport Day — выберите класс";
  const buttons = Object.entries(classes)
    .map(([id, item], index) => `
      <a class="class-card class-card--${item.color}" href="/class/${id}" data-link style="--delay:${index * 60}ms">
        <span class="class-card__label">КЛАСС</span>
        <strong>${item.name}</strong>
        <span class="class-card__arrow" aria-hidden="true">↗</span>
      </a>
    `).join("");

  app.innerHTML = shell(`
    <section class="hero">
      <div class="hero__marks" aria-hidden="true"><span>●</span><span>✦</span><span>●</span></div>
      <p class="eyebrow">Школьный спортивный праздник</p>
      <h1>SPORT<br><em>DAY</em></h1>
      <div class="hero__runner" aria-hidden="true">🏃</div>
      <p class="hero__date">7 станций <span></span> 4 маршрута <span></span> 1 команда</p>
    </section>
    <section class="selection" aria-labelledby="select-title">
      <div class="section-heading">
        <div>
          <p class="step-label">ШАГ 01</p>
          <h2 id="select-title">Выберите свой класс</h2>
        </div>
        <p>Выберите класс, чтобы увидеть маршрут и следующую станцию.</p>
      </div>
      <div class="class-grid">${buttons}</div>
    </section>
  `);
}

function renderRouteStrip(classId, classData, currentIndex, interactive = true) {
  return classData.route.map((stationId, index) => {
    const state = index < currentIndex ? "done" : index === currentIndex ? "active" : "upcoming";
    const label = state === "done" ? "Пройдено" : state === "active" ? "Сейчас" : `Шаг ${index + 1}`;
    const body = `
      <span class="route-card__state">${state === "done" ? "✓ " : ""}${label}</span>
      <strong>${stationId}</strong>
      <span>Станция</span>
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
  document.title = `${classData.name} — маршрут Sport Day`;

  app.innerHTML = shell(`
    <nav class="topbar" aria-label="Основная навигация">
      <a href="/" data-link class="back-link">← Все классы</a>
      ${classBadge(classData)}
    </nav>
    <header class="route-hero">
      <div>
        <p class="eyebrow">Ваш маршрут</p>
        <h1>Класс ${classData.name}</h1>
      </div>
      <div class="route-count"><strong>${completed ? 7 : currentIndex + 1}</strong><span>из 7</span></div>
    </header>
    <section class="direction-card direction-card--${classData.color}">
      <div class="direction-card__top">
        <span class="pulse-dot"></span>
        <span>${completed ? "Маршрут завершён" : isLast ? "Последняя станция" : "Сейчас"}</span>
      </div>
      <div class="direction-card__main">
        <span class="direction-card__icon">${completed ? "🏆" : getStationById(currentId).icon}</span>
        <div>
          <p>${completed ? "Отличная работа!" : "Идите на станцию"}</p>
          <strong>${completed ? "Финиш" : currentId}</strong>
        </div>
      </div>
      <div class="direction-card__bottom">
        <span>${completed ? "Все 7 станций пройдены" : getStationById(currentId).name}</span>
        <span>${completed ? "SPORT DAY ✓" : nextId ? `Далее: станция ${nextId}` : "Это финиш! 🏆"}</span>
      </div>
    </section>
    ${completed
      ? `<button class="primary-button" type="button" data-reset>НАЧАТЬ МАРШРУТ ЗАНОВО <span>↻</span></button>`
      : `<a class="primary-button" href="${routeFor(classId, currentId)}" data-link>ОТКРЫТЬ СТАНЦИЮ ${currentId} <span>→</span></a>`}
    <section class="route-section" aria-labelledby="full-route-title">
      <div class="section-title-row">
        <div><p class="step-label">МАРШРУТ</p><h2 id="full-route-title">Все станции</h2></div>
        <button class="text-button" type="button" data-reset>Начать заново</button>
      </div>
      <ol class="route-list">${renderRouteStrip(classId, classData, completed ? classData.route.length : currentIndex)}</ol>
    </section>
    <aside class="share-card">
      <div class="share-card__icon">▦</div>
      <div><strong>Ссылка для QR-кода</strong><p>Открывает маршрут ${classData.name} напрямую.</p></div>
      <button class="copy-button" type="button" data-copy-link>Копировать</button>
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
    return `<div class="video-frame"><iframe src="${station.video}" title="Видеоинструкция" allowfullscreen loading="lazy"></iframe></div>`;
  }
  return `
    <div class="video-placeholder">
      <span class="play-icon">▶</span>
      <div><strong>Видео с инструкцией</strong><p>Скоро появится</p></div>
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
  document.title = `Станция ${stationId} — ${classData.name}`;

  app.innerHTML = shell(`
    <nav class="topbar topbar--station" aria-label="Навигация станции">
      <a href="/class/${classId}" data-link class="back-link">← Маршрут</a>
      ${classBadge(classData)}
    </nav>
    <header class="station-hero station-hero--${classData.color}">
      <div class="station-hero__number"><span>СТАНЦИЯ</span><strong>${stationId}</strong></div>
      <div class="station-hero__content"><span class="station-hero__emoji">${station.icon}</span><h1>${station.name}</h1></div>
      <span class="station-hero__step">${routeIndex + 1} / 7</span>
    </header>
    <section class="station-content">
      <div class="info-panel info-panel--description">
        <p class="step-label">ЧТО НУЖНО ДЕЛАТЬ</p>
        <p class="description">${station.description}</p>
      </div>
      <div class="facts-grid">
        <div class="fact"><span class="fact__icon">⏱</span><div><span>Время</span><strong>${station.time}</strong></div></div>
        <div class="fact"><span class="fact__icon">🎒</span><div><span>Инвентарь</span><strong>${station.equipment}</strong></div></div>
      </div>
      <div class="video-section">
        <div class="section-title-row"><div><p class="step-label">ВИДЕО</p><h2>Как выполнять задание</h2></div></div>
        ${videoBlock(station)}
      </div>
    </section>
    <div class="station-actions">
      ${previousId ? `<a class="secondary-button" href="${routeFor(classId, previousId)}" data-prev-station data-link>← Назад</a>` : `<a class="secondary-button" href="/class/${classId}" data-link>← Маршрут</a>`}
      ${nextId ? `<a class="primary-button primary-button--next" href="${routeFor(classId, nextId)}" data-next-station data-next-index="${routeIndex + 1}" data-link>НА СЛЕДУЮЩУЮ <span>→</span></a>` : `<button class="primary-button primary-button--finish" type="button" data-finish>ЗАВЕРШИТЬ <span>🏆</span></button>`}
    </div>
    <a class="route-return" href="/class/${classId}" data-link>Посмотреть весь маршрут</a>
  `, { compact: true });
}

function renderNotFound() {
  document.title = "Страница не найдена — Sport Day";
  app.innerHTML = shell(`
    <section class="not-found">
      <span>🏀</span><p class="eyebrow">Ошибка 404</p><h1>Не та площадка</h1>
      <p>Такой страницы или маршрута нет.</p>
      <a class="primary-button" href="/" data-link>К выбору класса →</a>
    </section>
  `, { compact: true });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("toast--visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("toast--visible"), 2200);
}

function render() {
  const route = parseRoute();
  if (route.page === "home") renderHome();
  else if (route.page === "class") renderClass(route.classId);
  else if (route.page === "station") renderStation(route.classId, route.stationId);
  else renderNotFound();
}

document.addEventListener("click", async (event) => {
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
    saveProgress(classId, 0);
    saveComplete(classId, false);
    renderClass(classId);
    showToast("Маршрут начат заново");
    return;
  }

  const finish = event.target.closest("[data-finish]");
  if (finish) {
    const { classId } = parseRoute();
    saveComplete(classId, true);
    showToast("Маршрут пройден! Отличная работа 🏆");
    setTimeout(() => navigate(`/class/${classId}`), 500);
    return;
  }

  const copy = event.target.closest("[data-copy-link]");
  if (copy) {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Ссылка скопирована");
    } catch {
      showToast("Скопируйте адрес из строки браузера");
    }
    return;
  }

  const link = event.target.closest("a[data-link]");
  if (link && link.origin === window.location.origin && !event.metaKey && !event.ctrlKey) {
    event.preventDefault();
    navigate(link.pathname);
  }
});

window.addEventListener("popstate", render);
render();

export { parseRoute };
