import { type lettersType } from "./Type";
type partialNodeType = {
  node: Node,
  text: string
} | undefined;
type nodeDifferenceType = {
  delNodes: Node[],
  addNodes: Node[],
  looselyEqualNodeDiff: {
    ele: Node,
    dels: string,
    adds: string
  } | null
};

export class TyperExecutable {
  execContainer: HTMLElement;
  typedMarkup: Set<Node>;
  letters: lettersType = [];
  dftDelay = 40;
  bkspcDelay = .6; // backspace delay multiplier

  constructor(container: HTMLElement, typedMarkup: Set<Node>) {
    this.execContainer = container;
    this.typedMarkup = typedMarkup;
  }
  private getFilteredNodes(nodes: NodeListOf<Node> | Set<Node>) {
    const list: Node[] = [];
    for (const node of nodes) {
      if (([Node.ELEMENT_NODE, Node.TEXT_NODE] as number[]).includes(node.nodeType))
        list.push(node);
    }
    return list;
  }
  private injectBkspcs() {
    const changeDelay = (index: number, multiplier: number) => {
      if (index !== 0) this.letters[index - 1].nextDelay = this.dftDelay * multiplier;
    }
    const addMistake = (startI: number, endI: number) => {
      if (Math.floor(Math.random() * 2) === 0 && startI !== endI) {
        // swap first two chars
        const firstLetter = this.letters[startI].letter;
        this.letters[startI].letter = this.letters[startI + 1].letter;
        this.letters[startI + 1].letter = firstLetter;
      } else {
        this.letters[startI].letter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
      }
    }

    const min = 2;
    const max = 4;
    let lastBkspcI: number|null = null;
    for (let i = min; i < this.letters.length; i++) {
      let contLen = Math.floor(Math.random() * (max - min)) + min;
      if (Math.random() < 1/40) {
        if (i < contLen) {
          contLen = i;
        }
        if (lastBkspcI != null && lastBkspcI >= i - (contLen - 1))
          contLen = i - lastBkspcI - 1;
        const toContinueDelay = this.letters[i - (contLen - 1)].nextDelay;
        for (let j = 0; j < contLen; j++) {
          const toAppendI = i + j + 1;
          this.letters.splice(toAppendI, 0, {
            letter: "bkspc",
            ele: this.letters[i - j].ele,
            nextDelay: 0
          });
        }
        for (let j = 0; j <= contLen - 1; j++) {
          this.letters.splice(i + contLen + 1, 0, { ...this.letters[i -j]});
        }
        for (let j = 0; j < contLen; j++) {
          const toAppendI = i + j + 1;
          changeDelay(toAppendI, this.bkspcDelay);
        }
        addMistake(i - (contLen - 1), i);
        this.letters[i + contLen].nextDelay = toContinueDelay;
        this.letters[i].nextDelay += 350;
        lastBkspcI = contLen + i;
        i += contLen * 2 + min;
      }
    }
  }
  private injectDelays () {
    const mutatable = this.letters.slice(1);
    const mutLetters = mutatable.map(type => type.letter);
    const changeDelay = (index: number, multiplier: number) => {
      if (index !== 0) mutatable[index - 1].nextDelay = this.dftDelay * multiplier;
    }
    const puncs = [
      '.', ',', '!', '?', ':', ';', '-', '–', '—', 
      '(', ')', '[', ']', '{', '}', "'", '"', 
      '...', '/', '\\', '|', '_', '&', '@', '#', 
      '%', '^', '~', '`', '*', '+', '=', '<', '>', '$'
    ];
    for (let i = 0; i < mutLetters.length; i++) {
      const letter = mutLetters[i];
      let skip = false;
      const searchPhrases = (phrases: string[], delayMultiplier: number) => {
        for (const phrase of phrases) {
          if (mutLetters.length - i >= phrase.length) {
            const trunced = mutLetters.slice(i, i + phrase.length);
            if (phrase === trunced.join("")) {
              trunced.map((_, j) => changeDelay(i + j, delayMultiplier));

              i += phrase.length - 1;

              skip = true;
              break;
            }
          }
        }
      }

      if (letter === "bkspc") {
        changeDelay(i, this.bkspcDelay);
      }
      if (puncs.includes(letter)) {
        changeDelay(i, 1.2);
        continue;
      }

      searchPhrases(["and", "out", "is", "as"], .7);
      if (skip) continue;
      searchPhrases(["from", "in"], 1.4);
      if (skip) continue;

      if (letter === "") {
        changeDelay(i, 2.5);
        continue;
      }
      if (letter === letter.toUpperCase()) {
        changeDelay(i, 1.8);
        continue;
      }

      if (letter === " ") {
        changeDelay(i, .7);
        continue;
      }
      if (i >= 3 && mutLetters.slice(i - 4, i).includes(" ")) { // this is part of first three letters
        changeDelay(i, .8);
        continue;
      }
      changeDelay(i, 1);
    }
  }
  private getWordDifference(cmpWith: string, cmpTo: string) {
    const cmpWithLen = cmpWith.length;
    const cmpToLen = cmpTo.length;
    for (let i = 0; i < cmpWithLen; i++) {
      if (i === cmpToLen) {
        return ['', cmpWith.slice(i)];
      }
      if (cmpWith[i] !== cmpTo[i]) {
        return [cmpTo.slice(i), cmpWith.slice(i)];
      }
    }
    return [cmpTo.slice(cmpWith.length), ''];
  }
  private getNodeText = (node: Node | HTMLElement) => {
    return node.nodeType === Node.ELEMENT_NODE
      ? (node as HTMLElement).innerHTML
      : node.textContent ?? "";
  }
  private isLooselyEqualNodes(first: Node, second: Node) {
    // move over the text content and test equality
    const clonedFirst = first.cloneNode();
    clonedFirst.textContent = second.textContent;
    return clonedFirst.isEqualNode(second);
  }
  private nodesToBkspcs(nodes: Node[], partialNode: partialNodeType) { return this.nodesToLetters(nodes, partialNode, "bkspc") }
  private nodesToLetters(nodes: Node[], partialNode: partialNodeType, overrideLetter?: string) {
    const processLetter = (letter: string) => overrideLetter === undefined ? letter : overrideLetter
    const letters: lettersType = [];
    if (partialNode) {
      for (const letter of partialNode.text) {
        letters.push({
          ele: partialNode.node,
          letter: processLetter(letter),
          nextDelay: 0 // default to 0
        });
      }
    }

    for (const node of nodes) {
      const text = this.getNodeText(node);
      const len = text.length;
      if (len === 0) {
        letters.push({
          ele: node,
          letter: "",
          nextDelay: 0 // default to 0
        });
      } else {
        for (let i = 0; i < len; i++) {
          letters.push({
            ele: node,
            letter: processLetter(text[i]),
            nextDelay: 0 // default to 0
          });
        }
      }
    }
    return letters;
  }
  private getNodesDifference(cmpWith: Node[], cmpTo: Node[]): nodeDifferenceType {
    const cmpWithLen = cmpWith.length
    const cmpToLen = cmpTo.length;
    for (let i = 0; i < cmpWithLen; i++) { // check for differences relative ot compareWith length
      const cmpWithChild = cmpWith[i];

      if (i === cmpToLen) {
        const addNodes = [...cmpWith].slice(i);
        return {
          delNodes: [],
          addNodes: addNodes,
          looselyEqualNodeDiff: null
        };
      }

      const cmpToChild = cmpTo[i];
      if (cmpWithChild.isEqualNode(cmpToChild)) continue;

      if (this.isLooselyEqualNodes(cmpWithChild, cmpToChild)) {
        const [dels, adds] = this.getWordDifference(this.getNodeText(cmpWithChild), this.getNodeText(cmpToChild));

        const delNodes = [...cmpTo].slice(i + 1);
        const addNodes = [...cmpWith].slice(i + 1);
        return {
          delNodes: delNodes,
          addNodes: addNodes,
          looselyEqualNodeDiff: { ele: cmpToChild, dels: dels, adds: adds }
        };
      } else {
        const delNodes = [...cmpTo].slice(i);
        const addNodes = [...cmpWith].slice(i);
        return {
          delNodes: delNodes,
          addNodes: addNodes,
          looselyEqualNodeDiff: null
        };
      }
    }
    // the for loop goes until the compareWith length, now we will add the rest of the
    // compareTo nodes we couldn't get to, onto the differences
    return {
      delNodes: [...cmpTo].slice(cmpWithLen),
      addNodes: [],
      looselyEqualNodeDiff: null
    }
  }
  public run() {
    const clonedExecCont = this.execContainer.cloneNode(true);
    const cmpWith = this.getFilteredNodes(clonedExecCont.childNodes);
    const cmpTo = this.getFilteredNodes(this.typedMarkup);
    const nodesDiff = this.getNodesDifference(cmpWith, cmpTo);
    console.log(nodesDiff);

    let bkspcsPartialNode: partialNodeType = undefined;
    if (nodesDiff.looselyEqualNodeDiff)
      bkspcsPartialNode = {
        node: nodesDiff.looselyEqualNodeDiff.ele,
        text: nodesDiff.looselyEqualNodeDiff.dels
      };
    const bkspcs = this.nodesToBkspcs(nodesDiff.delNodes, bkspcsPartialNode);

    let lettersPartialNode: partialNodeType = undefined;
    if (nodesDiff.looselyEqualNodeDiff)
      lettersPartialNode = {
        node: nodesDiff.looselyEqualNodeDiff.ele,
        text: nodesDiff.looselyEqualNodeDiff.adds
      };
    this.letters = this.nodesToLetters(nodesDiff.addNodes, lettersPartialNode);
    this.letters = bkspcs.reverse().concat(this.letters);

    for (const node of cmpWith) {
      node.textContent = "";
    }

    this.injectDelays();
    this.injectBkspcs();
    console.log(this.letters);
    return this.letters;
  }
}
