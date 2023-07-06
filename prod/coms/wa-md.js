import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js'

/**
 * filename：wa-markdown.js
 * descript：顯示 markdown
 * associate: 
 * Author: Marty
 * Date: 2022/02
 */
export class MD extends LitElement {

    static properties = {
        path: {},
        default: {}
    };

    static styles = [css`
    :host {
        font-size: 18px;
        margin-left: 20px;
        margin-right: 20px;
        overflow: auto;
        display: block;
        width: calc(100% - 44px);
        height: 100%;
        overflow-x: hidden;
        padding-right: 24px;
    }
    `];

    setText(markdown) {
        var htmlContent = this.converter.makeHtml(markdown);
        this.content.innerHTML = htmlContent;
    }

    firstUpdated() {
        var self = this;
        this.converter = new showdown.Converter();
        this.content = this.renderRoot.getElementById("content");
    }

    render() {
        return html`<div id='content'><slot></slot></div>`
    }
}

customElements.define('wa-md', MD);