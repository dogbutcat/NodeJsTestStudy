/**
 * Created by oliver on 4/3/16.
 */
function Person(first,last){
    this.first=first;
    this.last=last;
}

var me =new Person('John','Smith');
var jane = new Person('Jane','Doe');
var emily = new Person('Emily','Janes');

console.table([me,jane,emily]);