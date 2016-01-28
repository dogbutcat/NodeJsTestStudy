/**
 * Created by oliver on 1/22/16.
 */

appnamespace = {};

appnamespace.ApplicationUtil = function () {
};

appnamespace.ApplicationUtil.prototype.validateLoginForm = function (){
    var error=true;
    document.getElementById("usernameMessage").innerText = "";
    document.getElementById("passwordMessage").innerText = "";

    if (!document.getElementById("username").value){
        document.getElementById("usernameMessage").innerText=
            "This field is required";
        error = false;
    }

    if (!document.getElementById("password").value){
        document.getElementById("passwordMessage").innerText =
            "This field is required";
    }

    return error
};