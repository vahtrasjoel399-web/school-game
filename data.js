// Edit this file to change routes, tasks, scoring, or station content.
export const classes = {
  "1a": { name: "1.a", route: [1, 3, 5, 7, 2, 4, 6], color: "coral" },
  "1b": { name: "1.b", route: [2, 4, 6, 1, 3, 5, 7], color: "blue" },
  "1h": { name: "1.h", route: [3, 5, 7, 2, 4, 6, 1], color: "yellow" },
  "1el": { name: "1.e/1.l", route: [4, 6, 1, 3, 5, 7, 2], color: "green" }
};

export const stations = {
  1: {
    name: { ru: "Цветные мячи", et: "Värvilised pallid" }, icon: "🟢",
    description: { ru: "Соберите все цветные мячи и разложите их по кольцам соответствующего цвета.", et: "Koguge kõik värvilised pallid kokku ja viige need õiget värvi rõngasse." },
    details: {
      ru: ["Синий мяч → синее кольцо", "Розовый мяч → розовое кольцо", "Зелёный мяч → зелёное кольцо", "Жёлтый мяч → жёлтое кольцо", "Каждый мяч должен оказаться в кольце правильного цвета."],
      et: ["Sinine pall → sinine rõngas", "Roosa pall → roosa rõngas", "Roheline pall → roheline rõngas", "Kollane pall → kollane rõngas", "Iga pall peab jõudma õiget värvi rõngasse."]
    },
    time: { ru: "До выполнения", et: "Kuni ülesanne on tehtud" },
    equipment: { ru: "Цветные мячи и 4 цветных кольца", et: "Värvilised pallid ja 4 värvilist rõngast" },
    result: { type: "status" }, photo: ""
  },
  2: {
    name: { ru: "Баскетбольный бросок", et: "Korvpalli vise" }, icon: "🏀",
    description: { ru: "Каждый ученик делает один бросок. В конце очки всего класса складываются.", et: "Iga õpilane teeb ühe viske. Lõpus liidetakse kogu klassi punktid kokku." },
    details: {
      ru: ["Мимо большого кольца — 0 очков", "В большое, но не в маленькое кольцо — 1 очко", "В маленькое кольцо — 3 очка"],
      et: ["Suurest rõngast mööda — 0 punkti", "Suurde, kuid mitte väikesesse rõngasse — 1 punkt", "Väikesesse rõngasse — 3 punkti"]
    },
    time: { ru: "По одному броску", et: "Üks vise õpilase kohta" },
    equipment: { ru: "Мячи, большое кольцо и 4–5 маленьких колец", et: "Pallid, suur rõngas ja 4–5 väikest rõngast" },
    result: { type: "counter", unit: { ru: "очков", et: "punkti" }, steps: [1, 3] }, photo: ""
  },
  3: {
    name: { ru: "Удар по футбольным воротам", et: "Jalgpalli väravalöök" }, icon: "⚽",
    description: { ru: "Каждый ученик получает одну попытку забить мяч в ворота.", et: "Iga õpilane saab ühe võimaluse lüüa pall väravasse." },
    details: {
      ru: ["Мимо ворот — 0 голов", "В ворота — 1 гол", "В конце посчитайте все голы класса."],
      et: ["Väravast mööda — 0 väravat", "Väravasse — 1 värav", "Lõpus lugege kokku kõik klassi väravad."]
    },
    time: { ru: "По одной попытке", et: "Üks katse õpilase kohta" },
    equipment: { ru: "Футбольный мяч и ворота", et: "Jalgpall ja värav" },
    result: { type: "counter", unit: { ru: "голов", et: "väravat" }, steps: [1] }, photo: ""
  },
  4: {
    name: { ru: "Прыжки всего класса", et: "Kui kaugele klass hüppab?" }, icon: "🦘",
    description: { ru: "Ученики прыгают по очереди. Каждый начинает с места приземления предыдущего.", et: "Õpilased hüppavad järjest. Iga järgmine alustab eelmise maandumiskohast." },
    details: {
      ru: ["Начните со стартовой линии.", "Все ученики класса прыгают по очереди.", "Измерьте общую дистанцию в метрах."],
      et: ["Alustage stardijoonelt.", "Kõik klassi õpilased hüppavad järjest.", "Mõõtke kogu vahemaa meetrites."]
    },
    time: { ru: "До последнего ученика", et: "Kuni viimane õpilane on hüpanud" },
    equipment: { ru: "Рулетка длиной 50 метров", et: "50-meetrine mõõdulint" },
    result: { type: "measurement", unit: { ru: "метров", et: "meetrit" }, step: 0.1 }, photo: ""
  },
  5: {
    name: { ru: "Передача мяча", et: "Palli söötmine" }, icon: "🏐",
    description: { ru: "Передайте мяч по зигзагообразной линии через весь класс и забросьте его в корзину.", et: "Söötke pall siksakilises reas läbi kogu klassi ja visake see korvi." },
    details: {
      ru: ["Ученики стоят на расстоянии 1–2 метра.", "Мяч должен пройти через каждого ученика.", "Последний ученик бросает мяч в корзину."],
      et: ["Õpilased seisavad 1–2 meetri kaugusel.", "Pall peab liikuma läbi kõigi õpilaste.", "Viimane õpilane viskab palli korvi."]
    },
    time: { ru: "На скорость", et: "Kiiruse peale" }, equipment: { ru: "Мяч и корзина", et: "Pall ja korv" },
    result: { type: "duration" }, photo: ""
  },
  6: {
    name: { ru: "Полоса препятствий", et: "Takistusrada" }, icon: "🏃",
    description: { ru: "Каждый ученик проходит всю полосу и передаёт мяч следующему.", et: "Iga õpilane läbib kogu takistusraja ja annab palli järgmisele." },
    details: {
      ru: ["Пробежать змейкой между конусами.", "Перепрыгнуть препятствия как зайчик.", "Пройти координационную лестницу.", "Добежать до конуса, положить мяч и вернуться."],
      et: ["Joosta siksakis ümber koonuste.", "Hüpata jänesehüpetega üle takistuste.", "Läbida koordinatsiooniredel.", "Jõuda koonuseni, panna pall maha ja tulla tagasi."]
    },
    time: { ru: "На скорость", et: "Kiiruse peale" }, equipment: { ru: "Конусы, препятствия, лестница и мяч", et: "Koonused, takistused, redel ja pall" },
    result: { type: "duration" }, photo: ""
  },
  7: {
    name: { ru: "Переправа через лужи", et: "Jump the Puddle" }, icon: "💦",
    description: { ru: "Доберитесь до мячей и принесите их обратно, передвигаясь только внутри колец.", et: "Jõudke pallideni ja tooge need tagasi, liikudes ainult rõngaste sees." },
    details: {
      ru: ["У класса есть 4–5 больших колец.", "Передвигайте кольца вперёд всей командой.", "Наступать за пределы колец нельзя!"],
      et: ["Klassil on 4–5 suurt rõngast.", "Liigutage rõngaid meeskonnaga edasi.", "Rõngast välja astuda ei tohi!"]
    },
    time: { ru: "До выполнения", et: "Kuni ülesanne on tehtud" }, equipment: { ru: "4–5 больших колец и мячи", et: "4–5 suurt rõngast ja pallid" },
    result: { type: "status" }, photo: "/assets/station-7.png"
  }
};

export function getClassById(classId) { return classes[classId] || null; }
export function getStationById(stationId) { return stations[Number(stationId)] || null; }
