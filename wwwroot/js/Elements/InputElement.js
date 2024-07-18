import { BaseElement } from "./BaseElement.js";

export class Input extends BaseElement {
    Type;
    constructor() {
        super();
        this.Type = "";
    }

    ToHtmlObject(content = "") {
        return '<input type="text" value="' + content+'">';
    }
}