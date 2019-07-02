import {EditorState, Plugin} from 'prosemirror-state'
import {EditorView, Decoration, DecorationSet} from 'prosemirror-view'
import {Schema, DOMParser} from 'prosemirror-model'
import {schema as basicSchema} from 'prosemirror-schema-basic'
import {addListNodes} from 'prosemirror-schema-list'
import {exampleSetup} from 'prosemirror-example-setup'

@CustomElement('text-editor')
class TextEditor extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        const schema = new Schema({
            nodes: addListNodes(basicSchema.spec.nodes, 'paragraph block*', 'block'),
            marks: basicSchema.spec.marks
        });

        const self = this;
        this.editor = new EditorView(self, {
            state: EditorState.create({
                doc: DOMParser.fromSchema(schema).parse(document.createTextNode('')),
                plugins: exampleSetup({schema}).concat([new WordCountDisplay()])
            }),

            dispatchTransaction(tx) {
                let newState = this.state.apply(tx);
                this.updateState(newState);

                self.dispatchEvent(new CustomEvent('document-change', {
                        detail: newState.doc.content.toJSON()
                    })
                )
            }
        });
    }


}

class WordCountDisplay extends Plugin {
    constructor() {
        super({props: {decorations: WordCountDisplay.decorations}});
    }

    static decorations({doc}) {
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

function CustomElement(name) {
    return function (target) {
        window.customElements.define(name, target);
    }
}

export default TextEditor;
