import supabase from "../supabaseClient.js"
console.log(supabase)
var button = document.getElementById("submit")
var username = "";
var passwords = "";

button.addEventListener("click", myFunction)
function myFunction(event){
    event.preventDefault();
    createAcc();
 /*    username = document.getElementById("username").value;
    passwords = document.getElementById("password").value; */
}

const createAcc = async() =>{
const { data, error } = await supabase.auth.signUp({
    email: 'bo@gmail.com',
    password: 'test2134',
  })
}






