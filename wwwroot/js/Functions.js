import { TableDataSet } from "./Elements/DataFormat.js";
import { TabelContent, RowContent, RowProperties, AddingSequence, Members, Member, Point, GetPairList } from "./ArrayClasses.js";
import { Table } from "./Elements/TableElement.js";



let titleArray = [""];
titleArray.pop();
let virtualDataSet = new TableDataSet(); //Only members without header. This variable changes during the proccess
let categoryList = [new RowContent("", false)];
categoryList.pop();
const AllInstances = [new Members()];
AllInstances.pop();



const WardSequence = [new AddingSequence()];
WardSequence.pop();
const AvgSequence = [new AddingSequence()];
AvgSequence.pop();

/**
 * 
 * @param {HTMLElement} element
 * @param {TabelContent} tableContent
 */
export function FirstTable(tableContent) {
    titleArray.length = 0;
    AllInstances.length = 0;
    virtualDataSet = new TableDataSet();

    const dataSet = new TableDataSet();
    titleArray = [tableContent.TableName];

    for (let i = 0; i < tableContent.ColumnList.length - 1; i++) {
        titleArray.push(tableContent.ColumnList[i].Title);

        dataSet.ColumnType.push("text");
        dataSet.ColumnEditable.push(false);
    }
    dataSet.AddRow(titleArray);
    for (let i = 0; i < tableContent.RowList.length; i++) {
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
    }

    //alert(JSON.stringify(AllInstances));
    const resTable = new Table("Result", dataSet);
    //element.innerHTML += resTable.ToHtmlObject();
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
    for (let i = 1; i < dataset.Row[0].Column.length; i++) {
        let min = dataset.Row[1].Column[i];
        for (let j = 0; j < dataset.Row.length; j++) {
            if (dataset.Row[j].Column[i] < min) {
                min = dataset.Row[j].Column[i];
            }
        }
        if (min > 0) {
            for (let j = 0; j < dataset.Row.length; j++) {
                dataset.Row[j].Column[i] -= min;
            }
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
export function SiCalc(tableContent) {
    SiCalculationFirstPhase(tableContent);
    SiCalculationSecondPhase();
}
export function SiCalculationFirstPhase(tableContent) {
    FirstTable(tableContent);
    DiffFormula("ward");
    FirstTable(tableContent);
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
    alert(JSON.stringify(SiArrayWard) + "\n" + JSON.stringify(SiArrayAvg));
}

/**
 * 
 * @param {AddingSequence} sequenceInstance
 * @returns
 */
function GetSi(sequenceInstance) {
    return (sequenceInstance.SecondDistance - sequenceInstance.FirstDistance) / Math.max(sequenceInstance.SecondDistance , sequenceInstance.FirstDistance);
}








