import { ColumnContent, RowContent } from "../ArrayClasses.js";
export class UserDefinedProjectModel {
    Id;
    UserId;
    ProductId;
    ProjectName;
    constructor() {
        this.Id = 0;
        this.UserId = 0;
        this.ProductId = 0;
        this.ProjectName = "";
    }
       
}

export class CategorizingProjectModel {
    _id;
    UserId;
    ProductId;
    ProjectName;
    ColumnList;
    RowList;
    constructor() {
        this._id = "000000000000000000000000";
        this.UserId = 0;
        this.ProductId = 0;
        this.ProjectName = "";
        this.ColumnList = [new ColumnContent("+/", false)];
        this.RowList = [new RowContent("+/", true, 0)];
    }
}