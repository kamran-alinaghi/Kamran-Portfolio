import { CategorizingProjectModel } from "./Models/UserDefinedProjectModel.js";

export class ColumnContent {
    //Id;
    Title;
    nOrQ;
    /**
     * 
     * @param {string} titleStr
     * @param {boolean} nOrQBool
     */
    constructor(titleStr, nOrQBool, id = 0) {
        this.Title = titleStr;
        this.nOrQ = nOrQBool;
        //this.Id = id;
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
    //Id;
    Name;
    Properties;
    /**
     * 
     * @param {string} nameString
     * @param {boolean} checked
     * @param {number} num
     */
    constructor(nameString, checked, num, id = 0) {
        //this.Id = id;
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

class DataChangeVerification {
    Columns;
    Rows;
    Values;
    constructor() {
        this.Columns = false;
        this.Rows = false;
        this.Values = false;
    }
    SetToFalse() {
        this.Columns = false;
        this.Rows = false;
        this.Values = false;
    }
}



export class TabelContent {
    TableName;
    TableId;
    userId;
    ColumnList;
    RowList;
    IsDataChanged = new DataChangeVerification();
    /**
     * 
     * @param {CategorizingProjectModel} project
     */
    constructor(project = null) {
        if (project == null) {
            this.ColumnList = [new ColumnContent("+/", false)];
            this.RowList = [new RowContent("+/", true, 0)];
            this.TableId = "0";
            this.userId = 0;
        }
        else {
            this.ColumnList = project.ColumnList;
            this.RowList = project.RowList;
            this.TableId = project._id;
            this.userId = project.UserId;
        }
        this.TableName = "Member Name";
    }

    /**
     * 
     * @param {string} rowName
     */
    AddRow(rowName, id = 0) {
        this.RowList.splice(this.RowList.length - 1, 1);
        this.RowList.push(new RowContent(rowName, true, 0, id));
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
    AddColumn(title, nOrQ, id = 0) {
        let tempCol = [];
        for (let i = 0; i < this.ColumnList.length; i++) {
            if (i < this.ColumnList.length - 1) {
                tempCol.push(this.ColumnList[i]);
            }
            else {
                tempCol.push(new ColumnContent(title, nOrQ, id));
            }
        }
        tempCol.push(new ColumnContent("+/", false, id));
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

export class AddingSequence {
    MembersToAdd;         //Members that are supposed to go to a subgroup
    SubGroup;      //The subgroup that is selected to accept a member
    FirstDistance;
    SecondOption;
    SecondDistance;
    constructor() {
        this.MembersToAdd = [0];
        this.MembersToAdd.pop();
        this.SubGroup = [0];
        this.SubGroup.pop();
        this.SecondOption = [0];
        this.SecondOption.pop();
        this.FirstDistance = 0;
        this.SecondDistance = 0;
    }
}

export class Member {
    id;
    Name;
    Properties;
    /**
     * 
     * @param {number} id
     */
    constructor(id = null) {
        this.id = id;
        this.Name = "";
        this.Properties = [0];
        this.Properties.pop();
    }
}

export class Members {
    Members;
    constructor() {
        this.Members = [new Member(null)];
        this.Members.pop();
    }

    /**
     * 
     * @param {Members} compare
     * @param {string} method
     * @returns
     */
    CompareWith(compare, method) {
        if (method == "ward") {
            const sampleArr1 = this.GetWardProperties();
            const sampleArr2 = compare.GetWardProperties();

            const sumDiff = this.#CompareArrays(sampleArr1, sampleArr2);
            return Math.sqrt(sumDiff);
        }
        else {
            const tempMembers = new Members();
            tempMembers.Members = this.Members.concat(compare.Members);
            const pairList = GetPairList(tempMembers.Members);
            let sum = 0;
            for (let i = 0; i < pairList.length; i++) {
                const sampleArr1 = tempMembers.Members[pairList[i].X].Properties;
                const sampleArr2 = tempMembers.Members[pairList[i].Y].Properties;
                sum += this.#CompareArrays(sampleArr1, sampleArr2);
            }
            sum = sum / pairList.length;
            return Math.sqrt(sum);
        }
    }
    
    GetWardProperties() {
        let result = this.Members[0].Properties;
        if (this.Members.length > 1) {
            result = this.#CompareArraysWard();
        }
        return result;
    }

    /**
     * 
     * @param {number[]} array1
     * @param {number[]} array2
     * @returns
     */
    #CompareArrays(array1, array2) {
        let result = 0;
        if (array1.length != array2.length) {
            throw new Error("Length doesn't match:\nFirst array length: " + array1.length + "\nSecond array length: " + array2.length);
        }
        else {
            for (let i = 0; i < array1.length; i++) {
                result += Math.pow((array1[i] - array2[i]), 2);
            }
        }
        return result;
    }

    #CompareArraysWard() {
        let result = [0];
        result.pop();
        const pairList = GetPairList(this.Members);
        for (let i = 0; i < this.Members[0].Properties.length; i++) {
            let tempSum = 0;
            for (let j = 0; j < pairList.length; j++) {
                tempSum += Math.pow((this.Members[pairList[j].X].Properties[i] - this.Members[pairList[j].Y].Properties[i]), 2);
            }
            result.push(Math.sqrt(tempSum / pairList.length));
        }
        //alert(JSON.stringify(result));
        return result;
    }

    #CompareArraysAvrg() {
        let result = [0];
        result.pop();

    }

    GetIds() {
        const result = [0];
        result.pop();
        if (this.Members.length > 0) {
            for (let i = 0; i < this.Members.length; i++) {
                result.push(this.Members[i].id);
            }
        }
        else {
            return null;
        }
        return result;
    }
}

export class Point {
    X;
    Y;
    Value;
    /**
     * 
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.X = x;
        this.Y = y;
        this.Value = 0;
    }
}

/**
 * 
 * @param {any[]} array
 * @returns
 */
export function GetPairList(array) {
    const result = [new Point(0, 0)];
    result.pop();
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = i + 1; j < array.length; j++) {
            result.push(new Point(i, j));
        }
    }
    return result;
}

export class Cluster {
    ClusterMembers;
    AlternativeMembers;
    /**
     * 
     * @param {number[]} inputArray
     * @param {number[]} altArray
     */
    constructor(inputArray = [], altArray = []) {
        this.ClusterMembers = inputArray;
        this.AlternativeMembers = altArray;
    }
}

export class List extends Array {
    constructor() {
        super();
    }
}


