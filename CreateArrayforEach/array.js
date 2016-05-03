/**
 * Created by oliver on 4/12/16.
 */
if(Array.prototype.forEach){
    Array.prototype.forEach = function (callback, thisArg) {
        var T,k=0;
        if(this==null){
            throw new TypeError('This is null or not defined!');
        }
        var O = Object(this),
            len = O.length>>>0;
        if ({}.toString.call(callback)!='[object Function]'){
            throw new TypeError(callback+'is not a function')
        }
        if(thisArg){
            T=thisArg;
        }
        while (k<len){
            if (k in O){
                var kValue = O[k];
                callback.call(T,kValue,k,O);
            }
            k++;
        }
    }
}
var tempArray = [1,3,5];
tempArray.forEach(function (arg,entry,index) {
    console.log(arg+' '+entry+' '+index+' '+this)
},'callOption')