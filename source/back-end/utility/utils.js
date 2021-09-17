const axios = require('axios');

module.exports = {
    data_check: function (data, example) {
        var errorField = 0
        Object.keys(data).map(field => {
            if (example.indexOf(field) < 0) {
                ++errorField
            } else {
                example.splice(example.indexOf(field), 1)
            }
        })

        return (errorField === 0 && example.length === 0) ? true : false
    },

    json_write: function (res, ret) {
        if (typeof ret === 'undefined') {
            res.json({
                code: '1',
                msg: '操作失敗'
            })
        } else {
            res.json(ret)
        }
    },

    formattime: function (time, format) {
        var t = new Date(time);
        var tf = function (i) { return (i < 10 ? '0' : '') + i };
        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
            switch (a){
                case 'yyyy':
                    return tf(t.getFullYear());
                break;
                case 'MM':
                    return tf(t.getMonth() + 1);
                break;
                case 'mm':
                    return tf(t.getMinutes());
                break;
                case 'dd':
                    return tf(t.getDate());
                break;
                case 'HH':
                    return tf(t.getHours());
                break;
                case 'ss':
                    return tf(t.getSeconds());
                break;
                default:
                    console.log('未在規範內時間格式');
                break;
            }
        })
    },
}
