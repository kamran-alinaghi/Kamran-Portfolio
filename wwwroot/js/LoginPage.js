let CanProcess = true;
const button = document.getElementById("login-button");
const UsernameInput = document.getElementById("username");
const PasswordInput = document.getElementById("pass");
let intervalButton;
let num = 0;
let rising = true;

const example = "example@gmail.com";
const AtChar = example.charAt(7);

button.onclick = function () { return LoginClick(); }
UsernameInput.onkeyup = function () { return ValidateEachChar(); }
UsernameInput.onchange = function () { return ValidateWholeString(); }
PasswordInput.onmousedown = function () { return MouseDown(); }
PasswordInput.onmouseup = function () { return MouseUp(); }
PasswordInput.onkeyup = function () { return ValidatePassword(); }
function LoginClick() {
    if (CanProcess) {
        CanProcess = false;
        num = 0;
        rising = true;
        intervalButton = setInterval(ButtonInterval, 20);
    }
}
function ButtonInterval() {
    button.style.background = "linear-gradient(to right,rgb(0,200,255) " + num + "%, rgb(255,100,255))";
    if (rising) { num += 10; }
    else { num -= 10; }
    if (num > 100) { rising = false; }
    if (!rising && num < 0) {
        clearInterval(intervalButton);
        CanProcess = true;
        SubmitProccess();
    }
}

function SubmitProccess() {
    if (ValidateEachChar() && ValidateWholeString() && ValidatePassword()) {
        document.theForm.submit();
    }
}

function ValidateText(str, isEmail) {
    if (str.length < 1) { return false; }
    let chars = ['.', '-', '_', 'A', 'a', 'B', 'b', 'C', 'c', 'D', 'd', 'E', 'e', 'F', 'f', 'G', 'g', 'H', 'h', 'I', 'i', 'J', 'j', 'K', 'k', 'L', 'l', 'M', 'm', 'N', 'n', 'O', 'o', 'P', 'p', 'Q', 'q', 'R', 'r', 'S', 's', 'T', 't', 'U', 'u', 'V', 'v', 'W', 'w', 'X', 'x', 'Y', 'y', 'Z', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

    chars.push(AtChar);
    if (isEmail) {
        if (str[0] === chars[0] || str[str.length - 1] === chars[0] || str[0] === AtChar) {
            return false;
        }
    }

    for (let i = 0; i < str.length; i++) {
        let isValid = false;
        for (let j = 0; j < chars.length; j++) {
            if (str[i] === chars[j]) {
                isValid = true;
                break;
            }
        }
        if (!isValid) {
            return false;
        }
    }
    return true;
}

function ValidatePassword() {
    if (!ValidateText(document.getElementById("pass").value, false)) {
        return false;
    }
    else {
        return true;
    }
}

function ValidateEachChar() {
    if (!ValidateText(document.getElementById("username").value, true)) {
        document.getElementById("username").style.color = "red";
        document.getElementById("username").title = "Allowed characters: A-Z, a-z, 0-9\nAllowed symblos: .  -  _  " + AtChar;
        return false;
    }
    else {
        document.getElementById("username").style.color = "black";
        document.getElementById("username").title = "Please enter your email address";
        return true;
    }
}

function ValidateWholeString() {
    const NumOfAt = NumberOfAt(document.getElementById("username").value)
    const isDomainValid = CheckForDomain(document.getElementById("username").value);
    if (NumOfAt > 1 || NumOfAt < 0 || !isDomainValid) {
        document.getElementById("username").style.color = "red";
        document.getElementById("username").title = "Your email is not in a correct format";
        return false;
    }
    else {
        document.getElementById("username").style.color = "black";
        document.getElementById("username").title = "Please enter your email address";
        return true;
    }
}


//Counts the number of Atsgin in the string. returns -1 if the Atsign is the last char
function NumberOfAt(str) {
    let res = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === AtChar) {
            if (i === str.length - 1) {
                res = -1;
            }
            else { res++; }
        }
    }
    return res;
}

//Checks if the email has a valid domain
function CheckForDomain(str) {
    let DotIndex = -1;
    let AtIndex = -1;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '.') { DotIndex = i; }
        if (str[i] === AtChar) { AtIndex = i; }
    }
    if (DotIndex > 0 && AtIndex > 0 && DotIndex > AtIndex + 1 && DotIndex < str.length - 1) {
        return true;
    }
    return false;
}

function MouseDown() {
    PasswordInput.type = "text";
}

function MouseUp() {
    PasswordInput.type = "password";
}