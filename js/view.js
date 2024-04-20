import { Panel } from "./panels.js";
import { Timer } from "./timer.js";
import { mainTabObjects, tabObjects } from "./tabs.js";

export class View {
  constructor(mainTabUrl) {
    this.mainTabUrl = mainTabUrl;
    this.timer = new Timer();
    this.mainPanel = new Panel("main", mainTabObjects);
    this.sidePanel = new Panel("details", tabObjects);
    this.getStat(this.timer.mainDate.value);

    this.timer.timerElement.addEventListener("dateChanged", (e) => {
      this.getStat(e.detail.currentDate);
    });
  }

  async getStat(date) {
    const URL = `http://127.0.0.1:5000/${this.mainTabUrl}/${date}`;
    const data = await fetch(URL);
    const cd = await data.json();
    const titleObject = { entnty: "Информация о фирмах", name: "", date };
    this.mainPanel.table.update(titleObject, cd);

    const firmId = cd.data[0]["id"];
    const firmName = cd.data[0]["name"];
    await this.getSideInfo(firmId, firmName, date);
  }

  async getSideInfo(firmId, firmName, date) {
    const URL = `http://127.0.0.1:5000/rating_history?firm=${firmId}&date=${date}`;
    const data = await fetch(URL);
    const cd = await data.json();

    const titleObject = {
      entnty: "Сведения о фирме",
      name: `"${firmName}"`,
      date,
    };
    this.sidePanel.table.update(titleObject, cd);
  }
}
