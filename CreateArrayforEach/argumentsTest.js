/**
 * Created by oliver on 5/4/16.
 */
function ArgTest(a, b) {
    var i,s = 'The ArgTest function expected';
    var numargs = arguments.length; // Get the Value transfered by Parameters
    var expargs = ArgTest.length;   // Get the Value of expected Parameters
    if (expargs<2){
        s+=expargs+' argument.';
    }else{
        s+=expargs+' arguments.';
    }

    if (numargs<2){
        s+=numargs+' argument.';
    }else{
        s+=numargs+' arguments.';
    }

    s+='\n\n';
    for (i = 0;i<numargs;i++){
        s+=' Arg '+i+' = '+arguments[i]+'\n';
    }

    return s;
};

var ret = ArgTest(1,2,3,4);

var p,e=document.getElementsByTagName('body')[0];
p=document.createElement('p');
(p.innerText=ret);
e.appendChild(p);