console.log('API OK')
const IS_LOCAL = false;
const HOST = IS_LOCAL ? 'http://lpython.dev' : 'http://ec2-13-58-190-26.us-east-2.compute.amazonaws.com'

var qs = params => Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');

var API = {
    jwtToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6IiIsInVzZXJuYW1lIjoibW9rYSIsImV4cCI6MTQ5OTk1NTE3NCwib3JpZ19pYXQiOjE0OTczNjMxNzR9.xxQpUsRnFbgYv9wTkl5stFkQvmzuCTeLMCNoURhRhnc',
    _fetch: function (url, options) {
        if (options && options.headers)
            var headers = options.headers;
        else
            var headers = {};

        if (typeof this.jwtToken !== 'undefined')
            headers["Authorization"] = "JWT " + this.jwtToken;

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
    logOut: function () {
        this.jwtToken = undefined;
        return Promise.resolve();
    },
    addCollaborator: function (email) {
        return this._fetch(HOST + '/users/invite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email
            })

        });
    },
    getPresentationInfo: function (id) {
        return this._fetch(HOST + '/presentations/' + id);
    },
    deletePresentation: function (id) {
        return this._fetch(HOST + '/presentations/' + id, {
            method: 'DELETE'
        });
    },
    renamePresentation: function (newname, id) {
        return this._fetch(HOST + '/presentations/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: newname
            })

        });
    },
    search: function (q) {
        return this._fetch(HOST + '/slides/?q=' + encodeURIComponent(q));
    },
    searchP: function (q) {
        return this._fetch(HOST + '/presentations/?q=' + encodeURIComponent(q));
    },
    getPresentations: function () {
        return this._fetch(HOST + '/presentations/');
    },
    addTagToSlide: function (tag, id) {
        return this._fetch(HOST + '/slides/' + id + '/tags', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'add',
                tag: tag
            })
        });
    },
    importPresentation: function (title, comment, tags, file) {
        var data = new FormData()
        data.append('file', file);
        data.append('title', title);
        data.append('comment', comment);

        return this._fetch(HOST + '/presentations/', {
            method: 'POST',
            
            body: data
        }).then(function(res) {
            console.log('composition new ok',res)
            
            var tagPromises = tags.map((tag) =>                 this.addTagToPresentation(tag,res.id)
                );
            
            return Promise.all(tagPromises);
        });

    },
    addTagToPresentation: function (tag, id) {
        return this._fetch(HOST + '/presentations/' + id + '/tags', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'add',
                tag: tag
            })
        });
    },
    removeTagFromSlide: function (tag, id) {
        return this._fetch(HOST + '/slides/' + id + '/tags', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'delete',
                tag: tag
            })
        });
    },
    removeTagFromPresentation: function (tag, id) {
        return this._fetch(HOST + '/presentations/' + id + '/tags', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'delete',
                tag: tag
            })
        });
    },
    signUp: function (lastname, firstname, email, password, password_confirm) {
        return this._fetch(HOST + '/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name: firstname,
                last_name: lastname,
                username: email,
                password
            })
        });
    },
    logIn: function (email, password) {
        return this._fetch(HOST + '/api-token-auth/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: qs({
                username: email,
                password
            })
        }).then((res) => {
            this.jwtToken = res.token;
            return res;
        })
    }
}