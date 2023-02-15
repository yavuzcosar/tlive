$(document).ready(function () {
    try {
        CascadingBind();
        DateRangeBind();
        PageCardResize();
        ContentFrameResize();
        $('.select2').select2();
    }
    catch (ex) {

    }

});
function DateRangeBind() {
    $('.date-range-picker').daterangepicker({
        timePicker: false,
        autoUpdateInput: true,
        startDate: moment(),
        endDate: moment().add(1, 'days'),
        ranges: {
            'Bugün': [moment(), moment().add(1, 'days')],
            'Yarın': [moment().add(1, 'days'), moment().add(2, 'days')],
            'Dün': [moment().subtract(1, 'days'), moment()],
            'Son 7 Gün': [moment().subtract(6, 'days'), moment()],
            'Son 30 Gün': [moment().subtract(29, 'days'), moment()],
            'Bu Ay': [moment().startOf('month'), moment().endOf('month')],
            'Son Ay': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            '** Temizle': [moment().subtract(1, 'year'), moment().add(1, 'years')],
        },
        locale: {
            format: "DD.MM.YYYY",
            cancelLabel: "Temizle",
            applyLabel: "Uygula",
            customRangeLabel: "Tarih Aralığı",
        }
    });
    $('.date-range-picker').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val("");
    });
    $('.date-range-picker').on('apply.daterangepicker', function (ev, picker) {
        if (picker.startDate.format('DD.MM.YYYY').toString() === moment().subtract(1, 'year').format('DD.MM.YYYY').toString()) {
            $(this).val("");
        }
        else {
            $(this).val(picker.startDate.format('DD.MM.YYYY') + ' - ' + picker.endDate.format('DD.MM.YYYY'));
        }
    });

    $('.time-range-picker').daterangepicker({
        timePicker: true,
        timePickerIncrement: 60,
        timePicker24Hour: true,
        locale: {
            format: 'HH:mm',
            cancelLabel: "Temizle",
            applyLabel: "Uygula"
        }
    }, function (start, end, label) { //callback

    }).on('show.daterangepicker', function (ev, picker) {
        picker.container.find(".calendar-table").hide(); //Hide calendar
    }).on('cancel.daterangepicker', function (ev, picker) {
        $(this).val("");
    });;
}
function CascadingBind() {
    $('[TCascading]').each(function (index) {
        var e = this;
        var parentId = $(e).attr("TCascading");
        var nullable = $(e).attr("TCascading-Null");
        var id = $("#" + parentId).val();
        if (nullable !== "true" && !id) {
            CascadingClear($(e));
        }
        $("#" + parentId).change(function () {
            CascadingRun(parentId, e);
        });
    });
}
function CascadingRun(parentId, e) {
    var el = $(e);
    CascadingClear(el);
    $("[TCascading='" + el.attr("id") + "']").each(function (index) {
        CascadingClear($(this));
    });
    var option = el.attr("TCascading-Option");
    var url = el.attr("TCascading-Url");
    var message = el.attr("TCascading-Message");
    var nullable = el.attr("TCascading-Null");
    var id = $("#" + parentId).val();
    if (nullable === "true" || (id && id > 0)) {
        el.append('<option value="">' + option + '</option');
        $.ajax({
            type: "GET",
            url: url + id,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                if (data.length > 0) {
                    CascadingShow(el);
                    $.each(data, function (index, option) {
                        el.append('<option value=' + option.Value + '> ' + option.Text + ' </option');
                    });
                }
            },
            error: function (xhr, status) {
                alert(message);
            }
        });
    }
}
function CascadingClear(el) {
    //console.log("CascadingClear", el);
    el.empty();
    //console.log("CascadingClear.Parent", $(el).parent());
    el.parent().hide();
    el.closest(".form-group").hide();
    el.hide();
}
function CascadingShow(el) {
    el.parent().show();
    el.closest(".form-group").show();
    el.show();
}


function FilterShow(id) {
    if ($('#' + id).val()) {
        $(".filter-" + id).hide();
    }
    else {
        $(".filter-" + id).show();
    }
}

function SearchBind(d) {
    $(".t-filter").each(function (i, e) {
        var filter = $(this);
        var id = filter.attr("id");
        var val = filter.val();
        d[id] = val;
        //console.log(id + ":", val);
    });
    $(".t-filter-check").each(function (i, e) {
        var filter = $(this);
        var id = filter.attr("id");
        var val = filter.prop("checked");
        d[id] = val;
        //console.log(id + ":", val);
    });
    console.log("SearchBind", d);
}


function DataLoaded(settings) {
    $(".t-filter-column").each(function (i, e) {
        var filter = $(this);
        var id = filter.attr("id");
        var val = filter.val();
        if (val) {
            $(".filter-" + id).hide();
            //console.log(".filter-" + id, "hide");
        }
        else {
            $(".filter-" + id).show();
            //console.log(".filter-" + id, "show");
        }
    });
    DTResize();
}
function PageCardResize() {
    try {
        var w = $(window).height();
        var card = $(".page-card")[0];
        if (card) {
            card = $(".page-card");
            var h = card.height();
            var t = card.position().top;
            //console.log("w-h-t :" + w + "-" + h + "-" + t);
            var nh = w - (t + 140);
            console.log("page-card:resize", nh);
            card.css("min-height", nh);
        }
    } catch (err) {
        console.log("PageCardSezie.Error", err);
    }

}


function DTResize() {
    try {

        var h = $(".page-card").css("min-height").replace('px', '');
        console.log("dtresize:", h);
        $(".ttable").parent().parent().css("min-height", h - 220);
    }
    catch (err) {
        console.log("DataTableHeight.Error", err);
    }
}

function ContentFrameResize() {
    try {

        var cardBody = $(".frmContent").closest(".card-body");
        if (cardBody) {
            var h = cardBody.height();
            if (h && h > 0) {
                $(".frmContent").height(h);
            }
        }
    } catch (err) {
        console.log("ContentFrameResize.Error", err);
    }
}