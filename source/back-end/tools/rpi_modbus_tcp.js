var ModbusRTU = require("modbus-serial");
var client = new ModbusRTU();

// open connection to a tcp line
client.connectTCP("192.168.4.99", { port: 502 });
client.setID(1);

// read the values of 10 registers starting at address 0
// on device number 1. and log the values to the console.
setInterval(function() {
    client.readHoldingRegisters(0, 10)
        .then((data) => {
            var result = data.data;
            var hex01;
            var hex02;
    
            var ampere;
            var temperature;
    
            if (result[0] === 0 && result[1] === 0){
                ampere = 0;
            } else if (result[0] !== 0 && result[1] !== 0){
                hex01 = result[0].toString(16) + result[1].toString(16);
                ampere = HexToFloat32(hex01);
            } else {
                hex01 = result[0].toString(16) + '0000';
                ampere = HexToFloat32(hex01);
            }
    
            if (result[2] === 0 && result[3] === 0){
                temperature = 0;
            } else if (result[2] !== 0 && result[3] !== 0){
                hex02 = result[2].toString(16) + result[3].toString(16);
                temperature = HexToFloat32(hex02);
            } else {
                hex02 = result[2].toString(16) + '0000';
                temperature = HexToFloat32(hex02);
            }
    
            console.log('ampere:' + ampere + ' temperature:' + temperature);
        })
        .catch((err)=>{
            console.log(err);
        })
}, 1000);

const HexToFloat32 = (str) => {
    var int = parseInt(str, 16);
    if (int > 0 || int < 0){
        var sign = (int >>> 31) ? -1 : 1;
        var exp = (int >>> 23 & 0xff) - 127;
        var mantissa = ((int & 0x7fffff) + 0x800000).toString(2);
        var float32 = 0;
        for (i = 0; i < mantissa.length; i += 1){ 
            float32 += parseInt(mantissa[i]) ? Math.pow(2, exp) : 0; exp-- 
        }
        return float32 * sign;
    } else {
        return 0;
    }
}