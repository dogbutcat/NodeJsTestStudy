/**
 * Created by oliver on 4/13/16.
 */
var x=0;
function test() {
    console.log(this.x)
    if (arguments.length !== 0){
        var i=test2;
        i.call(arguments[0]);
    }
}
function test2() {
    console.log('test2: '+this.x);
}

var o={};
o.y = {};
o.x=1;
o.y.x=2;
o.m = test;
o.m.apply();
o.m.call(o);
o.m.apply(o,[o.y]);