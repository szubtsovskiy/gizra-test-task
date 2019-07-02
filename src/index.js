import { Elm } from './elm/Main.elm'
import './js/TextEditor';


(function() {
    const root = document.createElement('div');
    document.body.appendChild(root);
    Elm.Main.init({node: root, flags: []})
})();

