/**
 * Created by oliver on 1/26/16.
 */

p = document.createElement("p");
p.id="p1";
p.innerText="Hello World!";
console.log(p.innerText);
document.getElementsByTagName("div")[0].appendChild(p);