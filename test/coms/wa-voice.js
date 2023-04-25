import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js'

class SpeechRecognition extends LitElement {
  static get properties() {
    return {
      recognition: { type: Object },
      isRecording: { type: Boolean },
      callback: { type: String },
      result: { type: String },
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
        background-color: #2ecc71;
        color: #fff;
        cursor: pointer;
      }

      #toggle-btn.disabled {
        background-color: #fcc;
        cursor: default;
        animation: blink 1s infinite;
      }
      
      @keyframes blink {
        0% {
          opacity: 1;
        }
        50% {
          opacity: 0.6;
        }
        100% {
          opacity: 1;
        }
      }

      #toggle-btn svg {
        margin-right: 5px;
        fill: currentColor;
      }
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

  constructor() {
    super();
    this.recognition = null;
    this.isRecording = false;
    this.result = '';
  }

  async firstUpdated() {
    try {
      this.voiceBtn = this.shadowRoot.getElementById('toggle-btn');
      this.callback = window[this.callback];
      await navigator.mediaDevices.getUserMedia({ audio: true });
      this.isRecording = true;
    } catch (error) {
      this.setEnable(false);
      console.error('無法取得麥克風權限：', error);
    }
  }

  render() {
    return html`
      <button
        id="toggle-btn"
        class=${this.isRecording && !this.recognition ? '' : 'disabled'}
        @click=${this.handleToggleBtnClick} >
        <span class="material-icons">mic</span>開始錄音
      </button>
    `;
  }

  setEnable(enabled) {
    this.voiceBtn.disabled = !enabled;
    if (enabled) {
      this.voiceBtn.classList.remove('disabled');
    } else {
      this.voiceBtn.classList.add('disabled');
    }
  }

  updateResult(txt) {
    this.result = txt;
  }

  handleToggleBtnClick() {
    if (!this.recognition) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.lang = 'zh-TW';

      this.recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1][0].transcript;
        this.result += result;
        this.callback(this.result);
      };

      this.recognition.onend = () => {
        this.isRecording = true;
        this.recognition = null;
        this.result = this.result + "\n";
        this.callback(this.result);
      };
      this.voiceBtn.innerHTML = '<span class="material-icons" style="width:30px">interpreter_mode</span> 錄音中';
      this.recognition.start();
      this.isRecording = false;
      this.callback(this.result);
    } else {
      this.recognition.stop();
      this.voiceBtn.innerHTML = '<span class="material-icons" >mic</span>開始錄音';
    }
  }
}

customElements.define('wa-voice', SpeechRecognition);
