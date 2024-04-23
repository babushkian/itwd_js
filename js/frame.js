export class Frame {
  constructor(root, name) {
    this.element = document.createElement("div");
    this.element.className = `half ${name}`;
    root.appendChild(this.element);
  }

  clear() {
    this.element.innerHTML = "";
  }
}
