import supabase from "../supabaseClient.js"
let elem = document.getElementById("signOut");
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN'){
        elem.innerHTML = "Sign-Out";
    } else if (event === "SIGNED_OUT") {
        elem.innerHTML = '<a href="Pages\\loginPage.html">Login</a>'
        var likeButtons = document.getElementsByClassName("recipe1Button");
        for (var i =0; i <likeButtons.length; i++) {
            likeButtons[i].style.backgroundColor = "";
        }
    }
  })

  
//Sign Out Event Listener
elem.addEventListener('click', function(e) {
    e = e || window.event;
    var element = e.target || e.srcElement;
        signOut();
        removeCards();
        
}, false);

//Sign Out
const signOut = async() =>{
    const { error } = await supabase.auth.signOut();
    alert("Signed Out!");
}

//Get Date
function getDate () {
    let element = document.getElementById("currentDateAdder");
    var dateHeader = element.innerText.split(" ");
    var len = 1;
    if (dateHeader[1].length > 2) {
        len = 2;
    }
    var currentDate = {monthName: dateHeader[0], day: dateHeader[1].substring(0,len), year: dateHeader[2]};
    return currentDate;
}


//Add Event Listeners to Add Buttons
function addEventListenerAddButtons (){
    var buttonsAdd = document.getElementsByClassName("recipeButton");
    for (var i =0; i < buttonsAdd.length; i++) {
        buttonsAdd[i].addEventListener('click', function(ea) {
            ea = ea || window.event;
            var elementButtonA = ea.target || ea.srcElement;
                let id = elementButtonA.parentElement.parentElement.parentElement.getAttribute('id');
                addRecipeDate(id);
                setTimeout(displayDateRecipes, 1500);
                
        }, false);
    }
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

//Remove Recipie From Certain Date
function addEventListenerRemoveButtons (){
    let buttonsB = document.getElementsByClassName("recipeButtonCurrent");
    for (var i =0; i < buttonsB.length; i++) {
        buttonsB[i].addEventListener('click', function(ec) {
            ec = ec || window.event;
            var elementButtonB = ec.target || ec.srcElement;
                let id = elementButtonB.parentElement.parentElement.getAttribute('id');
                removeRecipeDate(id);
                setTimeout(displayDateRecipes, 1500);
        }, false);
    }
}

//Store date recipes in this format: 
// |MonthName,Day,Year,id,id,id
// Repear for new dates


//Function to make recipe date card
const getDateRecipe = async(ids) => {
    const { data, error } = await supabase
        .from('recipeSample')
        .select()
        .in('ID', ids)
    for(var i =0; i <data.length; i++) {
        setRecipeCardDate(data[i].Image, data[i].Title.replace('Be the first to rate & review!', ''), data[i].ID, data[i].Link);
    }
    addEventListenerRemoveButtons();
}

//Display Recipe for Current Date
//Only Display
const displayDateRecipes = async() => {
    removeCards();
    const { data, error } = await supabase
        .from('User Recipe')
        .select('date_recipe')
    let dateList = data[0].date_recipe.split("|");
    let date = getDate();
    for (var i=1; i <dateList.length; i++) {
        dateList[i] = dateList[i].split(",");
        if(dateList[i][0] === date.monthName && dateList[i][1] === date.day && dateList[i][2] === date.year) {
            //display these recipes on this date
            var tempDateList = [];
            for (var j=3; j<dateList[i].length; j++){
                tempDateList.push(dateList[i][j]);
            }
            getDateRecipe(tempDateList);
            break;
        } else {
            continue;
        }

    }
    
}

displayDateRecipes();

//Add Recipe to Date Via ID
const addRecipeDate = async(id) => {
    var user = await userID();
    var dateStuff = await dateCheck(id);
    let date = getDate();
    var dateFormat = "|" + date.monthName +","+ date.day + "," + date.year;
    var recipeStuff;
    var startIndex;
    //True means date does not exist or ID is not being reused
    
    if (dateStuff.date){
        recipeStuff = dateStuff.currentData + dateFormat + "," + id;
    }else {
        if(dateStuff.id) {
            startIndex = dateStuff.currentData.indexOf(dateFormat) + dateFormat.length;
            recipeStuff = dateStuff.currentData.substring(0,startIndex) + ","+id + dateStuff.currentData.substring(startIndex);
        }else {
            alert("Recipe Already Added!");
        }
    }
    const { data, error } = await supabase
        .from('User Recipe')
        .update({
        date_recipe : recipeStuff
        })
        .eq('id', user)
}

//Displays Recipe on Search Bar on Left
//search is boolean, false means no search
//number is length of results to display at a time
const displayRecipesSearch = async(number, search, searchWord) =>{
    if (!search) {
        const { data, error } = await supabase
            .from('recipeSample')
            .select()
        for(var i = 0; i < number; i++) {
            setRecipeCardSearch(data[i].Image, data[i].Title.replace('Be the first to rate & review!', ''), data[i].ID, data[i].Link);
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
        addEventListenerAddButtons();
    } else {
        if (searchWord === "") {
            alert('Please Enter a Word Next Time!')
        }else {
            
            const { data, error } = await supabase
                .from('recipeSample')
                .select()
                .textSearch('Title', searchWord)
            if (data.length === 0) {
                alert("No Results Found!");
                removeSearch();
                displayRecipesSearch (250, false, "");
            } else {
                removeSearch();
                for(var i = 0; i < data.length; i++) {
                    setRecipeCardSearch(data[i].Image, data[i].Title.replace('Be the first to rate & review!', ''), data[i].ID, data[i].Link);
                }
                //Change highlighted buttons
                let currentLikes = await getCurrentLiked();
                let currentLikesList = currentLikes.split(",");
                let recipeResults = document.getElementsByClassName("recipe1Button");
                for(var i=0; i < recipeResults.length; i++) {
                    for (var j=1; j<currentLikesList.length; j++) {
                        if(currentLikesList[j] === recipeResults[i].parentElement.parentElement.parentElement.parentElement.getAttribute('id')) {
                            recipeResults[i].style.backgroundColor = 'yellow';
                        }
                    }
                }
                addEventListenerLikeButtons();
                addEventListenerAddButtons();
            }


            
        }
    }
}
    
displayRecipesSearch (1000, false, "");
setUpClicking();



//Check if date and ID exist already
const dateCheck = async(id) => {
    //True means date does not exist or ID is not being reused
    var checkDate = {date: true, id: true, currentData:""};
    const { data, error } = await supabase
        .from('User Recipe')
        .select('date_recipe')
    checkDate.currentData = data[0].date_recipe;
    let dateList = data[0].date_recipe.split("|");
    let date = getDate();
    for (var i=1; i <dateList.length; i++) {
        dateList[i] = dateList[i].split(",");
        if(dateList[i][0] === date.monthName && dateList[i][1] === date.day && dateList[i][2] === date.year) {
            checkDate.date = false;
            for (var j=3; j<dateList[i].length; j++){
                if (dateList[i][j] === id) {
                    checkDate.id = false;
                }
            }
            break;
        } else {
            continue;
        }
    }
    
    return checkDate;
}


//Get Current Liked Recipes
const getCurrentLiked = async() =>{
    const { data, error } = await supabase
    .from('User Recipe')
    .select('liked2')
    if (data[0] === undefined) {
        alert ("Warning: You Are Not Logged In\nTo Use All Features Log In");
    } else {
        const value = data[0].liked2;
        return value;
    }
    
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
function setRecipeCardSearch (imageLink, title, recipeID, recipeLink){
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
    recipeCardContainerDiv.appendChild(link);
    recipeCardContainerDiv.appendChild(buttonDiv);
    

    //Connect
    card.appendChild(recipeCardContainerDiv);
    ul.appendChild(card);
    
}

//Function for current date recipe
//Adds clickable link
//Change to work for downloaded recipes
function setRecipeCardDate (imageLink, title, recipeID, recipeLink){
    let ul = document.getElementById("dateRecipes");
    var card = document.createElement("li");
    card.setAttribute('class', 'recipeItemCurrent');
    card.setAttribute('id', recipeID);
    //Image
    let img = document.createElement("img");
    img.setAttribute('class', 'recipeImgCurrent');
    img.src = imageLink;


    //Title
    let header = document.createElement ('h3');
    header.setAttribute('class', 'recipeCardHeaderCurrent');
    header.innerHTML = title;


    //Title Div
    var link = document.createElement("a");
    link.setAttribute("href", recipeLink);
    link.setAttribute("target", "_blank");
    var titleDiv = document.createElement('div');
    titleDiv.setAttribute('class', "titleDivCurrent");
    titleDiv.appendChild(header);
    link.appendChild(titleDiv);
    
    //Image Div 
    var imageDiv = document.createElement('div');
    imageDiv.setAttribute('class', 'imageDivCurrent');
    imageDiv.appendChild(img);
    
    //ITDIV
    var ITDiv = document.createElement('div');
    ITDiv.setAttribute('class', 'itdivCurrent');
    ITDiv.appendChild (imageDiv);
    ITDiv.appendChild(link);


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

//Check for when date header changes to update recipes and remove previous ones
//Unfortunately need to add another event listener that just rerurns displayDateRecipes()
function setUpClicking () { 
    cellClassNames = document.getElementsByClassName("date-picker");
    for (var i =0; i < cellClassNames.length; i++) {
        cellClassNames[i].addEventListener('click', function(eb) {
            eb = eb || window.event;
            var element1 = eb.target || eb.srcElement;
                displayDateRecipes();                
        }, false);
    }
}

function removeCards(){
    let lis = document.getElementsByClassName("recipeItemCurrent")
    while (lis.length > 0) {
        lis[0].remove();
    }
}


const removeRecipeDate = async (id) => {
    let user = await userID();
    let dateRemove = await dateCheck(id)
    let dateList = dateRemove.currentData;
    let date = getDate();
    let index = dateList.indexOf("|" + date.monthName + "," + date.day + "," + date.year);
    index += date.monthName.length + date.day.length + date.year.length + 2;
    index = (dateList.indexOf(","+id, index));
    dateList = (dateList.substring(0,index) + dateList.substring(index + 1 + id.length));


    const { data, error } = await supabase
    .from('User Recipe')
    .update({
    date_recipe : dateList
    })
    .eq('id', user)
}


//Submits Search Bar
document.getElementById("searchSubmit").addEventListener("click", myFunction)
function myFunction(event){
    event.preventDefault();
    displayRecipesSearch(100, true, document.getElementById("searchBar").value.replaceAll(" ", "+"));
    document.getElementById("searchBar").value = "";
}

//Remove All Searches
function removeSearch(){
    let lis = document.getElementsByClassName("recipeItem")
    while (lis.length > 0) {
        lis[0].remove();
    }
}

document.getElementById("previous").addEventListener("click", setUpClicking);
document.getElementById("next").addEventListener("click", setUpClicking);




 