import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js'

/**
 * filename：wa-menubar.js
 * descript：工具選單 (包含Logo、按鈕)
 * Author: Marty
 * Date: 2022/02
 */
export class MenuBar extends LitElement {

    constructor() {
        super();
        this.currentMode = 2;
    }

    static styles = [css`
    #menubar {
        top: 5px;
        height: 40px;
        color: #fff;
        text-decoration: none;
        background: #058;
        z-index: 100;
    }
    .toolMenu {
        width:160px;
        float: right;
        box-sizing: border-box;
        font-size: 15px;
        position: relative;
        background: none;
        cursor: pointer;
        color: #fff;
        margin: 0 5px;
        transition: .3s;
        text-decoration: none;
        z-index: 100;
    }
    svg {
        fill: #eee;
        width: 24px;
        height: 24px;
    }  
    .btn {
        transition: all 0.5s ease;
        cursor: pointer;
        color: #eee;
        float:left;
        font-size: 16px;
        display: flex;
        align-items: center; 
        width:70px;
    }
    .btn:hover {
        transform: translateY(-3px);
        color: #fff;
    }
    .btn svg + span {
        margin-left: 1px;
      }    
  `];

    firstUpdated() {
    }

    render() {
        return html`
        <div id='menubar'>
        <div style='float:left;padding:4px;position:absolute'>
            <img height='36' src='./coms/webduino_logo.svg' style='margin-left:5px'>
        </div>
        <div style="padding-top: 10px;">
            <div class="toolMenu">
            <div id="button" class='btn'>
                <svg id="icon" viewBox="0 0 24 24">
                    <path id="path"
                        d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
                    <path d="M0 0h24v24H0z" fill="none" />
                </svg>
            </div>
                <slot></slot>
            </div>
        </div>
    </div>
    `;
    }
}
customElements.define('wa-menubar', MenuBar);
