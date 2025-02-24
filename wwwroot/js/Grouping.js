import { TabelContent, RowContent, RowProperties, AddingSequence, Members, Member, Point, GetPairList, Cluster } from "./ArrayClasses.js";
import { SubtractArray } from "./Functions.js";
let str = '';
let ClusterArray = [new Cluster()]; ClusterArray.length = 0;
let NotClustered = new Cluster();
let DistanceMatrix = [[0]];

/**
 * 
 * @param {AddingSequence} startingGroup
 * @param {Member[]} instances
 */
export function FinalGrouping(startingGroup, instances) {
    DistanceMatrix.length = 0;
    DistanceMatrix = GetDistanceMatrix(instances);
    ClusterArray.length = 0;
    str = '';
    const startingCluster = [...startingGroup.MembersToAdd, ...startingGroup.SubGroup];
    instances.forEach((value, instanceIndex) => {
        if (startingCluster.indexOf(instanceIndex) < 0) {
            NotClustered.ClusterMembers.push(instanceIndex);
        }
    });
    ClusterArray.push(new Cluster(startingCluster, NotClustered.ClusterMembers));
    NotClustered.AlternativeMembers = startingCluster;

    let sum = CompareClusters(ClusterArray, NotClustered);
    str += 'sum Si: ' + sum.toString() + '\n';

    let oldSum = 0;
    //while (sum > oldSum) {
        oldSum = sum;
        sum = CheckingNextMatch(oldSum, instances);
    //}
    str += 'second sum Si: ' + sum.toString() + '\n';

    return str;
}

/**
 * 
 * @param {Member[]} instances
 * @returns
 * Returns a n*n matrix of numbers that each one represents distance between row and column member
 */
function GetDistanceMatrix(instances) {
    const result = [[0]]; result.length = 0;
    for (let i = 0; i < instances.length; i++) {
        const tempArray = [0]; tempArray.length = 0;

        for (let j = 0; j < instances.length; j++) {
            if (j < i) {
                tempArray.push(result[j][i]);
            }
            else if (i == j) {
                tempArray.push(0);
            }
            else {
                tempArray.push(CompareArrays(instances[i].Properties, instances[j].Properties));
            }
        }
        result.push(tempArray);
    }
    return result;
}



/**
 * 
 * @param {number} startingSum
 * @param {Member[]} instances
 * @returns
 */
function CheckingNextMatch(startingSum, instances) {
    let maxSum = startingSum;
    let SelectedMatch = new AddingSequence();
    SelectedMatch.MembersToAdd = ClusterArray[0];
    const matchList = FindMatchList();
    for (let i = 0; i < matchList.length; i++) {
        const tempClusters = ClusterArray;
        tempClusters.push(new Cluster(matchList[i].MembersToAdd, matchList[i].SubGroup));
        const tempNotClustered = GetTempNotClustered(matchList[i].MembersToAdd, matchList[i].SubGroup);
        const tempSum = CompareClusters(tempClusters, tempNotClustered);
        str += '[' + matchList[i].MembersToAdd.map((val) => { return instances[val].Name }) +
            ']->[' + matchList[i].SubGroup.map((val) => { return instances[val].Name }) +
            '] & Alt: [' + tempNotClustered.ClusterMembers.map((val) => { return instances[val].Name }) +
            ']=> Si: ' + tempSum + '\n';

        if (tempSum > maxSum) { maxSum = tempSum; }
    }
    //const chosenCluster = ItemToCluster(match);
    //const altCluster = FindAlternativeCluster();
    //const resSum = CompareClusters(chosenCluster, altCluster, instances);
    //if (resSum > maxSum) {
    //    SelectedMatch = match;
    //}

    return maxSum;
}

function FindMatchList() {
    const result = [new AddingSequence()]; result.length = 0;

    const allIndividuals = [[0]]; allIndividuals.length = 0;
    NotClustered.ClusterMembers.map((val) => { allIndividuals.push([val]); });
    ClusterArray.map((val) => { allIndividuals.push(val.ClusterMembers); });
    for (let i = 0; i < allIndividuals.length; i++) {
        for (let j = i + 1; j < allIndividuals.length; j++) {
            const tempSeq = new AddingSequence();
            tempSeq.MembersToAdd = allIndividuals[i];
            tempSeq.SubGroup = allIndividuals[j];
            tempSeq.SecondOption = FindingAlternative(allIndividuals[i], allIndividuals[j], allIndividuals);
            result.push(tempSeq);
        }
    }
    return result;
}


/**
 * 
 * @param {number[]} elementGroup
 * @param {number[]} subElementGroup
 * @param {number[][]} allIndividuals
 */
function FindingAlternative(elementGroup, subElementGroup, allIndividuals) {
    let minDist = 0;
    let isFirst = true;
    let resultIndex = -1;
    const tempNotClustered = GetTempNotClustered(elementGroup, subElementGroup);
    const allClusters = [new Cluster()]; allClusters.length = 0;
    ClusterArray.map((val) => { allClusters.push(val); });
    allClusters.push(tempNotClustered);
    for (let i = 0; i < allClusters.length; i++) {
        if (allClusters[i].ClusterMembers != elementGroup && allClusters[i].ClusterMembers != subElementGroup) {
            if (isFirst) {
                minDist = CalculateDistance(elementGroup, allClusters[i]);
                resultIndex = i;
                isFirst = false;
            }
            else {
                const tempVal = CalculateDistance(elementGroup, allClusters[i]);
                if (tempVal < minDist) {
                    minDist = tempVal;
                    resultIndex = i;
                }
            }
        }
    }
    return allClusters[resultIndex].ClusterMembers;
}

/**
 * 
 * @param {number[]} elementGroup
 * @param {number[]} subElementGroup
 * @returns
 */
function GetTempNotClustered(elementGroup, subElementGroup) {
    const result = new Cluster();
    if (elementGroup.length == 1 && NotClustered.ClusterMembers.indexOf(elementGroup[0]) > -1) {
        if (subElementGroup.length == 1 && NotClustered.ClusterMembers.indexOf(subElementGroup[0]) > -1) {
            NotClustered.ClusterMembers.map((val) => {
                if (val != elementGroup[0] && val != subElementGroup[0]) {
                    result.ClusterMembers.push(val);
                }
            });
        }
        else {
            NotClustered.ClusterMembers.map((val) => {
                if (val != elementGroup[0]) {
                    result.ClusterMembers.push(val);
                }
            });
        }
    }
    else {
        if (subElementGroup.length == 1 && NotClustered.ClusterMembers.indexOf(subElementGroup[0]) > -1) {
            NotClustered.ClusterMembers.map((val) => {
                if (val != subElementGroup[0]) {
                    result.ClusterMembers.push(val);
                }
            });
        }
        else {
            result.ClusterMembers = NotClustered.ClusterMembers;
        }
    }
    return result;
}

/**
 * 
 * @param {number[]} firstArray
 * @param {Cluster} secondArray
 */
function CalculateDistance(firstArray, secondArray) {
    let result = 0;
    for (let i = 0; i < firstArray.length; i++) {
        for (let j = 0; j < secondArray.ClusterMembers.length; j++) {
            result += DistanceMatrix[firstArray[i]][secondArray.ClusterMembers[j]];
        }
    }
    return result / (firstArray.length * secondArray.ClusterMembers.length);
}

function GetAllSequencePairPossibilities() {
    const result = [new AddingSequence()]; result.length = 0;
    const allIndividuals = [[0]]; allIndividuals.length = 0;
    NotClustered.map((val) => { allIndividuals.push([val]); });
    ClusterArray.map((val) => { allIndividuals.push(val); });
    for (let i = 0; i < allIndividuals.length; i++) {
        for (let j = i; j < allIndividuals.length; j++) {
            const tempSeq = new AddingSequence();
            tempSeq.MembersToAdd = allIndividuals[i];
            tempSeq.SubGroup = allIndividuals[j];
            result.push(tempSeq);
        }
    }
    return result;
}


///**
// * 
// * @param {number[]} firstCluster
// * @param {number[]} secondCluster
// * @returns
// */
//function CompareClusters(firstCluster, secondCluster) {
//    let resultArray = [0]; resultArray.length = 0;
//    for (let i = 0; i < firstCluster.length; i++) {
//        let selfResult = 0;
//        let otherResult = 0;
//        selfResult = InstanceCompareCluster(firstCluster[i], firstCluster);
//        otherResult = InstanceCompareCluster(firstCluster[i], secondCluster);
//        resultArray.push(GetSi(selfResult, otherResult));
//    }
//    for (let i = 0; i < secondCluster.length; i++) {
//        let selfResult = 0;
//        let otherResult = 0;
//        selfResult = InstanceCompareCluster(secondCluster[i], secondCluster);
//        otherResult = InstanceCompareCluster(secondCluster[i], firstCluster);
//        resultArray.push(GetSi(selfResult, otherResult));
//    }
//    let resultAverage = 0;
//    resultArray.map((val) => { resultAverage += val; });
//    return resultAverage / (firstCluster.length + secondCluster.length);
//}

/**
 * 
 * @param {Cluster[]} clustered
 * @param {Cluster} notClustered
 */
function CompareClusters(clustered, notClustered) {
    const resultArray = [0]; resultArray.length = 0;
    clustered.forEach((cluster, index) => {
        cluster.ClusterMembers.forEach((num) => {
            const selfResult = InstanceCompareCluster(num, cluster.ClusterMembers);
            const otherResult = InstanceCompareCluster(num, cluster.AlternativeMembers);
            resultArray.push(GetSi(selfResult, otherResult));
        });
    });
    notClustered.ClusterMembers.forEach((num, index) => {
        const selfResult = InstanceCompareCluster(num, notClustered.ClusterMembers);
        const otherResult = InstanceCompareCluster(num, notClustered.AlternativeMembers);
        resultArray.push(GetSi(selfResult, otherResult));
    });
    let resultAverage = 0;
    resultArray.map((val) => { resultAverage += val; });
    return resultAverage / resultArray.length;
}

/**
 * 
 * @param {number} instanceIndex
 * @param {number[]} cluster
 * @param {boolean} isSelf
 */
function InstanceCompareCluster(instanceIndex, cluster) {
    let result = 0;
    let count = 0;
    for (let i = 0; i < cluster.length; i++) {
        if (cluster.indexOf(instanceIndex) < 0 || (cluster.indexOf(instanceIndex) > -1 && cluster[i] != instanceIndex)) {
            const tempval = DistanceMatrix[instanceIndex][cluster[i]];
            result += tempval;
            //str += instances[instanceIndex].Name + '->' + instances[cluster.ClusterMembers[i]].Name + ': ' + tempval + '\n';
            count++;
        }
    }
    return count > 0 ? (result / count) : 0;
}

/**
 * 
 * @param {number[]} array1
 * @param {number[]} array2
 * @returns
 */
function CompareArrays(array1, array2) {
    let result = 0;
    if (array1.length != array2.length) {
        throw new Error("Length doesn't match:\nFirst array length: " + array1.length + "\nSecond array length: " + array2.length);
    }
    else {
        for (let i = 0; i < array1.length; i++) {
            result += Math.pow((array1[i] - array2[i]), 2);
        }
    }
    return Math.sqrt(result);
}

/**
 * 
 * @param {number} firstDistance
 * @param {number} secondDistance
 * @returns
 */
function GetSi(firstDistance, secondDistance) {
    const max = Math.max(secondDistance, firstDistance);
    const diff = secondDistance - firstDistance;
    if (max != 0) { return diff / max; }
    else {
        if (diff == 0) { return 0; }
        else { return -1000; }
    }
}