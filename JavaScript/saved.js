import supabase from "../supabaseClient.js"
console.log(supabase);


//Get Current Liked Recipes
const getCurrentLiked = async() =>{
    const { data, error } = await supabase
    .from('User Recipe')
    .select('liked2')
    console.log(data)
    const value = data[0].liked2;
    return value;
    
}

//Add Event Listeners to Like Buttons
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

//Sets Recipe Card for Search Bar on Left
function setRecipeCardSearch (imageLink, title, recipeID, recipeLink){
    let ul = document.getElementById("likedList");
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
    var link = document.createElement("a");
    link.setAttribute("href", recipeLink);
    link.setAttribute("target", "_blank");
    titleDiv.setAttribute('class', "titleDiv");
    titleDiv.appendChild(header);
    link.appendChild(titleDiv);
    
    //Image Div 

    var imageDiv = document.createElement('div');
    imageDiv.setAttribute('class', 'imageDiv');
    imageDiv.appendChild(img);

    //Like Button
    var button2 = document.createElement('button');
    button2.setAttribute('id', 'likeButton');
    button2.setAttribute('class', 'recipe1Button');
    button2.innerHTML = '&#x2764;';
    button2.style.backgroundColor = 'yellow';
    button2.style.color ="red";
    //Button Div
    var buttonDiv = document.createElement('div');
    buttonDiv.setAttribute('class', "buttonDiv");
    buttonDiv.appendChild(button2);
    

    //Recipe Card Container Div
    let recipeCardContainerDiv = document.createElement("div");
    recipeCardContainerDiv.setAttribute('class', "recipeCardContainer");
    recipeCardContainerDiv.appendChild(imageDiv);
    recipeCardContainerDiv.appendChild(link);
    recipeCardContainerDiv.appendChild(buttonDiv);
    

    //Connect
    card.appendChild(recipeCardContainerDiv);
    ul.appendChild(card);
    
}

//Get User ID
const userID = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user.id;
}

const displayLiked = async() => {
    let likedIds = await getCurrentLiked();
    likedIds = likedIds.split(",")
    likedIds.splice(0,1);
    console.log(likedIds);
    const { data, error } = await supabase
            .from('recipeSample')
            .select()
            .in('ID', likedIds)
    console.log(data);
    for (var i = 0; i < likedIds.length; i++) {
        setRecipeCardSearch(data[i].Image, data[i].Title.replace('Be the first to rate & review!', ''), data[i].ID, data[i].Link);
    }
    addEventListenerLikeButtons();
}

displayLiked();
