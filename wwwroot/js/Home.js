document.addEventListener("DOMContentLoaded", function (event) {
    var app = new Vue({
        el: "#liveApp",
        components: {
            apexchart: VueApexCharts,
        },
        data: {
            connection: "",
            Connected: false,

            LiveLoaded: false,
            LiveBegin: false,
            LiveData: "",
            LiveTick: "",
            LiveProgress: 100, 

            LogsLoaded: false,
            LogsData: "",

            RecordBegin: false,
            RecordTick: "",
            RecordProgress: 100,

            ArchiveBegin: false,
            ArchiveTick: "",
            ArchiveProgress: 100,

            StatsBegin: false,
            StatsTick: "",
            StatsProgress: 100,

            LinesLoaded: true,
            LinesBegin: false,
            LinesData: [{
                name: "Oturum",
                data: [
                    {
                        x: "08/03/2023 10:00",
                        y: 10
                    }
                ]}, 
            ], 
            chartOptions: {
                chart: {
                    height: 350,
                    type: 'line',
                    zoom: {
                        enabled: false
                    }, 
                    toolbar: {
                        show: false
                    }
                },
                //xaxis: {
                //    //type: 'datetime'
                //   // categories: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]
                //},
                xaxis: {
                    type: "datetime"
                },
                colors: ['#77B6EA', '#39a1f4','#a38cc6'],
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth'
                }
                
            }
        },
        methods: {

        },
        created: function () {
            var v = this;
            v.connection = new signalR.HubConnectionBuilder()
                .withUrl("/live")
                .configureLogging(signalR.LogLevel.Information)
                .withAutomaticReconnect()
                .build();
            v.connection.onreconnecting(error => {
                /*  console.assert(connection.state === signalR.HubConnectionState.Reconnecting);*/
                v.Connected = false;
            });
            v.connection.onreconnected(connectionId => {
                //console.assert(connection.state === signalR.HubConnectionState.Connected);
                v.Connected = true;
            });
            v.connection.start().then(function () {
                v.Connected = true;
                v.connection.invoke('LoadServices', 'LiveService,RecordService,ArchiveService,StatsService');
            }).catch(function (err) {
                return console.error(err.toSting());
            });
        },
        mounted: function () {
            var v = this;
            v.connection.on("Tick", function (s, t) {
                if (s == "LiveService") {
                    var d = new Date(t * 1000).toISOString().substr(14, 5);
                    v.LiveTick = d;
                    //console.log("LiveTick", t);
                }
                else if (s == "RecordService") {
                    var d = new Date(t * 1000).toISOString().substr(14, 5);
                    v.RecordTick = d;
                    //console.log("RecordTick", t);
                }
                else if (s == "ArchiveService") {
                    var d = new Date(t * 1000).toISOString().substr(14, 5);
                    v.ArchiveTick = d;
                    //console.log("ArchiveTick", t);
                }
                else if (s == "StatsService") {
                    var d = new Date(t * 1000).toISOString().substr(14, 5);
                    v.StatsTick = d;
                    //console.log("ArchiveTick", t);
                }
            });
            v.connection.on("Progress", function (s, d) {
                if (s == "LiveService") {
                    if (v.LiveBegin === false) {
                        v.LiveBegin = true;
                    }
                    v.LiveProgress = d + "%";
                }
                else if (s == "RecordService") {
                    if (v.RecordBegin===false) {
                        v.RecordBegin = true;
                    }
                    v.RecordProgress = d + "%";
                }
                else if (s == "ArchiveService") {
                    if (v.ArchiveBegin === false) {
                        v.ArchiveBegin = true;
                    }
                    v.ArchiveProgress = d + "%";
                }
                else if (s == "StatsService") {
                    if (v.StatsBegin === false) {
                        v.StatsBegin = true;
                    }
                    v.StatsProgress = d + "%";
                }
            });

            v.connection.on("LiveLoad", function (d) {
                v.LiveBegin = false;
                v.LiveData = d;
                v.LiveLoaded = true;
                console.log("LiveLoad", d);
            });
            v.connection.on("LinesLoad", function (d) {
                v.LinesBegin = false;
                v.LinesData = d;
                v.LinesLoaded = true; 
               // var me = this 
               // me.$refs.chart.updateSeries(d);
               //console.log("LinesLoad", d);
            });
            v.connection.on("LogsLoad", function (logs) {
                v.LogsData = logs;
                v.LogsLoaded = true;
                v.RecordBegin = false;
                v.ArchiveBegin = false;
                console.log("Logs", logs);
            });
            v.connection.on("StatsFinished", function () {
                v.StatsBegin = false;
            });
        }
    });
    Vue.filter('formatDate', function (value) {
        if (value) {
            return moment(String(value)).format('DD MMMM YYYY HH:mm');
        }
    });
});