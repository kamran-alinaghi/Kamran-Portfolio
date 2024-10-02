import { BaseElement } from "./BaseElement.js";
import * as DataFormat from "./DataFormat.js";
import { Span } from "./SpanElement.js";
import { Input } from "./InputElement.js";
export class Table extends BaseElement {
    TableData;
    /**
     * 
     * @param {string} name
     * @param {DataFormat.TableDataSet} tableData
     */
    constructor(name, tableData) {
        super();
        this.Name = name;
        this.TableData = tableData;
        this.Tag = "table";
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

                if (this.TableData.ColumnEditable[j]) {
                    res += '<td>';
                    let tempInput = new Input(this.TableData.ColumnType[j]);
                    tempInput.Id = 'b' + this.TableData.Id + '-r' + (i - 1).toString() + '-c' + j + '-';
                    res += tempInput.ToHtmlObject(this.TableData.Row[i].Column[j]);
                }
                else {
                    res += '<td><div id="';
                    res += 'b' + this.TableData.Id + '-r' + (i - 1).toString() + '-c' + j + '-';
                    res += '" class="styled-div">' + this.TableData.Row[i].Column[j] + '</div>';
                }

                res += '</td>';
            }
            res += '</tr>';
        }
        if (this.TableData.LastRow.Column.length > 0) {
            res += '<tr>';
            for (let i = 0; i < this.TableData.LastRow.Column.length; i++) {
                res += '<td';
                if (i < this.TableData.LastRow.Column.length - 1 && this.TableData.LastRow.Column[i + 1] === " ") { res += ' style="border-right:0px solid #009879;"'; }
                res += '><div id="';
                res += 'b' + this.TableData.Id + '-r' + (this.TableData.Row.length - 1).toString() + '-c' + i + '-';
                res += '" class="sum-field"';
                if (i > 0 && i < this.TableData.LastRow.Column.length - 4) {
                    res += ' data-can-style="false"'
                }

                res += '>' + this.TableData.LastRow.Column[i] + '</div></td>';
            }
            res += '</tr>';
        }
        res += '</tbody>';
        res += '</table>';
        return res;
    }
}