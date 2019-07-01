import { Elm } from './elm/Main.elm'
import App from './js/App';
import './js/TextEditor';


(function() {
    const root = document.createElement('div');
    document.body.appendChild(root);
    App.set(Elm.Main.init({node: root, flags: []}));
})();

