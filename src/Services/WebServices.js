import axios from "axios";
import {
    useNotification
} from "@kyvg/vue3-notification";

const {
    notify
} = useNotification();

var http = null;
var latitude = 0.0;
var longitude = 0.0;
var api = null;

class WebService {
    constructor({
        // api_url = "https://nityadhanapi.winayak.com/admin/",
        //  api_url = "http://localhost:8000/admin/",
        //  api_url = "https://api.nityadhanfinance.com/admin/",
           api_url = process.env.VUE_APP_API_URL,
    }) {
        http = axios.create({
            baseURL: api_url,
        });
       
        latitude = localStorage.getItem("latitude");
        longitude = localStorage.getItem("longitude");
        this.getCurrentLocation();
    }

    webRequest({
        _method,
        _action,
        _body,
        _buttonId,
        _hide_loader
    }) {
        this.addLoader(_buttonId, _hide_loader);
        if (_method !== "undefined" && _method != "") {
            if (_method.toUpperCase() == "POST") {
                api = http
                    .post(_action, JSON.stringify(_body), {
                        headers: this.getHeader()
                    });
            } else if (_method.toUpperCase() == "PUT") {
                api = http
                    .put(_action, JSON.stringify(_body), {
                        headers: this.getHeader()
                    });
            } else if (_method.toUpperCase() == "DELETE") {
                api = http
                    .delete(_action, {
                        headers: this.getHeader()
                    });
            } else {
                let params = new URLSearchParams();
                for (let key in _body) {
                    params.set(key, _body[key]);
                }
                api = http
                    .get(_action, {
                        params: params,
                        headers: this.getHeader()
                    });
            }

            return api
                .then(response => {
                    this.removeLoader(_buttonId, _hide_loader);
                    return response.data;
                })
                .catch(e => {
                    this.removeLoader(_buttonId, _hide_loader);
                    return this._errorHandler(e);
                });
        } else {
            console.log("Method not defined. >> " + _action)
        }
    }


    getAccesstoken({_action,_body,_buttonId,_hide_loader})
    {
        this.addLoader(_buttonId, _hide_loader);
        var headers = {};
        headers["Content-Type"] = "application/json";

        return http
            .post(_action, JSON.stringify(_body), {
                headers: headers
            })
            .then(response => {
                this.removeLoader(_buttonId, _hide_loader);
                return response.data;
            })
            .catch(e => {
                this.removeLoader(_buttonId, _hide_loader);
                return this._loginErrorHandler(e);
            });
    }

    uploadImageAPI({
        _action,
        _file,
        _key,
        _body,
        _buttonId,
        _hideLoader
    }) {
        if (!_key) {
            _key = "file";
        }
        if (this.addLoader(_buttonId, _hideLoader)) {
            return;
        }
        let formData = new FormData();
        formData.append(_key, _file);
        for (let key in _body) {
            formData.append(key, _body[key]);
        }

        return http
            .post(_action, formData, {
                headers: this.getBaseHeader(),
            })
            .then((response) => {
                this.removeLoader(_buttonId, _hideLoader);
                return response.data;
            })
            .catch((e) => {
                this.removeLoader(_buttonId, _hideLoader);
                return this._errorHandler(e);
            });
    }


    _loginErrorHandler(error) {
        if (error.response != null) {
            error = error.response;
        }
        console.log("from Webservice:", error.data.message);
        var errorMessage;
        if (!error || !error.status) {
            errorMessage = "Server Not Responding";
        } else if (error.status === 400 || error.status === 404) {
            errorMessage =
                (error && error.data && error.data.message) ||
                "Invalid Username or Password";
        } else if (error.status === 500) {
            errorMessage = "Server Error";
        } else if (error.status === 423) {
            errorMessage = "Server Error";
        } else {
            errorMessage =
                (error && error.data && error.data.message) ? (error && error.data && error.data.message) : "Bad Response";
        }
        if (errorMessage) {
            notify({
                type: "error",
                text: errorMessage,
            });
            throw new Error(errorMessage);
        }
    }

    _errorHandler(error) {
        if (error.response != null) {
            error = error.response;
        }
        var errorMessage;
        if (!error || !error.status) {
            errorMessage = "Server Not Responding";
        } else if (error.status === 401) {
            errorMessage =
                (error && error.data && error.data.message) || "Bad Response";
            this.logout();
        } else if (error.status === 500) {
            errorMessage = "Server Error";
        } else if (error.status === 423) {
            if (error.data.message) {
                localStorage.setItem("get_error_code", error.data.message);
            }
        } else {
            errorMessage =
                (error && error.data && error.data.message) ? (error && error.data && error.data.message) : "Bad Response";
        }
        if (errorMessage) {
            notify({
                type: "error",
                text: errorMessage,
            });
            throw new Error(errorMessage);
        }
    }

    logout() {
        localStorage.clear();
        window.location.href = "/login";
    }

    getHeader(_headers) {
        var headers = this.getBaseHeader();
        headers["Content-Type"] = "application/json";
        headers["X-Frame-Options"] = "SAMEORIGIN";
        headers["platform"] = "WEB";

        for (let key in _headers) {
            headers[key] = _headers[key];
        }

        if (localStorage.getItem("branch_id")) {
            headers["X-BRANCH"] = localStorage.getItem("branch_id");
        } else {
            headers["X-BRANCH"] = "";
        }

        return headers;
    }
    getBaseHeader() {
        var headers = {};
        if (localStorage.getItem("access_token")) {
            headers["Authorization"] =
                "Bearer " + localStorage.getItem("access_token");
        }
        return headers;
    }

    addLoader(id, _hide_loader) {
        if (id) {
            var button = document.getElementById(id);
            if (button.disabled) {
                return true;
            }
            button.disabled = true;
            var loader = document.createElement("i");
            loader.className = "fa fa-spinner fa-spin mr-2";
            button.prepend(loader);
            return false;
        }
        if (!_hide_loader) {
            this.ajaxindicatorstart("Loading...Please Wait...!!!")
        }
    }

    removeLoader(id, _hide_loader) {
        if (id) {
            var button = document.getElementById(id);
            button.disabled = false;
            button.removeChild(button.childNodes[0]);
        }
        if (!_hide_loader) {
            this.ajaxindicatorstop()
        }
    }

    getLatitude() {
        return latitude;
    }

    getLongitude() {
        return longitude;
    }

    getCurrentLocation() {
        const success = (position) => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            localStorage.setItem("latitude", latitude);
            localStorage.setItem("longitude", longitude);
        };

        const error = (err) => {
            console.log(err);
        };
        navigator.geolocation.getCurrentPosition(success, error);
    }
    ajaxindicatorstart(text) {
        text = "";
        if (
            window.$("body")
            .find("#resultLoading")
            .attr("id") != "resultLoading"
        ) {
            window.$("body").append(
                "<div id='resultLoading' style='display:none'><div><img src='/static/img/logo.png'><div>" +
                text +
                "</div></div><div class='bg'></div></div>"
            );
        }

        window.$("#resultLoading").css({
            width: "100%",
            height: "100%",
            position: "fixed",
            "z-index": "10000000",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            margin: "auto"
        });

        // window.$('#resultLoading .bg').css({
        //   'background': '#000000',
        //   'opacity': '0.7',
        //   'width': '100%',
        //   'height': '100%',
        //   'position': 'absolute',
        //   'top': '0'
        // });

        window.$("#resultLoading>div:first").css({
            width: "550px",
            height: "-100px",
            "text-align": "center",
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            margin: "auto",
            "font-size": "16px",
            "z-index": "10",
            color: "#000000"
        });
        window.$("#resultLoading .bg").height("100%");
        window.$("#resultLoading").fadeIn(100);
        window.$("body").css("cursor", "wait");
    }
    ajaxindicatorstop() {
        window.$("#resultLoading .bg").height("100%");
        window.$("#resultLoading").fadeOut(100);
        window.$("body").css("cursor", "default");
    }
}

export default new WebService({
    // url: "https://nityadhanapi.winayak.com/admin/",
    url: process.env.VUE_APP_API_URL,
});