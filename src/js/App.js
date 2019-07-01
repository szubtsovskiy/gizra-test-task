const App = {
    get() {
        return this.instance;
    },

    set(instance) {
        this.instance = instance;
    }
};

export default App;
