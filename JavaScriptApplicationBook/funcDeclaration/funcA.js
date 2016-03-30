/**
 * Created by oliver on 1/28/16.
 */

/*TestCase("function Region", {
 "test grade": function () {
 var score = 6;

 if (score > 5 ) {
 function grade(){
 return 'pass!';
 }
 } else {
 function grade(){
 return 'fail!';
 }
 }
 assertEquals("this test is failed!","pass!",grade());
 },
 setUp: function () {
 }
 });*/

TestCase("function Expressions. ", {
    "test function scope": function () {
        var a = function x() {
            console.log('a');
            assertEquals("x is usable inside the function!", x, x);
        };

        a();

        try {
            x();
        }
        catch (e) {
            console.log(e);
        }
    }
});