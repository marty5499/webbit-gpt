import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js'

class ChatGPTBot extends LitElement {

  static get styles() {
    return css`
      #chatbox {
        height: calc(100% - 44px);
        width: 100%;
        overflow-y: scroll;
        white-space: pre-line;
        #overflow: hidden;
      }
      #input-area {
        width: 100%;
        position: relative;
        bottom: -28px;
      }
      #input-area Textarea {
        width: 100%;
        height: 44px; 
        line-height: 24px;
        font-size: 16px;
        padding: 10px;
        padding-right: 50px;
        box-sizing: border-box;
        resize: none;
        border: 1px solid #ccc;
        #overflow: hidden;
        max-height: 140px; /* 5行的高度 */
      }
      #input-area button {
        position: absolute;
        height: 20px;
        right: 10px;
        bottom: 20px;
        background-color: transparent;
        border: none;
        outline: none; 
        cursor: pointer;     
      }
      ::placeholder {
        color: #ccc;
      }
    `
  }

  static get properties() {
    return {

    };
  }

  constructor() {
    super();
    this.loading = false;
    this.loadingTextIndex = 0;
    this.loadingTexts = ['.', '..', '...'];
    this.wholeMsg = "";
  }

  setMQTT(app) {
    this.mqtt = app;
  }

  render() {
    return html`
      <div id="chatbox"></div>
      <div id="input-area">
        <textarea id='txtarea' placeholder="啟動中..." rows="1" 
        @keydown="${this.handleTextareaKeyDown}" 
        @keypress="${this.handleTextareaKeyPress}"
        @input="${this.handleOnInput}" disabled></textarea>
        <button id="send-button" @click="${this.sendMessage}">
          <img src='../coms/gpt_send.svg' width='24px'>
        </button>
      </div>
    `;
  }

  // https://jsbin.com/tihivunope/1/edit?html,output
  firstUpdated() {
    if (typeof (parent.Main) != "undefined") {
      parent.Main.registry("gpt", this);
    }
    this.textarea = this.shadowRoot.querySelector('#txtarea');
    this.textareaStyle = window.getComputedStyle(this.textarea);
    ChatGPTBot.lineHeight = parseFloat(this.textareaStyle.lineHeight);
    window.init();
  }

  handleOnInput(e) {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    var calHeight = textarea.scrollHeight - 20;
    textarea.style.marginTop = `-${calHeight}px`;
  }


  handleTextareaKeyDown(e) {
    if (e.keyCode === 13 && e.shiftKey) { // Shift + Enter key
      ChatGPTBot.shift_enter_Key = true;
    }
  }

  handleTextareaKeyPress(e) {
    var self = this;
    const textarea = e.target;
    const lineHeight = ChatGPTBot.lineHeight;
    if (e.keyCode == 13 && !ChatGPTBot.shift_enter_Key) { // Enter key
      // 判斷字串最後是否為換行符號
      if (textarea.value.endsWith('\n') && !e.shiftKey) {
        // 刪除字串最後的換行符號
        textarea.value = textarea.value.slice(0, -1);
      }
      this.sendMessage();
      setTimeout(function () {
        textarea.value = '';
        var e = {};
        e.target = self.textarea;
        self.handleOnInput(e);
        textarea.focus();
      }, 10);
      return;
    }

    ChatGPTBot.shift_enter_Key = false;
  }

  userSay(message) {
    const chatbox = this.shadowRoot.querySelector('#chatbox');
    const div = document.createElement('div');
    div.style.backgroundColor = '#eee';
    div.style.paddingTop = '10px';
    div.style.paddingBottom = '10px';
    const icon = document.createElement('img');
    icon.style.float = 'left';
    icon.src = '../coms/user.png';
    icon.width = 30;
    icon.height = 30;
    div.appendChild(icon);
    const text = document.createElement('div');
    text.style.paddingLeft = '50px';
    text.style.paddingTop = '10px';
    text.innerHTML = message;
    div.appendChild(text);
    chatbox.appendChild(div);
    // 捲動至底部
    chatbox.scrollTop = chatbox.scrollHeight;
  }

  clear() {
    const chatbox = this.shadowRoot.querySelector('#chatbox');
    chatbox.innerHTML = '';
  }

  start(iconName) {
    const chatbox = this.shadowRoot.querySelector('#chatbox');
    const div = document.createElement('div');
    div.style.backgroundColor = '#ddd';
    div.style.paddingTop = '10px';
    div.style.paddingBottom = '10px';

    // Add icon image
    const icon = document.createElement('img');
    this.icon = icon;
    icon.width = 30;
    icon.height = 30;
    icon.style.float = 'left';
    div.appendChild(icon);

    // Add like and dislike buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.float = 'right';
    buttonContainer.style['margin-right'] = '5px';
    div.appendChild(buttonContainer);

    const likeButton = document.createElement('button');
    likeButton.innerText = '👍';
    likeButton.memo = 'like';
    likeButton.style.marginLeft = '10px';
    likeButton.style.filter = 'grayscale(100%)';
    this.addBtnListener(likeButton);
    buttonContainer.appendChild(likeButton);

    const dislikeButton = document.createElement('button');
    dislikeButton.innerText = '👎';
    dislikeButton.memo = 'dislike';
    dislikeButton.style.marginLeft = '5px';
    dislikeButton.style.filter = 'grayscale(100%)';
    this.addBtnListener(dislikeButton);
    buttonContainer.appendChild(dislikeButton);
    this.likeButton = likeButton;
    this.dislikeButton = dislikeButton;

    // Add message text
    const text = document.createElement('div');
    text.style.paddingLeft = '50px';
    text.style.paddingTop = '10px';
    text.innerHTML = '';
    this.message = text;
    //this.setIconName(iconName);
    div.appendChild(text);

    chatbox.appendChild(div);
    this.sending();
  }

  addBtnListener(btn, cb) {
    btn.btnClicked = false;
    var self = this;
    btn.info = [];
    btn.addEventListener('click', () => {
      if (!btn.btnClicked) {
        if (btn.memo == 'like' && this.dislikeButton.style.filter == 'none') return;
        if (btn.memo == 'dislike' && this.likeButton.style.filter == 'none') return;
        btn.style.filter = 'none';
        btn.info = [self.lastPrompt, self.wholeMsg, btn.memo, true];
      } else {
        btn.style.filter = 'grayscale(100%)';
        btn.info = [self.lastPrompt, self.wholeMsg, btn.memo, false];
      }
      btn.btnClicked = !btn.btnClicked;
      this.mqtt.publish('feedback:' + JSON.stringify(btn.info));
    });
  }

  setUUID(uuid) {
    this.uuid = uuid;
  }

  setIconName(imgSrc) {
    this.icon.src = imgSrc;
  }

  sending() {
    this.loading = true;
    const sendButton = this.shadowRoot.querySelector('#send-button');
    sendButton.disabled = true;
    this.loadingInterval = setInterval(() => {
      sendButton.innerHTML = `${this.loadingTexts[this.loadingTextIndex]}`;
      this.loadingTextIndex = (this.loadingTextIndex + 1) % this.loadingTexts.length;
    }, 250);
  }

  read() {
    return this.message.innerHTML;
  }

  write(msg) {
    this.message.innerHTML = msg;
    const chatbox = this.shadowRoot.querySelector('#chatbox');
    chatbox.scrollTop = chatbox.scrollHeight;
  }

  /*
  * 完成 completion 顯示
  */
  done() {
    this.loading = false;
    clearInterval(this.loadingInterval);
    const sendButton = this.shadowRoot.querySelector('#send-button');
    sendButton.disabled = false;
    sendButton.innerHTML = `<img src='../coms/gpt_send.svg' width='24px'>`;
  }

  sendMessage() {
    //console.log("sendMessage()");
    const textarea = this.textarea;
    if (textarea.value.trim() == '') {
      textarea.value = '';
      return;
    }
    this.lastPrompt = textarea.value;
    this.userSay(textarea.value);
    this.promptCallback(textarea.value);
    textarea.value = '';
    var e = {};
    e.target = this.textarea;
    this.handleOnInput(e);
    textarea.focus();
  }

  prompt(msg) {
    this.textarea.value = msg;
    var e = {};
    e.target = this.textarea;
    this.handleOnInput(e);
  }

  promptCallback(callback) {
    this.promptCallback = callback;
  }

  setEnable(enable) {
    this.textarea.disabled = !enable;
    if (enable) {
      this.textarea.placeholder = '你想要問 AI 什麼問題 ?';
      this.textarea.focus();
    } else {
      this.textarea.placeholder = '正在回覆問題...';
    }

  }
}

customElements.define('wa-gpt-bot', ChatGPTBot);