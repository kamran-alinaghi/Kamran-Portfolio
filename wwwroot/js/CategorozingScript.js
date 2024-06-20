import * as myArrayData from "./ArrayClasses.js";

//alert("kamValue");
const table = document.getElementById("table");
const overal = document.getElementById("overal");
const saveButton = document.getElementById("save-button");
const deleteButton = document.getElementById("delete-button");
const nameInput = document.getElementById("name-input");
const valueInput = document.getElementById("value-input");
const overalBlack = document.getElementById("overal-black");
const valueLabel = document.getElementById("value-label");
overalBlack.onclick = function (e) { return ShowInputDialog(e); };
saveButton.onclick = function (e) { return SaveButtonOveral(e); };
deleteButton.onclick = function (e) { return DeleteData(e.target); };

let tableContent = new myArrayData.TabelContent();
let ttt = 0;

RefreshTable();

function RefreshTable() {
    let str = "";
    str += GetColumns();
    str += GetRows();
    table.innerHTML = str;
    const clickableCells = document.getElementsByClassName("clickable-cell");
    const editableCells = document.getElementsByClassName("editable-cell");
    const delButton = document.getElementsByClassName("del-button");
    for (let i = 0; i < clickableCells.length; i++) {
        clickableCells[i].onclick = function (e) { return ShowInputDialog(e); };
    }
    for (let i = 0; i < editableCells.length; i++) {
        editableCells[i].onchange = function (e) { return UpdateTableData(e); };
        editableCells[i].onkeydown = function (e) { if (e.key == "Enter") { return UpdateTableData(e); } };
    }
    for (let i = 0; i < delButton.length; i++) {
        delButton[i].onclick = function (e) { return DeleteData(e.target); }
    }

}

function GetColumns() {
    let str = "<tr><th>" + tableContent.KeyString + "</th>";
    for (let i = 0; i < tableContent.ColumnList.length; i++) {
        if (tableContent.ColumnList[i].Title == "+/") {
            str += '<th class="add-cell clickable-cell" data-index="c-+">+</th>';
        }
        else {
            str += '<th class="clickable-cell" data-isq="' + (tableContent.ColumnList[i].nOrQ ? "q" : "n") + '" data-index="c-' + i + '">' + tableContent.ColumnList[i].Title + "</th>";
        }
    }
    str += "</tr>";
    return str;
}

function GetRows() {
    let str = "";
    for (let i = 0; i < tableContent.RowList.length; i++) {
        str += "<tr>";
        if (tableContent.RowList[i].Name == "+/") {
            str += '<td class="add-cell clickable-cell" data-index="r-+">+</td>';
        }
        else {
            str += '<td><input type="text" value="' + tableContent.RowList[i].Name + '" class="editable-cell" data-index="r-' + i + '*n"/></td>';
            for (let j = 0; j < tableContent.RowList[i].Properties.length; j++) {
                if (tableContent.RowList[i].Properties[j].Checked) {
                    str += '<td><input class="editable-cell" type="checkbox"/ data-index="r-' + i + '*' + j + '" ' + (tableContent.RowList[i].Properties[j].NumVal != 0 ? ' checked' : '') + '></td>';
                }
                else {
                    str += '<td><input class="editable-cell" type="text" data-index="r-' + i + "*" + j + '" value="' + (tableContent.RowList[i].Properties[j].NumVal == 0 ? "" : tableContent.RowList[i].Properties[j].NumVal) + '"/></td>';
                }
            }
            str += '<td><button class="del-button" data-index="r-' + i + '"></button></td>';
        }
        str += "</tr>";
    }
    return str;
}

/**
 * 
 * @param {Event} e
 */
function ShowInputDialog(e) {
    valueInput.style.visibility = "inherit";
    valueLabel.style.visibility = "inherit";
    deleteButton.style.visibility = "inherit";
    let columnOrRow = "";
    let cIndex = -1;
    try { columnOrRow = e.target.getAttribute("data-index").slice(0, 1); }
    catch { }
    saveButton.setAttribute("data-index", e.target.getAttribute("data-index"));
    if (columnOrRow == "c" && e.target.innerHTML != "+") { deleteButton.setAttribute("data-index", e.target.getAttribute("data-index")); }
    if (e.target.innerHTML == "+") { deleteButton.style.visibility = "hidden"; }
    if (columnOrRow == "r") {
        valueInput.style.visibility = "hidden";
        valueLabel.style.visibility = "hidden";
        deleteButton.style.visibility = "hidden";
    }

    if (e.target.innerHTML != "+") {
        nameInput.value = e.target.innerHTML;
    }
    else {
        nameInput.value = "";
    }

    if (overal.style.visibility != "hidden") {
        overal.style.visibility = "hidden";
    }
    else {
        overal.style.visibility = "visible";
    }
}
/**
 * 
 * @param {Event} e
 */
function UpdateTableData(e) {
    let rowIndex = -1;
    let columnIndex = -1;
    let tempStr = "";
    tempStr = e.target.getAttribute("data-index").slice(2);
    let rowStr = "";
    let colStr = "";
    let isRow = true;
    for (let i = 0; i < tempStr.length; i++) {
        if (tempStr[i] == "*") { isRow = false; }
        else {
            if (isRow) { rowStr += tempStr[i]; }
            else { colStr += tempStr[i]; }
        }
    }
    rowIndex = parseInt(rowStr);
    if (colStr != "n") { columnIndex = parseInt(colStr); }

    if (columnIndex < 0) {
        tableContent.RowList[rowIndex].Name = e.target.value;
    }
    else {
        if (e.target.type == "checkbox") {
            tableContent.RowList[rowIndex].Properties[columnIndex].NumVal = e.target.checked ? 1 : 0;
        }
        else {
            tableContent.RowList[rowIndex].Properties[columnIndex].NumVal = parseInt(e.target.value);
            if (isNaN(tableContent.RowList[rowIndex].Properties[columnIndex].NumVal)) {
                e.target.style.backgroundColor = "red";
                alert("Wrong input!");
            }
            else { e.target.style.backgroundColor = "white"; }
        }
    }

    //alert(rowIndex + "/" + columnIndex);
}

function SaveButtonOveral(e) {
    let columnOrRow = "";
    let cIndex = -1;
    try { columnOrRow = e.target.getAttribute("data-index").slice(0, 1); }
    catch { }

    if (columnOrRow == "c") {
        try { cIndex = parseInt(e.target.getAttribute("data-index").slice(2)); }
        catch { }

        if (cIndex >= 0) {
            EditData(cIndex);
        }
        else {
            AddNewColumn();
        }
    }
    else if (columnOrRow == "r") {
        AddNewRow();
    }

    overal.style.visibility = "hidden";
    RefreshTable();
}

function EditData(index) {
    const boolVal = valueInput.value == "q" ? true : false;
    tableContent.EditColumn(index, nameInput.value, boolVal);
}

function AddNewColumn() {
    const boolVal = valueInput.value == "q" ? true : false;
    tableContent.AddColumn(nameInput.value, boolVal);
}

function AddNewRow() {
    tableContent.AddRow(nameInput.value);
}
/**
 * 
 * @param {HTMLElement} elem
 */
function DeleteData(elem) {
    const tempStr = elem.getAttribute("data-index");
    let rOrC = tempStr.slice(0, 1);
    let index = -1;
    index = parseInt(tempStr.slice(2));
    //alert(rOrC + "/" + index);
    if (confirm("Are you sure you want to delete this data?")) {
        if (rOrC == "r" && index > -1) { tableContent.RemoveRow(index); }
        else if (rOrC == "c" && index > -1) { tableContent.RemoveColumn(index); }
        overal.style.visibility = "hidden";
        RefreshTable();
    }
}




