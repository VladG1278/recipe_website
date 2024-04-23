import supabase from "../config/supabaseClient.js"

console.log(supabase);
var button = document.getElementById("submit");
button.addEventListener("click", myFunction);

var username;
var password;
function myFunction(event){
    event.preventDefault(); 
    username = document.getElementById("username").value;
    password = document.getElementById("password").value;
}