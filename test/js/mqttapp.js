/*
Prompt：
1. MQTTApp 的建構子應接受用戶 ID 作為參數。在建構子中，應初始化 MQTT 客戶端並設置其連接選項，包括開啟重連功能、設定連接超時時間和心跳間隔。此外，應該設定用戶名和密碼，對於此例，請設置用戶名和密碼為 'webduino'。
2. MQTTApp 的建構子應接受用戶 ID 作為參數。在建構子中，應初始化 MQTT 客戶端並設置其連接選項，包括開啟重連功能、設定連接超時時間和心跳間隔，並指定用戶名和密碼。
3. 建構子應根據主機名稱動態設置 MQTT 主題，如果主機名稱不是 "localhost"，則主題應該是 "kn@" 加上主機名稱的第一部分。
4. 建構子中還應該定義一個 disconnectTime 屬性，用於記錄客戶端斷線的時間。
5. 提供一個 `init` 方法，該方法應先連接到 MQTT 伺服器，然後訂閱兩個主題，一個用於接收訊息，另一個用於確定訊息是否完全接收。訂閱的主題應根據在建構子中設定的主題模板以及用戶 ID 來生成。
6. 提供一個 `connect` 方法，該方法應當使用 Promise 對象處理 MQTT 客戶端的連接。如果連接成功，則輸出連接成功的消息並解析 Promise；如果連接失敗，則輸出失敗消息並拒絕 Promise。此外，應在此方法中定義當連接失敗時的重連邏輯，並在連接失敗時記錄當前的時間。
7. 提供一個 `publish` 方法，該方法應該先檢查 MQTT 客戶端是否已經連接，如果沒有，則彈出提示視窗告訴使用者需要刷新頁面。如果已經連接，則應該將訊息發布到在建構子中設定的主題上。
8. 提供一個 `publishTopic` 方法，該方法允許用戶發布訊息到自定義的主題上。該方法應該先訂閱用於確定訊息是否完全接收的主題，然後發布訊息，並在訊息完全接收後取消訂閱。
9. 提供一個 `subscribe` 方法，該方法允許用戶訂閱特定的主題。如果該主題已經被訂閱，則輸出警告信息。
10. 提供一個 `onMessageArrived` 方法，該方法在接收到 MQTT 訊息時被呼叫。該方法應該檢查訊息的主題是否已被訂閱，如果是，則呼叫對應的回呼函數來處理訊息。
11. 當 MQTT 客戶端失去與伺服器的連線時，應自動進行重連，並且不會增加每次嘗試連接的時間間隔，每次重連嘗試應固定為 5 秒鐘。並在 console 訊息中顯示每次斷線和重新連線的資訊，包括斷線的原因和斷線了多長時間。
12. 在客戶端連線失敗時，應使用 Promise 的拒絕處理方式並在 5 秒後重新嘗試連接。
這個提示涵蓋了您提供的程式碼中所有的功能，並且詳細說明了
每個功能的具體需求和實現方式。請將此提示提供給 ChatGPT 以產生與您提供的程式碼功能相同的程式碼。
*/
class MQTTApp {
    constructor(userId) {
        if (typeof (parent.Main) != "undefined") {
            parent.Main.registry("mqtt", this);
        }
        this.userId = userId;
        this.client = new Paho.Client('wss://mqtt1.webduino.io/mqtt', userId);
        this.options = {
            reconnect: true,
            timeout: 900, keepAliveInterval: 30,
            userName: 'webduino', password: 'webduino'
        };
        this.onConnectPromise = null;
        this.subscriptions = {};
        var topic = "kn@chat-staging";
        if (location.hostname != "localhost") {
            topic = "kn@" + location.hostname.split(".")[0];
        }
        this.pubTopic = topic + '_prompt/' + userId;
        this.respTopic_cb = topic + "_completion/" + userId;
        this.respTopic_end = topic + "_completion_end/" + userId;
        this.disconnectTime = null;
    }

    async init(cb) {
        await this.connect();
        this.subscribe(this.respTopic_cb, function (msg) {
            cb(msg, false);
        });
        this.subscribe(this.respTopic_end, function (msg) {
            cb(msg, true);
        });
    }

    async connect() {
        this.onConnectPromise = new Promise((resolve, reject) => {
            this.client.connect({
                ...this.options,
                onSuccess: () => {
                    console.log('Connected to MQTT broker');
                    if (this.disconnectTime) {
                        const secondsDisconnected = (Date.now() - this.disconnectTime) / 1000;
                        console.log(`Reconnected after being disconnected for ${secondsDisconnected} seconds`);
                        this.disconnectTime = null;
                    }
                    resolve();
                },
                onFailure: (err) => {
                    console.log('Failed to connect to MQTT broker:', err);
                    reject(err);
                }
            });
        });

        try {
            await this.onConnectPromise;
            this.client.onConnectionLost = (responseObject) => {
                if (responseObject.errorCode !== 0) {
                    console.log("MQTT connection lost: " + responseObject.errorMessage);
                    this.disconnectTime = Date.now();
                    console.log("Reconnecting...");
                    this.connect();  // reconnecting when connection lost
                }
            };
            this.client.onMessageArrived = this.onMessageArrived.bind(this);
        } catch (err) {
            console.error('Failed to connect:', err);
            setTimeout(() => this.connect(), 5000);  // Retry connection in 5 seconds
        }
    }

    async publish(msg) {
        if (!this.client.isConnected()) {
            alert('MQTT disconnected. Please refresh the page.');
            return;
        }
        var payload = new Paho.Message(msg);
        payload.destinationName = this.pubTopic;
        this.client.send(payload);
        console.log("Published message: " + msg);
    }

    async publishTopic(topic, msg) {
        if (!this.client.isConnected()) {
            alert('MQTT disconnected. Please refresh the page.');
            return;
        }
        var pubTopic = topic + '_prompt/' + this.userId;
        var respTopic_end = topic + "_completion_end/" + this.userId;
        var self = this;
        return new Promise((resolve) => {
            self.subscribe(respTopic_end, (subMsg) => {
                self.client.unsubscribe(respTopic_end);
                delete self.subscriptions[respTopic_end];
                resolve(subMsg);
            });
            var payload = new Paho.Message(msg);
            payload.destinationName = pubTopic;
            this.client.send(payload);
        });
    }

    // MQTT message subscribe function
    subscribe(topic, onMessageReceived) {
        if (!this.subscriptions[topic]) {
            this.subscriptions[topic] = {
                onMessageReceived: onMessageReceived
            };
            this.client.subscribe(topic);
        } else {
            console.warn(`Already subscribed to topic: ${topic}`);
        }
    }

    // MQTT message received handler 
    onMessageArrived(message) {
        const topic = message.destinationName;
        const payload = message.payloadString;
        if (this.subscriptions[topic] && this.subscriptions[topic].onMessageReceived) {
            this.subscriptions[topic].onMessageReceived(payload);
        }
    }
}
