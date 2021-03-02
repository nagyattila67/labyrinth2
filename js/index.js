let SOR = parseInt(document.querySelector("#sorok").value);
let OSZLOP = parseInt(document.querySelector("#oszlopok").value);

ujAblak = function () {
    window.open(rules.html)
}

buildingTable = function () {
    myBody = document.querySelector("#mainTb")
    k = 0;
    for (let i = 0; i < SOR; i++) {
        myTr = document.createElement("tr");
        myTr.setAttribute("value", i);
        myBody.appendChild(myTr);
        for (let j = 0; j < OSZLOP; j++) {
            myTd = document.createElement("td");
            k = k + 1;
            myTr.appendChild(myTd);

            //myTd.style["background-color"]="#dbdbdb";
            myTd.setAttribute("name", k)
            myTd.setAttribute("onclick", "clickFunction(this)")
            myTd.setAttribute("value", j);
            if (myTd.getAttribute("value") == 0 || myTd.getAttribute("value") == OSZLOP - 1 || myTd.parentElement.getAttribute("value") == 0 || myTd.parentElement.getAttribute("value") == SOR - 1) {
                myTd.setAttribute("class", "outerBorder")
            } else { myTd.setAttribute("class", "cell"); }
        }
    }
    clicker = 0;
}
buildingTable();


setTable = function () {
    SOR = parseInt(document.querySelector("#sorok").value);
    OSZLOP = parseInt(document.querySelector("#oszlopok").value);
    area = document.querySelector("#mainTable");
    sector = document.querySelector("#mainTb");
    area.removeChild(sector);
    newTbody = document.createElement("tbody");
    newTbody.id = "mainTb";
    area.appendChild(newTbody);
    buildingTable();
    document.querySelector("#timeSearch").innerHTML = ' - ';
    document.querySelector("#lepesSzam").innerHTML = ' - ';
};

clicker = 0
buildingWall = true;
previousBrick = "";
erasedBrick = false;
ebCounter = 0;
wandering = Array()
step = 0;
steps = Array();
emptyPlaces = Array();
way = Array();
way2 = Array();
way3 = Array();
theYellowWay = Array();
theGreenWay = Array();
theRedWay = Array();
searched = false;
averageSteps = Array();
averageSteps2 = Array();

giveUp = function () {
    limit = document.querySelector("#giveUpInput").value;
    limit = parseInt(limit);
}

giveUp();

rulesLink = function () {
    window.open("rules.html", "Játékszabály", "height=1000");
}

cleaning = function () {
    for (let i = 1; i < SOR * OSZLOP + 1; i++) {
        if (document.querySelector(`td[name='${i}']`).getAttribute("class") == "cell red" ||
            document.querySelector(`td[name='${i}']`).getAttribute("class") == "cell yellow" ||
            document.querySelector(`td[name='${i}']`).getAttribute("class") == "cell red yellow") {
            document.querySelector(`td[name='${i}']`).setAttribute("class", "cell")
        }


        if (document.querySelector(`td[name='${i}']`).getAttribute("class") == "cell") {
            document.querySelector(`td[name='${i}']`).style["background-color"] = "#dbdbdb";
            if (document.querySelector(`td[name='${i}']`).id != "seeker" &&
                document.querySelector(`td[name='${i}']`).id != "target") {
                document.querySelector(`td[name='${i}']`).innerHTML = "";
            };
        };
    };
}

cleaning2 = function () {
    for (let i = 1; i < SOR * OSZLOP + 1; i++) {
        if (document.querySelector(`td[name='${i}']`).getAttribute("class") != "outerBorder") {
            document.querySelector(`td[name='${i}']`).style["background-color"] = "#dbdbdb";
            document.querySelector(`td[name='${i}']`).innerHTML = "";
        };
    };
};

clickFunction = function (this_) {
    console.log("eleje");
    theRedWay = Array();
    theYellowWay = Array();
    theGreenWay = Array();
    way = Array();

    if (searched == true) { searched = false; cleaning() };


    this2 = this_;
    clicker = clicker + 1;
    if (erasedBrick == true) { ebCounter = ebCounter + 1 };
    if (ebCounter == 2) { erasedBrick = false };
    console.log("kettő");
    if (this_.className == "outerBorder") { alert("Külső határra nem klikkelhet!"); clicker = clicker - 1; }
    if (this_.id == "target" || this_.id == "seeker") { alert("Házinyúlra nem lövünk!"); clicker = clicker - 1 }
    if (clicker == 1 && this_.className != "outerBorder") {
        this_.innerHTML = "&#128515";
        this_.id = "seeker"
    }
    if (clicker == 2 && this_.className != "outerBorder") {
        this_.innerHTML = "&#128515";
        this_.id = "target"
    }
    if (clicker > 2) {
        console.log("this_", this_.getAttribute("name"));
        if (this_.className == "outerBorder") { alert("Külső határra nem klikkelhet") }
        if (this_.className == "innerBorder") {
            this_.className = "cell"; buildingWall = false; erasedBrick = true; ebCounter = 0;
            this_.setAttribute("style", "background-color:#dbdbdb")
        }
        else {
            if (this_.className == "cell" || this_.className == "cell red" || this_.className == "cell red yellow") {
                this_.className = "innerBorder"; buildingWall = true;
                this_.setAttribute("style", "background-color:#000000");
            }
        }

        if (clicker > 3 && previousBrick != this_ && previousBrick.parentElement.getAttribute("value") == this_.parentElement.getAttribute("value") && erasedBrick == false) {
            min = Math.min(previousBrick.getAttribute("name"), this2.getAttribute("name")); max = Math.max(previousBrick.getAttribute("name"), this2.getAttribute("name"))
            for (let i = min; i < max + 1; i++) {
                if (document.querySelector(`td[name='${i}']`).id != "seeker" && document.querySelector(`td[name='${i}']`).id != "target") { document.querySelector(`td[name='${i}']`).className = "innerBorder" };
                document.querySelector(`td[name='${i}']`).style["background-color"] = "#000000"
            }
        }

        if (clicker > 3 && previousBrick != this_ && previousBrick.getAttribute("value") == this_.getAttribute("value") && erasedBrick == false) {
            //console.log("this2", this2);
            console.log("previousBrick", previousBrick);
            min = Math.min(previousBrick.getAttribute("name"), this2.getAttribute("name"))
            max = Math.max(previousBrick.getAttribute("name"), this2.getAttribute("name"))
            k = (max - min) / OSZLOP;
            for (let i = 0; i < k; i++) {
                if (document.querySelector(`td[name='${min + i * OSZLOP}']`).id != "seeker" && document.querySelector(`td[name='${min + i * OSZLOP}']`).id != "target") {
                    document.querySelector(`td[name='${min + i * OSZLOP}']`).className = "innerBorder";
                    document.querySelector(`td[name='${min + i * OSZLOP}']`).style["background-color"] = "#000000"
                }
            }
        }
    };

    /*for (let i = 1; i < SOR * OSZLOP + 1; i++) {
        if (document.querySelector(`td[name='${i}']`).getAttribute("class") == "innerBorder") {
            document.querySelector(`td[name='${i}']`).style["background-color"] = "#000000";
        };
        if (document.querySelector(`td[name='${i}']`).getAttribute("class") == "cell") {
            document.querySelector(`td[name='${i}']`).style["background-color"] = "#dbdbdb";
        };
    };*/

    //if (searced == true) { erasedBrick = true };



    previousBrick = this2;
    console.log("vége");
}

newLabyrinth = function () {
    searced = false;
    way = Array();
    way2 = Array();
    way3 = Array();
    theYellowWay = Array();
    theGreenWay = Array();
    wandering = Array();
    for (let i = 1; i < SOR * OSZLOP + 1; i++) {
        if (document.querySelector(`td[name='${i}']`).getAttribute("class") != "outerBorder") {
            document.querySelector(`td[name='${i}']`).setAttribute("class", "cell");
            document.querySelector(`td[name='${i}']`).style["background-color"] = "#dbdbdb"
            document.querySelector(`td[name='${i}']`).innerHTML = "";
        };
        if (document.querySelector(`td[name='${i}']`).getAttribute("id") == "target" ||
            document.querySelector(`td[name='${i}']`).getAttribute("id") == "seeker") {
            document.querySelector(`td[name='${i}']`).id = i;
        }
    };
    clicker = 0;
    step = 0;
    steps = Array();
    document.querySelector("#steps").innerHTML = " - ";
    document.querySelector("#minSteps").innerHTML = " - ";
    document.querySelector("#maxSteps").innerHTML = " - ";
    document.querySelector("#menet").innerHTML = " - ";
    document.querySelector("#averageSteps").innerHTML = " - ";
    document.querySelector("#lepesSzam").innerHTML = " - ";
    document.querySelector("#timeSearch").innerHTML = " - ";
    lenullaz();
};

searching = function () {
    averageSteps = Array();
    averageSteps2 = Array();
    averageSteps3 = Array();
    searched = true;
    erasedBrick = true;
    buildingWall = false;
    ebCounter = 0;
    theYellowWay = Array();
    theGreenWay = Array();
    theRedWay = Array();
    document.querySelector("td[id='seeker']").style["background-color"] = "#dbdbdb";
    document.querySelector("td[id='target']").style["background-color"] = "#dbdbdb";

    for (let i = 1; i < SOR * OSZLOP; i++) {
        if (document.querySelector(`td[name='${i}']`).style["background-color"] == "green" ||
            document.querySelector(`td[name='${i}']`).style["background-color"] == "rgb(255, 255, 0)") {
            document.querySelector(`td[name='${i}']`).className = "cell";
            document.querySelector(`td[name='${i}']`).style["background-color"] = "#dbdbdb"
        }
    }

    document.querySelector("#shortestWay").disabled = true;
    timeSrcStart = new Date();
    repNumber = document.querySelector("#repNumb").value;
    repNumber = parseInt(repNumber);
    for (let i = 0; i < repNumber; i++) {
        searching2();
    }

    document.querySelector("#minSteps").innerHTML = minStep;
    document.querySelector("#maxSteps").innerHTML = maxStep;
    document.querySelector("#menet").innerHTML = steps.length;
    document.querySelector("#averageSteps").innerHTML = averageStep;




    timeSrcFinish = new Date();
    timeSrc = Math.ceil((timeSrcFinish - timeSrcStart) / 1000);
    sec = timeSrc % 60;
    minute = ((timeSrc / 60).toFixed(0)) % 60;
    hour = (minute / 60).toFixed(0);
    document.querySelector("#timeSearch").innerHTML = `${hour} óra, ${minute} perc, ${sec} másodperc`;
    document.querySelector("#lepesSzam").innerHTML = steps[steps.length - 1];

    eloszlas();
    console.log("distribution", distribution);

    id = "spanForAverageList";
    area = document.querySelector("#divForAverageList");
    sector = document.querySelector("#spanForAverageList");
    add = 1;
    listFunction(area, sector, id, averageSteps, add);

    max = 0;
    for (let i = 0; i < averageSteps.length; i++) {
        if (averageSteps[i] > max) { max = averageSteps[i] }
    };
    min1 = max;
    for (let i = 0; i < averageSteps.length; i++) {
        if (averageSteps[i] < min1) { min1 = averageSteps[i] }
    };

    index = averageSteps.indexOf(max);
    averageSteps2 = averageSteps.slice(0);
    divisor = 1;
    while (averageSteps2[index] > 1000) {
        for (let i = 0; i < averageSteps.length; i++) {
            averageSteps2[i] = Math.floor((averageSteps2[i] / 10))
        }
        divisor = divisor * 10;
    };

    min = averageSteps2[index];
    for (let i = 0; i < averageSteps2.length; i++) {
        if (averageSteps2[i] < min) {
            min = averageSteps2[i];
        }
    }



    averageSteps3 = averageSteps2.map(item => item - min);

    max3 = 0;
    for (let i = 0; i < averageSteps3.length; i++) {
        if (max3 < averageSteps3[i]) { max3 = averageSteps3[i] }
    }

    document.querySelector("#lowest").innerHTML = min1;
    document.querySelector("#highest").innerHTML = max;

    myArray = averageSteps3.slice(0);
    myValue = max3;
    area = document.querySelector("#tableForAverage");
    sector = document.querySelector("#tbodyForAverage");
    id = "tbodyForAverage";
    graphFunction(area, sector, id, myValue, myArray)

    id = "spanForStepList";
    area = document.querySelector("#divForStepList");
    sector = document.querySelector("#spanForStepList");
    add = 1;
    listFunction(area, sector, id, steps, add);




};

otherInput = function () {
    repNumber = document.querySelector("#repNumb").value;
    repNumber = parseInt(repNumber);
    document.querySelector("#repNumb2").value = repNumber;
};

otherInput2 = function () {
    repNumber = document.querySelector("#repNumb2").value;
    repNumber = parseInt(repNumber);
    document.querySelector("#repNumb").value = repNumber;
};

stepToPlace = function () {
    while (newPlace == "") {
        number = Math.ceil(Math.random() * 4);
        if (number == 1) { newPlace = place - OSZLOP };
        if (number == 2) { newPlace = place + 1 };
        if (number == 3) { newPlace = place + OSZLOP };
        if (number == 4) { newPlace = place - 1 };
        if (document.querySelector(`td[name='${newPlace}']`).getAttribute("class") == "innerBorder"
            || document.querySelector(`td[name='${newPlace}']`).getAttribute("class") == "outerBorder") {
            newPlace = "";
        };
    };
};

searching2 = function () {
    if (way2.length != 0) {
        for (let i = 0; i < way2.length; i++) {
            document.querySelector(`td[name='${way2[i]}']`).classList.remove("yellow")
        };
    };

    way2 = Array();
    way = Array();
    way[0] = document.querySelector("#seeker").getAttribute("name");
    way[0] = parseInt(way[0]);
    finished = false;
    step = 0;


    for (let i = 0; i < SOR * OSZLOP; i++) {
        if (wandering[i] > 0 && i != start && i != finish) {
            document.querySelector(`td[name='${i}']`).classList.remove("red");
        };
    };
    wandering = Array();
    for (let i = 1; i < SOR * OSZLOP + 1; i++) {
        if (document.querySelector(`td[name='${i}']`).getAttribute("class") == "cell") { wandering[i] = 0 }
        else { wandering[i] = -1 };
    };
    for (let i = 1; i < SOR * OSZLOP + 1; i++) {
        if (document.querySelector(`td[name='${i}']`).getAttribute("class") == "cell"
            && document.querySelector(`td[name='${i}']`).id != "seeker"
            && document.querySelector(`td[name='${i}']`).id != "target"
        ) {
            document.querySelector(`td[name='${i}']`).innerHTML = "";
            document.querySelector(`td[name='${i}']`).style["background-color"] = "#dbdbdb";
        };
    };
    place = document.querySelector("td[id='seeker']").getAttribute("name");
    finish = document.querySelector("td[id='target']").getAttribute("name");
    place = parseInt(place);
    finish = parseInt(finish);
    start = place;
    newPlace = "";
    while (place != finish && finished == false) {
        newPlace = "";
        document.querySelector("#noSolution").innerHTML = " ";
        if (document.querySelector("#mode1").checked == true) {
            stepToPlace();
        }

        if (document.querySelector("#mode2").checked == true) {
            emptyPlaces = Array();
            if (wandering[place - OSZLOP] == 0) { emptyPlaces[emptyPlaces.length] = place - OSZLOP };
            if (wandering[place + 1] == 0) { emptyPlaces[emptyPlaces.length] = place + 1 };
            if (wandering[place + OSZLOP] == 0) { emptyPlaces[emptyPlaces.length] = place + OSZLOP };
            if (wandering[place - 1] == 0) { emptyPlaces[emptyPlaces.length] = place - 1 };

            if (emptyPlaces.length == 0) { stepToPlace() }
            else { newPlace = emptyPlaces[Math.floor(Math.random() * emptyPlaces.length)] };
        }


        place = newPlace;
        wandering[place] = wandering[place] + 1;
        way[way.length] = place;
        step = step + 1;
        if (step >= limit) { finished = true }
        if (finished == true) { document.querySelector("#noSolution").innerHTML = `Felad, lépésszám=${limit}` }


    };
    for (let i = 0; i < SOR * OSZLOP; i++) {
        if (wandering[i] > 0 && i != start && i != finish) {

            document.querySelector(`td[name='${i}']`).innerHTML = `${wandering[i]}`;
            document.querySelector(`td[name='${i}']`).style["background-color"] = "#ff0000";
            document.querySelector(`td[name='${i}']`).classList.add("red");
            theRedWay[theRedWay.length] = i;
        };
    };
    document.querySelector("#steps").innerHTML = step;
    steps[steps.length] = step;
    maxStep = 0;
    for (let i = 0; i < steps.length; i++) {
        if (steps[i] > maxStep) { maxStep = steps[i] }
    };
    minStep = steps[0];
    for (let i = 0; i < steps.length; i++) {
        if (steps[i] < minStep) { minStep = steps[i] }
    };

    averageStep = 0
    for (let i = 0; i < steps.length; i++) { averageStep = averageStep + steps[i] }
    averageStep = Math.floor(averageStep / steps.length);

    averageSteps[averageSteps.length] = averageStep;

};

showTheWay = function () {
    //erasedBrick = true;
    if (theYellowWay.length > 0) {
        for (let i = 1; i < SOR * OSZLOP; i++) {
            if (document.querySelector(`td[name='${i}']`).className != "innerBorder" &&
                document.querySelector(`td[name='${i}']`).className != "outerBorder") {
                document.querySelector(`td[name='${i}']`).style["background-color"] = "#dbdbdb"
            }
        }
        for (let i = 0; i < theRedWay.length; i++) {
            document.querySelector(`td[name='${theRedWay[i]}']`).style["background-color"] = "#ff0000";
        }
        for (let i = 0; i < theYellowWay.length; i++) {
            document.querySelector(`td[name='${theYellowWay[i]}']`).style["background-color"] = "#ffff00";
        }
    }
    else {
        document.querySelector("#shortestWay").disabled = false;
        for (let j = 0; j < way.length; j++) {
            for (let i = j + 1; i < way.length; i++) {
                if (way[j] != 0 && way[j] == way[i]) {
                    for (let k = j + 1; k < i + 1; k++) {
                        way[k] = 0;
                    };
                };
            };
        };

        way2 = Array();
        for (let i = 0; i < way.length; i++) {
            if (way[i] != 0) {
                way2[way2.length] = way[i];
                document.querySelector(`td[name='${way[i]}']`).classList.add("yellow")
            }
        };

        for (let i = 0; i < way2.length; i++) {
            document.querySelector(`td[name='${way2[i]}']`).style["background-color"] = "#ffff00";
        };

        theYellowWay = way2.slice(0);
    }


};

showTheShortestWay = function () {
    //buildingWall = false;
    if (theGreenWay.length > 0) {
        for (let i = 0; i < theGreenWay.length; i++) {
            document.querySelector(`td[name='${theGreenWay[i]}']`).style["background-color"] = "green";
        }
    }
    else {
        runningNumber = 0;
        do {
            runningNumber = runningNumber + 1;
            way3 = Array();
            way3[0] = way2[0];
            i = 0;
            finish = false;
            distances = Array();
            while (finish == false) {
                //distances = Array();
                //distances: right, down, left, up
                distMaxIndex = Number();
                myPlaceRight = way3[way3.length - 1];
                myPlaceDown = way3[way3.length - 1];
                myPlaceLeft = way3[way3.length - 1];
                myPlaceUp = way3[way3.length - 1];
                myPreviousPlace = way3[way3.length - 1];
                direction = String();
                document.querySelector("#seeker").className = "cell red yellow";
                document.querySelector("#target").className = "cell red yellow";

                do { myPlaceRight = myPlaceRight + 1; }
                while (document.querySelector(`td[name='${myPlaceRight}']`).className != "cell red yellow" && document.querySelector(`td[name='${myPlaceRight}']`).className != "innerBorder" && document.querySelector(`td[name='${myPlaceRight}']`).className != "outerBorder")

                if (document.querySelector(`td[name='${myPlaceRight}']`).className == "cell red yellow") {
                    distanceRight = way2.indexOf(myPlaceRight) - way2.indexOf(myPreviousPlace); distances[0] = distanceRight;
                } else { distances[0] = 0 }

                do { myPlaceDown = myPlaceDown + OSZLOP; }
                while (document.querySelector(`td[name='${myPlaceDown}']`).className != "cell red yellow" && document.querySelector(`td[name='${myPlaceDown}']`).className != "innerBorder" && document.querySelector(`td[name='${myPlaceDown}']`).className != "outerBorder")

                if (document.querySelector(`td[name='${myPlaceDown}']`).className == "cell red yellow") {
                    distanceDown = way2.indexOf(myPlaceDown) - way2.indexOf(myPreviousPlace); distances[1] = distanceDown;
                } else { distances[1] = 0 }

                do { myPlaceLeft = myPlaceLeft - 1; }
                while (document.querySelector(`td[name='${myPlaceLeft}']`).className != "cell red yellow" && document.querySelector(`td[name='${myPlaceLeft}']`).className != "innerBorder" && document.querySelector(`td[name='${myPlaceLeft}']`).className != "outerBorder")

                if (document.querySelector(`td[name='${myPlaceLeft}']`).className == "cell red yellow") {
                    distanceLeft = way2.indexOf(myPlaceLeft) - way2.indexOf(myPreviousPlace); distances[2] = distanceLeft;
                } else { distances[2] = 0 }

                do { myPlaceUp = myPlaceUp - OSZLOP; }
                while (document.querySelector(`td[name='${myPlaceUp}']`).className != "cell red yellow" && document.querySelector(`td[name='${myPlaceUp}']`).className != "innerBorder" && document.querySelector(`td[name='${myPlaceUp}']`).className != "outerBorder")

                if (document.querySelector(`td[name='${myPlaceUp}']`).className == "cell red yellow") {
                    distanceUp = way2.indexOf(myPlaceUp) - way2.indexOf(myPreviousPlace); distances[3] = distanceUp;
                } else { distances[3] = 0 }

                myNewPlace = [myPlaceRight, myPlaceDown, myPlaceLeft, myPlaceUp];

                distMax = Math.max(distances[0], distances[1], distances[2], distances[3]);
                if (distMax == 0) { i = i + 1; way3[way3.length] = way2[i] }
                else { distMaxIndex = distances.indexOf(distMax); way3[way3.length] = myNewPlace[distMaxIndex]; i = way2.indexOf(myNewPlace[distMaxIndex]); };

                if (document.querySelector(`td[name='${way3[way3.length - 1]}']`).id == "target") { finish = true }

                if (distances.indexOf(distMax) == 0) { direction = "right" }
                if (distances.indexOf(distMax) == 1) { direction = "down" }
                if (distances.indexOf(distMax) == 2) { direction = "left" }
                if (distances.indexOf(distMax) == 3) { direction = "up" }
                if (distMax == 0) { direction = "next" }




                if (way3[way3.length - 3] == way3[way3.length - 1]) { finish = true; console.log("HIBA") };

                if (direction != "next") {
                    insertSteps = Array();
                    newStep = Number();
                    if (direction == "right" && way3[way3.length - 1] != way3[way3.length - 2] + 1) {
                        newStep = way3[way3.length - 2];
                        while (newStep != way3[way3.length - 1]) {
                            newStep = newStep + 1;
                            insertSteps[insertSteps.length] = newStep
                        };
                    }
                    if (direction == "left" && way3[way3.length - 1] != way3[way3.length - 2] - 1) {
                        newStep = way3[way3.length - 2];
                        while (newStep != way3[way3.length - 1]) {
                            newStep = newStep - 1;
                            insertSteps[insertSteps.length] = newStep
                        };
                    }

                    if (direction == "up" && way3[way3.length - 1] != way3[way3.length - 2] - OSZLOP) {
                        newStep = way3[way3.length - 2];
                        while (newStep != way3[way3.length - 1]) {
                            newStep = newStep - OSZLOP;
                            insertSteps[insertSteps.length] = newStep
                        };
                    }

                    if (direction == "down" && way3[way3.length - 1] != way3[way3.length - 2] + OSZLOP) {
                        newStep = way3[way3.length - 2];
                        while (newStep != way3[way3.length - 1]) {
                            newStep = newStep + OSZLOP;
                            insertSteps[insertSteps.length] = newStep
                        };
                    };

                    insertSteps.pop();

                    newArray = Array();
                    for (let i = 0; i < way3.length - 1; i++) { newArray[newArray.length] = way3[i] }
                    for (let i = 0; i < insertSteps.length; i++) { newArray[newArray.length] = insertSteps[i] }
                    newArray[newArray.length] = way3[way3.length - 1];
                    way3 = Array();
                    way3 = newArray.slice(0);

                }



            }
            hiba = 0;
            for (let i = 0; i < way3.length - 1; i++) {
                if (way3[i] == way3[i + 1]) { hiba = hiba + 1 }
            }

            if (hiba == 1) { console.log("HIBAHIBA", hiba) };

            for (let i = 0; i < way2.length; i++) {
                document.querySelector(`td[name='${way2[i]}']`).classList.remove("yellow")
            }

            for (let i = 0; i < way3.length; i++) {
                document.querySelector(`td[name='${way3[i]}']`).className = "cell red yellow"
            }
            myWay = way2.slice(0);
            way2 = way3.slice(0);

        } while (way2.length != myWay.length);



        for (let i = 0; i < way3.length; i++) {
            document.querySelector(`td[name='${way3[i]}']`).style["background-color"] = "green";
        }
        theGreenWay = way3.slice(0);
        console.log("runningNumber", runningNumber);
    }

}



lenullaz = function () {
    document.querySelector("#minSteps").innerHTML = " - ";
    document.querySelector("#maxSteps").innerHTML = " - ";
    document.querySelector("#menet").innerHTML = " - ";
    document.querySelector("#averageSteps").innerHTML = " - ";
    document.querySelector("#steps").innerHTML = " - ";
    steps = Array();
    averageSteps = Array();
    averageSteps2 = Array();
    averageSteps3 = Array();
};

eloszlas = function () {
    maxWand = 0;
    for (let i = 0; i < wandering.length; i++) {
        if (wandering[i] > maxWand) { maxWand = wandering[i] };
    };
    distribution = Array();
    for (let i = 0; i < maxWand + 1; i++) {
        distribution[i] = 0;
    };
    for (let i = 0; i < maxWand + 1; i++) {
        for (let j = 0; j < wandering.length; j++) {
            if (wandering[j] == i) {
                distribution[i] = distribution[i] + 1
            }
        }
    }
    distMax = 0;
    for (let i = 1; i < distribution.length; i++) {
        if (distribution[i] > distMax) { distMax = distribution[i] }
    };
    distMaxPlace = distribution.indexOf(distMax);

    id = "spanForDistList";
    area = document.querySelector("#divForDistList");
    sector = document.querySelector("#spanForDistList");
    start = 0; add = 0;
    listFunction(area, sector, id, distribution, start, add);
    myValue = distMax;
    myArray = distribution.slice(0);
    area = document.querySelector("#tableForDist");
    sector = document.querySelector("#tbodyForDist");
    id = "tbodyForDist"
    graphFunction(area, sector, id, myValue, myArray)

}

listFunction = function (area, sector, id, myArray, add) {

    area.removeChild(sector);
    newSpan = document.createElement("span");
    newSpan.id = id;
    area.appendChild(newSpan);


    for (let i = 0; i < myArray.length; i++) {
        newSpan1 = document.createElement("span");
        newSpan.appendChild(newSpan1);
        newSpan1.innerHTML = `${i + add} - `
        newSpan2 = document.createElement("span");
        newSpan2.style.color = "#ff00ff"
        newSpan.appendChild(newSpan2);

        if (i < myArray.length - 1) { newSpan2.innerHTML = `${myArray[i]}, ` }
        else { newSpan2.innerHTML = `${myArray[i]}` }
    }




}


graphFunction = function (area, sector, id, myValue, myArray) {

    area.removeChild(sector);
    newTbody = document.createElement("tbody");
    newTbody.id = id;
    area.appendChild(newTbody);
    for (let i = 1; i < myValue + 1; i++) {
        newTr = document.createElement("tr");
        newTr.className = "distTr";
        newTbody.appendChild(newTr);
        for (let j = 1; j < myArray.length; j++) {
            newTd = document.createElement("td");
            newTd.className = "distTd";
            newTr.appendChild(newTd);
            if (i > (myValue - myArray[j])) {
                newTd.style["background-color"] = "#000000";
            }
        }
    }

}







