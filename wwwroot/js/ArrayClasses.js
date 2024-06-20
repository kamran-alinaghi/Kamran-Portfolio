export class ColumnContent {
    Title;
    nOrQ;
    /**
     * 
     * @param {string} titleStr
     * @param {boolean} nOrQBool
     */
    constructor(titleStr, nOrQBool) {
        this.Title = titleStr;
        this.nOrQ = nOrQBool;
    }
}

export class RowProperties {
    Checked;
    NumVal;
    /**
     * 
     * @param {boolean} checked
     * @param {number} num
     */
    constructor(checked, num) {
        this.Checked = checked;
        this.NumVal = num;
    }
}

export class RowContent {
    Name;
    Properties;
    /**
     * 
     * @param {string} nameString
     * @param {boolean} checked
     * @param {number} num
     */
    constructor(nameString, checked, num) {
        this.Name = nameString;
        this.Properties = [new RowProperties(checked, num)];
    }

    /**
     * 
     * @param {boolean} checked
     * @param {number} num
     */
    AddProperty(checked, num) {
        this.Properties.push(new RowProperties(checked, num));
    }

    RemoveProperty(index) {
        this.Properties.splice(index, 1);
    }
}


export class TabelContent {
    KeyString;
    ColumnList;
    RowList;
    constructor() {
        this.ColumnList = [new ColumnContent("+/", false)];
        this.RowList = [new RowContent("+/", true, 0)];
        //this.RowList = [new RowContent("s1", true, 0), new RowContent("+/", true, 0)];
        //this.RowList[0].RemoveProperty(0);
        this.KeyString = "Member Name";
    }

    /**
     * 
     * @param {string} rowName
     */
    AddRow(rowName) {
        this.RowList.splice(this.RowList.length - 1, 1);
        this.RowList.push(new RowContent(rowName, true, 0));
        this.RowList[this.RowList.length - 1].RemoveProperty(0);
        this.RowList.push(new RowContent("+/", true, 0));
        this.ModifyRows();
    }

    /**
     * 
     * @param {number} index
     */
    RemoveRow(index) {
        let tempList = [];
        for (let i = 0; i < this.RowList.length; i++) {
            if (i != index) { tempList.push(this.RowList[i]); }
        }
        this.RowList = tempList;
    }

    /**
     * 
     * @param {string} title
     * @param {boolean} nOrQ
     */
    AddColumn(title, nOrQ) {
        let tempCol = [];
        for (let i = 0; i < this.ColumnList.length; i++) {
            if (i < this.ColumnList.length - 1) {
                tempCol.push(this.ColumnList[i]);
            }
            else {
                tempCol.push(new ColumnContent(title, nOrQ));
            }
        }
        tempCol.push(new ColumnContent("+/", false));
        this.ColumnList = tempCol;

        this.ModifyRows();
    }

    /**
     * 
     * @param {number} index
     */
    RemoveColumn(index) {
        let tempColumnList = [];
        let tempRowList = [];
        for (let i = 0; i < this.ColumnList.length; i++) {
            if (i != index) { tempColumnList.push(this.ColumnList[i]); }
        }
        this.ColumnList = tempColumnList;
        for (let i = 0; i < this.RowList.length; i++) {
            let tempPropList = [];
            for (let j = 0; j < this.RowList[i].Properties.length; j++) {
                if (j != index) { tempPropList.push(this.RowList[i].Properties[j]); }
            }
            tempRowList.push(new RowContent("+/", true, 0));
            tempRowList[i].Name = this.RowList[i].Name;
            tempRowList[i].Properties = tempPropList;
        }
        this.RowList = tempRowList;
    }

    /**
     * 
     * @param {number} index
     * @param {string} title
     * @param {boolean} nOrQ
     */
    EditColumn(index, title, nOrQ) {
        if (index < this.ColumnList.length) {
            this.ColumnList[index].Title = title;
            this.ColumnList[index].nOrQ = nOrQ;
            this.ModifyRows();
        }
    }

    ModifyRows() {
        for (let i = 0; i < this.RowList.length; i++) {
            if (this.RowList[i].Name != "+/") {
                for (let j = 0; j < this.ColumnList.length - 1; j++) {
                    if (j >= this.RowList[i].Properties.length) {
                        this.RowList[i].Properties.push(new RowProperties(this.ColumnList[j].nOrQ, 0));
                    }
                    else {
                        if (this.RowList[i].Properties[j].Checked != this.ColumnList[j].nOrQ) {
                            this.RowList[i].Properties[j].Checked = this.ColumnList[j].nOrQ;
                            this.RowList[i].Properties[j].NumVal = 0;
                        }
                    }
                }
            }
        }
    }
}