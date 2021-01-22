class State {
    
    constructor(init) {
        this.params = new URLSearchParams(init);

        var self = this;
        document.addEventListener('DOMContentLoaded', () => self.updateDocumentLinks());
    }

    updateDocumentLinks() {
        [...document.links].forEach(link => {
            var queryString = '?' + this.toString();

            if(link.href.lastIndexOf("?") != -1) {
                link.href = link.href.replace(/\?.*/,queryString);
            } else {
                link.href += queryString;
            }

        })
    }

    add(key, value) {
        if(this.params.has(key)) {
            this.params.set(key, value);
        } else {
            this.params.append(key, value);
        }

        this.updateDocumentLinks();
    }

    remove(key) {
        this.params.delete(key);
        this.updateDocumentLinks();
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