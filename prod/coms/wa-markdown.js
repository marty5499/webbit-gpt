import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js'

/**
 * filename：wa-markdown.js
 * descript：顯示 markdown
 * associate: 
 * Author: Marty
 * Date: 2022/02
 */
export class Markdown extends LitElement {

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

    async getContent(from, to) {
        var idx = to;
        var content = this.default;
        var htmlContent = '';
        if (idx.length >= 1) {
            content = idx.substring(1);
        } else {
            return;
        }
        if (content.startsWith("q")) {
            var row = content.substring(1);
            htmlContent = '<wa-question id="exam" idx="' + row + '" bind="window.Main"></wa-question>';
            this.content.innerHTML = htmlContent;
        }
        else if (content.endsWith(".exam")) {
            var text = await fetch(this.path + content, {})
                .then((response) => {
                    return response.text();
                });
            window.Main.editor.setCode(text);
            location.hash = from;
        }
        else {
            var converter = new showdown.Converter();
            var text = await fetch(this.path + content, {})
                .then((response) => {
                    return response.text();
                });
            htmlContent = converter.makeHtml(text);
            this.content.innerHTML = htmlContent;
        }
    }

    firstUpdated() {
        var self = this;
        self.lastHash = location.hash;
        this.content = this.renderRoot.getElementById("content");
        this.getContent(self.lastHash, location.hash);
        window.addEventListener('hashchange', function () {
            self.getContent(self.lastHash, location.hash);
            self.lastHash = location.hash;
        });
    }

    render() {
        return html`<div id='content'><slot></slot></div>`
    }
}

customElements.define('wa-markdown', Markdown);