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
var results_Container = document.querySelector(".results");
var results_Top_Container = document.querySelector(".top-3");
//end-region

//region -Standard-
var currentWidth = 0;
var currentStatement = 0;
var topScore = subjects.length; // Using a base score of the amount of questions, increased by 2 for each option (see checkWeight)
var showingPartyInfo = false;
var showingInfo = false;
var onOptionsPage = false;
var onPartiesPage = false;
var onResultsPage = false;
var hasCreatedOptions = false;
var hasCreatedParties = false;
//end-region

//region -Arrays-
var choices = [];
var options = [];
var selectedParties = [];
var results = [];
//end-region

//region -constants-
const firstIndex = 0; 
const secondIndex = 1;
const thirdIndex = 2;

const progressWidthIncrement = 3.0303;

const circumference = 439.822971502571;
const circumferenceMobile = 276.46015351590177;
//end-region

//end-region

//region -events-
start_Button.addEventListener("click", updatePageForStatements);
nav_Back_Button.addEventListener("click", updatePageForPreviousStatement);

agree_Button.addEventListener("click", updatePageForNextStatement);
disagree_Button.addEventListener("click", updatePageForNextStatement);
no_Choice_Button.addEventListener("click", updatePageForNextStatement);
skip_Button.addEventListener("click", updatePageForNextStatement);

statement_Tab_Button_Parties.addEventListener("click", updateStatementPartyInfo);
statement_Tab_Button_Info.addEventListener("click", updateStatementInfo);
statement_Tab_Button_Close.forEach(button => {
    button.addEventListener("click", closeCurrentTab);
});

party_Options_Radio_Buttons[firstIndex].addEventListener("click", selectAllParties);
party_Options_Radio_Buttons[secondIndex].addEventListener("click", selectActiveParties);
party_Options_Radio_Buttons[thirdIndex].addEventListener("click", deSelectAllParties);
//end-region

//region -functions-

//region -DOM-

/**
 * Creates a list of parties (the ones participating) to display as buttons on the homepage
 */
function createPartiesParticipating(){
    var participatingLength = partyArrayParticipating.length;
    var container = document.querySelectorAll(".start__parties-list")[0];
    
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
/**
 * Creates a list of parties (the ones not participating) to display on the homepage
 */
function createPartiesNotParticipating(){
    var notParticipatingLength = partyArrayNotParticipating.length;
    var container = document.querySelectorAll(".start__parties-list")[1];
    
    for(var i=0; i<notParticipatingLength; i++){
        var linkElement = document.createElement("a");
    
        linkElement.setAttribute("tabindex", "0");
        if(partyArrayNotParticipating[i].link !== null) { //if the party doesn't have a website, don't add a link
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

/**
 * Update the html for the current statement and request to set set data to session storage
 * 
 * @param id The id of the current statement 
 */
function updateStatementHTML(id){
    statement_Title.innerHTML = subjects[id].title;
    statement_Text.innerHTML = subjects[id].statement;
    progress_Bar.setAttribute("style", "width: " + currentWidth + "%;");
    statement_Tab_Parties.classList.add("hidden");
    statement_Tab_Info.classList.add("hidden");
    setItemsToSessionStorage(id);
}

/**
 * Updates the webpage to the statements base page
 */
function updateHTMLForStatementPage(){
    top_Container.classList.add("app--white");
    main_Container.classList.add("hidden");
    start_Button.classList.add("button--disabled");

    nav_Container.classList.remove("app__nav--hidden");
    nav_Back_Button.classList.remove("button--disabled");
    statement_Container.classList.remove("hidden");
}

/**
 * Updates the parties stances on the current statement (selects only from the ones participating)
 */
function updateStatementPartyInfo(){
    if(statement_Tab_Parties.classList.contains("hidden")){
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
                        statement_Parties_Columns[firstIndex].appendChild(rowElement);
                        break;
                    case "contra":
                        statement_Parties_Columns[thirdIndex].appendChild(rowElement);
                        break;
                    case "none":
                        statement_Parties_Columns[secondIndex].appendChild(rowElement);
                        break;
                }
            }
        })
    }
    else{
        statement_Tab_Parties.classList.add("hidden");
    }
}

/**
 * Shows some info given about the current statement (currently not functional)
 */
function updateStatementInfo(){
    if(statement_Tab_Info.classList.contains("hidden")){
        statement_Tab_Parties.classList.add("hidden");
        statement_Tab_Info.classList.remove("hidden");

        statement_Info_Text.innerHTML = "No Info";
    }
    else{
        statement_Tab_Info.classList.add("hidden");
    }
}

/**
 * Shows the parties stances on the current statement 
 */
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

/**
 * Closes the active element (used for party stance and statement info)
 */
function closeCurrentTab(){
    this.parentElement.classList.add("hidden");
}

/**
 * Updates the webpage for the options base page and request to create options
 */
function updateHTMLForOptionsPage(){
    onOptionsPage = true;
    statement_Tab_Info.classList.add("hidden");
    statement_Tab_Parties.classList.add("hidden");

    currentWidth += progressWidthIncrement;
    progress_Bar.setAttribute("style", "width: " + currentWidth + "%;");

    nav_Back_Button.classList.add("button--disabled");
    statement_Container.classList.add("hidden");

    options_Page_Container.classList.remove("hidden");

    options_Next_Button[firstIndex].addEventListener("click", updateHTMLForPartiesPage);

    createOptions();
}

/**
 * Updates the webpage for the party selection base page and request to create party buttons
 */
function updateHTMLForPartiesPage(){
    onOptionsPage = false;
    onPartiesPage = true;
    options_Page_Container.classList.add("hidden");

    currentWidth += progressWidthIncrement;
    progress_Bar.setAttribute("style", "width: " + currentWidth + "%;");

    party_Page_Container.classList.remove("hidden");

    createPartyOptions();
}

/**
 * Updates the webpage for the results base page and request to create result buttons
 */
function updateHTMLForResultsPage(){
    onPartiesPage = false;
    onResultsPage = true;
    party_Page_Container.classList.add("hidden");

    currentWidth = 100;
    progress_Bar.setAttribute("style", "width: " + currentWidth + "%;");

    results_Container.classList.remove("hidden");

    createResultButtons();
}

/**
 * Selects or deselects the clicked option and adds / removes it from the array
 */
function selectOptionButtonOptions(){
    if(this.classList.contains("option--selected")){
        this.classList.remove("option--selected");
        var itemIndex = options.indexOf(this.id);
        options.splice(itemIndex, 1);
    }
    else{
        this.classList.add("option--selected");
        options.push(this.id);
    }
}

/**
 * Selects or deselects the clicked party and adds / removes it from the array also tries to check if the user can continue
 */
function selectOptionButtonParties(){
    if(this.classList.contains("option--selected")){
        this.classList.remove("option--selected");
        if(party_Options_Radio_Buttons[firstIndex].classList.contains("radio--selected") || party_Options_Radio_Buttons[secondIndex].classList.contains("radio--selected")){
            party_Options_Radio_Buttons[secondIndex].classList.remove("radio--selected");
            party_Options_Radio_Buttons[firstIndex].classList.remove("radio--selected");
        }
        var itemIndex = options.indexOf(this.innerText);
        selectedParties.splice(itemIndex, 1);
    }
    else{
        this.classList.add("option--selected");
        if(party_Options_Radio_Buttons[firstIndex].classList.contains("radio--selected") || party_Options_Radio_Buttons[secondIndex].classList.contains("radio--selected")){
            party_Options_Radio_Buttons[secondIndex].classList.remove("radio--selected");
            party_Options_Radio_Buttons[firstIndex].classList.remove("radio--selected");
        }
        selectedParties.push({name:this.innerText, score:0});
    }

    tryToActivateNextButtonParties();
}

/**
 * Creates the option buttons if it has not created them yet
 */
function createOptions(){
    if(!hasCreatedOptions){
        var i = 0;
        var id = 0;
        for(var d1 = 0; d1<3; d1++){
            var column = document.createElement("div");
            column.classList.add("options__column");
            for(var d2=i; d2 < i+10; d2++){
                var option_Button = document.createElement("button");
                option_Button.classList.add("option");
                option_Button.setAttribute("id", id);
                option_Button.setAttribute("tabindex", "0");
                option_Button.addEventListener("click", selectOptionButtonOptions);
                option_Button.innerHTML = subjects[d2].title;

                var option_Button_Tooltip = document.createElement("div");
                option_Button_Tooltip.classList.add("option__tooltip");
                option_Button_Tooltip.setAttribute("tooltip-limited", null);
                option_Button_Tooltip.setAttribute("tooltip", subjects[d2].statement);
                option_Button.appendChild(option_Button_Tooltip);

                column.appendChild(option_Button);
                id++;
            }
            i+=10;
            options_Container.appendChild(column);
        }
        hasCreatedOptions = true;
    }
}

/**
 * Creates the party buttons if it has not created them yet
 */
function createPartyOptions(){
    if(!hasCreatedParties){
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
        hasCreatedParties = true;
    }
}

/**
 * First makes a call to calculate results, then sorts the array of results by score (highest -> lowest), then calls to create the top 3 result buttons, then creates the other buttons
 */
function createResultButtons(){
    calculateResults();
    results.sort(function(a, b){return b.score - a.score}); //Sort the results by score percentage, from highest to lowest
    createTopResultButtons();

    for(var i=0; i<selectedParties.length; i++){
        var transition = 0;
        var sliderWidth = parseInt(results[i].score);
        var logoOffset = partyArrayParticipating.find(element => element.name == results[i].party).logo_offset;

        var btn = document.createElement("button");
        btn.setAttribute("tabindex", "0");
        btn.setAttribute("style", "transition-delay: " + transition + "s, 0s;");
        btn.classList.add("result", "result--enable-hover");

        var logo = document.createElement("div");
        logo.setAttribute("style", "background: url(https://tweedekamer2021.stemwijzer.nl/gfx/img/parties.png) 0px " + logoOffset + "% / 100% 3000% no-repeat;");
        logo.classList.add("result__image");

        btn.appendChild(logo);

        var details = document.createElement("div");
        details.classList.add("result__details");

        var slider = document.createElement("div");
        slider.classList.add("result__slider");

        var slider_Indicator = document.createElement("div");
        slider_Indicator.setAttribute("style", "width: " + sliderWidth + "%; transition-delay: 0s;");
        slider_Indicator.classList.add("results__slider-indicator");
        
        slider.appendChild(slider_Indicator);
        details.appendChild(slider);

        var details_Name = document.createElement("span");
        details_Name.classList.add("result__party-name");
        details_Name.innerHTML = results[i].party;

        details.appendChild(details_Name);
        btn.appendChild(details);

        var score_Percentage = document.createElement("span");
        score_Percentage.classList.add("result__percentage");
        score_Percentage.innerHTML = parseInt(results[i].score) + "%";

        btn.appendChild(score_Percentage);
        results_Container.appendChild(btn);

        transition += 0.15;
    }
}

/**
 * Creates the buttons for the top 3 results of the results array after it is sorted (see createResultButtons for sorting)
 */
function createTopResultButtons(){
    for(var i=0; i<3; i++){
        var transition = 0;
        var dashArray = circumference * (results[i].score / 100);
        var dashArrayMobile = circumferenceMobile * (results[i].score / 100);
        var logoOffset = partyArrayParticipating.find(element => element.name == results[i].party).logo_offset;

        var btn = document.querySelectorAll(".top-3__result")[i];
        btn.setAttribute("tabindex", "0");
        btn.setAttribute("style", "transition-delay: " + transition + "s, 0s;");

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); //The Main svg element for the percentage circle
        svg.setAttribute("viewbox", "0 0 160 160");
        svg.setAttribute("width", "160");
        svg.setAttribute("height", "160");
        svg.classList.add("circle");

        var circle_Background = document.createElementNS("http://www.w3.org/2000/svg", "circle"); //The background circle for the main svg element
        circle_Background.setAttribute("stroke-width", "20");
        circle_Background.setAttribute("fill", "#fff");
        circle_Background.setAttribute("cx", "80");
        circle_Background.setAttribute("cy", "80");
        circle_Background.setAttribute("r", "70");
        circle_Background.classList.add("circle__background");
        
        var circle_Percentage = document.createElementNS("http://www.w3.org/2000/svg", "circle"); //The percentage circle for the main svg element
        circle_Percentage.setAttribute("stroke-width", "20");
        circle_Percentage.setAttribute("stroke-dasharray", dashArray + ", " + circumference);
        circle_Percentage.setAttribute("fill", "none");
        circle_Percentage.setAttribute("cx", "80");
        circle_Percentage.setAttribute("cy", "80");
        circle_Percentage.setAttribute("r", "70");
        circle_Percentage.setAttribute("style", "transition-delay: 0s;");
        circle_Percentage.classList.add("circle__indicator");
        
        svg.appendChild(circle_Background);
        svg.appendChild(circle_Percentage);
        btn.appendChild(svg);

        var svg_Mobile = document.createElementNS("http://www.w3.org/2000/svg", "svg"); //The svg element created for mobile compatibility
        svg_Mobile.setAttribute("viewbox", "0 0 100 100");
        svg_Mobile.setAttribute("width", "100");
        svg_Mobile.setAttribute("height", "100");
        svg_Mobile.classList.add("circle", "circle--mobile");

        var circle_Background_Mobile = document.createElementNS("http://www.w3.org/2000/svg", "circle"); //The background circle for the mobile svg element
        circle_Background_Mobile.setAttribute("stroke-width", "12");
        circle_Background_Mobile.setAttribute("fill", "#fff");
        circle_Background_Mobile.setAttribute("cx", "50");
        circle_Background_Mobile.setAttribute("cy", "50");
        circle_Background_Mobile.setAttribute("r", "44");
        circle_Background_Mobile.classList.add("circle__background");

        var circle_Percentage_Mobile = document.createElementNS("http://www.w3.org/2000/svg", "circle"); //The percentage circle for the mobile svg element
        circle_Percentage_Mobile.setAttribute("stroke-width", "12");
        circle_Percentage_Mobile.setAttribute("stroke-dasharray", dashArrayMobile + ", " + circumferenceMobile);
        circle_Percentage_Mobile.setAttribute("fill", "none");
        circle_Percentage_Mobile.setAttribute("cx", "50");
        circle_Percentage_Mobile.setAttribute("cy", "50");
        circle_Percentage_Mobile.setAttribute("r", "44");
        circle_Percentage_Mobile.setAttribute("style", "transition-delay: 0s;");
        circle_Percentage_Mobile.classList.add("circle__indicator");

        svg_Mobile.appendChild(circle_Background_Mobile);
        svg_Mobile.appendChild(circle_Percentage_Mobile);
        btn.appendChild(svg_Mobile);

        var logo = document.createElement("div");
        logo.setAttribute("style", "background: url(https://tweedekamer2021.stemwijzer.nl/gfx/img/parties.png) 0px " + logoOffset + "% / 100% 3000% no-repeat;");
        logo.classList.add("top-3__image");

        btn.appendChild(logo);

        var details = document.createElement("div");
        details.classList.add("top-3__details");

        var details_Percentage = document.createElement("span");
        details_Percentage.classList.add("top-3__percentage");
        details_Percentage.innerHTML = parseInt(results[i].score) + "%";

        var details_Name = document.createElement("span");
        details_Name.classList.add("top-3__name");
        details_Name.innerHTML = results[i].party;

        details.appendChild(details_Percentage);
        details.appendChild(details_Name);

        btn.appendChild(details);

        transition += 0.15;
    }
}

/**
 * Selects all parties to be displayed on the results screen and checks if the user can proceed to the results
 */
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
                selectedParties.push({name:button.innerText, score:0});
            }
        }
    }

    tryToActivateNextButtonParties();
}

/**
 * Selects all actively participating parties (the ones with a size greater then 0) and selects them, then checks if the user can proceed to the results
 */
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
                            selectedParties.push({name:button.innerText, score:0});
                        }
                    }
                }
            });
        }
    }

    tryToActivateNextButtonParties();
}

/**
 * Deselects all selected parties and checks if the user can proceed to the results
 */
function deSelectAllParties(){
    for(var i=0; i<party_Columns.length; i++){
        for(var j=0; j<party_Columns[i].childElementCount; j++){
            var button = party_Columns[i].children[j];
            if(button.classList.contains("option--selected")){
                button.classList.remove("option--selected");
            }
        }
    }
    if(party_Options_Radio_Buttons[firstIndex].classList.contains("radio--selected")){
        party_Options_Radio_Buttons[firstIndex].classList.remove("radio--selected");
    }
    if(party_Options_Radio_Buttons[secondIndex].classList.contains("radio--selected")){
        party_Options_Radio_Buttons[secondIndex].classList.remove("radio--selected");
    }
    selectedParties = [];
    tryToActivateNextButtonParties();
}

/**
 * Looks through the selected party buttons, if the amount selected is greater then 3, let the user proceed to the results
 */
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
        options_Next_Button[secondIndex].setAttribute("tabindex", 0);
        options_Next_Button[secondIndex].addEventListener("click", updateHTMLForResultsPage);
        options_Next_Button[secondIndex].classList.remove("button--disabled");
    }
    else{
        options_Next_Button[secondIndex].setAttribute("tabindex", "-1");
        options_Next_Button[secondIndex].addEventListener("click", null);
        options_Next_Button[secondIndex].classList.add("button--disabled");
    }
}

/**
 * Updates the choice buttons to display the last selected choice if the user goes back a page
 */
function updateChoiceButtons(){
    var lastValue = choices[choices.length - 1].choice; //The last choice
    switch(lastValue){
        case "pro": //Last choice was agree
            agree_Button.classList.add("selected");
            return;
        case "none": //Last choice was no choice
            no_Choice_Button.classList.add("selected");
            return;
        case "contra": //Last choice was disagree
            disagree_Button.classList.add("selected");
            return;
        case "": //Last choice was skip
            return;
    }


}

/**
 * Clear the choice buttons of the selected class
 */
function clearChoiceButtons(){
    agree_Button.classList.remove("selected");
    no_Choice_Button.classList.remove("selected");
    disagree_Button.classList.remove("selected");
}
//end-region

//region -Functional-
/**
 * First tries to get items from current session, if those exist go to the selected statement and proceed from there, otherwise update the html for the first statement
 */
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

/**
 * Updates the page to go to 
 * 1.(the home page if the currentstatement is the first) 
 * 2.(the page for the last statement if on the options page) 
 * 3.(the options page if on the parties page) 
 * 4.(the home page if on the results page)
 * 5.(the page for the previous statement)
 * also removes the last index of the choices for the user to rethink their decision
 */
function updatePageForPreviousStatement(){
    if(currentStatement <= 1){ //If this is the first statement go to the home page
        window.location.href = "index.html";
        window.sessionStorage.clear();
        return;
    }
    else if(onOptionsPage){
        updateHTMLForStatementPage();
        updateChoiceButtons();
        options_Page_Container.classList.add("hidden");
        currentWidth -= progressWidthIncrement;
        progress_Bar.setAttribute("style", "width: " + currentWidth + "%;");
        choices.pop();
        setItemsToSessionStorage(subjects.length - 1); //Re-instates the session storage with the id of the last index of the subjects
        return;
    }
    else if(onPartiesPage){
        updateHTMLForOptionsPage();
        party_Page_Container.classList.add("hidden");
        currentWidth -= progressWidthIncrement;
        progress_Bar.setAttribute("style", "width: " + currentWidth + "%;");
        return;
    }
    else if(onResultsPage){
        window.location.href = "index.html";
        return;
    }

    clearChoiceButtons();
    updateChoiceButtons();
    choices.pop(); //Remove the last statement and choice from array
    currentStatement--;
    currentWidth -= progressWidthIncrement;
    statement_Current_Count.innerHTML = currentStatement + '/';
    updateStatementHTML(currentStatement - 1); //Show the statement (-1 because arrays start at 0)
}

/**
 * Updates the page to go to the next statement or the options page if the current statement is the last also adds the selected choice to the array
 */
function updatePageForNextStatement(){
    if(currentStatement == subjects.length){ //If this is the last statement go to th home page
        updateHTMLForOptionsPage();
        window.sessionStorage.clear();
        return;
    }

    clearChoiceButtons();
    choices.push({id:currentStatement, choice:this.value, weight:1}) //Add the currentStatement and it's choice to the choices
    currentStatement++;
    currentWidth += progressWidthIncrement;
    statement_Current_Count.innerHTML = currentStatement + '/';
    updateStatementHTML(currentStatement - 1); //Show the statement (-1 because arrays start at 0)
}

/**
 * Check if the session storage is filled and has all required items to proceed from last point
 */
function tryGetItemFromSession(){
    if(window.sessionStorage.getItem("currentQuestion") !== null && window.sessionStorage.getItem("currentAnswers") !== null && window.sessionStorage.getItem("currentProgressWidth") !== null){
        currentWidth = parseFloat(window.sessionStorage.getItem("currentProgressWidth"));
        currentStatement = parseInt(window.sessionStorage.getItem("currentQuestion"));
        choices = JSON.parse(window.sessionStorage.getItem("currentAnswers"));
        statement_Current_Count.innerHTML = currentStatement + '/';
        updateStatementHTML(currentStatement);
    }
}

/**
 * Updates the session storage with the updated values
 * @param id the id of the current statement
 */
function setItemsToSessionStorage(id){
    window.sessionStorage.setItem("currentProgressWidth", currentWidth);
    window.sessionStorage.setItem("currentQuestion", id);
    window.sessionStorage.setItem("currentAnswers", JSON.stringify(choices));
}

/**
 * Calculates the results based on the users choices, selected parties and options
 */
function calculateResults(){
    checkWeight();
    choices.forEach(choice => {
        var opt = choice.choice;

        if(opt == "") return; //If skipped, continue to next choice

        //Match answer to party position
        subjects[choice.id].parties.forEach(subject => {
            selectedParties.forEach(party => {
                if(party.name == subject.name){
                    if(subject.position == opt){
                        if(choice.weight > 1){
                            party.score += 3;
                        }
                        else party.score++;
                    }
                }
            });
        });
    });

    //Add a result to the array for each selected party
    selectedParties.forEach(party => {
        var result = (party.score / topScore) * 100;
        results.push({party:party.name, score:result});
    });
}

/**
 * Checks all choices and options, if one matches increase the choices weight by 1 and increase the top score by 2
 */
function checkWeight(){
    options.forEach(opt => {
        choices.forEach(choice => {
            if(opt == choice.id){
                topScore += 2;
                choice.weight++;
            }
        });
    });
}

//end-region

//end-region

//region -execute-
createPartiesParticipating();
createPartiesNotParticipating();
//end-region