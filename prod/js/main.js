class Main {

    init() {
        this.coms = {};
        // 改成所有元件ready再初始化,不要用 setTimeout
        setTimeout(function () {
            window.Main.markdown = markdown;
        }, 100);
    }

    ready(name, obj) {
        console.log("Component Ready...", name);
    }

    // mqtt,gpt,voice,deploy,carousel,flow
    registry(comName, obj) {
        this.coms[comName] = obj;
        console.log(" Registry >>> [" + comName + "]");
    }

    popup(title, text, icon, confirmButtonText) {
        Swal.fire({
            title: title,
            html: text,
            icon: icon,
            confirmButtonText: confirmButtonText
        })
    }

    eventTrigger(com, action, info) {
        console.log(com, ":", action, ":", info);
        if (com == 'mqtt' && action == 'onFailure') {
            //alert('連線中斷，請重新整理網頁');
        }
        else if (com == 'carousel' && action == 'setActor') {
            this.coms['gpt'].clear();
        }
    }
}

window.Main = new Main();
window.Main.init();
