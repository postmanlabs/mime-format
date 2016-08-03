var /**
     * @private
     * @type {Object}
     */
    db = require('./db.json'),
    /**
     * @private
     * @constacti
     * @type {String}
     */
    SEP = '/',
    /**
     * @private
     * @const
     * @type {string}
     */
    E = '';

module.exports = {
    /**
     * Attempts to guess the format by analysing mime type and not a db lookup
     *
     * @param {String} mime - contentType header value
     *
     * @returns {Object}
     */
    guess: function (mime) {
        var match,
            textFormat,
            mimeBase,
            otherFormats;

        // we now get the first part of content type and treat it as type reference
        mimeBase = (mimeBase = mime.split(SEP)) && mimeBase[0] &&
            mimeBase[0].replace(/^\s\s*/, E).replace(/\s\s*$/, E) || E;
        match = mimeBase.match(/(audio|video|image)/);
        // if we get the predictable bases, we bail out
        if (match && match[1]) {
            return {
                type: mimeBase,
                format: match[1],
                guessed: true
            };
        }

        // now we detect text format from remaining ambiguous bases
        match = mime.match(/\/[^\/]*(jsonp|json|xml|html|yaml|vml|script)/);
        textFormat = match && match[1];

        // if we see text format, we do not need to process further and return the format.
        if (textFormat || (mimeBase === 'text')) {
            return {
                type: 'text',
                format: textFormat || 'plain',
                guessed: true
            };
        }

        // we now detect other formats that are not present in base
        match = mime.match(/(audio|video|image|pdf|text)/);
        otherFormats = match && match[1];

        return { // default is `raw` for all unknown stuff
            type: mimeBase,
            format: otherFormats || 'raw',
            guessed: true,
            unknown: !(mimeBase && otherFormats)
        };
    },
    /**
     * @param {String} mime - contentType header value
     * @returns {Object}
     */
    lookup: function mimeFormatLookup (mime) {
        return (mime = String(mime).toLowerCase()) &&
            (mime = mime.replace(/^([^;]+).*$/g, '$1').replace(/\s/g, E)) && db[mime] ||
            module.exports.guess(mime);
    }
};
