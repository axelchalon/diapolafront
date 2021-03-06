console.log('API OK')
const IS_LOCAL = false;
const HOST = IS_LOCAL ? 'http://lpython.dev' : 'http://ec2-13-58-190-26.us-east-2.compute.amazonaws.com'

var qs = params => Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');

window.skipskip = false;
var API = {
    jwtToken: undefined,
    _fetch: function (url, options) {
        if (options && options.headers)
            var headers = options.headers;
        else
            var headers = {};

        if (typeof this.jwtToken !== 'undefined')
            headers["Authorization"] = "JWT " + this.jwtToken;

        if (!window.skipskip) {
        app.loading = true;
            
        } else {
            window.skipskip= true;
        }
        return fetch(url, Object.assign({}, options, {
            headers: headers
        })).
        then((response) => {
            app.loading = false;
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
        window.skipskip = true;
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
        console.log('wut',file)
        var data = new FormData()
        data.append('file', file);
        data.append('title', title);
        data.append('comment', comment);

        return this._fetch(HOST + '/presentations/', {
            method: 'POST',
            
            body: data
        }).then((res) => {
            console.log('composition new ok',res)
            
            var tagPromises = tags.map((tag) =>                 this.addTagToPresentation(tag,res.id)
                );
            
            console.log('tagpromises',tagPromises)
            
            return Promise.all(tagPromises);
        });

    },
    downloadGeneratedPresentation: function (slidesx) {
        var slides = slidesx.slice(0);
        slides.reverse();
        return this._fetch(HOST + '/composition/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                slides: slides.map(slide => slide.slideId || slide.id),
                title: '',
                description: ''
            })
        });
    },
    savePresentation: function (title, comment, tags, slidesx) {
        
        var slides = slidesx.slice(0);
        slides.reverse();
        console.log('save prez',title,comment,tags,slides)
        return this._fetch(HOST + '/composition/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                description: comment,
                slides: slides.map(slide => slide.slideId || slide.id)
            })
        }).then((res) => {
            console.log('composition save ok',res)
            
            var tagPromises = tags.map((tag) =>                 this.addTagToPresentation(tag,res.id)
                );
            
            console.log('tagpromises',tagPromises)
            
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