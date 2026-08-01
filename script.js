function showFields() {

let value = document.getElementById("members").value;

let div = document.getElementById("names");

div.innerHTML = "";

let total = 0;

if(value=="Five")
total = 5;

if(value=="Ten")
total = 10;

for(let i=1;i<=total;i++){

let input = document.createElement("input");

input.type="text";

input.placeholder="Enter Member "+i+" Name";

input.className="player";

div.appendChild(input);

}

}

function submitForm(){

let members=document.getElementById("members").value;

let players=document.querySelectorAll(".player");

let list=[];

players.forEach(function(item){

list.push(item.value);

});

fetch("https://script.google.com/macros/s/AKfycbwSW9pAuRi5v5PDe8fQwNxuddcU5hbLIfme9cqkxzp13PnTnbx_LzybamvGbhnc-W-F/exec",{

method:"POST",

body:JSON.stringify({

members:members,

names:list.join(", ")

})

})

.then(response=>response.json())

.then(data=>{

alert("Submitted Successfully");

location.reload();

});

}
