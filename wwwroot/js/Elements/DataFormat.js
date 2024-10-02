export class ContractDataSet {
    Name;
    Budget;
    Date;
    Framing_CN;
    Forming_CN;
    BuildingQty;
    InvoiceList;
    /**
     * 
     * @param {TableDataSet[]} tableList
     */
    constructor(tableList) {
        this.InvoiceList = tableList;
        this.Name = "";
        this.Budget = 0;
        this.Date = "";
        this.Forming_CN = "";
        this.Framing_CN = "";
        this.BuildingQty = 0;
    }
}

export class TableDataSet {
    Id;
    Column;
    Row;
    ColumnType;
    ColumnEditable;
    LastRow;
    constructor(id = 0) {
        this.Column = [{ Row: [] }];
        this.Row = [{ Column: [] }];
        this.Column.pop();
        this.Row.pop();
        this.Id = id;
        this.ColumnType = [""];
        this.ColumnType.pop();
        this.ColumnEditable = [true];
        this.ColumnEditable.pop();
        this.LastRow = { Column: [] };
        this.LastRow.Column.pop();
    }

    /**
     * 
     * @param {number} columnIndex
     * @param {number} rowIndex
     * @param {any} value
     */
    UpdateCell(columnIndex, rowIndex, value) {
        this.Column[columnIndex].Row[rowIndex] = value;
        this.Row[rowIndex].Column[columnIndex] = value;
    }

    /**
     * 
     * @param {any[]} dataList
     */
    AddColumn(dataList) {
        if (this.Column.length > 1) {
            if (this.Column[0].Row.length == dataList.length) {
                this.Column.push({ Row: dataList });
                return true;
            }
        }
        else {
            this.Column.push({ Row: dataList });
            return true;
        }
        return false;
    }

    /**
     * 
     * @param {any[]} dataList
     */
    AddRow(dataList) {
        if (this.Row.length > 1) {
            if (this.Row[0].Column.length == dataList.length) {
                this.Row.push({ Column: dataList });
                return true;
            }
        }
        else {
            this.Row.push({ Column: dataList });
            return true;
        }
        return false;
    }

    /**
     * 
     * @param {any[]} dataList
     */
    AddLastRow(dataList) {
        this.LastRow.Column = dataList;
    }
}

