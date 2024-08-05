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
const saveProjectButton = document.getElementById("save-project-button");
const selectOptions = document.getElementById("select-options");
const projectNameTextBox = document.getElementById("tBox");
const test = document.getElementById("test");
const downloadBtn = document.getElementById("download-btn");

var CreatedProjects = [];
var DBcolumns = [];
var DBrows = [];
var DBvalues = [];
overalBlack.onclick = function (e) { return ShowInputDialog(e); };
saveButton.onclick = function (e) { return SaveButtonOveral(e); };
deleteButton.onclick = function (e) { return DeleteData(e.target); };
saveProjectButton.onclick = function (e) { return SaveButtonFunction(e); }
selectOptions.onchange = function (e) { return ChangeProject(e); }
projectNameTextBox.onchange = function (e) { return ChangeProjectName(e); }
downloadBtn.onclick = function () { return Download("https://kamran-portfolio.com/lib/files/ASW.xlsx"); };

let tableContent = new myArrayData.TabelContent();
let IsSaved = true;


InitializeProjectsOptions();
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
    let str = "<tr><th>Member Name</th>";
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
}

function ChangeProjectName(event) {
    tableContent.TableName = event.target.value;
}

function InitializeProjectsOptions(selectedIndex = 0) {
    CreatedProjects = [];
    $.post("/categorizingapi/CreatedProjects",
        JSON.stringify({ "Id": userId }),
        function (data, status) {
            let str = "";
            if (data != "null") {
                CreatedProjects = JSON.parse(data);
                for (let i = 0; i < CreatedProjects.length; i++) {
                    str += '<option value="' + CreatedProjects[i].Id + '">' + CreatedProjects[i].ProjectName + '</option>';
                }
            }
            str += '<option value="0">New</option>';
            selectOptions.innerHTML = str;
            const tempId = CreatedProjects.length > 0 ? CreatedProjects[selectedIndex].Id : 0;
            $('#select-options').val(tempId);
            $('#select-options').change();
        });
}

function ChangeProject(event) {
    if (!IsSaved) {
        alert("Not Saved!");
    }
    else {
        if (event.target.value > 0) {
            GetDataOfProject(event.target.value);
        }
        else {
            tableContent = new myArrayData.TabelContent();
            tableContent.userId = userId;
            tableContent.TableId = CreatedProjects.length + 1;
            RefreshTable();
        }
    }
}

async function GetDataOfProject(Id) {
    GetColumnsFromDB(Id);
    GetRowsFromDB(Id);
    GetValuesFromDB(Id);
}

function GetColumnsFromDB(Id) {

    $.post("/categorizingapi/Columns",
        JSON.stringify({ "Id": Id }),
        function (data, status) {
            SetDBdata('c', data);
        });

}

function GetRowsFromDB(Id) {
    $.post("/categorizingapi/Rows",
        JSON.stringify({ "Id": Id }),
        function (data, status) {
            SetDBdata('r', data);
        });
}

function GetValuesFromDB(Id) {
    $.post("/categorizingapi/Values",
        JSON.stringify({ "Id": Id }),
        function (data, status) {
            SetDBdata('v', data);
        });
}

function SetDBdata(c, data) {
    switch (c) {
        case 'c':
            if (data != "null") { DBcolumns = JSON.parse(data); }
            else { DBcolumns = []; }
            tableContent.IsDataChanged.Columns = true;
            break;
        case 'r':
            if (data != "null") { DBrows = JSON.parse(data); }
            else { DBrows = []; }
            tableContent.IsDataChanged.Rows = true;
            break;
        case 'v':
            if (data != "null") { DBvalues = JSON.parse(data); }
            else { DBvalues = []; }
            tableContent.IsDataChanged.Values = true;
            break;
    }
    if (tableContent.IsDataChanged.Columns && tableContent.IsDataChanged.Rows && tableContent.IsDataChanged.Values) {
        tableContent.IsDataChanged.SetToFalse();
        StoreDataToTableContent();
    }
}

function StoreDataToTableContent() {
    tableContent = new myArrayData.TabelContent();
    tableContent.TableName = CreatedProjects[selectOptions.value - 1].ProjectName;
    projectNameTextBox.value = tableContent.TableName;
    tableContent.TableId = CreatedProjects[selectOptions.value - 1].Id;
    tableContent.userId = userId;
    for (let i = 0; i < DBcolumns.length; i++) {
        tableContent.AddColumn(DBcolumns[i].ColumnName, DBcolumns[i].IsBoolean, DBcolumns[i].Id);
    }
    for (let i = 0; i < DBrows.length; i++) {
        tableContent.AddRow(DBrows[i].RowName, DBrows[i].Id);
    }
    for (let i = 0; i < tableContent.RowList.length - 1; i++) {
        for (let j = 0; j < tableContent.RowList[i].Properties.length; j++) {
            tableContent.RowList[i].Properties[j] = FindAndSetValues(i, j);
        }
    }
    RefreshTable();
}

function FindAndSetValues(rowIndex, columnIndex) {
    for (let i = 0; i < DBvalues.length; i++) {
        if (DBvalues[i].RowId == tableContent.RowList[rowIndex].Id && DBvalues[i].ColumnId == tableContent.ColumnList[columnIndex].Id) {
            return new myArrayData.RowProperties(tableContent.ColumnList[columnIndex].nOrQ, DBvalues[i].Value);
        }
    }
    return new myArrayData.RowProperties(false, 0);
}

function SaveButtonFunction(event) {
    SendPUTrequest();
    //retrieve all data again
    //set to new project index
}

function SendPUTrequest() {
    $.ajax({
        url: "/categorizingapi/PutDataToDb",
        type: 'PUT',
        data: JSON.stringify(tableContent),
        success: function (result) {
            InitializeProjectsOptions(result - 1);
        },
        error: function (ajaxContext) {
            //test.innerHTML = ajaxContext.responseText;
        }
    });
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
    if (confirm("Are you sure you want to delete this data?")) {
        if (rOrC == "r" && index > -1) { tableContent.RemoveRow(index); }
        else if (rOrC == "c" && index > -1) { tableContent.RemoveColumn(index); }
        overal.style.visibility = "hidden";
        RefreshTable();
    }
}

function Download(url) {
    document.getElementById('my_iframe').src = url;
};




