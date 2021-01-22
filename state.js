class State {
    
    constructor(init) {
        this.params = new URLSearchParams(init);
        this.save();
    }

    save() {
        
    }

    append(key, value) {
        this.params.append(key, value);
        this.save();
    }

    remove(key) {
        this.params.delete(key);
        this.save();
    }

    has(key) {
        return this.params.has(key);
    }

    get(key) {
        return this.params.get(key);
    }

    toString() {
        return this.params.toString();
    }

}