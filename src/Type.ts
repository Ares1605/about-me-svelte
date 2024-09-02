import { TyperExecutable } from "./TyperExecutable";

export type cursorType = {
  hidden: boolean,
  full: boolean,
  blink: boolean,
  stay: boolean
};
export type letterType  = {
  letter: string,
  ele: Node,
  nextDelay: number // 0 for default
};
export type lettersType = letterType[];
export class Type {
  /*
   * this is where text is "typed",
   * and shown to the user
   */
  container: HTMLElement;
  /*
   * this is where text changes first go,
   * it does not take up space in the DOM,
   * simply a placeholder to dump the <slot> into
   */
  hiddenContainer: HTMLElement;
  /*
   * this is where space is assigned,
   * it's is an "invisible" element sitting behind container,
   * with the necessary space to type everything out
   */
  invisibleContainer: HTMLElement; 
  delayMultiplier: number;
  cursorEle: HTMLDivElement;
  cursor: cursorType;

  /*
   * the running and awaitingCallback properties are coupled together,
   * if a run function is called while running is true, the run function
   * will place itself into the awaitingCallback, and next time a type
   * operation occurs, it will find awaitingCallback is not null, stop
   * its kill its operation, and run the callback.
   */
  running: boolean = false; // whether something is currently being typed
  awaitingCallback: (() => void) | null = null; // a callback to run a typing operation
  typeTimeout: number = 0;
  blinkTimeout: number = 0;

  // represents the current markup (inside this.container)
  typedMarkup: Set<Node> = new Set();

  constructor(hiddenContainer: HTMLElement, invisibleContainer: HTMLElement, container: HTMLElement, delayMultiplier: number, cursorEle: HTMLDivElement, cursor: cursorType) {
    this.delayMultiplier = delayMultiplier;
    this.container = container;
    this.hiddenContainer = hiddenContainer;
    this.invisibleContainer = invisibleContainer;
    this.cursorEle = cursorEle;
    this.cursor = cursor;
  }
  private killRunOperations() {
    clearTimeout(this.blinkTimeout);
    clearTimeout(this.typeTimeout);
  }
  private complete() {
    this.blinkTimeout = setTimeout(() => {
      this.cursor.hidden = true;
      if (this.cursor.stay) {
        this.cursor.full = true;
        this.cursor.blink = true;
      }
    }, 450);
  }
  private setNodeText(node: Node, text: string) {
    if (node.nodeType === Node.ELEMENT_NODE)
      return (node as HTMLElement).innerHTML = text;
    return node.textContent = text;
  }
  private getNodeText = (node: Node | HTMLElement) => {
    return node.nodeType === Node.ELEMENT_NODE
      ? (node as HTMLElement).innerHTML
      : node.textContent ?? "";
  }
  private updateInvisibleCont() {
    this.invisibleContainer.innerHTML = this.hiddenContainer.innerHTML;
  }
  private getTypedMarkup() {
    const markup: Set<Node> = new Set();
    const nodes = [...this.container.childNodes];
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i] as HTMLElement | Node;
      if (!("classList" in node) || !node.classList.contains("cursor"))
        markup.add(node);
    } 
    return markup;
  }
  run() {
    this.killRunOperations();
    if (this.hiddenContainer.childNodes.length === 0) {
      this.complete();
      return;
    }
    const exec = new TyperExecutable(this.hiddenContainer, this.getTypedMarkup());
    const letters = exec.run();
    let letterI = 0;
    const nextType = (): null | letterType => {
      const letter = letters[letterI];
      letterI++;
      if (letter === undefined) return null;
      return letter;
    }
    let firstLetter = true;
    const wrapper = (delay: number) => {
      this.typeTimeout = setTimeout(() => {
        const inner = () => {
          const type = nextType();
          if (type === null) {
            this.complete();
            return;
          };
          this.container.insertBefore(type.ele, this.cursorEle);
          const text = this.getNodeText(type.ele);
          if (type.letter === "bkspc") {
            this.setNodeText(type.ele, text.slice(0, -1));
          } else {
            if (firstLetter) {
              firstLetter = false;
              this.updateInvisibleCont();
            }
            this.setNodeText(type.ele, text + type.letter);
          }
          wrapper(type.nextDelay);
        }
        inner();
      }, delay * this.delayMultiplier);
    }
    wrapper(150);
  }
}
