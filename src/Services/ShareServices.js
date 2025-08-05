import { createApp } from "vue";

class ShareService {
    constructor() {
        this.map = new Map()
    }

    setMapValue(key, value) {
        this.map.set(key, value)
    }
    onSuccessToast(message) {
        createApp.$notify({
            type: "success",
            text: message,
        });
    }

    onErrorToast(message) {
        createApp.$notify({
            type: "error",
            text: message,
        });
    }


    getMapValue(key) {
        if (this.map.has(key)) {
            return this.map.get(key)
        } else {
            return null
        }
    }

    clearMap() {
        this.map.clear()
    }

    deleteMapValue(key) {
        if (this.map.has(key)) {
            this.map.delete(key)
        }
    }
}

export default new ShareService({
    map: new Map()
})