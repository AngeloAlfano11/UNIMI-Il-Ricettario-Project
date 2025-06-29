//funzione che controlla i dati dell'utente durante il login per verificare se esso esiste o se qualche dato è errato
function userLogin() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    console.log("email = "+email);
    console.log("passowrd = "+password);
    var user = JSON.parse(window.localStorage.getItem(email));
    console.log(user);
    if(user==null || user.password!=password) {
        document.getElementById("loginError").classList.remove("d-none");
        return false;
    }
    window.localStorage.setItem("loggedUser", email);
    return true;
}

//funzione che salva nel sessionStorage informazioni essenziali per la ricerca della ricetta, se questa ha avuto piu risultati
function sessionStorageSearchedRecipe(recipe, searchTitle) { 
    console.log("searchTitle ="+searchTitle);  
    var essentialRecipesInfo = {};
    for (let i = 0; i < recipe.length; i++) {
        var meal = recipe[i];
        var idThumb = {}
        idThumb[meal.idMeal]=meal.strMealThumb;
        essentialRecipesInfo[meal.strMeal]=idThumb; 
    }
    var infos = {};
    infos[searchTitle]=essentialRecipesInfo;
    sessionStorage.setItem("recipeFounded",JSON.stringify(infos));
}

//funzione che disabilita e nasconde i vari tipi di ricerca, lasciando quella standard
function resetSearch() {
    var searchInput = document.getElementById("searchInput");
    searchInput.removeAttribute("disabled");
    searchInput.classList.remove("d-none");
    searchInput.setAttribute("placeholder","Search recipe");
    var selectSearch = document.getElementById("selectSearch");
    selectSearch.setAttribute("disabled","");
    selectSearch.classList.add("d-none");
    selectSearch.innerHTML='<option value="-1" selected>Choose an option</option>';
}

//funzione per fare una chiamata XML che esegue una funzione callback in caso di successo
function randomXhrRequest(url, callback) {
    console.log("chiamo randomXhrRequest");
    var xhrRequest = new XMLHttpRequest();
    xhrRequest.open('GET', url, true);
    xhrRequest.onload = function() {
        var status= xhrRequest.status;
        console.log("status = "+status);
        if (status==200) {
            //console.log("xhrRequest.response = "+xhrRequest.response);
            callback(xhrRequest);
        } else {
            console.log("Errore, status = "+ status);
        }
    };
    xhrRequest.send();
}

//modifica la barra di ricerca in base al tipo selezionato
function editSearchBar(type) {
    var searchInput = document.getElementById("searchInput");
    var url = "";
    resetSearch();
    console.log(type);
    switch (type) {
        case "categories":
            url = "https://www.themealdb.com/api/json/v1/1/list.php?c=list";
            searchInput.setAttribute("disabled","");
            searchInput.classList.add("d-none");  
            var selectSearch = document.getElementById("selectSearch");
            selectSearch.removeAttribute("disabled");
            selectSearch.classList.remove("d-none");
            selectSearch.setAttribute("name","categoryName");
            randomXhrRequest(url, function(xhrRequest) {
                var categories = JSON.parse(xhrRequest.response)["meals"];
                var options = "";
                for (let i = 0; i < categories.length; i++) {
                    options+='<option value=&quot;'+categories[i].strCategory+'&quot;>'+categories[i].strCategory+'</option>';                
                }
                selectSearch.innerHTML+=options;
            });
            break;
        case "area":
            url = "https://www.themealdb.com/api/json/v1/1/list.php?a=list";
            searchInput.setAttribute("disabled","");
            searchInput.classList.add("d-none");
            var selectSearch = document.getElementById("selectSearch");
            selectSearch.removeAttribute("disabled");
            selectSearch.classList.remove("d-none");
            selectSearch.setAttribute("name","areaName");
            randomXhrRequest(url, function(xhrRequest) {
                var categories = JSON.parse(xhrRequest.response)["meals"];
                var options = "";
                for (let i = 0; i < categories.length; i++) {
                    options+='<option value=&quot;'+categories[i].strArea+'&quot;>'+categories[i].strArea+'</option>';                
                }
                selectSearch.innerHTML+=options;
            });
            break;        
        case "ingredients":
            searchInput.setAttribute("placeholder","Search by main ingredient");
            searchInput.setAttribute("name","ingredientName");
            break;
        case "firstLetter":
            searchInput.setAttribute("placeholder","Search by first letter");
            searchInput.setAttribute("name","firstLetter");
            break;
        default:
            console.log("type of searchbar not found");
    } 

}

//funzione per mostrare o nascondere la ricerca vanzata delle ricette, resettandola in caso
function displayAdvacedSearch() {
    document.getElementById("categoriesRadio").checked=false;
    document.getElementById("areaRadio").checked=false;
    document.getElementById("ingredientRadio").checked=false;
    document.getElementById("firstCharRadio").checked=false;
    document.getElementById("searchInput").setAttribute("name","recipeName");
    if(document.getElementById("advancedSearchCheck").checked==true) {
        document.getElementById("advacedSearchContainer").classList.remove("d-none");
    } else {
        document.getElementById("advacedSearchContainer").classList.add("d-none");
        resetSearch();
    }   
}

//funzione per checkare le review già rilasciate dall'utente, aggiornando di conseguenza i bottoni
function checkUserSubmittedReviews(recipeName) {    
    var loggedUser = window.localStorage.getItem("loggedUser");    
    //controllo se l'utente è loggato o meno
    if(loggedUser==-1) {        
        return;
    }
    var reviewValue;
    var difficultyReview = JSON.parse(window.localStorage.getItem("difficultyReviews"))[recipeName];    
    //controllo se l'utente non ha lasciato una recensione sulla difficoltà o se la ricetta non ha recensioni sulla difficoltà
    if(difficultyReview==undefined || difficultyReview[loggedUser]==undefined) {        
    } else {
        reviewValue = difficultyReview[loggedUser];
        document.getElementById("btnradioDifficulty"+reviewValue).setAttribute("checked","");
    }
    var tasteReview = JSON.parse(window.localStorage.getItem("tasteReviews"))[recipeName];
    //controllo se l'utente non ha lasciato una recensione sul sapore o se la ricetta non ha recensioni sulla difficoltà
    if(tasteReview==undefined || tasteReview[loggedUser]==undefined) {        
    } else {
        reviewValue = tasteReview[loggedUser];
        document.getElementById("btnradioTaste"+reviewValue).setAttribute("checked","");
    }
    //aggiorno le funzioni dei bottoni
    updateFuncionReview("difficulty",recipeName);
    updateFuncionReview("taste",recipeName);
}

//funzione che genera il localStorage essenziale per il funzionamento del sito
function createEssentialLocalStorage() {
    console.log(window.localStorage.getItem("loggedUser"));
    if(window.localStorage.getItem("loggedUser")==null) {
        window.localStorage.setItem("loggedUser",-1);
    }
    if(window.localStorage.getItem("difficultyReviews")==null) {
        window.localStorage.setItem("difficultyReviews", "{}");
    }
    if(window.localStorage.getItem("tasteReviews")==null) {
        window.localStorage.setItem("tasteReviews", "{}");
    }    
}

//funzione che aggiorna la media della recensione di lable
function updateReview(lable, recipeName) {
    //console.log("chiamo updateReview");
    var recipeReviews = JSON.parse(window.localStorage.getItem(lable+"Reviews"))[recipeName];     
    //if che controlla se è la ricetta non è stata ancora recensita
    console.log(recipeReviews);
    if(recipeReviews==undefined && document.getElementById(lable+"Title")==null) {
        //console.log("la ricetta non ha ancora recensioni");
        return "-";
    }    
    var totalValues = 0;
    var n = 0;      
    for (var key in recipeReviews) {
        totalValues+=Number(recipeReviews[key]);
        n++;
    }
    //if che controlla se è la prima volta che si apre la pagina oppure se la funzione è chiamta da updateReview, in quanto nel primo caso ritorna la stringa con la media dei voti, mentre nel secondo caso cambia il titolo del tag p
    console.log("id = "+lable+"Title");
    var pTag = document.getElementById(lable+"Title");
    if(document.getElementById(lable+"Title")==null) {
        console.log("prima chiamta di updateReview per "+lable);
        return Number.parseFloat(totalValues/n).toFixed(2).toString();
    }  else {
        if(recipeReviews==undefined) {
            lable= lable.charAt(0).toUpperCase()+lable.slice(1)+" : -";
        } else {
            //modifico la lable mettendo la prima lettera maiuscola
            lable = lable.charAt(0).toUpperCase()+lable.slice(1)+" : "+Number.parseFloat(totalValues/n).toFixed(2);
        }        
        pTag.innerText=lable;        
    }       
}

//funzione che aggiorna tutti i bottoni in base a lable con la funzione tra removeReview e submitReview, dipendentemente da qual'è quella più adatta
function updateFuncionReview(lable, recipeName) {
    for (let i = 1; i <= 5; i++) {
        button = document.getElementById("btnradio"+lable.charAt(0).toUpperCase()+lable.slice(1)+i);       
        if(button.checked) {
            document.getElementById("btnradio"+lable.charAt(0).toUpperCase()+lable.slice(1)+i).setAttribute("onclick",'removeReview("'+lable+'","'+recipeName+'","'+i+'")');
        } else {
            document.getElementById("btnradio"+lable.charAt(0).toUpperCase()+lable.slice(1)+i).setAttribute("onclick",'submitReview("'+lable+'","'+recipeName+'","'+i+'")');
        }
    }    
}

//funzione che rimuove una recensione
function removeReview(lable, recipeName, value) {
    var loggedUser = window.localStorage.getItem("loggedUser");  
    var reviewRecipe = JSON.parse(window.localStorage.getItem(lable+"Reviews"));  
    delete reviewRecipe[recipeName][loggedUser];
    if(Object.keys(reviewRecipe[recipeName])==0) {
        delete reviewRecipe[recipeName];
    }
    window.localStorage.setItem(lable+"Reviews", JSON.stringify(reviewRecipe));
    //aggiorno i bottoni per aggiungere la recensione
    document.getElementById("btnradio"+lable.charAt(0).toUpperCase()+lable.slice(1)+value).checked=false;
    updateFuncionReview(lable, recipeName);
    updateReview(lable, recipeName);
}

//funzione che aggiunge una recensione
function submitReview(lable, recipeName, value) {
    var loggedUser = window.localStorage.getItem("loggedUser");    
    var yourReview = {};
    yourReview[loggedUser]= value;
    //controllo se l'utente è loggato o meno per lasciare la recensione, mandando un messaggio d'errore in caso
    if(loggedUser==-1) {
        document.getElementById("errorToSubmitReviews").classList.remove("d-none");
        return;
    }
    var reviewRecipe = JSON.parse(window.localStorage.getItem(lable+"Reviews"));    
    //if che controlla se è la prima recensione che viene fatta, in quanto altrimenti ci sarebbe un undefined che bloccherebbe la funzione
    if(reviewRecipe[recipeName]==undefined) {
        reviewRecipe[recipeName]=yourReview;
    } else {  
        reviewRecipe[recipeName][loggedUser] = value;
    }
    window.localStorage.setItem(lable+"Reviews", JSON.stringify(reviewRecipe));
    //aggiorno i bottoni per aggiungere la recensione
    updateFuncionReview(lable, recipeName);
    updateReview(lable, recipeName);    
}

//funzione che salva nei dati dell'utente la nota scritta su una ricetta
function savePersonalNote(loggedUser, recipeName) {
    var user = JSON.parse(window.localStorage.getItem(loggedUser));
    //salvo la nota    
    user.personalNotes[recipeName]=document.getElementById("personalNoteArea").value;
    //sovrascrivo i dati per aggiornare personalNotes
    window.localStorage.setItem(loggedUser,JSON.stringify(user));
    var editPersonalNoteButton = document.getElementById("editPersonalNoteButton");
    var personalNoteArea =  document.getElementById("personalNoteArea")
    //faccio tornare la textarea ed il pulsante come prima
    editPersonalNoteButton.textContent="Edit note";
    editPersonalNoteButton.setAttribute("onclick",'editPersonalNote("'+loggedUser+'", "'+recipeName+'")');
    personalNoteArea.setAttribute("disabled", "");
}

//funzione che permette la modifica delle note dell'utente se si clicca il pulsante
function editPersonalNote(loggedUser, recipeName) {
    var editPersonalNoteButton = document.getElementById("editPersonalNoteButton");
    var personalNoteArea =  document.getElementById("personalNoteArea")
    //modifico il pulsante per sbloccare il textarea e ne cambio la funzione
    editPersonalNoteButton.textContent="Save note";
    editPersonalNoteButton.setAttribute("onclick",'savePersonalNote("'+loggedUser+'", "'+recipeName+'")');
    //modifico il CSS della textarea per far comprendere all'utente la possibilità di poter editare
    personalNoteArea.removeAttribute("disabled");
}

//funzione che restituire l'html del div contenente le note personali dell'utente se è loggato
function addPersonalNote(recipeName) {
    var loggedUser = window.localStorage.getItem("loggedUser");
    if(loggedUser==-1) {
        return "<br>";
    }
    loggedUser = JSON.parse(window.localStorage.getItem(loggedUser));        
    var personalNote = loggedUser.personalNotes[recipeName];
    //controllo se c'è una nota o meno nei dati dell'utente. Se non c'è, metto il vuoto
    if(personalNote==undefined) {
        personalNote = "";
    }
    var html = '<div class="row text-center d-flex bg-warning bg-opacity-50 rounded-3 mx-auto"><p class="fs-2">Personal notes</p><textarea class="form-control" id="personalNoteArea" disabled>'+personalNote+'</textarea><button class="btn btn-light" id="editPersonalNoteButton" type="button" onclick="editPersonalNote(&quot;'+window.localStorage.getItem("loggedUser")+'&quot;,&quot;'+recipeName+'&quot;)">Edit note</button></div>';
    return html;
}

//funzione che mostra 6 ricette
function displaySixRecipes(index, caller) {
    var container;
    //resetta l'innerHTML del container quando clicco il pulsante nel caso ci siano piu ricette
    var reset;
    var allRecipesKeys = [];
    var recipeNames_idThumb = {};
    var searchTitle;
    //if che controlla se la funzione è stata chiamata dalla pagina privata dell'utente per mostrare i preferiti oppure se è stata chiamata perché la ricerca di una ricetta ha restituito più risultati
    if(!caller) {
        container = document.getElementById("containerFavRecipes");
        reset = '<div class="col-md-12"><p class="text-center fs-2 text-primary text-opacity-75">Your favourite recipes</p></div>';
        var user = JSON.parse(window.localStorage.getItem(window.localStorage.getItem("loggedUser")));
        console.log("user ="+JSON.stringify(user));
        allRecipesKeys = Object.keys(user.favRecipes);
        recipeNames_idThumb = user.favRecipes;      
    } else {        
        container = document.getElementById("recipeContainer");        
        searchTitle = Object.keys(JSON.parse(sessionStorage.getItem("recipeFounded")));
        recipeNames_idThumb = JSON.parse(sessionStorage.getItem("recipeFounded"))[searchTitle];
        allRecipesKeys = Object.keys(recipeNames_idThumb);
        reset ='<div class="col-md-12"><p class="fs-2 text-center mb-4">Results for "'+String(searchTitle).replace(/_/g," ")+'"</p></div>';
    }
    console.log("allRecipesKeys = "+allRecipesKeys);
    console.log("recipeNames_idThumb = "+JSON.stringify(recipeNames_idThumb));    
    container.innerHTML=reset;
    //flag che serve per fermare il ciclo for per mostrare solo le prime 6 ricette
    var flag = 0;
    var nPages = Math.ceil(allRecipesKeys.length/6);
    //il sixNames contiene 6 o meno ricette da mostrare nella pagina
    var sixNames = [];
    for (; (index < allRecipesKeys.length && flag<6); index++) {        
        sixNames[flag]=allRecipesKeys[index];
        flag++;
    };
    console.log("sixNames ="+sixNames);
    for (let i = 0; i < sixNames.length; i++) {      
        container.innerHTML += '<a class="col-md-6 my-2 colCards simpleText" href="recipe.html?recipeId='+Object.keys(recipeNames_idThumb[sixNames[i]])+'"><img class="rounded img-fluid d-block fit-contain w-50 h-auto mx-auto" src="'+Object.values(recipeNames_idThumb[sixNames[i]])+'"><p class="text-center">'+sixNames[i]+'</p></a>';
    };
    //costruisco lo slider per mostrare le altre ricette
    var navBar = "";
    if(nPages>1) {
        //creo una variabile navBar perché se scrivessi subito nell'innerHTML del container, i tag si metterebbero uno sotto l'altro, perciò prima costruisco la barra e poi la metto nell'container
            navBar = '<nav class="navbar navbar-expand-lg bg-light"><div class="container-fluid justify-content-center">';
            navBar+='<button class="btn btn-primary mx-2" onclick="displaySixRecipes(&quot;' + Math.max(0,Number(index-12)) + '&quot;,'+caller+')">←</button>';
            for (let j = 1; j <= nPages; j++) {
                console.log("j = "+j);
                if(j==Math.ceil(index/6)) {
                    navBar += '<button class="btn btn-outline-primary mx-2" onclick="displaySixRecipes(&quot;' + ((j-1) * 6) + '&quot;,'+caller+')">' + j + '</button>';
                } else {
                navBar += '<button class="btn link-underline-opacity-0 mx-2" onclick="displaySixRecipes(&quot;' + ((j-1) * 6) + '&quot;,'+caller+')">' + j + '</button>'; 
                }        
            }
            navBar+='<button class="btn btn-primary mx-2" onclick="displaySixRecipes(&quot;' + Math.min((nPages-1)*6,Number(index)) + '&quot;,'+caller+')">→</button>';
            navBar+='</div></nav>';
    }    
    container.innerHTML+=navBar;    
}

/*
//funzione per costruire il ricettario con le ricette salvate
function displayFavRecipes(user) {
    var container = document.getElementById("containerFavRecipes");
    var favRecipesKeys = Object.keys(user.favRecipes);
    //console.log("RoundDown(6/favRecipesKeys.length) = "+Math.floor(favRecipesKeys.length/6));
    if(favRecipesKeys.length<=6) {
        container.innerHTML='<div class="col-md-12"><p class="text-center fs-2 text-primary text-opacity-75">Your favourite recipes</p></div>';
        for (let i = 0; i < favRecipesKeys.length; i++) {
        console.log("i = "+i);        
        container.innerHTML += '<a class="col-md-6 my-2 colCards simpleText" href="recipe.html?recipeId='+Object.keys(user.favRecipes[favRecipesKeys[i]])+'"><img class="rounded img-fluid d-block fit-contain w-50 h-auto mx-auto" src="'+Object.values(user.favRecipes[favRecipesKeys[i]])+'"><p class="text-center">'+favRecipesKeys[i]+'</p></a>';
        };
    } else {
        displaySixRecipes(0,false);
    }    
}
*/

//funzione che restituisce l'html del bottone dei preferiti se l'utente è loggato
function buildFavButton(mealValues) {
    var html = "<br>";
    var mealName = mealValues.strMeal;
    //non metto il bottone dei preferiti se non c'è alcun account loggato
    if(window.localStorage.getItem("loggedUser")==-1) {
        return html;
    }
    var user = JSON.parse(window.localStorage.getItem(window.localStorage.getItem("loggedUser")));
    //controllo se la ricetta è già salvata tra i preferiti per scegliere se fare un bottone che rimuova o che aggiunga ai preferiti
    if(Object.hasOwn(user.favRecipes,mealName)) {
        console.log("ricetta inclusa");
        html='<div class="d-flex justify-content-center"><button class="btn btn-warning" id="favButton" onclick="removeRecipeToFav(&quot;' + mealName + '&quot;, &quot;' + mealValues.strMealThumb + '&quot;,&quot;'+mealValues.idMeal+'&quot;)">Remove from favourites</button></div>';
    } else {
        console.log("ricetta non inclusa");
        html='<div class="d-flex justify-content-center"><button class="btn btn-warning" id="favButton" onclick="addRecipeToFav(&quot;' + mealName + '&quot;, &quot;' + mealValues.strMealThumb + '&quot;,&quot;'+mealValues.idMeal+'&quot;)">Add to favourites</button></div>';
    }
    return html;
}

//funzione che aggiunge una ricetta ai preferiti
function addRecipeToFav(mealName, mealThumb, mealId) {  
    var user = JSON.parse(window.localStorage.getItem(window.localStorage.getItem("loggedUser")));
    //aggiungo nome ed immagine alle ricette preferite
    var holder = {};
    holder[mealId]=mealThumb;
    user.favRecipes[mealName] = holder;
    //sovrascrivo i dati dell'user per permettere la modifica di favRecipes
    window.localStorage.setItem(window.localStorage.getItem("loggedUser"),JSON.stringify(user));
    //cambio il pulsante con quello per rimuovere la ricetta
    var favButton = document.getElementById("favButton");
    favButton.textContent="Remove from favourites";
    favButton.setAttribute("onclick", 'removeRecipeToFav("' + mealName + '", "' + mealThumb + '","'+mealId+'")');
}

//funzione che rimuove una ricetta dai preferiti
function removeRecipeToFav(mealName, mealThumb, mealId) {
    var user = JSON.parse(window.localStorage.getItem(window.localStorage.getItem("loggedUser")));
    //rimuovo all'array la ricetta
    delete user.favRecipes[mealName];
    //sovrascrivo i dati dell'user per permettere la modifica di favRecipes
    window.localStorage.setItem(window.localStorage.getItem("loggedUser"),JSON.stringify(user));
    //cambio il pulsante con quello per rimuovere la ricetta
    var favButton = document.getElementById("favButton");
    favButton.textContent="Add to favourites";
    favButton.setAttribute("onclick", 'addRecipeToFav("' + mealName + '", "' + mealThumb + '","'+mealId+'")');
}

//funzione di supporto che modifica la funzione di un bottone per far partire un form in caso di secondo click;
function changeToSubmit(idButton) {
    console.log("idButton= "+idButton);
    document.getElementById(idButton).setAttribute("type","submit");
}

//funzione che disconnette l'utente e lo porta alla pagina iniziale
function logOutUser() {
    //imposto l'assenza di un utente loggato
    window.localStorage.setItem("loggedUser",-1);
    //serve per non far partire la funzione userSignUp()
    document.getElementById("accountForm").removeAttribute("onsubmit");
    //permette di tornare alla pagina iniziale dopo il submit della cancellazione dell'account
    document.getElementById("accountForm").setAttribute("action","ilRicettario.html");
}

//funzione per cancellare dal localStorage i dati dell'utente loggato, rimuovendo anche le sue recenzioni
function deleteUser() {    
    var loggedUser = window.localStorage.getItem("loggedUser");
    var tasteReviews = JSON.parse(window.localStorage.getItem("tasteReviews"));    
    var difficultyReviews = JSON.parse(window.localStorage.getItem("difficultyReviews"));
    var i;
    //prendo le chiavi perché nel localStorage i dati sono salvati come {key1 : {key2: value}} 
    var tasteKeys = Object.keys(tasteReviews);
    var difficultyKeys = Object.keys(difficultyReviews);
    //i due for sono necessari perché un utente può non aver lasciato una recensione al gusto ma può averlo fatto alla difficoltà e viceversa.
    for (i = 0; i < tasteKeys.length; i++) {
        if(Object.keys(tasteReviews[tasteKeys[i]]).includes(loggedUser)) {
            delete tasteReviews[tasteKeys[i]][loggedUser];
            //secondo if per rimuovere la ricetta dal localStorage se non ha più recensioni
            if(Object.keys(tasteReviews[tasteKeys[i]]).length==0) {                
                delete tasteReviews[tasteKeys[i]];
            }
        }
    }    
    for (i = 0; i < difficultyKeys.length; i++) {
        if(Object.keys(difficultyReviews[difficultyKeys[i]]).includes(loggedUser)) {            
            delete difficultyReviews[difficultyKeys[i]][loggedUser];
            //stesso if di prima ma per difficultyReviews
            if(Object.keys(difficultyReviews[difficultyKeys[i]]).length==0) {                
                delete difficultyReviews[difficultyKeys[i]];
            }
        }
    }
    //sovrascrivo i dati per salvarli nel localStorage
    window.localStorage.setItem("tasteReviews",JSON.stringify(tasteReviews));
    window.localStorage.setItem("difficultyReviews",JSON.stringify(difficultyReviews));
    //cancello l'utente e lo disconnetto
    window.localStorage.removeItem(loggedUser);
    logOutUser();
}

//funzione che modifica la funzione dei bottoni e sblocca la possibilità di editare i valori dell'utente
function editUserData() {
    //al click dell'edit, i campi dell'account sono editabili
    document.getElementById("userInformation").removeAttribute("disabled");    
    var editButton = document.getElementById("editDataButton");
    var deleteButton = document.getElementById("deleteUserButton");
    //modifico l'aspetto del bottone e la sua funzione per far si che il form funzioni
    editButton.textContent="Save changes";
    editButton.classList.remove("btn-warning");
    editButton.classList.add("btn-success");
    editButton.setAttribute("onclick",'changeToSubmit("editDataButton")');
    //permetto la rimozione dell'account
    deleteButton.removeAttribute("disabled");
}

//funzione per recuperare e settare i valori dell'account nella propria pagina personale quando si è loggati
function getUserValues() {
    if(window.localStorage.getItem("loggedUser")==-1 || window.localStorage.getItem("loggedUser")==null) {
        document.getElementById("accountContainer").innerHTML='<h1 class="text-center">User not found.</h1>'
        return;
    }    
    var user = JSON.parse(window.localStorage.getItem(window.localStorage.getItem("loggedUser")));
    document.getElementById("username").value=user.username;
    var gender = document.getElementById("gender").options;
    for (let i = 0; i < gender.length; i++) {
        if(gender[i].value==user.gender) {
            gender[i].selected = true;
            break;
        }        
    }
    document.getElementById("date").value=user.dateOfBirth;
    document.getElementById("email").value=window.localStorage.getItem("loggedUser");
    document.getElementById("password").value=user.password;
    displaySixRecipes(0,false);    
    //displayFavRecipes(user);
}

//funzione per la modifica del bottone di login in caso in cui sia loggati o meno
function checkLoggedUser() {    
    var loggedUser = window.localStorage.getItem("loggedUser");
    var loginHtml = document.getElementById("accountButton");  
    if(loggedUser!="-1") {        
        loginHtml.setAttribute("href","myAccount.html");
        loginHtml.textContent="Your account";
        loginHtml.classList.remove("btn-outline-primary");
        loginHtml.classList.add("btn-outline-success");
    }    
}

//funzione che controlla i parametri inseriti dall'utente durante la registrazione o durante la modifica dei suoi dati
function userSignUp() {
    //controlli per la registrazione dell'utente
    var regex = new RegExp(/(?!.*[\.\-\_]{2,})^[a-zA-Z0-9\.\-\_]{3,24}$/gm);
    var username = document.getElementById("username");
    if(!username.value.match(regex)) {
        username.classList.add("border-danger");
        document.getElementById("usernameError").classList.remove("d-none");
        return false;
    }
    var gender = document.getElementById("gender");
    if(gender.value=="0") {
        gender.classList.add("border-danger");
        document.getElementById("genderError").classList.remove("d-none");
        return false;
    }
    var date = document.getElementById("date");
    if(date.value=="") {
        date.classList.add("border-danger");
        document.getElementById("dateError").classList.remove("d-none");
        return false;
    }
    var email = document.getElementById("email");
    //standard Regex per email da RFC2822
    regex = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g);
    if(!email.value.match(regex)) {
        email.classList.add("border-danger");
        document.getElementById("emailError").classList.remove("d-none");
        return false;
    }
    //l'AND serve nel caso in cui io stia modificando l'email dalla mia pagina personale, infatti controllo se l'email inserita non si trova già nel localStorage e se questa è diversa da quella dell'user loggato
    if(window.localStorage.getItem(email.value)!=null && window.localStorage.getItem("loggedUser")!=email.value) {
        email.classList.add("border-danger");
        document.getElementById("emailAlreadyExistsError").classList.remove("d-none");
        return false;
    }
    var password = document.getElementById("password");
    regex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm);    
    if(!password.value.match(regex)) {
        password.classList.add("border-danger");
        document.getElementById("passwordError").classList.remove("d-none");
        return false;
    }
    var termsOfService = document.getElementById("termsOfService");
    if(termsOfService.checked==false) {
        termsOfService.classList.add("text-danger");
        document.getElementById("termOfServiceError").classList.remove("d-none");
        return false;
    }
    var savedFavRecipes = {};
    var savedPersonalNotes = {};
    //if che salva le ricette già salvate e le note personali nel caso stia editando l'account
    if(window.localStorage.getItem("loggedUser")!=-1) {
        savedFavRecipes = JSON.parse(window.localStorage.getItem(window.localStorage.getItem("loggedUser"))).favRecipes;
        savedPersonalNotes = JSON.parse(window.localStorage.getItem(window.localStorage.getItem("loggedUser"))).personalNotes;
    }
    var user = {"username":username.value, "gender":gender.value, "dateOfBirth":date.value,"password":password.value, "Terms of service": "Accepted", "favRecipes":savedFavRecipes, "personalNotes":savedPersonalNotes};
    //controllo se ho modificato l'email di un account già esistente, cancellandolo per permettere l'aggiornamento della key nel localStorage
    if(window.localStorage.getItem("loggedUser")!=user.email) {
        var oldEmailUser = window.localStorage.getItem("loggedUser");
        window.localStorage.removeItem(oldEmailUser);
    }
    //console.log("salvo l'user = "+JSON.stringify(user));
    window.localStorage.setItem(email.value, JSON.stringify(user));
    window.localStorage.setItem("loggedUser",email.value);
    /* debug
    console.log("username = "+username.value);
    console.log("gender = "+gender.value);
    console.log("date = "+date.value);
    console.log("email = "+email.value);
    console.log("password = "+password.value);
    console.log("termsOfService = "+termsOfService.checked);*/
    return true;  
} 

//funzione che riempie la pagina html con un messaggio d'errore in caso di ricerca che non è andata a buon fine
function errorBuildingRecipePage() {
    var recipeContainer = document.getElementById("recipeContainer");
    recipeContainer.innerHTML+='<div class="row text-center d-flex"><div><h1>Recipe not found. Please search again.</h1></div></div>';
}

//funzione per riempire la pagina html con le informazioni della ricetta. In alternativa mostra una schermata con tutte le ricette trovate 
function buildRecipePage(recipe,searchTitle) {
    console.log("size = "+recipe.length);
    console.log("recipe = "+JSON.stringify(recipe));
    var recipeContainer = document.getElementById("recipeContainer");
    //controllo se sono state trovate piu ricette o meno
    if(recipe.length==1) { 
        recipe = recipe[0];        
        var html = '<p class="text-center fs-1 titleFont">'+recipe.strMeal+'</p>'
        html+=buildFavButton(recipe);
        html+='<div class="row row-cols-1 row-cols-md-2 mx-auto"><div class="col d-flex flex-column justify-content-center px-4 pt-4"><img class="mx-auto img-fluid rounded-4" src='+recipe.strMealThumb+'></div><div class="col d-flex flex-column pt-3 px-5"><div class="col flex-column"><ul class="d-flex flex-column text-center gap-1 p-0"><p class="fs-2">Ingredients</p>';
        var ingredients = {};
        // for per salvare gli ingredienti in un oggetto così da poterci accedere piu facilmente
        for (let i = 1; i <= 20; i++) {
            var strIngredient = "strIngredient"+i;
            var strMeasure = "strMeasure"+i;
            ingredients[recipe[strIngredient]]=recipe[strMeasure];
        }
        // for per scrivere la tabella degli ingredienti    
        for (const key in ingredients) {
            if(key=="") {
                break;
            }
            html+='<li class="fs-5">'+ingredients[key]+' of '+key+'</li>';
        };    
        html+='</ul></div></div></div><div class="row text-center d-flex mx-auto"><div><p class="fs-2">Instruction</p><p class="fs-5">'+recipe.strInstructions+'</p></div></div></div>';
        html+=addPersonalNote(recipe.strMeal);
        //costruisco la row delle recensioni
        html+='<div class="row d-flex text-center mx-auto"><p class="fs-2 text-center">Leave your review</p><div class="row row-cols-1 row-cols-md-2 mx-auto">'
        //aggiungo una flag j per indicare quando costruire l'altra colonna ed aggiungere gli altri bottoni della recensione    
        for (let i = 1, j = 1, lable = "Difficulty"; i <= 5 && j<=2 ; i++) {
            if(i==1) {
                html+='<div class="col flex-column p-2">'
                if(j==1) {
                    html+='<p class="fs-3 text-center" id='+lable.toLowerCase()+'Title>'+lable+' : '+updateReview(lable.toLowerCase(), recipe.strMeal)+'</p>';
                } else if(j==2) {
                    lable="Taste";
                    html+='<p class="fs-3 text-center" id='+lable.toLowerCase()+'Title>'+lable+' : '+updateReview(lable.toLowerCase(), recipe.strMeal)+'</p>';
                }
                html+='<form class="btn-group" id="radio'+lable+'" role="group">';
            }                   
            html+='<input type="radio" class="btn-check" name="btnradio'+lable+'" id="btnradio'+lable+i+'" autocomplete="off" onclick="submitReview(&quot;'+lable.toLowerCase()+'&quot;,&quot;'+recipe.strMeal+'&quot;,&quot;'+i+'&quot;)"><label class="btn btn-outline-warning"for="btnradio'+lable+i+'">'+i+'</label>';
            if(i==5) {
                html+='</form></div>';
                i=0;
                j++;
            }
        }    
        html+='</div><p class="fs-6 text-center text-danger d-none" id="errorToSubmitReviews">To submit you review, please <a href="login.html">login.</a></p></div>';
        recipeContainer.innerHTML=html;
        checkUserSubmittedReviews(recipe.strMeal);
    } else {
        console.log("più ricette trovate");
        sessionStorageSearchedRecipe(recipe,searchTitle);
        displaySixRecipes(0,true);        
    }
}

//funzione che prende il searchParam ed in base ad esso effettua un tipo di ricerca diverso
function searchRecipe() {
    var recipe;
    var keyUrl;
    var url;
    var searchParams = new URLSearchParams(window.location.search);
    //for che setta keyUrl con il name dell'input, anche se fa solo un'iterazione
    for (keyUrl of searchParams.keys()) {        
    }
    if(keyUrl==null || keyUrl==undefined) {
        errorBuildingRecipePage();
        return;
    }
    //rimuovo le virgolette dall'input, se presenti 
    var valueUrl = new URLSearchParams(window.location.search).get(keyUrl).replace(/["]+/g,"");    
    valueUrl = valueUrl.replace(/ /g,"_");
    console.log("valueUrl = "+valueUrl);
    console.log("keyUrl = "+keyUrl);
    if(valueUrl=="") {
        errorBuildingRecipePage();
        return;
    }
    //switch per decidere a quale url fare la richiesta API. di Default c'è recipeName, ovvero la ricerca classica
    switch (keyUrl) {
        case "categoryName":
            url = "https://www.themealdb.com/api/json/v1/1/filter.php?c="+valueUrl;
            break;
        case "areaName":
            url = "https://www.themealdb.com/api/json/v1/1/filter.php?a="+valueUrl;
            break;
        case "ingredientName":
            url = "https://www.themealdb.com/api/json/v1/1/filter.php?i="+valueUrl;
            break;
        case "firstLetter": 
            url = "https://www.themealdb.com/api/json/v1/1/search.php?f="+valueUrl;
            break;
        case "recipeId":
            url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i="+valueUrl;
            break;
        default:
            url = "https://www.themealdb.com/api/json/v1/1/search.php?s="+valueUrl;
            break;
    }
    console.log("url = "+url);
    randomXhrRequest(url, function(xhrRequest) {
        var jsonObject = JSON.parse(xhrRequest.response)["meals"];
        //controllo se la ricerca ha trovato qualcosa o meno        
        if(jsonObject == null) {
            errorBuildingRecipePage();
            return;
        }        
        buildRecipePage(jsonObject,valueUrl);
    });    
}

//Funzione per pulire la sessionSteorage e cercare altre ricette random
function generateMoreRecipeCards() {
    sessionStorage.clear();    
    document.getElementById("containerRandomRecipes").innerHTML="";
    generateRecipeCards();  
}

/*
//funzione ricorsiva per modificare recipe nel caso sia duplicata. Non sono riuscito ad implementarla seppur resetti recipe
function checkIfDoubleRecipe(idMeals, idRecipe, recipe) {
    if(!idMeals.includes(idRecipe)) {
        console.log("ricetta non duplicata");
        return recipe;
    } else {
        console.log("ricetta duplicata. Genero una nuova ricetta");
        randomXhrRequest("https://www.themealdb.com/api/json/v1/1/random.php", function(xhrRequestNew) {
            console.log("Chiamo la funzione di callback in caso di duplicazione");
            recipe = JSON.parse(xhrRequestNew.response)["meals"];
            idRecipe = recipe[0].idMeal;
            console.log("nuova ricetta  = "+recipe[0].strMeal);
            checkIfDoubleRecipe(idMeals, idRecipe, recipe[0]);
        });
    }
}*/

//funzione che genera 10 ricette randomiche o le riprende dal LocalStorage in caso l'utente torni indietro alla pagina di landing
function generateRecipeCards() {
    var recipes = [];
    var layout = document.getElementById("containerRandomRecipes");
    // if che serve per non far generare di nuovo le card quando si naviga in un'altra scheda
    if (sessionStorage.getItem("Recipes")==null) {
        var idMeals = [];
        console.log("Inizio a generare 10 ricette causali");        
        //Genero 10 ricette random
        for (let i = 0; i < 10; i++) {
            //console.log("entro nel for con posizione i = "+i);
            randomXhrRequest("https://www.themealdb.com/api/json/v1/1/random.php", function(xhrRequest) {
                var recipe =  JSON.parse(xhrRequest.response)["meals"];
                var idRecipe = recipe[0].idMeal;
                //chiamo la funzione per controllare se c'è una ricetta duplicata
                //recipes[i] = checkIfDoubleRecipe(idMeals, idRecipe, recipe[0]);
                recipes[i] = recipe[0];                     
                layout.innerHTML += '<a class="colCards simpleText" href="recipe.html?recipeId='+recipes[i].idMeal+'" style="padding: 20px";><div class="border rounded-4 bg-light px-2 pt-4 shadow-lg bg-body-tertiary rounded"><img class="rounded img-fluid d-block fit-contain w-80 h-80" src="'+recipes[i].strMealThumb+'"<div class="py-2"><h4 class="text-center">'+recipes[i].strMeal+'</h4></div></div></div></a>';
                idMeals[i] = recipes[i].idMeal;
                sessionStorage.setItem("Recipes", JSON.stringify(recipes));
            });            
        }        
    } else {
        //questo serve a riempire l'array recipes nel caso in cui la sessione non sia terminata
        recipes = JSON.parse(sessionStorage.getItem("Recipes"));
        //genero le card
        for (let i = 0; i < recipes.length; i++) {        
            layout.innerHTML += '<a class="colCards simpleText" href="recipe.html?recipeId='+recipes[i].idMeal+'" style="padding: 20px";><div class="border rounded-4 bg-light px-2 pt-4 shadow-lg bg-body-tertiary rounded"><img class="rounded img-fluid d-block fit-contain w-80 h-80" src="'+recipes[i].strMealThumb+'"<div class="py-2"><h4 class="text-center">'+recipes[i].strMeal+'</h4></div></div></div></a>';
        }
    }     
}