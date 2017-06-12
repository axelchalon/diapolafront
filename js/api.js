console.log('API OK')
var API = {
        _fetch: function (url, options) {
            var headers = new Headers();
            /* headers.append("X-JWT", "JWT_HERE"); */

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
                    return new Promise(function(resolve,reject) {
                        setTimeout(() => { resolve(response); }, 2000)       
                    })
                
                })
            }
        };