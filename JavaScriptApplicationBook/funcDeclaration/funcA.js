/**
 * Created by oliver on 1/28/16.
 */

TestCase("function Region", {
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
})