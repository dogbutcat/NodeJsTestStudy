/**
 * Created by oliver on 4/14/16.
 */
var newArray = [1,4,9],map = Array.prototype;
newArray.map(function (e) {
    return parseInt(e,10) // 需要转换的数字和该数字的进制根
})

manualforEach = function (arr, fn, context) {
    for (var i =0,l = arr.length;i<l;i++){
        fn.call(context,arr[i],i,arr)
    }
}

manualMap = function (arr, fn, context) {
    var ret = [];
    
    manualforEach(arr,function (item, i, arr) {
        var temp = fn.call(context,item,i,arr);
        ret.push(temp)
    });
    
    return ret;
}([1,2,3],function (a) {
    return ++a;
})
