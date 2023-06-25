import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js'

class WAFlowchart extends LitElement {

  static get properties() {
    return {
      scale: { type: Number },
      offsetX: { type: Number },
      offsetY: { type: Number },
      isDragging: { type: Boolean },
      startX: { type: Number },
      startY: { type: Number },
    };
  }

  static get styles() {
    return css`
        :host {
          width: 100%;
          height: 100%;
        }
        /* Define div styles */
        #container {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
          caret-color: transparent;
          display: flex; /* 讓 div 變成彈性容器 */
          justify-content: center; /* 水平置中 */
          align-items: center; /* 垂直置中 */
        }

         /* Define image styles */
        #image {
          position: absolute;
          pointer-events: none;
          user-select: none;
        }

         /* Define button styles */
        #zoom-in,
        #zoom-out {
          position: absolute;
          bottom: 10px;
          font-size: 20px;
          height:32px;
          width:32px;
          color:#a2a2a2;
          background-color: transparent;
          border: none;
          outline: none;          
          border: none;
          cursor: pointer;
        }
         #zoom-in {
          right: 10px;
          bottom: 50px;
          z-index: 5;
          border:1px #a2a2a2 solid;
        }
         #zoom-out {
          right: 10px;
          z-index: 5;
          border:1px #a2a2a2 solid;
        }
      `;
  }

  constructor() {
    super();
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.startX = 0;
    this.startY = 0;
    this.isDragging = false;
  }

  firstUpdated() {
    this.container = this.shadowRoot.getElementById('container');
    this.image = null;
  }

  clearImage() {
    let oldImage = this.shadowRoot.getElementById('image');
    if (oldImage != null) {
      oldImage.parentNode.removeChild(oldImage);
    }
  }

  setImage(image) {
    this.clearImage();
    this.container.appendChild(image);
    //image
    image.id = 'image';
    var self = this;
    setTimeout(function () {
      image.style.left = (self.container.offsetWidth / 2 - image.offsetWidth / 2) + "px";
      //console.log(">>>>>>>", image.offsetHeight);
      if (image.offsetHeight < 770) {
        image.style.top = (self.container.offsetHeight / 2 - image.offsetHeight / 2) + "px";
      } else {
        image.style.top = "10px";
      }
      self.imageOriginWidth = image.offsetWidth;
      self.imageOriginHeight = image.offsetHeight;
      self.image = image;
    }, 10);
  }

  processing() {
    this.clearImage();
    const h1 = this.shadowRoot.getElementById('loading');
    h1.style['width'] = '100px';
    h1.style['font-size'] = '32px';
    h1.style['color'] = '#ccc';
    h1.style.display = 'flex';
    h1.style.justifyContent = 'center';
    h1.style.alignItems = 'center';
    const texts = ['.', '..', '...'];
    let index = 0;
    this.intervalId = setInterval(() => {
      h1.textContent = `${texts[index]}`;
      index = (index + 1) % texts.length;
    }, 250);
  }

  done() {
    clearInterval(this.intervalId);
    const h1 = this.shadowRoot.getElementById('loading');
    h1.innerHTML = '流程圖';
  }

  render() {
    return html`
        <div id="container"
        @mousedown="${this.onMouseDown}"
        @mousemove="${this.onMouseMove}"
        @mouseup="${this.onMouseUp}">
          <h1 id="loading" style="color:#ccc;user-select: none;">流程圖</h1>
          <button id="zoom-in" @click="${this.zoomIn}">+</button>
          <button id="zoom-out" @click="${this.zoomOut}">-</button>
        </div>
      `;
  }

  setCode(code) {
    try {
      this.graph = code;
      const imgEle = Viz(this.graph, { format: 'png-image-element', engine: 'dot' });
      this.setImage(imgEle);
    } catch (e) {
      //console.log("flow:", e);
    }
    //console.log("-=-=-=-=-=-=-=-=-=-=-\n", code);
  }

  onMouseDown(e) {
    if (this.image == null) return;
    this.isDragging = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.updateOffset();
  }

  updateOffset() {
    this.offsetX = this.image.style.left;
    this.offsetY = this.image.style.top;
    this.offsetX = parseInt(this.offsetX.substring(0, this.offsetX.length - 2));
    this.offsetY = parseInt(this.offsetY.substring(0, this.offsetY.length - 2));
  }

  onMouseMove(e) {
    if (this.isDragging) {
      let dx = e.clientX - this.startX;
      let dy = e.clientY - this.startY;
      let image = this.image;
      image.style.left = this.offsetX + dx + 'px';
      image.style.top = this.offsetY + dy + 'px';
    }
  }

  onMouseUp(e) {
    if (this.image == null) return;
    this.isDragging = false;
    this.updateOffset();
  }

  zoomIn() {
    let image = this.image;
    let container = this.container;
    // Increase the scale and update image's width and height
    this.scale = this.scale + 0.1;
    image.style.width = this.scale * this.imageOriginWidth + "px";
    image.style.height = this.scale * this.imageOriginHeight + "px";
    // Calculate the image's center point before scaling
    var centerX = (image.offsetLeft - container.offsetLeft) + image.offsetWidth / 2;
    var centerY = (image.offsetTop - container.offsetTop) + image.offsetHeight / 2;
    // Update image's left and top attributes to maintain the center point
    image.style.left = (container.offsetLeft + centerX) - image.offsetWidth / 2 + "px";
    image.style.top = (container.offsetTop + centerY) - image.offsetHeight / 2 + "px";
  }

  zoomOut() {
    let image = this.image;
    let container = this.container;
    // Decrease the scale and update image's width and height
    this.scale = this.scale - 0.1;
    image.style.width = this.scale * this.imageOriginWidth + "px";
    image.style.height = this.scale * this.imageOriginHeight + "px";
    // Calculate the image's center point before scaling
    var centerX = (image.offsetLeft - container.offsetLeft) + image.offsetWidth / 2;
    var centerY = (image.offsetTop - container.offsetTop) + image.offsetHeight / 2;
    // Update image's left and top attributes to maintain the center point
    image.style.left = (container.offsetLeft + centerX) - image.offsetWidth / 2 + "px";
    image.style.top = (container.offsetTop + centerY) - image.offsetHeight / 2 + "px";
  }
}

customElements.define('wa-flow', WAFlowchart);