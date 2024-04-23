import { convertInputToString } from "./utils.js";

export class Table {
  constructor({ content }) {
    this.tableSlot = content;
    this.tableContent = null;
    this._row = 0; // текущая выбранная строка в таблице. Нужна чтобы выводить информацию в подчиненное окно
  }

  get rowObject() {
    return this.tableContent.data[this._row];
  }

  /**
   * @param {Number} value
   */
  set currentRow(value) {
    this._row = parseInt(value);
  }

  update(titleObject, cd) {
    this.tableContent = cd;
    // удаляем созданные заголовок и таблицу
    while (this.tableSlot.firstChild) {
      this.tableSlot.removeChild(this.tableSlot.firstChild);
    }

    this.createTitle(titleObject);
    this.buildTable();
  }

  createTitle(titleObject) {
    const tt = document.createElement("div");
    tt.innerText = `${titleObject.entnty} ${titleObject.name} на ${titleObject.simDate}`;
    // tt.innerText = `${titleObject.entnty} ${
    //   titleObject.name
    // } на ${convertInputToString(titleObject.simDate)}`;

    tt.className = "title";
    this.tableSlot.appendChild(tt);
  }

  buildTable() {
    const { order, header, data } = this.tableContent;
    //создаем таблицу
    // сначала контейнел для таблицы
    const tc = document.createElement("div");
    tc.className = "table";
    this.tableSlot.appendChild(tc);
    // затем саму таллицу

    this.table = document.createElement("table");
    tc.appendChild(this.table);
    // ее заголовок
    const th = document.createElement("tr");
    this.table.appendChild(th);

    // и сами данные
    order.forEach((el) => {
      const thd = document.createElement("th");
      thd.innerText = header[el];
      th.appendChild(thd);
    });
    data.forEach((element, index) => {
      const tr = document.createElement("tr");
      tr.dataset.id = index;
      this.table.appendChild(tr);
      if (element.hasOwnProperty("active")) {
        if (!element.active) {
          tr.classList.add("not_active");
        }
      }
      order.forEach((key) => {
        let a = document.createElement("td");
        if (!key.includes("_date")) {
          a.innerText = element[key];
        } else {
          if (element[key]) {
            const d = new Date(element[key]);
            a.innerText =
              d.getDate().toString().padStart(2, "0") +
              "." +
              (d.getMonth() + 1).toString().padStart(2, "0") +
              "." +
              d.getFullYear();
          } else {
            a.innerText = "";
          }
        }
        tr.appendChild(a);
      });
    });
  }
}
