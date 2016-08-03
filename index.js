var /**
     * @private
     * @type {Object}
     */
    db = require('./db.json'),
    /**
     * @private
     * @const
     * @type {String}
     */
    SEP = '/';

module.exports = {
    /**
     * Attempts to guess the format by analysing mime type and not a db lookup
     *
     * @param {String} mime - contentType header value
     *
     * @returns {Object} 
     */
    guess: function (mime) {
        var match = mime.match(/(jsonp|json|[a-z]{1,2}ml|script)/),
            format = match && match[1];

        return format ? {
            type: 'text',
            format: format,
            guessed: true
        } : { // default is `raw` for all unknown stuff
            type: (mime = mime.split(SEP)) && mime[0],
            format: 'raw',
            guessed: true
        };
    },
    /**
     * @param {String} mime - contentType header value
     * @returns {Object}
     */
    lookup: function mimeFormatLookup (mime) {
        return mime && (mime = String(mime)) && (mime = mime.replace(/^\s*?([^;\s]+).*$/g, '$1')) && db[mime] || 
            module.exports.guess(mime);
    }
};
