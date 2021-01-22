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

    replace(key, value) {
        this.params.replace(key, value);
        this.save();
    }

    remove(key) {
        this.params.delete(key);
        this.save();
    }

    has(key) {
        return this.params.has(key);
    }

    getFirst(key) {
        return this.params.get(key);
    }

    getAll(key) {
        return this.params.getAll(key);
    }

    toString() {
        return this.params.toString();
    }

}