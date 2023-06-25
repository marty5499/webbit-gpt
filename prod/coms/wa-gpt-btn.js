import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js'

class GPTSend extends LitElement {
    static get properties() {
        return {
            callback: { type: String }
        };
    }

    static get styles() {
        return css`
      #toggle-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1em;
        font-weight: bold;
        padding: 5px;
        border: none;
        border-radius: 5px;
        background-color: #007bff;
        color: #fff;
        cursor: pointer;
      }

      #toggle-btn svg {
        margin-right: 5px;
        fill: currentColor;
      }

      @keyframes shake {
        0% { transform: translate(0, 0); }
        25% { transform: translate(0, -3px); }
        50% { transform: translate(0, 0); }
        75% { transform: translate(0, 3px); }
        100% { transform: translate(0, 0); }
      } 
    `;
    }

    constructor() {
        super();
    }

    async firstUpdated() {
        this.processing = false;
        this.callback = window[this.callback];
    }

    startShakeAnimation() {
        const btn = this.shadowRoot.querySelector('#toggle-btn');
        btn.classList.add('shake');
        this.bak_backgroundColor = btn.style.backgroundColor;
        btn.style.backgroundColor = '#ccddee';
        btn.style.animation = 'shake 0.5s ease-in-out infinite';
    }

    stopShakeAnimation() {
        const btn = this.shadowRoot.querySelector('#toggle-btn');
        btn.classList.remove('shake');
        btn.style.backgroundColor = this.bak_backgroundColor;
        btn.style.animation = '';
        this.processing = false;
    }

    handleToggleBtnClick(e) {
        if(this.processing) return;
        this.processing = true;
        this.startShakeAnimation();
        this.callback();
    }

    render() {
        return html`
      <button id="toggle-btn" @click=${this.handleToggleBtnClick}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            stroke="#FFFFFF" stroke-width="1">
            <path d="M20.33 3.67C20.14 3.48 19.9 3.35 19.64 3.29C19.38 3.23 19.11 3.24 18.86 3.32L4.23 8.2C3.96 8.29 3.72 8.45 3.54 8.67C3.36 8.89 3.25 9.16 3.23 9.45C3.21 9.73 3.27 10.02 3.4 10.27C3.54 10.51 3.75 10.72 4 10.85L10.07 13.85L13.07 19.94C13.19 20.18 13.38 20.38 13.6 20.52C13.83 20.66 14.09 20.73 14.36 20.73H14.46C14.75 20.71 15.02 20.6 15.24 20.42C15.47 20.25 15.63 20 15.72 19.73L20.67 5.14C20.76 4.89 20.77 4.62 20.71 4.36C20.65 4.1 20.52 3.86 20.33 3.67ZM4.85 9.58L17.62 5.32L10.53 12.41L4.85 9.58ZM14.43 19.15L11.59 13.47L18.68 6.38L14.43 19.15Z" />
        </svg>傳送
      </button>
    `;
    }
}
customElements.define('wa-gpt-btn', GPTSend);
