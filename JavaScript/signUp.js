import supabase from "../supabaseClient.js"
console.log(supabase)
var button = document.getElementById("submit")
var username = "";
var passwords = "";

button.addEventListener("click", myFunction)
function myFunction(event){
    event.preventDefault();
    createAcc();
    alert("Sign Up Successful Login Now");
}

const createAcc = async() =>{
  username = document.getElementById("username").value;
  passwords = document.getElementById("password").value;
  const { data, error } = await supabase.auth.signUp({
    email: username,
    password: passwords,
  })
  
}





