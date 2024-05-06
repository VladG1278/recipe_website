import supabase from "../supabaseClient.js"
let elem = document.getElementById("signOut");
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN'){
        elem.innerHTML = "Sign-Out";
    } else if (event === "SIGNED_OUT") {
        elem.innerHTML = '<a href="Pages\loginPage.html">Login</a>'
    }
  })

elem.addEventListener('click', function(e) {
    e = e || window.event;
    var element = e.target || e.srcElement;
        signOut();
}, false);


const signOut = async() =>{
    const { error } = await supabase.auth.signOut();
}

//Get Date
let element = document.getElementById("currentDateAdder");
var dateHeader = element.innerText.split(" ");
var currentDate = {monthName: dateHeader[0], day: dateHeader[1].substring(0,1), year: dateHeader[2]};
console.log(currentDate);
setRecipeCard("https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png", "chicken curry", "currentRecipes");





//Makes LIs with the imageLink title and id (this being the ul or ol list to add the lis to)
function setRecipeCard (imageLink, title, id){
    let ul = document.getElementById(id);
    var card = document.createElement("li");
    card.setAttribute('class', 'recipeItem');
    
    //Image
    let img = document.createElement("img");
    img.setAttribute('class', 'recipeImg');
    img.src = imageLink;


    //Title
    let header = document.createElement ('h3');
    header.setAttribute('class', 'recipeCardHeader');
    header.innerHTML = title;


    //Title Div
    var titleDiv = document.createElement('div');
    titleDiv.setAttribute('class', "titleDiv");
    titleDiv.appendChild(header);
    
    
    //Image Div 

    var imageDiv = document.createElement('div');
    imageDiv.setAttribute('class', 'imageDiv');
    imageDiv.appendChild(img);
    


    //Add Button
    var button1 = document.createElement('button');
    button1.setAttribute('id', 'addButton');
    button1.setAttribute('class', 'recipeButton');
    button1.innerHTML = "&#43;";
    //Like Button
    var button2 = document.createElement('button');
    button2.setAttribute('id', 'likeButton');
    button2.setAttribute('class', 'recipeButton');
    button2.innerHTML = '&#x2764;';
    //Button Div
    var buttonDiv = document.createElement('div');
    buttonDiv.setAttribute('class', "buttonDiv");
    buttonDiv.appendChild(button1);
    buttonDiv.appendChild(button2);
    

    //Recipe Card Container Div
    let recipeCardContainerDiv = document.createElement("div");
    recipeCardContainerDiv.setAttribute('class', "recipeCardContainer");
    recipeCardContainerDiv.appendChild(imageDiv);
    recipeCardContainerDiv.appendChild(titleDiv);
    recipeCardContainerDiv.appendChild(buttonDiv);
    

    //Connect
    card.appendChild(recipeCardContainerDiv);
    ul.appendChild(card);
    
} 