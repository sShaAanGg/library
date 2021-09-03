var net = require("net")


module.exports = {
    /*========================================================== */
    //  tcp client
    /*========================================================== */
    send_switch_socket: function (req, res) {
        var param = req.body.data;
        var hexStr;

        switch (param) {
            case 'light_on':
                hexStr = "54414349002100124B0018E4685410320000000000000006000300000010";
                break;
            case 'light_off':
                hexStr = "54414349002100124B0018E4685410320000000000000006010300000010";
                break;
            case 'fan_on':
                hexStr = "54414349002100124B0018E467A010320000000000000006000300000010";
                break;
            case 'fan_off':
                hexStr = "54414349002100124B0018E467A010320000000000000006010300000010";
                break;
        }

        let client = net.Socket();
        let msg = '';

        client.setTimeout(5000);

        client.connect(15476, '192.168.4.11', () => {
            const cmdData = Uint8Array.from(Buffer.from(hexStr, 'hex'));
            // console.log(cmdData);
            client.write(cmdData);
            
            msg = {status: 'success'};
        })

        client.on("timeout", () => {
            msg = {status: 'Timeout'};
            client.destroy();
        })

        client.on('error', (err) => {
            msg = {status: err};
            client.end();
        })

        /* 監聽end事件 */
        client.on("data", function (data) {
            console.log("the data of server is " + data.toString());
        })
        client.on('end', () => {
            console.log('[Back end]' + msg);
            res.send(msg);
            client.end();
        })
    },
    sendPrinterSocket: function (req, res) {
        var param = req.body.data

        /* 創建TCP客户端 */
        let client = net.Socket()

        /* 設置連接的服務器 */
        client.connect(15476, '192.168.4.10', function () {

            /* 向服務器發送數據 */
            client.write('PRINTER|'+ param.spec + '|' + param.lotNo + '|' + param.snStart + '|' + param.time)
        })

        /* 監聽服務器傳來的data數據 */
        // client.on("data", function (data) {
        //     console.log("the data of server is " + data.toString());
        // })

        /* 監聽end事件 */
        client.on("end", function () {
            res.end()
        })
    }

}