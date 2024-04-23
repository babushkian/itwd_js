import { Table } from "./table.js";
import { BASE_URL } from "./utils.js";
export class SidePanel {
  constructor(tabObj, root) {
    //элемент DOM, внутри которого должна прорисовываться панель
    this.root = root;
    //указательна родительскую панель
    this.parent = null;
    // список дочерних панелей]
    this.children = {};
    // параметр, incomeObj передаваемый из родительского элемента. Служит для двух целей
    // 1) из него берутся параметры для get-запроса для построения таблицы
    // 2) из него берутся параметры для формирования заголовка (прмпример, название фирмы и дата)
    // параметр сохраняется для того, чтобы можно было в одной панели переключаться между вкладками
    this.incomeObj = null;
    this.currentTabElement = null;
    this.currentTabIndex = 0;
    this.tabObject = tabObj;
    console.log("конфирурация", tabObj);
    this.createPanel();
    this.table = new Table(this);
    this.jsonObj = null;
    //буду ссылаться на обьект панели по id из объекта tabObject
    //this.children[this.tabObject[this.currentTabIndex].id]
  }

  createPanel() {
    //создается место под вкладки
    this.tabsPanel = document.createElement("div");
    this.tabsPanel.className = "tabs_panel";
    this.root.appendChild(this.tabsPanel);
    // создается место под таблицу с заголовком
    this.content = document.createElement("div");
    this.content.className = "content__window";
    this.root.appendChild(this.content);
  }

  drawPanel(incomeObj) {
    function listenTabPanel(event) {
      // при переключении вкладки формируется новая таблица, this.incomeObj не меняется
      // в соответствии с параметрами, куазанными  в конфигурационном объекте this.tabObject
      // на один из элементов которого указывает this.currentTabIndex
      const a = event.target.closest(".tab");
      if (a && a.dataset.id != this.currentTabIndex) {
        this.currentTabElement.classList.remove("active_tab");
        a.classList.add("active_tab");
        this.currentTabElement = a;
        this.currentTabIndex = parseInt(a.dataset.id);
        this.getInfo();
      }
    }
    // создаются вкладки на панели вкладок
    // определяется текущая вкладка и индекс текущей вкладки - указатель на конфигураионный объект
    this.tabsPanel.innerHTML = "";
    this.tabObject.forEach((tab, index) => {
      const tb = document.createElement("button");
      tb.className = "tab";
      if (!this.currentTabElement) {
        this.currentTabElement = tb;
        this.currentTabIndex = index;
        tb.classList.add("active_tab");
      }
      tb.dataset.id = index;
      tb.innerHTML = `<span>${tab.name}</span>`;
      this.tabsPanel.appendChild(tb);
    });
    // прослушивание закоадок, чтобы менять таблицы
    const listen = listenTabPanel.bind(this);
    this.tabsPanel.addEventListener("click", (event) => {
      listen(event);
    });
    // запрос и отрисовка табличной части
    this.changeContent(incomeObj);
  }

  async changeContent(incomeObj) {
    this.incomeObj = incomeObj;
    this.getInfo();
  }

  async getInfo() {
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
