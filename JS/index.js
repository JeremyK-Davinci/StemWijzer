//remember querySelectorAll for multi-buttons

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

createPartiesParticipating();
createPartiesNotParticipating();