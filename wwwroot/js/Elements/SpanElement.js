import { BaseElement } from "./BaseElement.js";

export class Span extends BaseElement {
    constructor() {
        super();
        this.Tag = 'span';
        this.Style = 'border: none;padding: 12px 10%;outline: none;background-color: inherit; min-width: 20px; width:80%;';
    }

    ToHtmlObject(content="") {
        return this.AddTag(content);
    }
}