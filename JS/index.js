//region -Variables-

//region -Elements-
var start_Button = document.getElementById("button_start");
var top_Container = document.getElementById("top_container");
var nav_Container = document.getElementById("top_nav");
var nav_Back_Button = document.getElementById("top_nav_back_button");
var main_Container = document.getElementById("main_container");
var statement_Container = document.getElementById("statement_container");
var statement_Current_Count = document.getElementById("counter");

var progress_Bar = document.querySelector(".app__nav-progress-indicator");
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
var statement_Buttons = document.querySelector(".statement__buttons");
var statement_Parties_Columns = document.querySelectorAll(".statement__parties-column");
var statement_Info_Text = document.querySelector(".statement__tab-text");
var options_Page_Container = document.querySelector(".select-statements");
var options_Container = document.querySelector(".select-statements__content");
var party_Page_Container = document.querySelector(".select-parties");
var party_Options_Container = document.querySelector(".select-parties__content");
var options_Next_Button = document.querySelectorAll(".options-header__next");
var party_Options_Radio_Buttons = document.querySelectorAll(".radio");
var party_Columns = document.querySelectorAll(".options__column-parties");
//end-region

//region -Standard-
var currentWidth = 0;
var currentStatement = 0;
var showingPartyInfo = false;
var showingInfo = false;
//end-region

//region -Arrays-
var choices = [];
var options = [];
var selectedParties = [];
//end-region

//region -constants-
const indexAgree = 0;
const indexNeither = 1;
const indexDisagree = 2;

const indexStatementSelectPage = 0;
const indexPartiesSelectPage = 1;

const indexAllParties = 0;
const indexSittingParties = 1;
const indexRemoveSelection = 2;
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

party_Options_Radio_Buttons[indexAllParties].addEventListener("click", selectAllParties);
party_Options_Radio_Buttons[indexSittingParties].addEventListener("click", selectActiveParties);
party_Options_Radio_Buttons[indexRemoveSelection].addEventListener("click", deSelectAllParties);
//end-region

//region -functions-

//region -DOM-
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

function updateStatementHTML(id){
    statement_Title.innerHTML = subjects[id].title;
    statement_Text.innerHTML = subjects[id].statement;
    progress_Bar.setAttribute("style", "width: " + currentWidth + "%;");
    statement_Tab_Parties.classList.add("hidden");
    statement_Tab_Info.classList.add("hidden");
    window.sessionStorage.setItem("currentProgressWidth", currentWidth);
    window.sessionStorage.setItem("currentQuestion", id);
    window.sessionStorage.setItem("currentAnswers", JSON.stringify(choices));
}

function updateHTMLForStatementPage(){
    top_Container.classList.add("app--white");
    main_Container.classList.add("hidden");
    start_Button.classList.add("button--disabled");

    nav_Container.classList.remove("app__nav--hidden");
    nav_Back_Button.classList.remove("button--disabled");
    statement_Container.classList.remove("hidden");
}

function updateStatementPartyInfo(){
    if(statement_Tab_Parties.classList.contains("hidden")){ //Not showing
        statement_Tab_Info.classList.add("hidden");
        statement_Tab_Parties.classList.remove("hidden");
        statement_Buttons.classList.add("statement__buttons--floating")

        var currentSubject = subjects[currentStatement - 1];

        currentSubject.parties.forEach(party => {
            var partyFromArray = partyArrayParticipating.find(item => item.name == party.name);
            if(partyFromArray !== null && partyFromArray !== undefined){
                var rowElement = document.createElement("div");
                var rowButtonElement = document.createElement("button");
                var rowButtonElementLogo = document.createElement("div");
                var rowButtonElementText = document.createElement("span");
                var rowInfoElement = document.createElement("div");

                rowElement.classList.add("parties-column__party");

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

function updateHTMLForOptionsPage(){
    statement_Tab_Info.classList.add("hidden");
    statement_Tab_Parties.classList.add("hidden");

    nav_Container.classList.add("app__nav--hidden");
    nav_Back_Button.classList.add("button--disabled");
    statement_Container.classList.add("hidden");

    options_Page_Container.classList.remove("hidden");

    options_Next_Button[indexStatementSelectPage].addEventListener("click", updateHTMLForPartiesPage);

    createOptions();
}

function updateHTMLForPartiesPage(){
    options_Page_Container.classList.add("hidden");

    party_Page_Container.classList.remove("hidden");

    createPartyOptions();
}

function updateHTMLForResultsPage(){

}

function selectOptionButtonOptions(){
    if(this.classList.contains("option--selected")){
        this.classList.remove("option--selected");
        var itemIndex = options.indexOf(this.innerText);
        options.splice(itemIndex, 1);
    }
    else{
        this.classList.add("option--selected");
        options.push(this.innerText);
    }
}

function selectOptionButtonParties(){
    if(this.classList.contains("option--selected")){
        this.classList.remove("option--selected");
        if(party_Options_Radio_Buttons[indexAllParties].classList.contains("radio--selected") || party_Options_Radio_Buttons[indexSittingParties].classList.contains("radio--selected")){
            party_Options_Radio_Buttons[indexSittingParties].classList.remove("radio--selected");
            party_Options_Radio_Buttons[indexAllParties].classList.remove("radio--selected");
        }
        var itemIndex = options.indexOf(this.innerText);
        selectedParties.splice(itemIndex, 1);
    }
    else{
        this.classList.add("option--selected");
        if(party_Options_Radio_Buttons[indexAllParties].classList.contains("radio--selected") || party_Options_Radio_Buttons[indexSittingParties].classList.contains("radio--selected")){
            party_Options_Radio_Buttons[indexSittingParties].classList.remove("radio--selected");
            party_Options_Radio_Buttons[indexAllParties].classList.remove("radio--selected");
        }
        selectedParties.push(this.innerText);
    }

    tryToActivateNextButtonParties();
}

function createOptions(){
    var i = 0;
    for(var d1 = 0; d1<3; d1++){
        var column = document.createElement("div");
        column.classList.add("options__column");
        for(var d2=i; d2 < i+10; d2++){
            var option_Button = document.createElement("button");
            option_Button.classList.add("option");
            option_Button.setAttribute("tabindex", "0");
            option_Button.addEventListener("click", selectOptionButtonOptions);
            option_Button.innerHTML = subjects[d2].title;

            var option_Button_Tooltip = document.createElement("div");
            option_Button_Tooltip.classList.add("option__tooltip");
            option_Button_Tooltip.setAttribute("tooltip-limited", null);
            option_Button_Tooltip.setAttribute("tooltip", subjects[d2].statement);
            option_Button.appendChild(option_Button_Tooltip);

            column.appendChild(option_Button);
        }
        i+=10;
        options_Container.appendChild(column);
    }
}

function createPartyOptions(){
    var i = 0;
    for(var d1=0; d1<3; d1++){
        var column = document.createElement("div");
        column.classList.add("options__column", "options__column-parties");
        for(var d2=i; d2 < i+10; d2++){
            if(d2 >= partyArrayParticipating.length) break;

            var party_Button = document.createElement("button");
            party_Button.classList.add("option", "option--with-image");
            party_Button.addEventListener("click", selectOptionButtonParties);
            party_Button.setAttribute("tabindex", "0");
            party_Button.innerHTML = partyArrayParticipating[d2].name;

            var party_Button_Image = document.createElement("div");
            var image_Offset = partyArrayParticipating[d2].logo_offset;
            party_Button_Image.classList.add("option__image");
            party_Button_Image.setAttribute("style", "background: url(https://tweedekamer2021.stemwijzer.nl/gfx/img/parties.png) 0px " + image_Offset + "% / 100% 3000% no-repeat;");
            party_Button.appendChild(party_Button_Image);

            column.appendChild(party_Button);
        }
        i+=10;
        party_Options_Container.appendChild(column);
    }

    party_Columns = document.querySelectorAll(".options__column-parties");
}

function selectAllParties(){
    if(this.classList.contains("radio--selected")){
        this.classList.remove("radio--selected");
    }
    else this.classList.add("radio--selected");

    for(var i=0; i<party_Columns.length; i++){
        for(var j=0; j<party_Columns[i].childElementCount; j++){
            var button = party_Columns[i].children[j];
            if(button.classList.contains("option--selected") && !this.classList.contains("radio--selected")){
                button.classList.remove("option--selected")
                var itemIndex = selectedParties.indexOf(button.innerText);
                selectedParties.splice(itemIndex, 1);
            }
            else if(!button.classList.contains("option--selected") && !this.classList.contains("radio--selected")){
                continue;
            }
            else{
                button.classList.add("option--selected");
                selectedParties.push(button.innerText);
            }
        }
    }

    tryToActivateNextButtonParties();
}

function selectActiveParties(){
    if(this.classList.contains("radio--selected")){
        this.classList.remove("radio--selected");
    }
    else this.classList.add("radio--selected");

    for(var i=0; i<party_Columns.length; i++){
        for(var j=0; j<party_Columns[i].childElementCount; j++){
            var button = party_Columns[i].children[j];
            parties.forEach(party => {
                if(party.name == button.innerText){
                    if(party.size > 0){
                        if(button.classList.contains("option--selected") && !this.classList.contains("radio--selected")){
                            button.classList.remove("option--selected");
                            var itemIndex = selectedParties.indexOf(button.innerText);
                            selectedParties.splice(itemIndex, 1);
                        }
                        else{
                            button.classList.add("option--selected");
                            selectedParties.push(button.innerText);
                        }
                    }
                }
            });
        }
    }

    tryToActivateNextButtonParties();
}

function deSelectAllParties(){
    for(var i=0; i<party_Columns.length; i++){
        for(var j=0; j<party_Columns[i].childElementCount; j++){
            var button = party_Columns[i].children[j];
            if(button.classList.contains("option--selected")){
                button.classList.remove("option--selected");
            }
        }
    }
    selectedParties = [];
    tryToActivateNextButtonParties();
}

function tryToActivateNextButtonParties(){
    var selected = 0;
    for(var i=0; i<party_Columns.length; i++){
        for(var j=0; j<party_Columns[i].childElementCount; j++){
            var button = party_Columns[i].children[j];
            if(button.classList.contains("option--selected")){
                selected++;
            }
        }
    }

    if(selected >= 3){
        options_Next_Button[indexPartiesSelectPage].setAttribute("tabindex", 0);
        options_Next_Button[indexPartiesSelectPage].addEventListener("click", null);
        options_Next_Button[indexPartiesSelectPage].classList.remove("button--disabled");
    }
    else{
        options_Next_Button[indexPartiesSelectPage].setAttribute("tabindex", "-1");
        options_Next_Button[indexPartiesSelectPage].addEventListener("click", null);
        options_Next_Button[indexPartiesSelectPage].classList.add("button--disabled");
    }
}
//end-region

//region -Functional-
function updatePageForStatements(){
    tryGetItemFromSession();
    if(currentStatement >= 1){
        updateHTMLForStatementPage();
        return;
    }
    updateHTMLForStatementPage();
    currentWidth = 3.0303;
    progress_Bar.setAttribute("style", "width: " + currentWidth + "%;");
    currentStatement++;
    updateStatementHTML(currentStatement - 1);
}

function updatePageForPreviousStatement(){
    if(currentStatement <= 1){ //If this is the first statement go to the home page
        window.location.href = "index.html";
        window.sessionStorage.clear();
        return;
    }

    choices.pop(); //Remove the last statement and choice from array
    currentStatement--;
    currentWidth -= 3.0303;
    statement_Current_Count.innerHTML = currentStatement + '/';
    updateStatementHTML(currentStatement - 1);
}

function updatePageForNextStatement(){
    if(currentStatement == 30){ //If this is the last statement go to th home page
        updateHTMLForOptionsPage();
        window.sessionStorage.clear();
        return;
    }

    choices.push({id:currentStatement, choice:this.id}) //Add the currentStatement and it's choice to the choices
    currentStatement++;
    currentWidth += 3.0303;
    statement_Current_Count.innerHTML = currentStatement + '/';
    updateStatementHTML(currentStatement - 1); //Show the statement (-1 because arrays start at 0)
}

function tryGetItemFromSession(){
    if(window.sessionStorage.getItem("currentQuestion") !== null && window.sessionStorage.getItem("currentAnswers") !== null && window.sessionStorage.getItem("currentProgressWidth") !== null){
        currentWidth = parseFloat(window.sessionStorage.getItem("currentProgressWidth"));
        currentStatement = parseInt(window.sessionStorage.getItem("currentQuestion"));
        choices = JSON.parse(window.sessionStorage.getItem("currentAnswers"));
        updateStatementHTML(currentStatement);
    }
}

function calculateResults(){
    
}
//end-region

//end-region

//region -execute-
createPartiesParticipating();
createPartiesNotParticipating();
//end-region