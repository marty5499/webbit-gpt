class Cookie {
    constructor(months) {
        this.expires = new Date();
        this.expires.setMonth(this.expires.getMonth() + months);
    }

    set(key, value) {
        document.cookie = `${key}=${value};expires=${this.expires.toUTCString()}`;
    }

    get(key) {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(key + '=')) {
                return cookie.substring(key.length + 1);
            }
        }
        return '';
    }
}