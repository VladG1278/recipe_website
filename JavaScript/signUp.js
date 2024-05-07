import supabase from "../supabaseClient.js"
console.log(supabase)
var button = document.getElementById("submit")
var username = "";
var passwords = "";

button.addEventListener("click", myFunction)
function myFunction(event){
    event.preventDefault();
    createAcc();
}

const createAcc = async() =>{
  username = document.getElementById("username").value;
  passwords = document.getElementById("password").value;
  const { data, error } = await supabase.auth.signUp({
    email: username,
    password: passwords,
  })
  alert("Sign Up Successful Login Now");
  
}

const { data } = supabase.auth.onAuthStateChange((event, session) => {
    
  console.log(event, session)

  if (event === 'INITIAL_SESSION') {
    // handle initial session
  } else if (event === 'SIGNED_IN') {
    alert("Signed In!")
    document.getElementById("username").value = ""
    document.getElementById("password").value = ""
    window.location.href = "../index.html";
    
  }
})





