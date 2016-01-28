/**
 * Created by oliver on 1/12/16.
 */
/*Sample One-Read Files
//Sync
fs = require('fs');
filenames = fs.readdirSync(".");
for (i=0;i<filenames.length;i++){
    console.log(filenames[i]);
}
console.log('Current uid: '+process.getuid()+'\n');

//Async
fs.readdir(".",function(err,filenames){
    var i;
    for (i=0;i<filenames.length;i++){
        console.log(filenames[i]);
    }
})
console.log('Current uid: '+process.getuid());
*/

/*Sample Two-Calculate Byte Number
//Sync
fs = require('fs');
filenames = fs.readdirSync(".");
for (i=0;i<filenames.length;i++){
    var stats=fs.statSync("./"+filenames[i]);
    var totalBytes;
    totalBytes +=stats.size;
}
console.log(totalBytes+'\n');

//Async
count = filenames.length;
for (i=0;i<filenames.length;i++){
    fs.stat("./"+filenames[i],function(err,stats){
        totalBytes +=stats.size;
        count--;
        if(count === 0){
            console.log(totalBytes);
        }
    });
}
*/
