import { Table } from "./table.js";
import { BASE_URL } from "./utils.js";
export class SidePanel {
  constructor(name, tabObj) {
    this.currentTabElement = null;
    this.currentTabIndex = 0;
    this.tabObject = tabObj;
    this.createPanel(name);
    this.table = new Table(this);
    this.jsonObj = null;
  }
  createPanel(name) {
    const r = document.createElement("div");
    r.className = `half ${name}`;
    const root = document.querySelector(".content");
    root.appendChild(r);
    this.tabsPanel = document.createElement("div");
    this.tabsPanel.className = "tabs_panel";
    r.appendChild(this.tabsPanel);

    this.content = document.createElement("div");
    this.content.className = "content__window";
    r.appendChild(this.content);
    this.buildPanel();
  }

  buildPanel() {
    function listenTabPanel(event) {
      const a = event.target.closest(".tab");
      if (a && a.dataset.id != this.currentTabIndex) {
        this.currentTabElement.classList.remove("active_tab");
        a.classList.add("active_tab");
        this.currentTabElement = a;
        this.currentTabIndex = parseInt(a.dataset.id);
        this.getInfo();
      }
    }

    this.tabsPanel.innerHTML = "";
    this.tabObject.forEach((tab, index) => {
      const tb = document.createElement("button");

      tb.className = "tab";

      if (!this.currentTabElement) {
        this.currentTabElement = tb;
        this.currentTabIndex = index;
        tb.classList.add("active_tab");
      }
      // tb.setAttribute("id", tab.id);
      tb.dataset.id = index;

      tb.innerHTML = `<span>${tab.name}</span>`;
      this.tabsPanel.appendChild(tb);
    });

    const listen = listenTabPanel.bind(this);
    this.tabsPanel.addEventListener("click", (event) => {
      listen(event);
    });
  }

  async signalFromParent(incomeObj) {
    this.incomeObj = incomeObj;
    this.getInfo();
  }

  async getInfo() {
    const URL = `http://127.0.0.1:5000/rating_history?firm=${this.incomeObj.id}&date=${this.incomeObj.simDate}`;
    const DATA = this.tabObject[this.currentTabIndex];
    let url = `${BASE_URL}/${DATA.endpoint}?`;
    const requestParams = [];
    for (let key in DATA.attributes) {
      requestParams.push(`${key}=${this.incomeObj[DATA.attributes[key]]}`);
    }

    url += requestParams.join("&");
    console.log(url, requestParams);
    const data = await fetch(url);
    this.jsonObj = await data.json();
    console.log(DATA.title);
    const titleObject = {
      entnty: DATA.title.entity,
    };
    DATA.title.embedded.forEach((key) => {
      titleObject[key] = this.incomeObj[key];
    });
    console.log(titleObject);

    this.table.update(titleObject, this.jsonObj);
  }
}
