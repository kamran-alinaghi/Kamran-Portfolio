const smallScreenContainer = document.getElementById("long-container");
const smallScreenFrame = document.getElementById("small-screen-frame");
const smallScreen = document.getElementById("small-screen");
const title = document.getElementById("exceptional-title");
const insideTitle = document.getElementsByClassName("inside-title");
const titleDetails = document.getElementById("title-details");
let IsTopPassed = false;
let IsBottomPassed = false;
let topPadding = window.innerWidth * 0.025;

addEventListener("resize", function () { return OnResize(); });
addEventListener("scroll", function () { return SmallScreen(); });
//const t = setInterval(SmallScreen, 25);


/**
 * This method runs 40 times per second to check the scroll bar position and position the small screen accordingly.
 */
function SmallScreen() {
    smallScreen.innerHTML = "inner height: " + window.innerHeight +
        "<br>top rect: " + smallScreenFrame.getBoundingClientRect().top +
        "<br>inner width: " + window.innerWidth +
        "<br>top padding: " + topPadding +
        "<br>small screen height: " + smallScreenFrame.getBoundingClientRect().height;
    if (smallScreenContainer.getBoundingClientRect().top < topPadding) {
        if (!IsTopPassed) {
            smallScreenFrame.style.position = "fixed";
            smallScreenFrame.style.top = window.innerWidth * 0.04 + topPadding + "px";
            smallScreen.style.position = "static";
            IsTopPassed = true;
        }
    }
    else {
        if (IsTopPassed) {
            smallScreenFrame.style.position = "static";
            smallScreen.style.position = "relative";
            smallScreen.style.top = "20px";
            IsTopPassed = false;
        }
    }

    //if (smallScreenFrame.getBoundingClientRect().bottom > topPadding + smallScreenContainer.getBoundingClientRect().height + smallScreenContainer.getBoundingClientRect().top) {

    //}
}

OnResize();
function OnResize() {
    if (window.innerWidth < 700) {
        topPadding = 17.5;
        title.style.fontSize = "35px";
        titleDetails.style.fontSize = "10.5px";
        ClassHeightChanger(insideTitle, "42px");
    }
    else {
        topPadding = window.innerWidth * 0.025;
        title.style.fontSize = "5vw";
        titleDetails.style.fontSize = "1.5vw";
        ClassHeightChanger(insideTitle, "6vw");
    }
    smallScreenFrame.style.width = smallScreenContainer.getBoundingClientRect().width - window.innerWidth * 0.08 + "px";
    smallScreenFrame.style.height = (window.innerHeight - (topPadding * 2) - (window.innerWidth * 0.08)) + "px";
    smallScreen.style.width = smallScreenFrame.getBoundingClientRect().width - 40 + "px";
    smallScreen.style.height = smallScreenFrame.getBoundingClientRect().height - 40 + "px";
}

/**
 * Changes the height property of all elements in a class collection.
 * @param {HTMLCollectionOf<Element>}   Collection      the collection of elements from a specific class
 * @param {string}                      value           the height value
 */
function ClassHeightChanger(Collection, value) {
    for (let i = 0; i < Collection.length; i++) {
        Collection[i].style.height = value;
    }
}
