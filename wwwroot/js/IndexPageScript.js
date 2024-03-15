const titleContainer = document.getElementById("title-container");
const smallScreenContainer = document.getElementById("long-container");
const smallScreenFrame = document.getElementById("small-screen-frame");
const blackFrame = document.getElementById("black-frame");
const title = document.getElementById("exceptional-title");
const insideTitle = document.getElementsByClassName("inside-title");
const titleDetails = document.getElementById("title-details");
const screenBackground = document.getElementById("screen-background");
const slidingGrid = document.getElementById("sliding-grid");

let IsTopPassed = false;
let IsBottomPassed = false;
let topPadding = window.innerWidth * 0.025;
let topAbsolute = 0;
let swichPoint = 0;

const OnWidthChange = 750;
let slidingValue = window.innerWidth / 2;

window.onload = function () { setTimeout(MyOnResize, 1) };
window.onresize = MyOnResize;
window.onscroll = SmallScreen;
setTimeout(MyOnResize, 2);

//title.addEventListener("click", function () { setTimeout(MyOnResize, 1); });

/**
 * This method runs 40 times per second to check the scroll bar position and position the small screen accordingly.
 */
function SmallScreen() {
    slidingGrid.innerHTML = "frame top " + smallScreenContainer.getBoundingClientRect().top +
        "<br>inner width: " + window.innerWidth +
        "<br>scrollY: " + window.scrollY +
        "<br>slidingGrid.style.left: " + slidingGrid.style.left +
        "<br>container top: " + smallScreenContainer.getBoundingClientRect().top +
        "<br>small screen top: " + smallScreenFrame.getBoundingClientRect().top +
        "<br>sw: " + swichPoint;
    const slidingHeigth = (window.innerHeight - window.innerWidth * 0.08 - 40);

    if (smallScreenContainer.getBoundingClientRect().top < topPadding) {
        if (!IsTopPassed) {
            smallScreenFrame.style.position = "fixed";
            smallScreenFrame.style.top = topPadding + "px";

            blackFrame.style.position = "fixed";
            blackFrame.style.top = topPadding + "px";
            blackFrame.style.left = 0.1 * window.innerWidth - 20 + "px";

            screenBackground.style.position = "fixed";
            screenBackground.style.top = topPadding + 20 + "px";
            screenBackground.style.left = 0.1 * window.innerWidth + "px";

            slidingGrid.style.position = "fixed";
            slidingGrid.style.left = "0px";
            slidingGrid.style.top = topPadding + 20 + 0.2 * slidingHeigth + "px";

            IsTopPassed = true;
        }
        slidingGrid.style.left = window.innerWidth / 2 - (window.scrollY - topAbsolute) + "px";
    }
    else {
        if (IsTopPassed) {
            smallScreenFrame.style.position = "relative";
            smallScreenFrame.style.left = "0px";
            smallScreenFrame.style.top = "0px";

            blackFrame.style.position = "relative";
            blackFrame.style.left = "-20px";
            blackFrame.style.top = "-20px";

            screenBackground.style.position = "relative";
            screenBackground.style.left = "0px";
            screenBackground.style.top = "0px";

            slidingGrid.style.position = "relative";
            slidingGrid.style.left = "0px";
            slidingGrid.style.top = "20px";

            IsTopPassed = false;
        }
    }
}

function MyOnResize() {
    if (window.innerWidth < OnWidthChange) {
        titleContainer.style.height = 0.4 * OnWidthChange + "px";
        title.style.fontSize = 0.05 * OnWidthChange + "px";
        titleDetails.style.fontSize = 0.015 * OnWidthChange + "px";
        ClassHeightChanger(insideTitle, 0.06 * OnWidthChange + "px");
        topAbsolute = OnWidthChange * 0.4;
    }
    else {
        titleContainer.style.height = 0.4 * window.innerWidth + "px";
        title.style.fontSize = "5vw";
        titleDetails.style.fontSize = "1.5vw";
        ClassHeightChanger(insideTitle, "6vw");
        topAbsolute = window.innerWidth * 0.4;
    }

    smallScreenFrame.style.width = window.innerWidth * 0.8 + "px";
    smallScreenFrame.style.borderWidth = "20px " + window.innerWidth * 0.1 + "px";
    smallScreenFrame.style.height = (window.innerHeight - window.innerWidth * 0.08 - 40) + "px";
    smallScreenFrame.style.top = "0px";

    blackFrame.style.width = window.innerWidth * 0.8 - 1 + "px";
    blackFrame.style.height = (window.innerHeight - window.innerWidth * 0.08 - 40) + "px";
    blackFrame.style.left = "-20px";
    blackFrame.style.top = "-20px";

    screenBackground.style.width = window.innerWidth * 0.8 + "px";
    screenBackground.style.height = (window.innerHeight - window.innerWidth * 0.08 - 40) + "px";
    screenBackground.style.left = "0px";
    screenBackground.style.top = "0px";

    const slidingHeigth = (window.innerHeight - window.innerWidth * 0.08 - 40);
    slidingGrid.style.width = window.innerWidth * 2 + "px";
    slidingGrid.style.height = 0.6 * slidingHeigth + "px";
    slidingGrid.style.top = "20px";
    slidingGrid.style.left = "0px";

    topPadding = (window.innerHeight - smallScreenFrame.getBoundingClientRect().height) / 2;
    SmallScreen();
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
//alert("dd");
