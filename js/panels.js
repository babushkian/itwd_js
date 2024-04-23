"use strict";

import { Table } from "./table.js";

export class Panel {
  constructor(tabObj, root) {
    this.root = root;
    this.currentTab = null;
    this.tabObject = tabObj;
    this.createPanel();
    this.table = new Table(this);
  }
  createPanel() {
    this.tabsPanel = document.createElement("div");
    this.tabsPanel.className = "tabs_panel";
    this.root.appendChild(this.tabsPanel);

    this.content = document.createElement("div");
    this.content.className = "content__window";
    this.root.appendChild(this.content);
    this.buildPanel();
  }

  buildPanel() {
    function listenTabPanel(event) {
      const a = event.target.closest(".tab");
      if (a) {
        this.currentTab.classList.remove("active_tab");
        a.classList.add("active_tab");
        this.currentTab = a;
      }
    }

    this.tabsPanel.innerHTML = "";
    this.tabObject.forEach((tab, index) => {
      const tb = document.createElement("button");

      tb.className = "tab";

      if (!this.currentTab) {
        this.currentTab = tb;
        tb.classList.add("active_tab");
      }
      tb.setAttribute("id", tab.id);

      tb.innerHTML = `<span>${tab.name}</span>`;
      this.tabsPanel.appendChild(tb);
    });

    const listen = listenTabPanel.bind(this);
    this.tabsPanel.addEventListener("click", (event) => {
      listen(event);
    });
  }
}
