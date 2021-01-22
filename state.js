class State {
    
    constructor(init) {
        this.params = new URLSearchParams(init);

        var self = this;
        document.addEventListener('DOMContentLoaded', () => self.save());
    }

    save() {
        
    }

    add(key, value) {
        if(this.params.has(key)) {
            this.params.set(key, value);
        } else {
            this.params.append(key, value);
        }

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