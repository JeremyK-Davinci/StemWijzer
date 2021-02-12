//remember querySelectorAll for multi-Elements

//region -Variables-

//region -Elements-
var start_Button = document.getElementById("button_start");
var top_Container = document.getElementById("top_container");
var nav_Container = document.getElementById("top_nav");
var nav_Back_Button = document.getElementById("top_nav_back_button");
var main_Container = document.getElementById("main_container");
var statement_Container = document.getElementById("statement_container");
var statement_Current_Count = document.getElementById("counter");

var agree_Button = document.querySelector(".button--agree");
var disagree_Button = document.querySelector(".button--disagree");
var no_Choice_Button = document.querySelector(".button--neither");
var skip_Button = document.querySelector(".statement__skip");
var statement_Title = document.querySelector(".statement__theme");
var statement_Text = document.querySelector(".statement-title");
var statement_Tab_Parties = document.querySelector(".statement__tab--parties");
var statement_Tab_Info = document.querySelector(".statement__tab--more-info");
var statement_Tab_Button_Parties = document.querySelector(".statement__tab-button--parties");
var statement_Tab_Button_Info = document.querySelector(".statement__tab-button--more-info");
var statement_Tab_Button_Close = document.querySelectorAll(".statement__tab-close");

var statement_Parties_Columns = document.querySelectorAll(".statement__parties-column");

var statement_Info_Text = document.querySelector(".statement__tab-text");
//end-region

//region -Standard-
var currentStatement = 0;
var showingPartyInfo = false;
var showingInfo = false;
//end-region

//region -Arrays-
var choices = [];
//end-region

//region -constants-
const indexAgree = 0;
const indexNeither = 1;
const indexDisagree = 2;
//end-region

//end-region

//region -events-
start_Button.addEventListener("click", updatePageForStatements);
nav_Back_Button.addEventListener("click", updatePageForPreviousStatement)

agree_Button.addEventListener("click", updatePageForNextStatement);
disagree_Button.addEventListener("click", updatePageForNextStatement);
no_Choice_Button.addEventListener("click", updatePageForNextStatement);
skip_Button.addEventListener("click", updatePageForNextStatement);

statement_Tab_Button_Parties.addEventListener("click", updateStatementPartyInfo);
statement_Tab_Button_Info.addEventListener("click", updateStatementInfo);
statement_Tab_Button_Close.forEach(button => {
    button.addEventListener("click", closeCurrentTab);
});
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
    currentStatement++;
    updateStatementHTML(currentStatement);
}

function updatePageForPreviousStatement(){
    if(currentStatement <= 1){ //If this is the first statement go to the home page
        window.location.href = "index.html";
        return;
    }

    choices.pop(); //Remove the last statement and choice from array
    currentStatement--;
    statement_Current_Count.innerHTML = currentStatement + '/';
    updateStatementHTML(currentStatement);
}

function updatePageForNextStatement(){
    if(currentStatement == 30){ //If this is the last statement go to th home page
        window.location.href = "index.html";
        return;
    }

    choices.push({id:currentStatement, choice:this.id}) //Add the currentStatement and it's choice to the choices
    currentStatement++;
    statement_Current_Count.innerHTML = currentStatement + '/';
    updateStatementHTML(currentStatement - 1); //Show the statement (-1 because arrays start at 0)
}

function updateStatementHTML(id){
    statement_Title.innerHTML = subjects[id].title;
    statement_Text.innerHTML = subjects[id].statement;
}

function updateStatementPartyInfo(){
    if(statement_Tab_Parties.classList.contains("hidden")){ //Not showing
        statement_Tab_Info.classList.add("hidden");
        statement_Tab_Parties.classList.remove("hidden");

        var currentSubject = subjects[currentStatement - 1];

        currentSubject.parties.forEach(party => {
            var partyFromArray = partyArrayParticipating.find(item => item.name == party.name);
            if(partyFromArray !== null && partyFromArray !== undefined){
                var rowElement = document.createElement("div");
                var rowButtonElement = document.createElement("button");
                var rowButtonElementLogo = document.createElement("div");
                var rowButtonElementText = document.createElement("span");
                var rowInfoElement = document.createElement("div");

                rowInfoElement.classList.add("parties-column__party-explanation", "hidden");
                rowInfoElement.innerHTML = party.opinion;

                rowButtonElement.setAttribute("tabindex", "0");
                rowButtonElement.classList.add("parties-column__party-header", "parties-column__party-header--with-explanation");
                rowButtonElement.addEventListener("click", showPartyStanceInfo);

                rowButtonElementLogo.classList.add("parties-column__party-logo");
                var logoOffset = partyFromArray.logo_offset;
                rowButtonElementLogo.setAttribute("style", "background: url(https://tweedekamer2021.stemwijzer.nl/gfx/img/parties.png) 0px " + logoOffset + "% / 100% 3000% no-repeat;");

                rowButtonElementText.classList.add("parties-column__party-name");
                rowButtonElementText.innerHTML = party.name;

                rowButtonElement.appendChild(rowButtonElementLogo);
                rowButtonElement.appendChild(rowButtonElementText);

                rowElement.appendChild(rowButtonElement);
                rowElement.appendChild(rowInfoElement);

                switch(party.position){
                    case "pro":
                        statement_Parties_Columns[indexAgree].appendChild(rowElement);
                        break;
                    case "contra":
                        statement_Parties_Columns[indexDisagree].appendChild(rowElement);
                        break;
                    case "none":
                        statement_Parties_Columns[indexNeither].appendChild(rowElement);
                        break;
                }
            }
        })
    }
    else{ //Showing
        statement_Tab_Parties.classList.add("hidden");
    }
}

function updateStatementInfo(){
    if(statement_Tab_Info.classList.contains("hidden")){ //Not showing
        statement_Tab_Parties.classList.add("hidden");
        statement_Tab_Info.classList.remove("hidden");

        statement_Info_Text.innerHTML = "No Info";
    }
    else{ //Showing
        statement_Tab_Info.classList.add("hidden");
    }
}

function showPartyStanceInfo(){
    var infoElement = this.nextElementSibling;
    console.log(infoElement);
    if(infoElement.classList.contains("hidden")){
        infoElement.classList.remove("hidden");
        this.classList.add("parties-column__party-header--open");
    }
    else{
        infoElement.classList.add("hidden");
        this.classList.remove("parties-column__party-header--open");
    }
}

function closeCurrentTab(){
    this.parentElement.classList.add("hidden");
}
//end-region

//region -execute-
createPartiesParticipating();
createPartiesNotParticipating();
//end-region