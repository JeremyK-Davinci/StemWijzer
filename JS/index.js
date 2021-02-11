//remember querySelectorAll for multi-buttons

//region -Variables-

//region -Elements-
var start_Button = document.getElementById("button_start");
var top_Container = document.getElementById("top_container");
var nav_Container = document.getElementById("top_nav");
var nav_Back_Button = document.getElementById("top_nav_back_button");
var main_Container = document.getElementById("main_container");
var statement_Container = document.getElementById("statement_container");
//end-region

//region -Standard-
var currentStatement = 0;
//end-region

//end-region

//region -events-
start_Button.addEventListener("click", updatePageForStatements);
nav_Back_Button.addEventListener("click", updatePageForPreviousStatement)
//end-region

//region -functions-
function createPartiesParticipating(){
    var participatingLength = partyArrayParticipating.length;
    var container = document.querySelectorAll(".start__parties-list")[0] //get first list of parties
    
    for(var i=0; i<participatingLength; i++){
        var linkElement = document.createElement("a");
    
        linkElement.setAttribute("tabindex", "0");
        linkElement.setAttribute("href", partyArrayParticipating[i].link);
        linkElement.setAttribute("target", "_blank");
        linkElement.setAttribute("tooltip", partyArrayParticipating[i].name);
        linkElement.setAttribute("tooltip-on-focus", null);
        linkElement.setAttribute("tooltip-white", null);
        linkElement.setAttribute("class", "start__party");

        var logoElement = document.createElement("div");

        logoElement.setAttribute("class", "start__party-logo");
        logoElement.setAttribute("style", "background: url(https://tweedekamer2021.stemwijzer.nl/gfx/img/parties.png) 0px " + partyArrayParticipating[i].logo_offset + "% / 100% 3000% no-repeat;");

        linkElement.appendChild(logoElement);
        container.appendChild(linkElement);
    }
}

function createPartiesNotParticipating(){
    var notParticipatingLength = partyArrayNotParticipating.length;
    var container = document.querySelectorAll(".start__parties-list")[1] //get second list of parties
    
    for(var i=0; i<notParticipatingLength; i++){
        var linkElement = document.createElement("a");
    
        linkElement.setAttribute("tabindex", "0");
        if(partyArrayNotParticipating[i].link !== null) { //if the partie doesn't have a website, don't add a link
            linkElement.setAttribute("href", partyArrayNotParticipating[i].link);
        }
        linkElement.setAttribute("target", "_blank");
        linkElement.setAttribute("tooltip", partyArrayNotParticipating[i].name);
        linkElement.setAttribute("tooltip-on-focus", null);
        linkElement.setAttribute("tooltip-white", null);
        linkElement.setAttribute("class", "start__party");

        var logoElement = document.createElement("div");

        logoElement.setAttribute("class", "start__party-logo");
        logoElement.setAttribute("style", "background: url(https://tweedekamer2021.stemwijzer.nl/gfx/img/parties.png) 0px " + partyArrayNotParticipating[i].logo_offset + "% / 100% 3000% no-repeat;");

        linkElement.appendChild(logoElement);
        container.appendChild(linkElement);
    }
}

function updatePageForStatements(){
    //Do styling options
    top_Container.classList.add("app--white");
    main_Container.classList.add("hidden");
    start_Button.classList.add("button--disabled");

    nav_Container.classList.remove("app__nav--hidden");
    nav_Back_Button.classList.remove("button--disabled");
    statement_Container.classList.remove("hidden");
    window.history.pushState('', subjects[0].title, '?1')//update the url parameters without reloading page as reloading will default to home page
}

function updatePageForPreviousStatement(){
    currentStatement = parseInt(window.location.search.replace('?', ''));
    if(currentStatement <= 1){
        window.location.href = "index.html";
        return;
    }
}

function updatePageForNextStatement(){

}
//end-region

//region -execute-
createPartiesParticipating();
createPartiesNotParticipating();
//end-region