class Container {
    static list = [];
    static init(cfg) {
        for (var key in cfg) {
            var ctx = new Container(key);
            Container.list.push(ctx);
            if (cfg[key] == '') continue;
            var drag = new Draggable(cfg[key]);
            drag.ctx = ctx;
            ctx.drag = drag;
        }
    }
    constructor(id) {
        this.id = id;
        this.eleCtx = document.getElementById(id);
    }
    static save() {
        var cfg = {}
        var list = Container.list;
        for (var i in list) {
            var dragId = list[i].drag.eleDrag.firstElementChild.id;
            cfg[list[i].id] = dragId;
        }
        console.log(JSON.stringify(cfg));
    }
    static load(strCfg) {
        //strCfg = '{"c1":"cnt5","c2":"cnt4","c3":"cnt3","c4":"cnt2","c5":"cnt1"}';
        var cfg = JSON.parse(strCfg);
        console.log(cfg);
        var list = Container.list;
        var dragIds = {}
        // remove all
        for (var i in list) {
            var ctx = list[i];
            var dragId = ctx.drag.eleDrag.firstElementChild.id;
            var eleDrag = ctx.drag.eleDrag;
            dragIds[dragId] = eleDrag;
            ctx.eleCtx.removeChild(eleDrag);
        }
        // set all
        for (var i in list) {
            var ctx = list[i];
            var dragId = cfg[ctx.id];
            ctx.drag.eleDrag = dragIds[dragId];
            ctx.eleCtx.appendChild(dragIds[dragId]);
        }
    }
}

class IDraggable {
    static list = [];
    static distance = 100;

    static saveTmpLeftTop(draggable) {
        var left = draggable.eleTitle.style.left;
        var top = draggable.eleTitle.style.top;
        draggable.tmp = {
            left: left == '' ? '0px' : left,
            top: top == '' ? 'opx' : top
        }
    }

    static loadTmpLeftTop(draggable) {
        draggable.eleTitle.style.left = draggable.tmp.left;
        draggable.eleTitle.style.top = draggable.tmp.top;
        delete draggable.tmp;
    }

    static updateLeftTop(draggable, dx, dy) {
        var x = draggable.eleTitle.style.left;
        var y = draggable.eleTitle.style.top;
        x = parseInt(x.replace('px', '')) + dx;
        y = parseInt(y.replace('px', '')) + dy;
        draggable.eleTitle.style.left = x + "px";
        draggable.eleTitle.style.top = y + "px";
    }

    constructor(id) {
        //console.log("create Draggable:", id);
        this.id = id;
        this.eleDrag = document.getElementById(id);
        this.eleTitle = this.createTitleToBody();
        window[id] = this;
        IDraggable.list.push(this);
    }

    createTitleToBody() {
        console.log("createTitleToBody");
        var eleTitle = document.createElement('div');
        eleTitle.classList.add("title");
        eleTitle.style['width'] = (this.eleDrag.offsetWidth - 14) + "px";
        eleTitle.style['height'] = (this.eleDrag.offsetHeight - 14) + "px";
        this.body = document.getElementsByTagName('body')[0];
        this.body.appendChild(eleTitle);
        return eleTitle;
    }

    checkNearestContainer(self) {
        var distance = IDraggable.distance;
        var ctxList = Container.list;
        for (var i in ctxList) {
            var ctx = ctxList[i];
            var x1 = self.eleTitle.offsetLeft + self.eleTitle.offsetWidth / 2;
            var y1 = self.eleTitle.offsetTop + self.eleTitle.offsetHeight / 2;
            var x2 = ctx.eleCtx.offsetLeft + self.eleTitle.offsetWidth / 2;
            var y2 = ctx.eleCtx.offsetTop + self.eleTitle.offsetHeight / 2;
            var calDistance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            if (calDistance <= distance) {
                ctx.eleCtx.style['border'] = '4px dashed #e00';
                ctx.swapPos = true;
            } else {
                ctx.eleCtx.style['border'] = '0px dashed #000';
                ctx.swapPos = false;
            }
        }
    }

    restoreContainerWH() {
        const elements = document.querySelectorAll('.container');
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.width = '100%';
            elements[i].style.height = '100%';
        }
    }
    updateContainer(size) {
        const elements = document.querySelectorAll('.container');
        console.log("updateContainer...");
        for (let i = 0; i < elements.length; i++) {
            var w = elements[i].offsetWidth;
            var h = elements[i].offsetHeight;
            elements[i].style.width = (w + size) + 'px';
            elements[i].style.height = (h + size) + 'px';
        }
    }

    startDrag() {
        var self = this;
        self.updateContainer(-2);
        // mousedown event
        this.startDragEvent = function (evt) {
            evt.preventDefault();
            if (evt.srcElement != self.eleTitle) {
                return;
            }
            self.isDragging = true;
            //紀錄滑鼠按下的座標位置(畫面x,y)
            self.tmpClientX = evt.clientX;
            self.tmpClientY = evt.clientY;
            IDraggable.saveTmpLeftTop(self);
        };

        // mousemove event
        this.dragingEvent = function (evt) {
            evt.preventDefault();
            if (self.isDragging) {
                // Calculate the new position of the box
                var dx = evt.clientX - self.tmpClientX;
                var dy = evt.clientY - self.tmpClientY;
                // Update the position of the box
                IDraggable.updateLeftTop(self, dx, dy);
                self.tmpClientX = evt.clientX;
                self.tmpClientY = evt.clientY;
                self.checkNearestContainer(self);
            }
        }

        // mouseup event
        this.stopDragEvent = function (evt) {
            evt.preventDefault();
            if (self.isDragging) {
                var ctx = self.hasNestestContainer();
                if (ctx != null) {
                    self.swapDraggable(self, ctx);
                    Container.save();
                    Draggable.off();
                }
                IDraggable.loadTmpLeftTop(self);
                delete self.tmpClientX;
                delete self.tmpClientY;

            }
            self.restoreContainerWH();
            self.isDragging = false;
        };
        this.eleTitle.addEventListener("mousedown", this.startDragEvent);
        this.body.addEventListener("mousemove", this.dragingEvent);
        this.body.addEventListener("mouseup", this.stopDragEvent);
    }

    start() {
        this.eleTitle.style['display'] = 'block';
        this.eleTitle.style['left'] = this.eleDrag.getBoundingClientRect()['x'] + 'px';
        this.eleTitle.style['top'] = this.eleDrag.getBoundingClientRect()['y'] + 'px';
        this.startDrag();
    }

    stop() {
        //console.log("stop...", this.id);
        this.eleTitle.style['display'] = 'none';
    }

    static on() {
        for (var i in Draggable.list) {
            Draggable.list[i].start();
        }
    }

    static off() {
        for (var i in Draggable.list) {
            Draggable.list[i].stop();
        }
    }
}

class Draggable extends IDraggable {
    constructor(id) {
        super(id);
    }

    hasNestestContainer() {
        var ctxList = Container.list;
        for (var i in ctxList) {
            if (ctxList[i].swapPos) {
                return ctxList[i];
            }
        }
        return null;
    }

    swapDraggable(drag, ctx) {
        var ctx1 = drag.ctx;
        var ctx2 = ctx;
        if (ctx1 != ctx2) {
            var eleDrag1 = ctx1.drag.eleDrag;
            var eleDrag2 = ctx2.drag.eleDrag;
            ctx1.drag.eleDrag = eleDrag2;
            ctx2.drag.eleDrag = eleDrag1;
            ctx1.eleCtx.removeChild(eleDrag1);
            ctx2.eleCtx.removeChild(eleDrag2);
            ctx1.eleCtx.appendChild(eleDrag2);
            ctx2.eleCtx.appendChild(eleDrag1);
        }
        ctx2.swapPos = false;
        ctx2.eleCtx.style['border'] = '0px solid #000';
    }
}