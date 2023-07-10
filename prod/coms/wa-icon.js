import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js'

class ICONElement extends LitElement {
    static get styles() {
        return css`
          .material-icons {
            font-family: 'Material Icons', sans-serif;
            font-size: 24px;
            line-height: 24px;
            font-weight: normal;
            font-style: normal;
            letter-spacing: normal;
            text-transform: none;
            display: inline-block;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
            -webkit-font-feature-settings: 'liga';
            -webkit-font-smoothing: antialiased;
          }
        `;
    }

    render() {
        return html`
          <span class="material-icons">face</span>
        `;
    }
}

customElements.define('wa-icon', ICONElement);