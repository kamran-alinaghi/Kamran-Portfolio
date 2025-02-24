import { TableDataSet } from "./Elements/DataFormat.js";
import { TabelContent, RowContent, RowProperties, AddingSequence, Members, Member, Point, GetPairList } from "./ArrayClasses.js";
import { Table } from "./Elements/TableElement.js";
import { FinalGrouping } from "./Grouping.js";



let titleArray = [""];
titleArray.pop();
let virtualDataSet = new TableDataSet(); //Only members without header. This variable changes during the proccess
let categoryList = [new RowContent("", false)];
categoryList.pop();
let AllInstances = [new Members()];
AllInstances.pop();
let ConstInstances = [new Member()]; //Stays the same all the process
ConstInstances.pop();



let WardSequence = [new AddingSequence()];
WardSequence.pop();
let AvgSequence = [new AddingSequence()];
AvgSequence.pop();
let maxResults = [new AddingSequence()];
maxResults.pop();

/**
 * 
 * @param {HTMLElement} element
 * @param {TabelContent} tableContent
 */
export function FirstTable(tableContent, element) {
    titleArray.length = 0;
    AllInstances.length = 0;
    ConstInstances.length = 0;
    virtualDataSet = new TableDataSet();

    const dataSet = new TableDataSet();
    titleArray = [tableContent.TableName];

    for (let i = 0; i < tableContent.ColumnList.length - 1; i++) {
        titleArray.push(tableContent.ColumnList[i].Title);

        dataSet.ColumnType.push("text");
        dataSet.ColumnEditable.push(false);
    }
    dataSet.AddRow(titleArray);
    for (let i = 0; i < tableContent.RowList.length - 1; i++) {
        const rowArray = [];
        rowArray.push(tableContent.RowList[i].Name);
        for (let j = 0; j < tableContent.RowList[i].Properties.length; j++) {
            if (tableContent.RowList[i].Properties[j].Checked) {
                rowArray.push(tableContent.RowList[i].Properties[j].NumVal * 0.707);
            }
            else { rowArray.push(tableContent.RowList[i].Properties[j].NumVal / 10); }
        }
        virtualDataSet.AddRow(rowArray);
    }
    FindDiff(virtualDataSet);

    for (let i = 0; i < virtualDataSet.Row.length; i++) {
        dataSet.AddRow(virtualDataSet.Row[i].Column);
        const tempMember = new Member(i);
        for (let j = 0; j < virtualDataSet.Row[i].Column.length; j++) {
            if (j == 0) {
                tempMember.Name = virtualDataSet.Row[i].Column[0];
            }
            else {
                tempMember.Properties.push(virtualDataSet.Row[i].Column[j]);
            }
        }
        AllInstances.push(new Members());
        AllInstances[i].Members.push(tempMember);
        ConstInstances.push(tempMember);
    }
    //alert(JSON.stringify(dataSet));
    const resTable = new Table("Result", dataSet);
    if (element) {
        element.innerHTML = resTable.ToHtmlObject();
    }
}

/**
 * 
 * @param {string} methodString
 */
export function DiffFormula(methodString) {
    while (AllInstances.length > 1) {
        const firstCloseMember = FindClosestMembers(AllInstances, methodString);
        const secondCloseMember = FindSecondClosestMember(AllInstances, methodString, firstCloseMember);
        AddToSequence(AllInstances, firstCloseMember, secondCloseMember, methodString);
        RearrangeInstances(AllInstances, firstCloseMember);
    }
    //DisplaySequence();
}



/**
 * 
 * @param {Members[]} memberList
 * @param {string} method
 * @returns
 */
function FindClosestMembers(memberList, method) {
    const pairList = GetPairList(memberList);
    let minValue = 0;
    let minIndex = -1;
    for (let i = 0; i < pairList.length; i++) {
        const tempValue = memberList[pairList[i].X].CompareWith(memberList[pairList[i].Y], method);
        if (i == 0) {
            minValue = tempValue;
            minIndex = 0;
        }
        if (tempValue < minValue) {
            minValue = tempValue;
            minIndex = i;
        }
    }



    if (minIndex > -1) {
        pairList[minIndex].Value = minValue;
        return pairList[minIndex];
    }
    else {
        return null;
    }
}

/**
 * 
 * @param {Members[]} memberList
 * @param {string} method
 * @param {Point} currentMembers
 * @returns
 */
function FindSecondClosestMember(memberList, method, currentMembers) {
    let minValue = 0;
    let minIndex = -1;
    let firstAssign = true;

    for (let i = 0; i < memberList.length; i++) {
        if (i != currentMembers.X && i != currentMembers.Y) {
            const tempValue = memberList[currentMembers.X].CompareWith(memberList[i]);
            if (firstAssign) {
                minValue = tempValue;
                minIndex = i;
                firstAssign = false;
            }
            else {
                if (tempValue < minValue) {
                    minValue = tempValue;
                    minIndex = i;
                }
            }
        }
    }
    if (minIndex > -1) {
        const resultPoint = new Point(currentMembers.X, minIndex);
        resultPoint.Value = minValue;
        return resultPoint;
    }
    else { return null; }
}

/**
 * 
 * @param {Members[]} instanceList
 * @param {Point} indexes
 */
function RearrangeInstances(instanceList, indexes) {
    for (let i = 0; i < instanceList[indexes.Y].Members.length; i++) {
        instanceList[indexes.X].Members.push(instanceList[indexes.Y].Members[i]);
    }
    instanceList.splice(indexes.Y, 1);
}

/**
 * 
 * @param {TableDataSet} dataset
 */
function FindDiff(dataset) {
    const startIndex = 0;
    for (let i = 1; i < dataset.Row[0].Column.length; i++) {
        let min = dataset.Row[startIndex].Column[i];
        let max = min;
        for (let j = startIndex; j < dataset.Row.length; j++) {
            if (dataset.Row[j].Column[i] < min) {
                min = dataset.Row[j].Column[i];
            }
            if (dataset.Row[j].Column[i] > max) {
                max = dataset.Row[j].Column[i];
            }
        }
        for (let j = startIndex; j < dataset.Row.length; j++) {
            dataset.Row[j].Column[i] = 0.707 * (dataset.Row[j].Column[i] - min) / (max - min);
        }
    }
}

/**
 * 
 * @param {Members[]} members
 * @param {Point} firstCloseMember
 * @param {Point?} secondCloseMember
 * @param {string} methodString
 */
function AddToSequence(members, firstCloseMember, secondCloseMember, methodString) {
    const tempStep = new AddingSequence();
    tempStep.SubGroup = members[firstCloseMember.Y].GetIds();
    tempStep.MembersToAdd = members[firstCloseMember.X].GetIds();
    tempStep.FirstDistance = firstCloseMember.Value;
    if (secondCloseMember) {
        tempStep.SecondOption = members[secondCloseMember.Y].GetIds();
        tempStep.SecondDistance = secondCloseMember.Value;
    }
    if (methodString == "ward") { WardSequence.push(tempStep); }
    else { AvgSequence.push(tempStep); }
}

/**
 * 
 * @param {AddingSequence[]} sequence
 */
function DisplaySequence(sequence) {
    let str = "";
    for (let i = 0; i < sequence.length; i++) {
        str += 'Stage ' + (i + 1).toString() + ': ';
        str += GroupToString(sequence[i].SubGroup);
        str += ' -> ';
        str += GroupToString(sequence[i].MembersToAdd);
        str += ' @' + sequence[i].FirstDistance;
        str += ' Or: ';
        str += GroupToString(sequence[i].SecondOption);
        str += ' @' + sequence[i].SecondDistance;
        str += '\n';
    }
    return str;

    function GroupToString(array) {
        let result = '[';
        for (let j = 0; j < array.length; j++) {
            result += virtualDataSet.Row[array[j]].Column[0];
            if (j < array.length - 1) { result += ' & '; }
        }
        result += ']';
        return result;
    }
}

export function AlertSequence() {
    let str = "Ward:\n" + DisplaySequence(WardSequence) + "\n";
    str += "Avg:\n" + DisplaySequence(AvgSequence);
    alert(str);
}

/**
 * 
 * @param {TabelContent} tableContent
 */
export function SiCalc(tableContent, element) {
    WardSequence.length = 0;
    AvgSequence.length = 0;
    maxResults.length = 0;
    SiCalculationFirstPhase(tableContent, element);
    let str = '';
    SiCalculationSecondPhase();
    let groupToStart = maxResults[0];
    if (GetSi(maxResults[1]) > GetSi(maxResults[0])) { groupToStart = maxResults[1]; }

    str += "\nGroup To Start: [" + groupToStart.MembersToAdd.map((val) => { return ConstInstances[val].Name }) + '->' + groupToStart.SubGroup.map((val) => { return ConstInstances[val].Name }) +']';
    str += '\n\n\n' + FinalGrouping(groupToStart, ConstInstances);
    return str;
}
export function SiCalculationFirstPhase(tableContent, element) {

    FirstTable(tableContent, element);
    DiffFormula("ward");
    FirstTable(tableContent, null);
    DiffFormula("avg");
    //AlertSequence();
}

function SiCalculationSecondPhase() {
    const SiArrayWard = [0];
    SiArrayWard.length = 0;
    const SiArrayAvg = [0];
    SiArrayAvg.length = 0;

    for (let i = 0; i < WardSequence.length; i++) {
        SiArrayWard.push(GetSi(WardSequence[i]));
    }
    for (let i = 0; i < AvgSequence.length; i++) {
        SiArrayAvg.push(GetSi(AvgSequence[i]));
    }
    return 'WARD:\n' + ShowSiArray(WardSequence, SiArrayWard) + "\nAvarage Linkage:\n" + ShowSiArray(AvgSequence, SiArrayAvg);
    //alert(JSON.stringify(SiArrayWard) + "\n" + JSON.stringify(SiArrayAvg));
}

/**
 * 
 * @param {AddingSequence} sequenceInstance
 * @returns
 */
function GetSi(sequenceInstance) {
    const max = Math.max(sequenceInstance.SecondDistance, sequenceInstance.FirstDistance);
    const diff = sequenceInstance.SecondDistance - sequenceInstance.FirstDistance;
    if (max != 0) { return diff / max; }
    else {
        if (diff == 0) { return 0; }
        else { return -1000; }
    }
}

/**
 * 
 * @param {AddingSequence[]} sequence
 * @param {number[]} result
 * @returns
 */

function ShowSiArray(sequence, result) {
    let str = '';
    for (let i = 0; i < sequence.length; i++) {
        str += ArrayToString(sequence[i].MembersToAdd) + ' & ' + ArrayToString(sequence[i].SubGroup) + ' Si: ' + result[i] + '\n';
    }
    const index = result.indexOf(Math.max(...result));
    if (index > -1) { str += 'Max: ' + ArrayToString(sequence[index].MembersToAdd) + ' & ' + ArrayToString(sequence[index].SubGroup) + ' @ Si: ' + result[index] + '\n'; }
    maxResults.push(sequence[index]);
    return str;
}

/**
 * 
 * @param {number[]} array
 * @returns
 */
function ArrayToString(array) {
    let result = '[';
    for (let i = 0; i < array.length; i++) { result += ConstInstances[array[i]].Name + (i < array.length - 1 ? ',' : ''); }
    return result + ']';
}

/**
 * 
 * @param {any[]} what
 * @param {any[]} from
 * @returns
 */
export function SubtractArray(what, from) {
    let result = [];
    for (let i = 0; i < from.length; i++) {
        if (what.indexOf(from[i]) < 0) {
            result.push(from[i]);
        }
    }
    return result;
}