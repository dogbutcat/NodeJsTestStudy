/**
 * Created by oliver on 1/25/16.
 */

/*function MyObject(){}

MyObject.prototype.x=1;
var obj = new MyObject();
alert("obj.x="+obj.x);
MyObject.prototype.x=2;
alert("obj.x="+obj.x); // 表示x为引用类型
obj.x=3; // 执行之后obj自身添加了x属性
alert("obj.x="+obj.x);
delete obj.x; // 删除后obj自身的x不存在,遂寻找MyObject.prototype中的x
alert("obj.x was deleted="+obj.x);*/

function MyObject1(){}
function MyObject2(){}
/*
MyObject1.prototype = new MyObject2();
MyObject2.prototype = new MyObject1();
MyObject1.prototype.x = 2;
alert(MyObject2.prototype.x)*/

function MyObject(){}
Array.prototype = new MyObject();
alert(Array.prototype.constructor);