export class BaseElement{
    Id;
    Name;
    Class;
    Style;
    Tag;
    Content;
    ChildList;
    constructor() {
        this.Id = "";
        this.Name = "";
        this.Class = [""];
        this.Class.pop();
        this.Style = "";
        this.Tag = "";
        this.Content = "";
        this.ChildList = [];
    }

    ToHtmlObject() {
        return "";
    }

    /**
     * 
     * @param {string} content
     * @returns
     */
    AddTag(content) {
        let res = '';
        res += '<' + this.Tag;
        if (this.Id.length > 0) { res += ' id="' + this.Id + '"'; }
        if (this.Name.length > 0) { res += ' name="' + this.Name + '"'; }
        if (this.Class.length > 0) {
            res += ' class="';
            for (let i = 0; i < this.Class.length; i++) {
                res += ' ' + this.Class[i];
            }
            res += '"';
        }
        if (this.Style.length > 0) { res += ' style="' + this.Style + '"'; }
        res += '>';
        res += content;
        res += '</' + this.Tag + '>';
        return res;
    }
}