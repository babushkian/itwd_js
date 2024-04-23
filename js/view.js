import { Panel } from "./panels.js";
import { SidePanel } from "./side_panel.js";
import { Timer } from "./timer.js";
import { mainTabObjects, tabObjects } from "./tabs.js";

export class View {
  constructor(mainTabUrl) {
    this.mainTabUrl = mainTabUrl;
    this.timer = new Timer();
    this.mainPanel = new Panel("main", mainTabObjects);
    this.sidePanel = new SidePanel("details", tabObjects);
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

    const incomeObj = { ...this.mainPanel.table.rowObject, simDate: date };
    this.sidePanel.signalFromParent(incomeObj);
    const x = this.tableListen.bind(this, date);
    this.mainPanel.table.table.addEventListener("click", x);
  }

  tableListen(date, event) {
    const cell = event.target;
    const selectedRow = cell.closest("tr");
    if (selectedRow) {
      this.mainPanel.table.currentRow = selectedRow.dataset.id;
      const incomeObj = { ...this.mainPanel.table.rowObject, simDate: date };
      this.sidePanel.signalFromParent(incomeObj);
    }
  }

  async getSideInfo({ id, name }, date) {
    const URL = `http://127.0.0.1:5000/rating_history?firm=${id}&date=${date}`;
    const data = await fetch(URL);
    const cd = await data.json();

    const titleObject = {
      entnty: "Сведения о фирме",
      name: `"${name}"`,
      date,
    };
    this.sidePanel.table.update(titleObject, cd);
  }
}
