/**
 * Created by oliver on 3/28/16.
 */
if(Array.isArray){
    Array.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}

function changeColor(newColor) {
    //var elem = document.getElementsByTagName("p");
    //elem.style.color = newColor;
    var elem = document.getElementsByTagName("p");
    //if (Array.isArray(elem)) {
    //elem.forEach(function (elemet) {
    //    console.log(elemet.value);
    //});
    //}else{
    //    elem.style.color = 'cyan';
    //}
    //for(var element in elem){
    /* Explain: for documnet.getElementsByClassName||document.getElementsByTagName
    returns array-like object HTMLCollection instead of real array; for standard array for...in
    will work correctly returning only values (untill some properties will be added there), but it's
    bad way to do so.
    */
    //    element.style.color = newColor;
    //}
    for (var i=0;i<elem.length;i++){
        //elem[i].style.color = 'red';
        elem[i].style.color = newColor;
    }
}

function f1(){
    var n=999;
    nAdd= function () {
        n+=1
    }

    function f2(){
        var temp = document.getElementById("show");
        var p = document.createElement("p");
        var x = 0;
        //p.onclick = changeColor; //cannt use changeColor() cuz it works as function
        p.onclick = function () {
            if (x%2==0) {
                changeColor('red');
            }else{
                changeColor('blue');
            }
            console.log(x++);
        }
        p.innerText= n.toString();
        temp.appendChild(p);
    }
    return f2;
}

var result = f1();
result();
nAdd();
result();
