/**
 * Created by oliver on 3/31/16.
 */
/*
function bindAll(){
    $("div.r1").click(function (r) {
        clicker = this;
        r.preventDefault();
        var c = $("meta[name=csrf-token]").attr("content");
        $.post("/api/activity/createInvoice",{
            _csrf:c,
            id:"1",
            price:$(this).data("price"),
            row:String($(this).data("row")),
            column:String($(this).data("col"))
        }, function (r) {
            r.err?(alert(r.err),"Already Gone!" == r.err && $(clicker).css("background-color","gray")):window.location.href="/usercenter/invoice"
        },"json")
    })
}*/
