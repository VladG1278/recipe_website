import supabase from "../supabaseClient.js"
let elem = document.getElementById("signOut");
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN'){
        elem.innerHTML = "Sign-Out";
    } else if (event === "SIGNED_OUT") {
        elem.innerHTML = '<a href="Pages\\loginPage.html">Login</a>'
        "recipe1Button".style.backgroundColor = '';
    }
  })


//Sign Out Event Listener
elem.addEventListener('click', function(e) {
    e = e || window.event;
    var element = e.target || e.srcElement;
        signOut();
}, false);

//Sign Out
const signOut = async() =>{
    const { error } = await supabase.auth.signOut();
}

//Get Date
let element = document.getElementById("currentDateAdder");
var dateHeader = element.innerText.split(" ");
var currentDate = {monthName: dateHeader[0], day: dateHeader[1].substring(0,1), year: dateHeader[2]};


//Displays Recipe on Search Bar on Left
const displayRecipes = async(number) =>{
    const { data, error } = await supabase
        .from('recipeSample')
        .select()
    console.log(data);
    for(var i = 0; i < number; i++) {
        setRecipeCardSearch(data[i].Image, data[i].Title.replace('Be the first to rate & review!', ''), data[i].ID);
    }
    //Change highlighted buttons
    let currentLikes = await getCurrentLiked();
    let currentLikesList = currentLikes.split(",");
    let recipeResults = document.getElementsByClassName("recipe1Button");
    for(var i=0; i < recipeResults.length; i++) {
        for (var j=1; j<currentLikesList.length; j++) {
            if(currentLikesList[j] === recipeResults[i].parentElement.parentElement.parentElement.getAttribute('id')) {
                recipeResults[i].style.backgroundColor = 'yellow';
            }
        }
    }

    addEventListenerLikeButtons();
}
displayRecipes(50);

//Add Event Listeners to All Buttons
function addEventListenerLikeButtons (){
    let buttons = document.getElementsByClassName("recipe1Button");
    for (var i =0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function(e) {
            e = e || window.event;
            var elementButton = e.target || e.srcElement;
                let recipeID = elementButton.parentElement.parentElement.parentElement.getAttribute('id');
                addLiked(recipeID, elementButton);
        }, false);
    }
}


//Get Current Liked Recipes
const getCurrentLiked = async() =>{
    const { data, error } = await supabase
    .from('User Recipe')
    .select('liked2')
    const value = data[0].liked2;
    return value;
}

//Add Liked Recipe ID
//If exists remove and unhighlight, else add and highlight
//remove not working
const addLiked = async(id, elementButton) => {
    var value;
    var newLiked;
    var user;
    value = await getCurrentLiked();
    user = await userID();
    const test = "," + id;
    if (value.includes(test)) {
        elementButton.style.backgroundColor = '';
        value = value.replace(test, '');
        newLiked = value;
    }else {
        if (value === "") {
            newLiked = test;
        } else {
            newLiked = value + test;
        }
        elementButton.style.backgroundColor = 'yellow';
    }
    const { data, error } = await supabase
        .from('User Recipe')
        .update({
          liked2: newLiked
        })
        .eq('id', user)
    
    
}


//Get User ID
const userID = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user.id;
}


//Sets Recipe Card for Search Bar on Left
function setRecipeCardSearch (imageLink, title, recipeID){
    let ul = document.getElementById("currentRecipes");
    var card = document.createElement("li");
    card.setAttribute('class', 'recipeItem');
    card.setAttribute('id', recipeID)
    
    //Image
    let img = document.createElement("img");
    img.setAttribute('class', 'recipeImg');
    img.src = imageLink;
    img.loading = 'lazy';


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
    button2.setAttribute('class', 'recipe1Button');
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

//Function for current date recipe
function setRecipeCardDate (imageLink, title, recipeID){
    let ul = document.getElementById("dateRecipes");
    var card = document.createElement("li");
    card.setAttribute('class', 'recipeItemCurrent');
    
    //Image
    let img = document.createElement("img");
    img.setAttribute('class', 'recipeImgCurrent');
    img.src = imageLink;


    //Title
    let header = document.createElement ('h3');
    header.setAttribute('class', 'recipeCardHeaderCurrent');
    header.innerHTML = title;


    //Title Div
    var titleDiv = document.createElement('div');
    titleDiv.setAttribute('class', "titleDivCurrent");
    titleDiv.appendChild(header);
    
    
    //Image Div 
    var imageDiv = document.createElement('div');
    imageDiv.setAttribute('class', 'imageDivCurrent');
    imageDiv.appendChild(img);
    
    //ITDIV
    var ITDiv = document.createElement('div');
    ITDiv.setAttribute('class', 'itdivCurrent');
    ITDiv.appendChild (imageDiv);
    ITDiv.appendChild(titleDiv);


    //Remove Button
    var button1 = document.createElement('button');
    button1.setAttribute('id', 'removeButton');
    button1.setAttribute('class', 'recipeButtonCurrent');
    button1.innerHTML = "-";
    

    //Recipe Card Container Div
    let recipeCardContainerDiv = document.createElement("div");
    recipeCardContainerDiv.setAttribute('class', "recipeCardContainerCurrent");
    recipeCardContainerDiv.appendChild(ITDiv);
    recipeCardContainerDiv.appendChild(button1);
    

    //Connect
    card.appendChild(recipeCardContainerDiv);
    ul.appendChild(card);
    
}


    
