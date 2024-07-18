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
                res += '<td>';
                if (j == 0) {
                    let tempSpan = new Span();
                    res += tempSpan.ToHtmlObject(this.TableData.Row[i].Column[j]);
                }
                else {
                    let tempInput = new Input();
                    res += tempInput.ToHtmlObject(this.TableData.Row[i].Column[j]);
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