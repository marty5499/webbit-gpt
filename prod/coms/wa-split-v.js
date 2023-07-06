import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js'

/**
 * filename：wa-split-v.js
 * descript：水平分割卷軸，可以讓這卷軸上下的div區塊可以改變顯示區塊大小
 * Author: Marty
 * Date: 2022/02
 */
export class SplitV extends LitElement {

    constructor() {
        super();
    }

    static styles = [css`
      .splitter {
        background-color: #9f9f9f;
        width: 100%;
        height: 3px;
        cursor: row-resize;
      }
    `]

    firstUpdated() {
        //*/
        if (typeof (window.Main) != "undefined") {
            window.Main.registry("split-v", this);
        }
        let self = this;
        let ele = this.parentElement;
        let header = ele.children[0];
        let splitter = ele.children[1];
        let body = ele.children[2];
        let isResizing = false;
        let currentY;
        let originalTop;
        let originalHeight;
        let originalBodyHeight;
        this.header = header;
        this.body = body;
        self.lastHeaderHeight = this.header['style']['height'];
        self.lastBodyHeight = this.body['style']['height'];

        splitter.addEventListener("mousedown", function (e) {
            isResizing = true;
            currentY = e.clientY;
            originalTop = splitter.offsetTop;
            originalHeight = splitter.offsetHeight;
            originalBodyHeight = splitter.previousElementSibling.offsetHeight;
        });

        document.addEventListener("mouseup", function () {
            isResizing = false;
        });

        document.addEventListener("mousemove", function (e) {
            if (!isResizing) return;
            const delta = e.clientY - currentY;
            splitter.style.top = originalTop + delta + "px";
            splitter.previousElementSibling.style.height = originalBodyHeight + delta + "px";
            body.style.height = (ele.offsetHeight - header.offsetHeight) + "px";
            self.lastHeaderHeight = originalBodyHeight + delta + "px";
            self.lastBodyHeight = body.style.height;
        });
    }

    setHideBody(hide) {
        if (hide) {
            this.header['style']['height'] = '100%';
            this.body['style']['height'] = '0%';
        } else {
            this.header['style']['height'] = this.lastHeaderHeight;
            this.body['style']['height'] = this.lastBodyHeight;
        }
    }

    render() {
        return html`
        <div class="splitter" id="splitter"></div>
        `;
    }
}
customElements.define('wa-split-v', SplitV);
