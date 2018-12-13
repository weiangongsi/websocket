//index.js
//获取应用实例
const app = getApp()

Page({
    data: {},

    //页面加载事件
    onLoad: function () {
        this.initSocket();

    },
    initSocket: function () {

        var socketOpen = false

        function sendSocketMessage(msg) {
            console.log('send msg:')
            console.log(msg);
            if (socketOpen) {
                wx.sendSocketMessage({
                    data: msg
                })
            } else {
                socketMsgQueue.push(msg)
            }
        }


        var ws = {
            send: sendSocketMessage
        }

        wx.connectSocket({
            url: 'wss://xcx.dcssn.com/gs-guide-websocket'
        })
        wx.onSocketOpen(function (res) {
            socketOpen = true
            ws.onopen()
        })

        wx.onSocketMessage(function (res) {
            ws.onmessage(res)
        })

        var Stomp = require('../../utils/stomp.min.js').Stomp;
        Stomp.setInterval = function (interval, f) {
            return setInterval(f, interval);
        };
        Stomp.clearInterval = function (id) {
            return clearInterval(id);
        };
        var stompClient = Stomp.over(ws);

        stompClient.connect({}, function (sessionId) {

            stompClient.subscribe('/topic/greetings', function (body, headers) {
                console.log('From MQ:', body);
            });

            let openid = 'oO1Yu5Tlih1Lxqi7yh1qc7fZJE9M';
            stompClient.subscribe('/user/' + openid + '/message', function (body, headers) {
                wx.vibrateLong()
                console.log('From MQ to user:', body);
            });

            stompClient.send("/app/helloServer", {}, JSON.stringify({'msg': '我是客户端'}));
        })

    }
})