class FixFlow {
    constructor() {
        this._enhance = {};
        this._cvt = {};
    }
    parseStringToObject(str) {
        const obj = {};
        const regex = /([^=,\s]+)=("[^"]+"|[^,]+)/g;
        let match;

        while ((match = regex.exec(str))) {
            const key = match[1];
            const val = match[2].replace(/"/g, '');
            obj[key] = val;
        }
        return obj;
    }

    parseNode(q) {
        // 利用正規表達式擷取節點名稱和屬性字串
        //const matches = q.match(/"*(\w+)"*\s*\[(.+)\]/);
        const matches = q.match(/"*([\w\u4e00-\u9fa5]+)"*\s*\[(.+)\]/);
        if (matches == null) return [null, null];
        const nodeName = matches[1];
        var hasSpace = q.indexOf(nodeName + " ") >= 0 ? ' ' : '';
        const attrString = matches[2];
        // 將屬性字串轉換成物件
        const attrObj = this.parseStringToObject(attrString);
        const takeString = nodeName + hasSpace + "[" + attrString + "]";
        // 組成最終的物件
        const obj = {};
        obj[nodeName] = attrObj;
        return [takeString, obj];
    }

    toText(obj) {
        const nodeName = Object.keys(obj)[0];
        const attrs = obj[nodeName];
        const attrString = Object.keys(attrs)
            .map(key => `${key}="${attrs[key]}"`).join(', ');
        return `${nodeName} [${attrString}]`;
    }

    cvt(obj) {
        const keyName = Object.keys(obj)[0];
        const valObj = obj[keyName];
        var process = false;
        if (typeof valObj['label'] == 'undefined') {
            //console.log("cvt:", keyName, valObj);
            valObj['label'] = keyName.replaceAll('"', '');
        }
        // 加工 '開始'
        if (valObj['label'].indexOf("開始") >= 0 || keyName.indexOf("開始") >= 0
            || valObj['label'].indexOf("結束") >= 0 || keyName.indexOf("結束") >= 0
            || valObj['label'].indexOf("start") >= 0 || keyName.indexOf("start") >= 0
            || valObj['label'].indexOf("end") >= 0 || keyName.indexOf("end") >= 0
        ) {
            this._cvt[keyName] = valObj;
            valObj['shape'] = 'oval';
            process = true;
        }
        // 加工 '判斷' '比較'
        if (valObj['label'].indexOf("判斷") >= 0 || keyName.indexOf("判斷") >= 0
            || valObj['label'].indexOf("比較") >= 0 || keyName.indexOf("比較") >= 0) {
            this._cvt[keyName] = valObj;
            valObj['shape'] = 'diamond';
            process = true;
        }
        // 加工 '輸入、輸出'
        if (valObj['label'].indexOf("輸入") >= 0 || keyName.indexOf("輸入") >= 0
            || valObj['label'].indexOf("輸出") >= 0 || keyName.indexOf("輸出") >= 0) {
            this._cvt[keyName] = valObj;
            valObj['shape'] = 'parallelogram';
            process = true;
        }
        return process ? this.toText(obj) : "";
    }

    addEnhance(line) {
        var nodes = line.split('->');
        for (var i in nodes) {
            var nodeName = nodes[i].trim().replace(";", "");
            var nodeValue = '';
            if (nodeName.indexOf("[") >= 0) {
                nodeValue = nodeName.split("[")[1].trim();
                nodeName = nodeName.split("[")[0].trim();
            }
            if (nodeName.indexOf("開始") >= 0
                || nodeName.indexOf("結束") >= 0
                || nodeName.indexOf("判斷") >= 0
                || nodeName.indexOf("輸入") >= 0
                || nodeName.indexOf("輸出") >= 0
                || nodeName.indexOf("start") >= 0
                || nodeName.indexOf("end") >= 0
            ) {
                if (nodeName in this._cvt) {
                    //console.log("skip:", nodeName);
                    return;
                }
                this._enhance[nodeName] = nodeValue;
                //console.log("node:", nodeName, nodeValue);
            }
        }
    }

    combineEnahance(data) {
        var lines = "\n";
        for (var key in this._enhance) {
            //console.log(">enhance>>>", key, this._enhance[key]);
            var obj = {};
            obj[key] = { "shape": "" };
            lines += "\n" + this.cvt(obj);
        }
        var pos = data.lastIndexOf("}");
        data = data.substring(0, pos) +
            lines + "\n" + data.substring(pos);

        //reset enhance
        this._enhance = {};
        this._cvt = {};
        return data;
    }

    convert(viz) {
        var ndata = viz;
        var data = viz.split('\n');
        for (var i in data) {
            if (data[i].indexOf("->") > 0) {
                this.addEnhance(data[i]);
                continue;
            }
            var obj = null;
            var [matchStr, obj] = this.parseNode(data[i]);
            if (obj != null) {
                var cvtStr = this.cvt(obj);
                if (cvtStr != "")
                    ndata = ndata.replace(matchStr, cvtStr);
            }
        }
        ndata = this.combineEnahance(ndata);
        ndata = ndata.replace("rankdir=LR;", "");
        return ndata;
    }
}

var ff = new FixFlow();
//console.log(ff.convert(viz));

