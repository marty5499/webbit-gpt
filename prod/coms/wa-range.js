import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js'

/**
 * filename：wa-range.js
 * descript：
 * Author: Marty
 * Date: 2022/02
 */
export class Range extends LitElement {

    constructor() {
        super();
    }

    static styles = [css`
        input[type=range] {
            width: 100px;
            height: 24px;
        }

        #value {
            margin-top: 10px;
            font-size: 14px;
        }
    `]

    firstUpdated() {
        const slider = this.renderRoot.querySelector("#slider");
        const value = this.renderRoot.querySelector("#value");
        var self = this;
        slider.addEventListener("input", function () {
            value.innerHTML = slider.value;
            self.rangeEvent(slider.value);
        });
        window.Main.ready("wa-range", self);
    }

    onSlider(e) {
        this.rangeEvent = e;
    }

    render() {
        return html`
        <div style="float:left;">
            <input type="range" min="12" max="64" value="24" step="1" id="slider">
            <span id="value">24</span>
        </div>
        `;
    }
}
customElements.define('wa-range', Range);
