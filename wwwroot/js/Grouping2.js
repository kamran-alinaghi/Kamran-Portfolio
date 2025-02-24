import { TabelContent, RowContent, RowProperties, AddingSequence, Members, Member, Point, GetPairList, Cluster } from "./ArrayClasses.js";
import { SubtractArray } from "./Functions.js";
let str = '';
let ClusterArray = [new Cluster()];
let NotClustered = new Cluster();

/**
 * 
 * @param {AddingSequence} startingGroup
 * @param {Member[]} instances
 */
export function FinalGrouping(startingGroup, instances) {
    NotClustered.length = 0;
    ClusterArray.length = 0;
    str = '';
    const startingCluster = new Cluster([...startingGroup.MembersToAdd, ...startingGroup.SubGroup]);
    const AltClustered = new Cluster();
    instances.forEach((value, instanceIndex) => {
        if (startingCluster.ClusterMembers.indexOf(instanceIndex) < 0) {
            AltClustered.ClusterMembers.push(instanceIndex);
        }
    });


    let sum = CompareClusters(startingCluster, AltClustered, instances);
    str += 'sum Si: ' + sum.toString() + '\n';

    let oldSum = 0;
    ClusterArray.push(startingCluster);
    while (sum > oldSum) {
        oldSum = sum;
        sum = CheckingNextMatch(startingCluster, AltClustered, oldSum, instances);
    }
    
    return str;
}



/**
 * 
 * @param {Cluster} startingCluster
 * @param {Cluster} NotClustered
 * @param {number} startingSum
 * @param {Member[]} instances
 * @returns
 */
function CheckingNextMatch(startingCluster, NotClustered, startingSum, instances) {
    let maxSum = startingSum;
    let SelectedMatch = new AddingSequence();
    SelectedMatch.MembersToAdd = startingCluster.ClusterMembers;
    for (let i = 0; i < NotClustered.ClusterMembers.length; i++) {
        const match = FindNextMatch(ClusterArray, instances);
        //const chosenCluster = ItemToCluster(match);
        //const altCluster = FindAlternativeCluster();
        //const resSum = CompareClusters(chosenCluster, altCluster, instances);
        if (resSum > maxSum) {
            SelectedMatch = match;
        }
    }
    return maxSum;
}

function FindNextMatch() {

}


/**
 * 
 * @param {Cluster} firstCluster
 * @param {Cluster} secondCluster
 * @param {Member[]} instances
 */
function CompareClusters(firstCluster, secondCluster, instances) {
    let resultArray = [0]; resultArray.length = 0;
    for (let i = 0; i < firstCluster.ClusterMembers.length; i++) {
        let selfResult = 0;
        let otherResult = 0;
        selfResult = InstanceCompareCluster(firstCluster.ClusterMembers[i], firstCluster, instances);
        otherResult = InstanceCompareCluster(firstCluster.ClusterMembers[i], secondCluster, instances);
        resultArray.push(GetSi(selfResult, otherResult));
    }
    for (let i = 0; i < secondCluster.ClusterMembers.length; i++) {
        let selfResult = 0;
        let otherResult = 0;
        selfResult = InstanceCompareCluster(secondCluster.ClusterMembers[i], secondCluster, instances);
        otherResult = InstanceCompareCluster(secondCluster.ClusterMembers[i], firstCluster, instances);
        resultArray.push(GetSi(selfResult, otherResult));
    }
    let resultAverage = 0;
    resultArray.map((val) => { resultAverage += val; });
    return resultAverage / instances.length;
}

/**
 * 
 * @param {number} instanceIndex
 * @param {Cluster} cluster
 * @param {Member[]} instances
 * @param {boolean} isSelf
 */
function InstanceCompareCluster(instanceIndex, cluster, instances) {
    let result = 0;
    let count = 0;
    for (let i = 0; i < cluster.ClusterMembers.length; i++) {
        if (cluster.ClusterMembers.indexOf(instanceIndex) < 0 || (cluster.ClusterMembers.indexOf(instanceIndex) > -1 && cluster.ClusterMembers[i] != instanceIndex)) {
            const tempval = CompareArrays(instances[instanceIndex].Properties, instances[cluster.ClusterMembers[i]].Properties);
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