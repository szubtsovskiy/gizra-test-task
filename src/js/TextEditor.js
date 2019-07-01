import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {Schema, DOMParser} from "prosemirror-model"
import {schema} from "prosemirror-schema-basic"
import {addListNodes} from "prosemirror-schema-list"
import {exampleSetup} from "prosemirror-example-setup"

@CustomElement('text-editor')
class TextEditor extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        console.log('TextEditor init...');

        const mySchema = new Schema({
            nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
            marks: schema.spec.marks
        });

        const content = document.createElement('div');
        this.appendChild(content);

        this.editor = new EditorView(this, {
            state: EditorState.create({
                doc: DOMParser.fromSchema(mySchema).parse(content),
                plugins: exampleSetup({schema: mySchema})
            })
        });
    }


}

function CustomElement(name) {
    return function (target) {
        window.customElements.define(name, target);
    }
}

export default TextEditor;
