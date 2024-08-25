<script lang="ts">
import Cursor from "./Cursor.svelte";
import { onMount } from "svelte";
export let delayMultiplier: number = 1;
export let justify: string = "left";
export let cursorStay = false;
export let cursorHidden = false;
export let cursorFull = false;
export let cursorBlink = false;

let hiddenContainer: HTMLDivElement;
let container: HTMLDivElement;
let cursor: HTMLDivElement;
class NodeLL { // Node Linked List
  currentNode : ChildNode;
  constructor(currentNode: ChildNode) {
    this.currentNode = currentNode;
  }
  hasNext() { return this.currentNode.nextSibling !== null; }
  next() {
    if (this.currentNode.nextSibling === null)
      throw Error("Next node cannot be null when calling 'next' func");
    return this.currentNode = this.currentNode.nextSibling;
  }
  get() { return this.currentNode; }
}
class Type {
  backspaceCount = 0;
  forceComplete: boolean;
  nodeLL: NodeLL;
  container: HTMLElement;
  hiddenParent: HTMLElement;
  delayMultiplier: number;

  constructor(hiddenContainer: HTMLElement, container: HTMLElement, delayMultiplier: number) {
    this.delayMultiplier = delayMultiplier;
    this.container = container;
    this.hiddenParent = hiddenContainer;
    if (hiddenContainer.childNodes.length === 0) {
      this.nodeLL = new NodeLL(hiddenContainer); // temporary hold to satisy node: NodeLL instead of node: NodeLL|null
      this.forceComplete = true;
    } else {
      this.nodeLL = new NodeLL(hiddenContainer.childNodes[0]);
      this.forceComplete = false;
    }
  }
  private cloneNode() {
    const node = this.nodeLL.currentNode;
    if (node.nodeType === Node.TEXT_NODE) {
      return document.createTextNode("");
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const cloned = node.cloneNode() as HTMLElement;
      cloned.innerHTML = "";
      return cloned;
    }
    return null;
  }
  private getText() {
    const node = this.nodeLL.currentNode;
    if (node.nodeType === Node.ELEMENT_NODE)
      return (node as HTMLElement).innerHTML;
      else if (node.nodeType === Node.TEXT_NODE)
        return node.textContent === null ? null : node.textContent.replace(/^\n|\n$/g, '');
    return null;
  }
  private complete() {
    setTimeout(() => {
      cursorHidden = true;
      if (cursorStay) {
        cursorFull = true;
        cursorBlink = true;
      }
    }, 450);
  }
  private splitWords(text: string) {
    let list: string[] = [];
    let word = "";
    for (const letter of text) {
      if (letter === " ") {
        word !== "" && list.push(word);
        list.push(letter);
        word = "";
      } else {
        word += letter;
      }
    }
    word !== "" && list.push(word);
    return list;
  }
  private countTextLines() {
    // Create a temporary element to measure the text
    const measurer = document.createElement('div');
    
    // Copy the styles that affect text layout
    const styles = window.getComputedStyle(container);
    measurer.style.width = styles.width;
    measurer.style.font = styles.font;
    measurer.style.padding = styles.padding;
    measurer.style.lineHeight = styles.lineHeight;
    measurer.style.whiteSpace = 'pre-wrap';
    measurer.style.position = 'absolute';
    measurer.style.visibility = 'hidden';
    
    // Set the text content
    measurer.textContent = container.textContent;
    
    // Add the measurer to the document body
    document.body.appendChild(measurer);
    
    // Calculate the number of lines
    const height = measurer.offsetHeight;
    
    // Handle 'normal' line-height
    let lineHeight;
    if (styles.lineHeight === 'normal') {
      // Create a single-line element to measure the 'normal' line height
      const singleLineDiv = document.createElement('div');
      singleLineDiv.style.font = styles.font;
      singleLineDiv.style.lineHeight = 'normal';
      singleLineDiv.style.padding = '0';
      singleLineDiv.style.visibility = 'hidden';
      singleLineDiv.textContent = 'X';
      document.body.appendChild(singleLineDiv);
      
      lineHeight = singleLineDiv.offsetHeight;
      document.body.removeChild(singleLineDiv);
    } else {
      lineHeight = parseFloat(styles.lineHeight);
    }
    
    const lines = Math.round(height / lineHeight);
    
    // Remove the measurer from the document
    document.body.removeChild(measurer);
    
    return lines;
  }
  private getExecutable() {
    
    type eleWordsType = {
      words: string[],
      ele: HTMLElement | Text
    }
    let list: eleWordsType[] = [];
    while (true) {
      let text = this.getText();
      if (text) {
        const words = this.splitWords(text);
        const cloned = this.cloneNode();
        if (cloned === null) {
          console.error("Cloned node returned none...");
          continue;
        }

        list.push({
          words: words,
          ele: cloned
        });
      }

      if (!this.nodeLL.hasNext()) break;
      this.nodeLL.next();
    }
    return list;
  }
  run() {
    if (this.forceComplete) {
      this.complete();
      return;
    }
    const eleWords = this.getExecutable();
    let eleI = 0;
    let wordI = 0;
    let letterI = 0;
    eleWords.forEach(eleWord => {
      this.container.insertBefore(eleWord.ele, cursor);
    });
    const wrapper = (delay: number) => {
      setTimeout(() => {
        const inner = () => {
          const eleWord = eleWords[eleI];
          if (!eleWord) {
            this.complete();
            return;
          }
          const word = eleWord.words[wordI];
          if (!word) {
            eleI++;
            wordI = 0;
            letterI = 0;
            return inner();
          }
          const letter = word[letterI];
          if (!letter) {
            wordI++;
            letterI = 0;
            return inner();
          }
          if (eleWord.ele.nodeType === Node.TEXT_NODE){
            (eleWord.ele as Text).textContent += letter;
          }
          else
          (eleWord.ele as HTMLElement).innerHTML += letter;
          console.log(this.countTextLines());

          letterI++;
          wrapper(80);
        }
        inner();
      }, delay * this.delayMultiplier);
    }
    wrapper(0);
  }
}
onMount(() => {
  (new Type(hiddenContainer, container, delayMultiplier)).run();
});

</script>

<div class="parent" style="justify-content: {justify}">
  <div class="inner">
    <div class="hidden-container">
      <div bind:this={hiddenContainer} class="text"><slot /></div>
      {#if cursorStay}
        <Cursor hidden={cursorHidden} full={false} />
      {/if}
    </div>
    <div class="container" style="justify-content: {justify}">
      <div bind:this={container} class="text"><div class="cursor" bind:this={cursor}><Cursor hidden={cursorHidden} full={cursorFull} blink={cursorBlink} /></div></div>
    </div>
  </div>
</div>

<style>
.text {
  display: inline-block;
  white-space: pre-wrap;
}
.container {
  position: absolute;
  top: 0;
  left: 0;
}
.parent {
  display: flex;
  position: relative;
}
.hidden-container {
  opacity: .3;
}
.inner {
  position: relative;
}
.hidden-container, .container {
  display: flex;
  align-items: end;
}
.cursor {
  display: inline-block;
  vertical-align: bottom; /* throw the cursor to inline of the text */

  /*
    this part is important.
    this ensures the cursor doesn't take up space,
    so a text-align: center, isn't offcentered when
    the cursor persists, or deletes
  */
  width: 0px;
  overflow: visible;
}
</style>
