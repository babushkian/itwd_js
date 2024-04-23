const mainTabObjects = [
  {
    id: "main_firms",
    name: "фирмы",
    endpoint: "feq",
  },
  /*
  {
    id: "main_staff",
    name: "люди",
    endpoint: "feq",
  },
  {
    id: "main_statistics",
    name: "статистика",
    endpoint: "feq",
  },
  */
];

const tabObjects = [
  {
    id: "firm_staff",
    name: "сотрудники",
    endpoint: "current_staff",
    attributes: { firm: "id", date: "simDate" },
    title: { entity: "Сведения о фирме", embedded: ["name", "simDate"] },
  },
  {
    id: "firm_rating",
    name: "рейтинг",
    endpoint: "rating_history",
    attributes: { firm: "id", date: "simDate" },
    title: {
      entity: "Сведения о струдниках фирмы",
      embedded: ["name", "simDate"],
    },
  },
  /*
  {
    id: "firm_history",
    name: "история",
    endpoint: "feq",
  },
  */
];

import { BASE_URL } from "./utils.js";

class Tab {
  constructor(initObj) {
    this.endpoint = initObj.endpoint;
    this.attributes = initObj.attributes;
  }
}

export { mainTabObjects, tabObjects, Tab };
