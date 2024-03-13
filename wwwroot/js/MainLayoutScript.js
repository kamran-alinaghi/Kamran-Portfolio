OnResize();
AddEffectToMenuBar();
MenuBarButton();
addEventListener("resize", function () { return OnResize(); });







function MenuBarButton() {
    const button = document.getElementById("menu-bar-button");
    const menus = document.getElementById("drop-down-menu");
    button.addEventListener("click", function () {
        if (menus.getAttribute("data-visibility") == "t") {
            AddOrRemoveClass(menus, "fade-in", false);
            AddOrRemoveClass(menus, "fade-out");
            menus.setAttribute("data-visibility", "f");
        }
        else {
            AddOrRemoveClass(menus, "fade-out", false);
            AddOrRemoveClass(menus, "fade-in");
            menus.setAttribute("data-visibility", "t");
        }
    });
}
/**
 * When the width of the window changes, if it gets smaller than 700, it calls the ChangeNavbarAppearance(bigger) 
 * to change the NavBar apearance accordingly
 */
function OnResize() {
    if (window.innerWidth < 750) { ChangeNavbarAppearance(false); }
    else { ChangeNavbarAppearance(true); }
}


/**
 * Changes the appearance of the NavBar in the header based on the width of the window
 * @param {boolean} bigger              A boolean that specifies if the Nav Bar is getting bigger (true) or smaller (flase)
 */
function ChangeNavbarAppearance(bigger) {
    const container = document.getElementById("headerContainer");
    const NavMenu = document.getElementById("nav-menu");
    const MenuBar = document.getElementById("menu-bar-button");
    const PlaceOrderButton = document.getElementById("place-order-button");
    const DropDownMenu = document.getElementById("drop-down-menu");
    const addString = bigger ? "header-container" : "header-container-small";
    const removeString = bigger ? "header-container-small" : "header-container";
    NavMenu.style.display = bigger ? "grid" : "none";
    MenuBar.style.display = bigger ? "none" : "block";
    PlaceOrderButton.style.display = bigger ? "block" : "none";
    DropDownMenu.style.display = bigger ? "none" : "grid";
    AddOrRemoveClass(container, removeString, false);
    AddOrRemoveClass(container, addString);
}


/**
 * Checks whether the given element contains the class or not, then adds or removes it accordingly
 *@param {HTMLElement}  elem            A dom element that is supposed to add/remove a class to/from it
 *@param {string}       classString     A string that specifies the name of the class to add or remove 
 *@param {boolean}      IsAdd           A boolean that specifies to add or remove
*/
function AddOrRemoveClass(elem, classString, IsAdd = true) {
    if (IsAdd) {
        if (!elem.classList.contains(classString)) {
            elem.classList.add(classString);
        }
    }
    else {
        if (elem.classList.contains(classString)) {
            elem.classList.remove(classString);
        }
    }
}

/**
 * This method adds the effect of getting 5% bigger to all elements that are from class round-button
 */
function AddEffectToMenuBar() {
    const RoundButton = document.getElementsByClassName("round-button");
    const PlaceOrder = document.getElementById("place-order-button");
    for (let i = 0; i < RoundButton.length; i++) {
        RoundButton[i].addEventListener("mouseover", (event) => {
            AddOrRemoveClass(RoundButton[i], "round-button-hover");
            AddOrRemoveClass(RoundButton[i], "round-button-not-hover", false);
        });
        RoundButton[i].addEventListener("mouseout", (event) => {
            AddOrRemoveClass(RoundButton[i], "round-button-not-hover");
        });
    }
    PlaceOrder.addEventListener("mouseover", (event) => {
        AddOrRemoveClass(PlaceOrder, "place-order-hover");
        AddOrRemoveClass(PlaceOrder, "place-order-not-hover", false);
    });
    PlaceOrder.addEventListener("mouseout", (event) => {
        AddOrRemoveClass(PlaceOrder, "place-order-not-hover");
    });
}


