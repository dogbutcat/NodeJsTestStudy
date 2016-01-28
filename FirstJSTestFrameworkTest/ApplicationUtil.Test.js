ApplicationUtilTest = TestCase("ApplicationUtilTest");

ApplicationUtilTest.prototype.setUp = function () {
    this.applicationUtil = new appnamespace.ApplicationUtil();
    /*:DOC += <FORM action=""><table><tr><td>Username</td><td><input type="text" id="username"/></td><td><span id="usernameMessage"></span></td></tr><tr><td>Password</td><td><input type="password" id="password"/></td><td><span id="passwordMessage"></span></td></tr></table></FORM> */
};
// /*:DOC +=<HTML>*/ 代表创建依附于document body的DOM响应

ApplicationUtilTest.prototype.testValidateLoginFormBothEmpty = function () {
    /* Simulate empty user name and password */
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";

    this.applicationUtil.validateLoginForm();

    assertEquals("Username is not validated correctly!", "This field is required",
        document.getElementById("usernameMessage").innerText);
    assertEquals("Password is not validated correctly!", "This field is required",
        document.getElementById("passwordMessage").innerText);
};

ApplicationUtilTest.prototype.testValidateLoginFormWithEmptyUserName = function () {
    /* Simulate empty user name and password */
    document.getElementById("username").value = "";
    document.getElementById("password").value = "123";

    this.applicationUtil.validateLoginForm();

    assertEquals("Username is not validated correctly!",
        "This field is required",document.getElementById("usernameMessage").innerText);
    assertEquals("Password is not validated correctly!",
    "",document.getElementById("passwordMessage").innerText);
};

ApplicationUtilTest.prototype.testValidateLoginFormWithEmptyPassword = function () {
    /* Simulate empty */
    document.getElementById("username").value = "anyUsername";
    document.getElementById("password").value = "";

    this.applicationUtil.validateLoginForm();

    assertEquals("Username is not validated correctly!","",
    document.getElementById("usernameMessage").innerText);
    assertEquals("Password is not validated correctly!",
    "This field is required",document.getElementById("passwordMessage").innerText);
};