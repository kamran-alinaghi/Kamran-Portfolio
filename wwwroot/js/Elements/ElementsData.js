import * as DataFormat from "./DataFormat.js";

export const t = "kam";

export const testTable = '<table class="styled-table"><thead><tr><th>Header 1</th><th>Header 2</th><th>Header 3</th><th>Header 4</th></tr></thead ><tbody><tr><td><span>Data1</span></td><td><input type="text"></td><td><input type="text"></td><td><input type="text"></td></tr><tr><td><span>Data2</span></td><td><input type="text"></td><td><input type="text"></td><td><input type="text"></td></tr><tr><td><span>Data3</span></td><td><input type="text"></td><td><input type="text"></td><td><input type="text"></td></tr></tbody></table > ';

export class Table {
    Name;
    TableData;
    /**
     * 
     * @param {string} name
     * @param {DataFormat.TableDataSet} tableData
     */
    constructor(name, tableData) {
        this.Name = name;
        this.TableData = tableData;
    }

    ToHtmlObject() {
        let res = '';
        res = '<table class="styled-table">';
        res += '<thead>';
        res += '<tr>';
        for (let i = 0; i < this.TableData.Row[0].Column.length; i++) {
            res += '<th>' + this.TableData.Row[0].Column[i];
            res += '</th>';
        }
        res += '</tr>';
        res += '</thead>';
        res += '<tbody>';
        for (let i = 1; i < this.TableData.Row.length; i++) {
            res += '<tr>';
            for (let j = 0; j < this.TableData.Row[i].Column.length; j++) {
                res += '<td>';
                if (j == 0) {
                    res += '<span>';
                    res += this.TableData.Row[i].Column[j];
                    res += '</span>';
                }
                else {
                    res += '<input type="text" value="' + this.TableData.Row[i].Column[j] +'">';
                }
                res += '</td>';
            }
            res += '</tr>';
        }
        res += '</tbody>';
        res += '</table>';
        return res;
    }
}