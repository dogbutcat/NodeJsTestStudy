/**
 * Created by oliver on 1/12/16.
 */

var nIntervId;

function changeColor(){
    nIntervId = setInterval(flashText,1000);
}
function flashText(){
    var oElem = document.getElementById("my_box");
    oElem.style.color = oElem.style.color == "red"?"blue":"red";
}

function stopTextColor(){
    clearInterval(nIntervId);
}