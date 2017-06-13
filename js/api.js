console.log('API OK')
const IS_LOCAL = false;
const HOST = IS_LOCAL ? 'http://lpython.dev' : 'http://ec2-13-58-190-26.us-east-2.compute.amazonaws.com'

var qs = params => Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');

var API = {
    jwtToken: undefined,
    _fetch: function (url, options) {
        if (options.headers)
            var headers = options.headers;
        else
            var headers = new Headers();
        
        if (typeof this.jwtToken !== 'undefined')
            headers.append("X-JWT", this.jwtToken);

        return fetch(url, Object.assign({}, options, {
            headers: headers
        })).
        then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
    },
    getPresentationInfo: function (id) {
        // return promise...
    },
    signUp: function (lastname, firstname, email, password, password_confirm) {
        return this._fetch('http://echo.jsontest.com/key/value/one/two')
            // simulate delay
            .then((response) => {
                return new Promise(function (resolve, reject) {
                    setTimeout(() => {
                        resolve(response);
                    }, 2000)
                })

            })
    },
    logIn: function (email, password) {
        return this._fetch(HOST + '/api-token-auth/', {
            method: 'POST',
            headers: {'Content-Type':'application/x-www-form-urlencoded'},
            body: qs({username: email, password})
        }).then((res) => { this.jwtToken = res.token; return res; })
    }
}