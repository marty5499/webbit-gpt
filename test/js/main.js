class Main {

    init() {
        this.coms = {};

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
var pdf = new PDF('https://kn-staging.nodered.vip/books/docs/eyJucyI6IjFXS0ZOal84MzhSNlJRVHRsa2lrXzBscjNQcG4tQjVKNSIsImZpbGUiOiJib29rLnBkZiJ9');
((async function () {
    await pdf.load();
    //pdf.find("正片後像");
    //pdf.page(1);
    document.getElementById('zoomIn').addEventListener('click', async function () {
        pdf.zoomIn();
    });

    document.getElementById('zoomOut').addEventListener('click', async function () {
        pdf.zoomOut();
    });

    document.getElementById('fitWidth').addEventListener('click', async function () {
        pdf.fitWidth();
    });
})())