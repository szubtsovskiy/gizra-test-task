import {EditorState, Plugin} from 'prosemirror-state'
import {EditorView, Decoration, DecorationSet} from 'prosemirror-view'
import {Schema, DOMParser} from 'prosemirror-model'
import {schema} from 'prosemirror-schema-basic'
import {addListNodes} from 'prosemirror-schema-list'
import {exampleSetup} from 'prosemirror-example-setup'

@CustomElement('text-editor')
class TextEditor extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        console.log('TextEditor init...');

        const mySchema = new Schema({
            nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
            marks: schema.spec.marks
        });

        const content = document.createElement('div');
        this.appendChild(content);

        let wordCountDisplay = new Plugin({
            props: {
                decorations({doc}) {
                    const decorations = [];
                    doc.content.forEach((node, offset) => {
                        if (node.type.name !== 'paragraph' || node.content.size === 0) {
                            return;
                        }

                        const firstChild = node.content.firstChild;
                        if (!firstChild || firstChild.type.name !== 'text') {
                            return;
                        }

                        const text = firstChild.text.trim();

                        decorations.push(Decoration.widget(offset + node.content.size + 1, () => {
                            const wordCount = document.createElement('div');
                            wordCount.className = 'widget--word-count';
                            wordCount.appendChild(document.createTextNode(`Words: ${text.split(' ').length}`));

                            return wordCount;
                        }))
                    });

                    return DecorationSet.create(doc, decorations);
                }
            }
        });

        this.editor = new EditorView(this, {
            state: EditorState.create({
                doc: DOMParser.fromSchema(mySchema).parse(content),
                plugins: exampleSetup({schema: mySchema}).concat([wordCountDisplay])
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
