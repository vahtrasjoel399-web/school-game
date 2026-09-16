// Edit this file to change routes or station content.
export const classes = {
  "1a": { name: "1.a", route: [1, 3, 5, 7, 2, 4, 6], color: "coral" },
  "1b": { name: "1.b", route: [2, 4, 6, 1, 3, 5, 7], color: "blue" },
  "1h": { name: "1.h", route: [3, 5, 7, 2, 4, 6, 1], color: "yellow" },
  "1el": { name: "1.e/1.l", route: [4, 6, 1, 3, 5, 7, 2], color: "green" }
};

export const stations = {
  1: {
    name: "Быстрый старт",
    icon: "🏃",
    description: "Эстафета на скорость. Подробное описание задания будет добавлено позже.",
    time: "10 минут",
    equipment: "Конусы, эстафетная палочка",
    video: ""
  },
  2: {
    name: "Точный пас",
    icon: "⚽",
    description: "Командное задание с мячом. Подробное описание задания будет добавлено позже.",
    time: "10 минут",
    equipment: "Мячи, конусы",
    video: ""
  },
  3: {
    name: "Меткий бросок",
    icon: "🏀",
    description: "Задание на меткость. Подробное описание задания будет добавлено позже.",
    time: "10 минут",
    equipment: "Мячи, корзины",
    video: ""
  },
  4: {
    name: "Полоса ловкости",
    icon: "⚡",
    description: "Пройдите спортивную полосу. Подробное описание задания будет добавлено позже.",
    time: "10 минут",
    equipment: "Обручи, конусы, скакалки",
    video: ""
  },
  5: {
    name: "Командный баланс",
    icon: "🤝",
    description: "Задание на совместную работу. Подробное описание задания будет добавлено позже.",
    time: "10 минут",
    equipment: "Маты, мячи",
    video: ""
  },
  6: {
    name: "Прыжок чемпиона",
    icon: "⭐",
    description: "Задание с прыжками. Подробное описание задания будет добавлено позже.",
    time: "10 минут",
    equipment: "Скакалки, разметка",
    video: ""
  },
  7: {
    name: "Финишный вызов",
    icon: "🏆",
    description: "Финальное спортивное задание. Подробное описание задания будет добавлено позже.",
    time: "10 минут",
    equipment: "Конусы, секундомер",
    video: ""
  }
};

export function getClassById(classId) {
  return classes[classId] || null;
}

export function getStationById(stationId) {
  return stations[Number(stationId)] || null;
}
