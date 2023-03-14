"use strict";
var connection = new signalR.HubConnectionBuilder().withUrl(serverUrl).build();
connection.on("Executing", function (id, output) {
    document.getElementById("btnRun").disabled = true;
    var li = document.createElement("li");
    document.getElementById("outputList").appendChild(li);
    if (output == ":begin") {
        li.textContent = "Yükleniyor";
        document.getElementById("btnRun").disabled = true;
    }
    else if (output == ":started") {
        li.textContent = "Started";
        li.style.color = "red";
    }
    else if (output == ":ended") {
        document.getElementById("btnRun").disabled = false;
        li.textContent = "Ended";
        li.style.color = "red";
    }
    else {
        li.textContent = output;
    }
});

connection.start({ withCredentials: false }).then(function () {
    document.getElementById("btnRun").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("btnRun").addEventListener("click", function (event) {
    var cmd = document.getElementById("Command").value;
    connection.invoke("Execute", cmd).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});


$(document).ready(function () {
    $("#Command").change(function () {
        LoadData();
    });
});


function LoadData() {
    $("#outputList").html("");
    var command = $("#Command").val();
    if (command && command != "") {
        var type = $('#Command option:selected').get(0).attributes["t-type"].value;
        if (type == "Read") {

        }
        else if (type == "ReadWrite") {

        }
    }
    else {

    }
}
function RunOld() {
    $("#dvResult").html("Yükleniyor...");
    var command = $("#Command").val();
    if (command && command != "") {
        var url = serverUrl + "cmd=" + command;
        var type = $('#Command option:selected').get(0).attributes["t-type"].value;
        if (type == "Read") {

        }
        else if (type == "ReadWrite") {
            var p = $("#Prm").val();
            url = url + "&p=" + p;
        }
        $.get(url, function (d) {
            if (d.IsSuccess) {
                console.log(d.Data);
                $("#dvResult").html(d.Data);
            }
            else {
                toastr.warning(d.Message);
            }
        });

    }
    else {
        toastr.error("Komut girin");
    }
}