const mainTabs = [
  {
    id: "main_firms",
    name: "фирмы",
    endpoint: "fstatus",
    attributes: { date: "simDate" },
    title: { entity: "Информация о фирмах", embedded: ["name", "simDate"] },
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

const firmTabs = [
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

  {
    id: "firm_history",
    name: "история",
    endpoint: "feq",
  },
  {
    id: "firm_directors",
    name: "директора",
    endpoint: "current_staff",
    attributes: { firm: "id", date: "simDate" },
    title: {
      entity: "Директора в фирмах",
      embedded: ["name"],
    },
  },
];

const peopleTabs = [
  {
    id: "people_info",
    name: "сведения",
    endpoint: "man_info",
    attributes: { man: "id", date: "simDate" },
    title: { entity: "Информация о человеке", embedded: ["simDate"] },
  },
];

import { BASE_URL } from "./utils.js";

class Tab {
  constructor(initObj) {
    this.endpoint = initObj.endpoint;
    this.attributes = initObj.attributes;
  }
}

export { mainTabs, firmTabs, Tab };
