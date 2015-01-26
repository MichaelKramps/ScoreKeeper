window.onload = function(){runScoreKeeper()};

function runScoreKeeper(){
    var addPlayer = document.querySelector("#addPlayer");
    addPlayer.onclick = function() {
        addNewPlayer();
    };
    var submitScores = document.querySelector("#submitScores");
    submitScores.onclick = function() {
        enterScores(submitScores.parentNode);
        startNextRound();
    };
};

/******************************************* Global Variables *********************************************/

numberOfPlayers = 0;

/*************************************** Editable Table Scores Functions ******************************************/

function createTextInput(type, nameOfClass, playerNumber) {
    var newTextInputTD = document.createElement("TD");
    var lineBreak = document.createElement("BR");
    var newTextInput = document.createElement("INPUT");
    if (type != "score") {
        newTextInput.onkeypress = function () {
            if (event.keyCode == 13) {
                if (type == "player") {
                    numberOfPlayers += 1;
                    replaceInputTD(newTextInputTD);
                    appendAddPlayerButton();
                    createMissingScores();
                    createCurrentRoundForm();
                    createTotalTD();
                } else if (type == "edit") {
                    createAndReplaceScoreInput(newTextInput, playerNumber);
                    totalScores();
                } else {
                    replaceInputTD(newTextInputTD, nameOfClass);
                };
            };
        };
    }
    newTextInput.style.width = "100px";
    var addPlayerButton = document.createElement("SPAN");
    addPlayerButton.innerHTML = "submit";
    addPlayerButton.className = "submitPlayer";
    addPlayerButton.onclick = function() {
        if (type == "player") {
            numberOfPlayers += 1;
            replaceInputTD(newTextInputTD);
            appendAddPlayerButton();
            createMissingScores();
            createCurrentRoundForm();
            createTotalTD();
        } else if (type == "editplayer") {
            replaceInputTD(newTextInputTD, nameOfClass);
        };
    };
    newTextInputTD.appendChild(newTextInput);
    newTextInputTD.appendChild(lineBreak);
    if (type == "player" || type == "editplayer") {
        newTextInputTD.appendChild(addPlayerButton);    
    } else if (type == "edit") {
        var editSubmitButton = createEditSubmitButton(playerNumber);
        newTextInputTD.appendChild(editSubmitButton);
    };
    return newTextInputTD;
};

function replaceInputTD(textInputNode, nameOfClass) {
    var newTD = document.createElement("TD");
    var numPlayers = numberOfPlayers;
    newTD.className = nameOfClass ? nameOfClass : "Player" + numPlayers.toString();
    var inputValue = textInputNode.firstChild.value
    newTD.innerHTML = inputValue + "<br>";
    var editValueButton = document.createElement("SPAN");
    editValueButton.className = "editButton";
    editValueButton.innerHTML = "edit";
    editValueButton.onclick = function() {
        var editTextInputNode = createTextInput("editplayer", newTD.className);
        editTextInputNode.firstChild.value = inputValue;
        newTD.parentNode.replaceChild(editTextInputNode, newTD);
    };
    newTD.appendChild(editValueButton);
    textInputNode.parentNode.replaceChild(newTD, textInputNode);
};

function createEditSubmitButton(playerNumber) {
    var editButton = document.createElement("SPAN");
    editButton.innerHTML = "edit";
    editButton.className = "editButton";
    editButton.onclick = function() {
        createAndReplaceScoreInput(editButton.parentNode.firstChild, playerNumber);
        totalScores();
    };
    return editButton;
};

/************************************ functions used for adding players ***************************************/

function addNewPlayer() {
    var newTextInput = createTextInput("player");
    var addPlayerButton = document.querySelector("#addPlayer");
    addPlayerButton.parentNode.replaceChild(newTextInput, addPlayerButton);
};

function appendAddPlayerButton() {
    var playersRow = document.querySelector("#playersRow");
    var newAddPlayerButton = createAddPlayerButton();
    playersRow.appendChild(newAddPlayerButton);
};

function createAddPlayerButton() {
    var newAddPlayerButton = document.createElement("TD");
    newAddPlayerButton.id = "addPlayer";
    newAddPlayerButton.innerHTML = "Add Player";
    newAddPlayerButton.onclick = function() {
        addNewPlayer();
    };
    return newAddPlayerButton;
}

/**************************************Functions for Entering Scores*********************************************/

function createCurrentRoundForm() {
    var allRounds = document.getElementsByClassName("scores");
    var submitScoresButton = document.querySelector("#submitScores");
    var currentRound = allRounds[allRounds.length - 1];
    var scoreInput = createTextInput("score");
    currentRound.insertBefore(scoreInput, submitScoresButton);
};

function createMissingScores() {
    var numRounds = document.getElementsByClassName("scores").length;
    if(numRounds > 1){
        for (i = 0; i < numRounds - 1; i++) {
            var newScoreTD = document.createElement("TD");
            createScoreTD(newScoreTD, i);
        }
    }; /* Else It's Round 1 */
};

function createScoreTD(TD, i) {
    var numPlayers = numberOfPlayers;
    var scoreRounds = document.getElementsByClassName("scores");
    TD.innerHTML = "0";
    TD.className = "Player" + numPlayers.toString();
    TD.className += " score";
    TD.onclick = function() {
        var editScoreInput = createTextInput("edit", TD.className, numPlayers);
        editScoreInput.firstChild.value = "0";
        editScoreInput.onkeypress = function () {
            if (event.keyCode == 13) {
                createAndReplaceScoreInput(editScoreInput.firstChild, numPlayers);
                totalScores();
            };
        };
        TD.parentNode.replaceChild(editScoreInput, TD);
    };
    scoreRounds[i].appendChild(TD);
};

function enterScores(scoreRoundNode) {
    var numPlayers = numberOfPlayers;
    for (i = 1; i < numPlayers + 1; i++) {
        var currentInputNode = scoreRoundNode.childNodes[i].firstChild;
        createAndReplaceScoreInput(currentInputNode, i);
    }
    totalScores();
};

function createAndReplaceScoreInput(inputNode, playerNumber) {
    var newScoreTD = document.createElement("TD");
    newScoreTD.className = "Player" + playerNumber;
    newScoreTD.className += " score";
    newScoreTD.innerHTML = (isNaN(inputNode.value) || inputNode.value == "") ? 0 : inputNode.value;
    newScoreTD.onclick = function () {
        var editScoreInput = createTextInput("edit", newScoreTD.className, playerNumber);
        editScoreInput.firstChild.value = newScoreTD.innerHTML;
        editScoreInput.onkeypress = function () {
            if (event.keyCode == 13) {
                createAndReplaceScoreInput(editScoreInput.firstChild, playerNumber);
                totalScores();
            };
        };
        newScoreTD.parentNode.replaceChild(editScoreInput, newScoreTD);
    };
    inputNode.parentNode.parentNode.replaceChild(newScoreTD, inputNode.parentNode);
};

function startNextRound() {
    var submitScoresButton = document.querySelector("#submitScores");
    submitScoresButton.parentNode.removeChild(submitScoresButton);
    var nextRoundTR = createNextRound();
    var newSubmitScoresButton = createNewSubmitScoresButton();
    nextRoundTR.appendChild(newSubmitScoresButton);
    var tbody = document.querySelector("#table tbody");
    tbody.appendChild(nextRoundTR);
};

function createNextRound() {
    var newRoundTR = document.createElement("TR");
    var numPlayers = numberOfPlayers;
    newRoundTR.className = "scores";
    var roundNumberTD = document.createElement("TD");
    var roundNumber = document.getElementsByClassName("scores").length + 1;
    roundNumberTD.innerHTML = "Round " + roundNumber;
    newRoundTR.appendChild(roundNumberTD);
    for (i = 0; i < numPlayers; i++) {
        var newScoreInputTD = createTextInput("score");
        newRoundTR.appendChild(newScoreInputTD);
    };
    return newRoundTR;
};

function createNewSubmitScoresButton() {
    var submitScoresButton = document.createElement("TD");
    submitScoresButton.id = "submitScores";
    submitScoresButton.innerHTML = "Submit Scores";
    submitScoresButton.onclick = function() {
        enterScores(submitScoresButton.parentNode);
        startNextRound();
    };
    return submitScoresButton;
};

/**************************************************Total Scores Function******************************************/

function totalScores() {
    var numPlayers = numberOfPlayers;
    var totalRow = document.querySelector("#totalRow");
    for (i = 1; i < numPlayers + 1; i++) {
        var totalScore = calculatePlayerTotal(i);
        totalRow.childNodes[i].innerHTML = totalScore;
    };
};

function calculatePlayerTotal(playerNumber) {
    var scoreRows = document.getElementsByClassName("scores");
    var playerScore = 0;
    for (j = 0; j < scoreRows.length; j++) {
        var scoreValue = parseInt(scoreRows[j].childNodes[playerNumber].innerHTML);
        if (isNaN(scoreValue) == false) {
            playerScore += scoreValue;    
        };

    };
    return playerScore;
};

function createTotalTD () {
    var newTotalTD = document.createElement("TD");
    newTotalTD.innerHTML = "0";
    newTotalTD.className = "Player" + numberOfPlayers;
    var totalRow = document.querySelector("#totalRow");
    totalRow.appendChild(newTotalTD);
}