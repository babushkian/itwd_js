import { Panel } from "./panels.js";
import { SidePanel } from "./side_panel.js";
import { Timer } from "./timer.js";
import { mainTabs, firmTabs, peopleTabs } from "./tabs.js";
import { Frame } from "./frame.js";

export class View {
  constructor(mainTabUrl) {
    const root = document.querySelector(".content");
    this.mainTabUrl = mainTabUrl;
    this.timer = new Timer();
    this.left = new Frame(root, "main");
    this.right = new Frame(root, "details");

    this.mainPanel = new SidePanel(mainTabs, this.left.element);
    this.firmPanel = new SidePanel(firmTabs, this.right.element);
    this.peoplePanel = new SidePanel(peopleTabs, this.right.element);

    this.mainPanel.addChild("main_firms", this.firmPanel);
    this.mainPanel.addChild("main_staff", this.peoplePanel);
    console.log("потомки ", this.mainPanel.children);

    const incomeObj = { simDate: this.timer.mainDate.value };
    this.mainPanel.drawPanel(incomeObj);

    // измненение даты (перрерисовывать всю панель не нужно, только таблицу)
    this.timer.timerElement.addEventListener("dateChanged", (e) => {
      const incomeObj = { simDate: e.detail.currentDate };
      this.mainPanel.changeContent(incomeObj);
    });
  }

  async getStat(date) {
    const URL = `http://127.0.0.1:5000/fstatus?date=${date}`;
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
}
