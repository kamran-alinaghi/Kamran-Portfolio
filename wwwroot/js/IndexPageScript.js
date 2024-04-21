const titleContainer = document.getElementById("title-container");
const smallScreenContainer = document.getElementById("long-container");
const blackFrame = document.getElementById("black-frame");
const title = document.getElementById("exceptional-title");
const insideTitle = document.getElementsByClassName("inside-title");
const titleDetails = document.getElementById("title-details");
const svgFrame = document.getElementById("svg-frame");
const backgroundVideo = document.getElementById("video01");

const responsiveDevelopment = document.getElementById("responsive-development");
const responsiveVideo = document.getElementById("responsive-video");
const AIdevelopment = document.getElementById("AI-development");
const topLayer = document.getElementById("top-layer");
const buttonWrap = document.getElementById("buttons-wrap");

const stickPapers = [document.getElementById("stick-paper-0"),
document.getElementById("stick-paper-1"),
document.getElementById("stick-paper-2"),
document.getElementById("stick-paper-3"),
document.getElementById("stick-paper-4"),
];

const pageButtons = document.getElementsByClassName("dash-button-wrap");
for (let i = 0; i < pageButtons.length; i++) {
    pageButtons[i].addEventListener("click", function (e) { return PageButtonClicks(e); });
}
/**
 * 
 * @param {HTMLDivElement} event
 */
function PageButtonClicks(event) {
    //alert(event.target.getAttribute("data-page-num"));
    ShowEachStickPage(Number(event.target.getAttribute("data-page-num")));
}


const foreignObject = document.getElementById("foreign-object");

const test = document.getElementById("test");

const isMobile = isDeviceAMobile();
const stickPapersHeight = 1000;
let IsTopPassed = false;
let IsBottomPassed = false;
let topPadding = window.innerWidth * 0.025;
let swichPoint = 0;
let leftValue = 0;
let leftValue2 = 0;
let topValue = 0;
let longHeight = 0;

let currentPage = 0;

let tempNum = 0;
let firstBool = true;
let secBool = true;
let thirdBool = true;
let fourthBool = true;
let isBackward = false;

const OnWidthChange = 750;
let slidingValue = window.innerWidth / 2;

window.onload = function () { setTimeout(MyOnResize, 1) };
if (!isMobile) { window.onresize = function () { setTimeout(MyOnResize, 1) }; }
window.onscroll = SmallScreen;
setTimeout(MyOnResize, 2);


//title.addEventListener("click", function () { window.location.href = "/home/privacy"; });

/**
 * This method runs 40 times per second to check the scroll bar position and position the small screen accordingly.
 */
function SmallScreen() {
    if (smallScreenContainer.getBoundingClientRect().top < topPadding) {
        if (!IsTopPassed) {
            FixedPositionElement(blackFrame, true);
            FixedPositionElement(topLayer, true);
            IsTopPassed = true;
        }
        SetLeftValue(true);
    }
    else {
        if (IsTopPassed) {
            FixedPositionElement(blackFrame, false);
            FixedPositionElement(topLayer, false);
            IsTopPassed = false;
        }
        SetLeftValue(false);
    }
}

function MyOnResize() {
    test.innerHTML = window.innerWidth;
    if (window.innerWidth < OnWidthChange) {
        titleContainer.style.height = 0.4 * OnWidthChange + "px";
        title.style.fontSize = 0.05 * OnWidthChange + "px";
        titleDetails.style.fontSize = 0.015 * OnWidthChange + "px";
        ClassHeightChanger(insideTitle, 0.06 * OnWidthChange + "px");

        topLayer.style.width = OnWidthChange * 0.5 + "px";
        topLayer.style.left = (window.innerWidth - OnWidthChange * 0.5) / 2 + "px";
    }
    else {
        titleContainer.style.height = 0.4 * window.innerWidth + "px";
        title.style.fontSize = "5vw";
        titleDetails.style.fontSize = "1.5vw";
        ClassHeightChanger(insideTitle, "6vw");

        topLayer.style.width = "50vw";
        topLayer.style.left = "25vw";
    }

    const frameHeight = (window.innerHeight - window.innerWidth * 0.08 - 40);
    blackFrame.style.width = window.innerWidth * 0.8 + "px";
    blackFrame.style.height = frameHeight + "px";
    blackFrame.style.left = window.innerWidth * 0.1 - 20 + "px";
    blackFrame.style.top = "0px";
    topPadding = window.innerWidth * 0.04;


    topLayer.style.top = "10vh";
    topLayer.style.height = "80vh";

    
    svgFrame.setAttribute("width", window.innerWidth * 0.8);
    svgFrame.setAttribute("height", frameHeight);

    if (foreignObject.getBoundingClientRect().width > foreignObject.getBoundingClientRect().height * 1.775) {
        backgroundVideo.setAttribute("width", "100%");
        backgroundVideo.setAttribute("height", "auto");
    }
    else {
        backgroundVideo.setAttribute("width", "auto");
        backgroundVideo.setAttribute("height", "100%");
    }

    if (responsiveDevelopment.getBoundingClientRect().width < responsiveDevelopment.getBoundingClientRect().height * 16 / 9) {
        responsiveVideo.setAttribute("width", "80%");
        responsiveVideo.setAttribute("height", "auto");
    }
    else {
        responsiveVideo.setAttribute("width", "auto");
        responsiveVideo.setAttribute("height", "80%");
    }

    AIdevelopment.setAttribute("width", "auto");
    AIdevelopment.setAttribute("height", responsiveVideo.getBoundingClientRect().height);

    leftValue = (responsiveDevelopment.getBoundingClientRect().width - responsiveVideo.getBoundingClientRect().width) / 2;
    topValue = (responsiveDevelopment.getBoundingClientRect().height - responsiveVideo.getBoundingClientRect().height) / 2;
    responsiveVideo.style.left = leftValue + "px";
    responsiveVideo.style.top = topValue + "px";

    leftValue2 = leftValue * 2.5 + responsiveVideo.getBoundingClientRect().width;
    AIdevelopment.style.left = leftValue2 + "px";
    AIdevelopment.style.top = topValue - responsiveVideo.getBoundingClientRect().height + "px";


    longHeight = topPadding + 1040 + leftValue2 + stickPapersHeight + frameHeight - (svgFrame.getBoundingClientRect().width - AIdevelopment.getBoundingClientRect().width) / 2;
    smallScreenContainer.style.height = longHeight + "px";

    for (let i = 0; i < stickPapers.length; i++) {
        CenterIn(stickPapers[i], topLayer);
    }

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

/**
 * 
 * @param {HTMLElement} elem
 * @param {HTMLElement} inElem
 */
function CenterIn(elem, inElem) {
    elem.style.left = (inElem.getBoundingClientRect().width - elem.getBoundingClientRect().width) / 2 + "px";
    elem.style.top = (inElem.getBoundingClientRect().height - elem.getBoundingClientRect().height) / 2 + "px";
}

/**
 * 
 * @param {HTMLElement} elem
 * @param {boolean} switchToFix
 */
function FixedPositionElement(elem, switchToFix, topStr="0px") {
    if (switchToFix) {
        elem.style.position = "fixed";
        elem.style.top = topPadding + "px";
    }
    else {
        elem.style.position = "relative";
        elem.style.top = topStr;
    }
}

/**
 * 
 * @param {boolean} isPassed
 */
function SetLeftValue(isPassed) {
    const midCenter = AIdevelopment.getBoundingClientRect().left + AIdevelopment.getBoundingClientRect().width / 2;
    if (midCenter < window.innerWidth / 2 && !isBackward) {
        const scrollValue = window.scrollY - tempNum;
        test.innerHTML = scrollValue + "<br>" + tempNum + "<br>" + topLayer.style.top + "<br>" + window.innerWidth;
        if (scrollValue < 0) { isBackward = true; }
        if (scrollValue < 1000) {
            MakeBlur(scrollValue);
        }
        else if (scrollValue < 1000 + stickPapersHeight) {
            FixedPositionElement(topLayer, true);
            UnBlurTopLayer();
            ShowStickPapers(scrollValue);
        }
        else {
            FixedPositionElement(topLayer, false, (longHeight - topLayer.getBoundingClientRect().height + (topLayer.getBoundingClientRect().bottom - smallScreenContainer.getBoundingClientRect().bottom)) + "px");
        }
    }
    else {
        const tempVal = smallScreenContainer.getBoundingClientRect().top - topPadding;
        responsiveVideo.style.left = leftValue + (isPassed ? tempVal : 0) + "px";
        AIdevelopment.style.left = leftValue2 + (isPassed ? tempVal : 0) + "px";
        tempNum = window.scrollY;
        blackFrame.style.filter = "0px";
        blackFrame.style.opacity = 1;
        topLayer.style.opacity = "0";
        isBackward = false;
    }
}

function MakeBlur(BlurVal) {
    const blurValue = BlurVal < 0 ? 0 : (BlurVal > 1000 ? 100 : BlurVal / 10);
    blackFrame.style.filter = "blur(" + blurValue + "px)";
    topLayer.style.filter = "blur(" + (100 - blurValue) + "px)";

    const opacityValue = (1 - blurValue / 100) < 0 ? 0 : ((1 - blurValue / 100) > 1 ? 1 : (1 - blurValue / 100));
    blackFrame.style.opacity = opacityValue.toString();
    const verseOpacityValue = 1 - opacityValue;
    topLayer.style.opacity = verseOpacityValue.toString();

    //topLayer.innerHTML = blurValue;
}

function UnBlurTopLayer() {
    blackFrame.style.opacity = "0";
    topLayer.style.opacity = "1";
    topLayer.style.filter = "blur(0px)";
}

function ShowStickPapers(scrollValue) {

    const eachStick = stickPapersHeight / stickPapers.length;
    for (let i = 0; i < stickPapers.length; i++) {
        if (scrollValue < stickPapersHeight + eachStick * (i + 1)) {
            ShowEachStickPage(i);
            break;
        }
    }
}

/**
 * 
 * @param {number} pageNumber
 */
function ShowEachStickPage(pageNumber) {
    if (currentPage != pageNumber) {
        for (let i = 0; i < stickPapers.length; i++) { RemoveFadeEffect(stickPapers[i]); }
        for (let i = 0; i < stickPapers.length; i++) {
            if (i > currentPage && i <= pageNumber) { AddFadeInOutEffect(stickPapers[i]); }
            else if (i <= currentPage && i > pageNumber) {
                RemoveAnimationEffect(stickPapers[i], i);
                AddFadeInOutEffect(stickPapers[i], false);
            }
        }
        if (pageNumber < currentPage) {
            for (let i = 0; i <= pageNumber; i++) {
                AddAnimationClass(stickPapers[i], i, (pageNumber - i + 1) * (-5), (pageNumber - i) * (-5));
            }
        }
        else {
            for (let i = 0; i < pageNumber; i++) {
                AddAnimationClass(stickPapers[i], i, (pageNumber - i - 1) * (-5), (pageNumber - i) * (-5));
            }
        }
        currentPage = pageNumber;
    }
}

function isDeviceAMobile() {
    let check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

/**
 * 
 * @param {HTMLElement} elem
 * @param {number} classIndex
 * @param {number} startAngle
 * @param {number} endAngle
 */
function AddAnimationClass(elem, classIndex, startAngle, endAngle) {
    let classStr = "rotate-" + classIndex;
    AddOrRemoveClass2(elem, classStr + "-alt", false);
    if (AddOrRemoveClass2(elem, classStr, false)) {
        classStr += "-alt";
    }
    document.documentElement.style.setProperty("--anim-start-deg-" + classIndex, startAngle + "deg");
    document.documentElement.style.setProperty("--anim-end-deg-" + classIndex, endAngle + "deg");
    AddOrRemoveClass2(elem, classStr);
    elem.style.rotate = endAngle + "deg";
}

/**
 * 
 * @param {HTMLElement} elem
 * @param {boolean} IsFadeIn
 */
function AddFadeInOutEffect(elem, IsFadeIn = true) {
    if (IsFadeIn) {
        AddOrRemoveClass2(elem, "opacity-to-ziro", false);
        AddOrRemoveClass2(elem, "opacity-to-one");
        elem.style.opacity = "1";
    }
    else {
        AddOrRemoveClass2(elem, "opacity-to-one", false);
        AddOrRemoveClass2(elem, "opacity-to-ziro");
        elem.style.opacity = "0";
    }
}

function RemoveFadeEffect(elem) {
    AddOrRemoveClass2(elem, "opacity-to-ziro", false);
    AddOrRemoveClass2(elem, "opacity-to-one", false);
}

/**
 * 
 * @param {HTMLElement} elem
 * @param {number} classIndex
 */
function RemoveAnimationEffect(elem, classIndex) {
    const classStr = "rotate-" + classIndex;
    AddOrRemoveClass2(elem, classStr, false);
    AddOrRemoveClass2(elem, classStr + "-alt", false);
    elem.style.rotate = "0deg";
}

/**
 * 
 * @param {HTMLElement} elem
 * @param {string} classString
 * @param {boolean} IsAdd
 * @returns
 */
function AddOrRemoveClass2(elem, classString, IsAdd = true) {
    let result = false;
    if (IsAdd) {
        if (!elem.classList.contains(classString)) {
            elem.classList.add(classString);
            result = true;
        }
    }
    else {
        if (elem.classList.contains(classString)) {
            elem.classList.remove(classString);
            result = true;
        }
    }
    return result;
}
//alert("dd");
