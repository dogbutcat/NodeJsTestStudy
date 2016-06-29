/**
 * Created by oliver on 6/28/16.
 */
'use strict';
var promiseCount = 0;
function testPromise() {
    var thisPromiseCount = ++promiseCount;
    var log = document.getElementById('log');
    log.insertAdjacentHTML('beforeend', thisPromiseCount + ') Started (<small>Sync code started</small>)<br/>');

    var p1 = new Promise((resolve, reject) => {
        log.insertAdjacentHTML('beforeend', thisPromiseCount +
            ') Started (<small> Async code started</small>)<br/>');
        window.setTimeout(()=> {
            resolve(thisPromiseCount)
        }, Math.random() * 2000 + 1000);
    });
    p1.then((val)=> {
        log.insertAdjacentHTML('beforeend', val + ') Promise fulfilled (<small>Async code terminated</small>)<br/>');
    }).catch((reason)=> {
        console.log('Handle rejected promise (' + reason + ') here.');
    });

    log.insertAdjacentHTML('beforeend', thisPromiseCount + ') Promise made (<small>Sync code terminated</small>),<br/>');
}