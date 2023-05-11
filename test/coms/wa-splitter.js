import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js'

/**
 * filename：wa-splitter.js
 * descript：垂直分割卷軸，可以讓這卷軸左右的div區塊，可以改變顯示區塊大小
 * Author: Marty
 * Date: 2022/02
 */
export class Splitter extends LitElement {

    constructor() {
        super();
        this.left = "30%";
    }

    static barWidthPx = 5;

    static properties = {
        left: {}
    };

    static styles = [css`
    .splitter {
        float: left;
        width: ${Splitter.barWidthPx}px;
        background-color: #9f9f9f;
        cursor: col-resize;
        height: calc(100vh - 40px)
    }
    `]

    createOverlayDiv() {
        var self = this;
        self.overlay = document.createElement('div');
        self.overlay.style['position'] = 'absolute';
        self.overlay.style['top'] = '0';
        self.overlay.style['left'] = '0';
        self.overlay.style['width'] = '30%';
        self.overlay.style['height'] = '100%';
        self.leftFrame.appendChild(self.overlay);
    }

    firstUpdated() {
        var self = this;
        let isDragging = false;
        self.startX = '';
        self.startWidth = '';

        const splitter = this.renderRoot.querySelector(".splitter");
        let ele = this.parentElement;
        self.leftFrame = ele.children[0];
        self.rightFrame = ele.children[2];
        self.leftFrame.style.width = this.left;
        var calWidth = self.leftFrame.offsetWidth + Splitter.barWidthPx;
        self.rightFrame.style.width = `calc(100% - ${calWidth}px)`;
        self.updateWidth(calWidth);
        if (typeof (editor) != 'undefined')
            editor.blockEditor.resized();

        splitter.addEventListener("mousedown", (e) => {
            isDragging = true;
            self.startX = e.clientX;
            self.startWidth = self.leftFrame.offsetWidth;
            self.createOverlayDiv();
        });
        splitter.addEventListener("touchstart", (e) => {
            isDragging = true;
            self.startX = e.clientX;
            self.startWidth = self.leftFrame.offsetWidth;
        });
        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            const diffX = e.clientX - self.startX;
            self.updateWidth(diffX);
        });
        document.addEventListener("mouseup", (e) => {
            isDragging = false;
            try {
                self.overlay.parentNode.removeChild(self.overlay);
            } catch (e) { }
            self.overlay = null;
        });
    }

    updateWidth(diffX) {
        this.leftFrame.style.width = this.startWidth + diffX + "px";
        var calWidth = this.leftFrame.offsetWidth + Splitter.barWidthPx;
        this.rightFrame.style.width = `calc(100% - ${calWidth}px)`;
        if (typeof (editor) != 'undefined')
        editor.blockEditor.resized();
    }

    render() {
        return html`<div class="splitter"></div>`;
    }
}
customElements.define('wa-splitter', Splitter);