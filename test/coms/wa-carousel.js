import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js'

class ImageSlider extends LitElement {
  static get properties() {
    return {
      index: { type: Number },
      images: { type: Array },
    };
  }

  static get styles() {
    return css`
          :host {
            display: block;
          }
    
          .container {
            position: relative;
            overflow: hidden;
          }
    
          #previous,
          #next {
            position: absolute;
            top: 202px;
            width: 32px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            font-size: 30px;
            color: rgba(0, 0, 0, 0.5);
            background-color: #ddd;
            cursor: pointer;
            z-index:5;
          }
    
          #previous {
            left: 30px;
          }
    
          #next {
            right: 30px;
          }
    
          .title {
            position: absolute;
            #background-color: rgba(333, 0, 0, 0.1);
            top: 200px;
            width:100%;
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 20px;
            color: rgba(0, 0, 0, 0.5);
          }

          .slider {
            display: flex;
            overflow-x: scroll;
            scroll-behavior: smooth;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            overflow: hidden;
            align-items: center; /* 垂直置中 */  
            width:320px;
            height:240px;          
          }
    
          .slider img {
            flex: 0 0 100%;
            height: auto;
            scroll-snap-align: center;
          }
    
          .dots {
            display: flex;
            justify-content: center;
            margin-top: 10px;
          }
    
          .dots li {
            width: 10px;
            height: 10px;
            margin: 0 5px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.5);
            cursor: pointer;
            transition: background-color 0.5s ease;
          }
    
          .dots li.dot--active {
            background-color: white;
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
          .info {
            top:36px;
            right:40px;
            position: absolute;
            font-size: 24px;
            filter: invert(0.8);
            cursor: pointer;
          }
          .blink {
            animation: blink 0.5s linear alternate infinite;
          }
          @keyframes blink {
            from { opacity: 1; }
            to { opacity: 0; }
          }
        `;
  }

  constructor() {
    super();
    this.selectCallback = function () { };
    this.index = 0;
    this.lastIdx = -1;
    this.images = [
      ['bio', '生物學 01', '../coms/bio.png', '320px','https://md.webduino.io/s/jW7cOvXmg'],
      ['jack01', '程式設計實習', '../coms/jack01.png', '320px','https://md.webduino.io/s/3Jh3hCuJO'],
      //['kebbi','../coms/kebbi.png', '320px'],
    ];
    this.actor = this.images[this.index][0];
    this.loadImages();
  }

  setActor(actorName, focus) {
    if (arguments.length == 2 && focus) this.lastIdx = -1;
    for (var i = 0; i < this.images.length; i++) {
      if (this.images[i][0] == actorName) {
        this.index = i;
        this.switchImg();
        break;
      }
    }
  }

  loadImages() {
    // 定義一個 Promise 物件，用來下載一張圖片
    function downloadImage(url) {
      return new Promise(function (resolve, reject) {
        var img = new Image();
        img.onload = function () {
          resolve(img);
        };
        img.onerror = function () {
          reject(url);
        };
        img.src = url;
      });
    }

    // 建立一個 Promise 陣列，用來下載所有圖片
    var promises = this.images.map(function (image) {
      return downloadImage(image[2]);
    });
    // 等到所有圖片都下載完畢後，再繼續執行後面的程式碼
    Promise.all(promises).then(function (images) {
      // 所有圖片都下載完畢，可以繼續執行後面的程式碼了
      //console.log('所有圖片都下載完畢！');
      // ...
    }).catch(function (url) {
      // 有圖片下載失敗，可以在這裡處理錯誤
      console.log('下載圖片失敗：' + url);
    });
  }

  firstUpdated() {
    this.next = this.shadowRoot.getElementById('next');
    this.previous = this.shadowRoot.getElementById('previous');
    this.descript = this.shadowRoot.getElementById('title');
    this.info = this.shadowRoot.getElementById('info');
    var self = this;
    setTimeout(function () {
      self.info.classList.remove('blink');
    }, 1000);
    setTimeout(function () {
      self.switchImg();
    }, 10);
  }

  blinkInfo() {
    this.info.classList.add('blink');
    var self = this;
    setTimeout(function () {
      self.info.classList.remove('blink');
    }, 1000);
  }

  render() {
    return html`
      <div class="container">
        <span id="info" class="material-icons info blink"
        @click=${() => this.openInfo()}>info</span>
        <span id="previous" @click=${() => this.switchImg(--this.index)}>
        <span class="material-icons prev">chevron_left</span></span>
        <span id="next" @click=${() => this.switchImg(++this.index)}>
        <span class="material-icons next">chevron_right</span></span>
        <span id="title" class="title"></span>
        <div id="slider" class="slider">
          ${this.images.map((image) => html`<img src=${image[2]} />`)}
        </div>
      </div>
    `;
  }

  openInfo(){
    var url = this.images[this.index][4];
    window.open(url);
  }

  select(callback) {
    this.selectCallback = callback;
  }

  switchImg() {
    this.index = this.index < 0 ? 0 : this.index;
    this.index = this.index == this.images.length ? this.images.length - 1 : this.index;

    if (this.lastIdx != this.index) {
      this.lastIdx = this.index;
      if (this.index == 0) {
        this.previous.style['display'] = 'none';
      } else {
        this.previous.style['display'] = 'block';
      }
      if (this.index == this.images.length - 1) {
        this.next.style['display'] = 'none';
      } else {
        this.next.style['display'] = 'block';
      }
      this.actor = this.images[this.index][0];
      this.descript.innerHTML = this.images[this.index][1];
      this.selectCallback(this.index, this.images[this.index][0]);
      const imgWidth = this.shadowRoot.querySelector('.slider img').clientWidth;
      const recomputedWidth = this.index * imgWidth;
      this.shadowRoot.querySelector('.slider').scrollTo({ left: recomputedWidth, behavior: 'smooth' });
      this.blinkInfo();
    }
  }
}

customElements.define('wa-carousel', ImageSlider);