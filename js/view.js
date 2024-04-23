import { Panel } from "./panels.js";
import { SidePanel } from "./side_panel.js";
import { Timer } from "./timer.js";
import { mainTabs, firmTabs } from "./tabs.js";
import { Frame } from "./frame.js";

export class View {
  constructor(mainTabUrl) {
    const root = document.querySelector(".content");
    this.mainTabUrl = mainTabUrl;
    this.timer = new Timer();
    this.left = new Frame(root, "main");
    this.right = new Frame(root, "details");

    this.mainPanel = new Panel(mainTabs, this.left.element);
    this.firmPanel = new SidePanel(firmTabs, this.right.element);
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
    this.firmPanel.signalFromParent(incomeObj);
    const x = this.tableListen.bind(this, date);
    this.mainPanel.table.table.addEventListener("click", x);
  }

  tableListen(date, event) {
    const cell = event.target;
    const selectedRow = cell.closest("tr");
    if (selectedRow) {
      this.mainPanel.table.currentRow = selectedRow.dataset.id;
      const incomeObj = { ...this.mainPanel.table.rowObject, simDate: date };
      this.firmPanel.signalFromParent(incomeObj);
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
    this.firmPanel.table.update(titleObject, cd);
  }
}
