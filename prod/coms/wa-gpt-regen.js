import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js'

class GPTSendRenGen extends LitElement {
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
        font-weight: bold;
        padding: 5px;
        border: none;
        border-radius: 5px;
        background-color: #007bff;
        color: #fff;
        cursor: pointer;
        height:24px;
      }

      #toggle-btn svg {
        margin-right: 5px;
        fill: currentColor;
      }
      svg {
        width: 24px;
        height: 24px;
        display: inline-block;
        vertical-align: middle;
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
        if (this.processing) return;
        this.processing = true;
        this.startShakeAnimation();
        this.callback();
    }

    render() {
        return html`
      <button id="toggle-btn" @click=${this.handleToggleBtnClick} >
      <svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>repeat_one_line</title> <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Media" transform="translate(-1008.000000, 0.000000)" fill-rule="nonzero"> <g id="repeat_one_line" transform="translate(1008.000000, 0.000000)"> <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" id="MingCute" fill-rule="nonzero"> </path> <path d="M16.9468,3.06597 C16.9739,2.72042 17.2988,2.50915 17.5784,2.65537 L17.8843359,2.81961469 L17.8843359,2.81961469 L18.2441125,3.02306 C18.3082219,3.06026563 18.3743195,3.09912813 18.4422779,3.13965926 L18.8713369,3.40296371 C18.9462281,3.45021641 19.022725,3.49916125 19.1007,3.54981 L19.5642531,3.85984438 C19.6368234,3.90981938 19.707007,3.95884516 19.7747402,4.00677094 L20.1512254,4.27991938 L20.1512254,4.27991938 L20.4658449,4.51943031 C20.5129562,4.55614359 20.5573625,4.59115375 20.599,4.62431 C20.8348,4.81202 20.8243,5.1899 20.5764,5.38622 L20.2964094,5.6030625 L20.2964094,5.6030625 L19.9555,5.8554175 L19.9555,5.8554175 L19.5559406,6.13701125 L19.5559406,6.13701125 L19.1,6.44157 L19.1,6.44157 L18.6379797,6.73325781 L18.6379797,6.73325781 L18.2217375,6.981575 L18.2217375,6.981575 L17.8572266,7.18744219 L17.8572266,7.18744219 L17.5504,7.35178 L17.5504,7.35178 C17.275,7.49534 16.9785,7.31614 16.9521,6.99217 L16.9266136,6.644574 L16.9266136,6.644574 L16.9032968,6.2303828 L16.9032968,6.2303828 L16.8934,5.99994 L6,5.99994 C4.94563773,5.99994 4.08183483,6.81581733 4.00548573,7.85067759 L4,7.99994 L4,16.9999 C4,18.0542909 4.81587733,18.9180678 5.85073759,18.9944144 L6,18.9999 L18,18.9999 C19.0543909,18.9999 19.9181678,18.18405 19.9945144,17.1491661 L20,16.9999 L20,10.9999 C20,10.4477 20.4477,9.99994 21,9.99994 C21.51285,9.99994 21.9355092,10.3860188 21.9932725,10.8832951 L22,10.9999 L22,16.9999 C22,19.1421545 20.3159949,20.8909825 18.199637,20.9950049 L18,20.9999 L6,20.9999 C3.85780364,20.9999 2.10892107,19.3159889 2.0048953,17.1995456 L2,16.9999 L2,7.99994 C2,5.85774364 3.68396753,4.10886107 5.80035957,4.0048353 L6,3.99994 L16.8931,3.99994 L16.9123768,3.585144 L16.9123768,3.585144 L16.9349944,3.2246072 C16.938908,3.1692676 16.94286,3.11636 16.9468,3.06597 Z M13,10.0187 L13,15 C13,15.5523 12.5523,16 12,16 C11.4477,16 11,15.5523 11,15 L11,11.8661 C10.547,12.1282 9.96229,11.9963 9.66793,11.5547 C9.36158,11.0952 9.48575,10.4743 9.94528,10.168 L11.4297,9.17834 C12.1009,8.73089 13,9.21202 13,10.0187 Z" id="形状" fill="#eee"> </path> </g> </g> </g> </g></svg>
      重新產生
      </button>
    `;
    }
}
customElements.define('wa-gpt-regen', GPTSendRenGen);
