import supabase from "../supabaseClient.js"
var button = document.getElementById("submit")
var username = "";
var passwords = "";
button.addEventListener("click", myFunction)
function myFunction(event){
    event.preventDefault();
    signIn();
    
}
const signIn = async() =>{
    username = document.getElementById("username").value;
    passwords = document.getElementById("password").value;
    const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password: passwords,
      })

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
  