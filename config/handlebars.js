const handlebars = require('express-handlebars');

module.exports = handlebars({
    defaultLayout: "main/default",
    layoutsDir: 'src/views',
    helpers: {
        is: function(a, b, opts) {
            if (a == b) return opts.fn(this);
            return opts.inverse(this);
        },
        section: function(name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        },
    },
    extname: '.hbs'
})