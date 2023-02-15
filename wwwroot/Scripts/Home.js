"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signalR = require("../node_modules/@microsoft/signalr/dist/esm/index");
//import { HubConnection, HubConnectionBuilder } from "../node_modules/@microsoft/signalr/src/index";
class HomeIndex {
    constructor(opt) {
        this.Start = function () {
            var self = this;
            self.Connection = new signalR.HubConnectionBuilder()
                .withUrl("/live")
                .configureLogging(signalR.LogLevel.Information)
                .build();
            this.Connection.on("load", data => {
                self.Load(data);
            });
            this.Connection.on("update", data => {
                self.Load(data);
            });
            this.Connection.start().then(() => this.Connection.invoke("load"));
            this.Connection.onclose(this.Start);
        };
        this.Load = function (result) {
            // ilk veri yükleme
        };
        this.Update = function (percent, server) {
            // percent : sunucuları çekerken kaç sunucu varsa ona göre bir ilerleme progress barı gössterilir
        };
        this.Url = opt.Url;
        this.Start();
    }
}
