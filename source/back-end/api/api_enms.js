var net = require("net")

module.exports = {
    /*========================================================== */
    //  tcp client
    /*========================================================== */
    send_switch_socket: function (req, res) {

        console.log('[Back end] send_switch_socket');

        var param = req.body.data;
        var hexStr;

        console.log(param);

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
}
