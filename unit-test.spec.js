var expect = require('expect.js');

describe('lookup', function () {
    var mimeFormat = require('./index.js');

    describe('edge case', function () {
        it('handles handle undefined mime with raw format', function () {
            var mime = mimeFormat.lookup();
            expect(mime).have.property('type', 'unknown');
            expect(mime).have.property('format', 'raw');
            expect(mime).have.property('guessed', true);
            expect(mime).have.property('orphan', true);
        });

        it('handles handle blank mime with raw format', function () {
            var mime = mimeFormat.lookup('');
            expect(mime).have.property('type', 'unknown');
            expect(mime).have.property('format', 'raw');
            expect(mime).have.property('guessed', true);
            expect(mime).have.property('orphan', true);
        });

        it('handles uppercase headers', function () {
            var mime = mimeFormat.lookup('Application/Pdf');
            expect(mime).have.property('type', 'embed');
            expect(mime).have.property('format', 'pdf');
            expect(mime).not.have.property('guessed');
        });

        it('handles normal charset', function () {
            var mime = mimeFormat.lookup('application/unknown-stream; charset=utf8');
            expect(mime).have.property('type', 'application');
            expect(mime).have.property('format', 'raw');
            expect(mime).have.property('guessed', true);
        });

        it('handles malformed charset', function () {
            var mime = mimeFormat.lookup('application/pdf  ; charset = text/utf8');
            expect(mime).have.property('type', 'embed');
            expect(mime).have.property('format', 'pdf');
            expect(mime).not.have.property('guessed');
            expect(mime).have.property('source', 'application/pdf');
        });

        it('handles untrimmed boundary whitespaces', function () {
            var mime = mimeFormat.lookup('  application/pdf  ; charset = text/utf8');
            expect(mime).have.property('type', 'embed');
            expect(mime).have.property('format', 'pdf');
            expect(mime).not.have.property('guessed');
            expect(mime).have.property('source', 'application/pdf');
        });

        it('handles untrimmed internal whitespaces outside db', function () {
            var mime = mimeFormat.lookup('application / grooscript');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'script');
            expect(mime).have.property('guessed', true);
            expect(mime).have.property('source', 'application/grooscript');
        });

        it('removes unwanted spaces before referring db', function () {
            var mime = mimeFormat.lookup('application / xml');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'xml');
            expect(mime).not.have.property('guessed');
            expect(mime).have.property('source', 'application/xml');
        });

        it('unknown bases return as "unknown"', function () {
            var mime = mimeFormat.lookup('somebase/no-subtype');
            expect(mime).have.property('type', 'unknown');
            expect(mime).have.property('format', 'raw');
            expect(mime).have.property('guessed');
            expect(mime).have.property('orphan', true);
        });
    });

    describe('sanity', function () {
        it('"text/pdf"', function () {
            var mime = mimeFormat.lookup('text/pdf');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'plain');
            expect(mime).have.property('guessed', true);
        });

        it('"text/plain"', function () {
            var mime = mimeFormat.lookup('text/plain');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'plain');
            expect(mime).have.property('guessed', true);
        });

        it('"text/xml"', function () {
            var mime = mimeFormat.lookup('text/xml');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'xml');
            expect(mime).have.property('guessed', true);
        });

        it('"text/hodor+mxml"', function () {
            var mime = mimeFormat.lookup('text/hodor+mxml');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'xml');
            expect(mime).have.property('guessed', true);
        });

        it('"application/json"', function () {
            var mime = mimeFormat.lookup('application/json');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'json');
            expect(mime).not.have.property('guessed');
        });

        it('"application/some+javascript"', function () {
            var mime = mimeFormat.lookup('application/some+javascript');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'script');
            expect(mime).have.property('guessed', true);
        });

        it('"application/some+vml"', function () {
            var mime = mimeFormat.lookup('application/some+vml');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'vml');
            expect(mime).have.property('guessed', true);
        });

        it('"application/some+vml"', function () {
            var mime = mimeFormat.lookup('application/some+vml');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'vml');
            expect(mime).have.property('guessed', true);
        });

        it('"audio/some+vmll"', function () {
            var mime = mimeFormat.lookup('audio/some+vml');
            expect(mime).have.property('type', 'audio');
            expect(mime).have.property('format', 'audio');
            expect(mime).have.property('guessed', true);
        });

        it('"image/some+vmll"', function () {
            var mime = mimeFormat.lookup('image/some+vml');
            expect(mime).have.property('type', 'image');
            expect(mime).have.property('format', 'image');
            expect(mime).have.property('guessed', true);
        });

        it('"application/pdf"', function () {
            var mime = mimeFormat.lookup('application/pdf');
            expect(mime).have.property('type', 'embed');
            expect(mime).have.property('format', 'pdf');
            expect(mime).not.have.property('guessed');
        });

        it('"application/xml"', function () {
            var mime = mimeFormat.lookup('application/xml');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'xml');
            expect(mime).not.have.property('guessed');
        });
    });

    describe("application autocompletes", function () {
        it("application/atom+xml", function () {
            var mime = mimeFormat.lookup('application/atom+xml');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'xml');
            expect(mime).not.have.property('guessed');
        });
        it("application/ecmascript", function () {
            var mime = mimeFormat.lookup('application/ecmascript');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'script');
            expect(mime).not.have.property('guessed');
        });
        it("application/json", function () {
            var mime = mimeFormat.lookup('application/json');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'json');
            expect(mime).not.have.property('guessed');
        });
        it("application/javascript", function () {
            var mime = mimeFormat.lookup('application/javascript');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'script');
            expect(mime).not.have.property('guessed');
        });
        it("application/ogg", function () {
            var mime = mimeFormat.lookup('application/ogg');
            expect(mime).have.property('type', 'audio');
            expect(mime).have.property('format', 'ogg');
            expect(mime).not.have.property('guessed');
        });
        it("application/rdf+xml", function () {
            var mime = mimeFormat.lookup('application/rdf+xml');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'xml');
            expect(mime).not.have.property('guessed');
        });
        it("application/rss+xml", function () {
            var mime = mimeFormat.lookup('application/rss+xml');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'xml');
            expect(mime).not.have.property('guessed');
        });
        it("application/soap+xml", function () {
            var mime = mimeFormat.lookup('application/soap+xml');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'xml');
            expect(mime).not.have.property('guessed');
        });
        it("application/xhtml+xml", function () {
            var mime = mimeFormat.lookup('application/xhtml+xml');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'xml');
            expect(mime).not.have.property('guessed');
        });

        // need to add in db
        it("application/octet-stream", function () {
            var mime = mimeFormat.lookup('application/octet-stream');
            expect(mime).have.property('type', 'application');
            expect(mime).have.property('format', 'raw');
            expect(mime).have.property('guessed');
        });
        it("application/pdf", function () {
            var mime = mimeFormat.lookup('application/pdf');
            expect(mime).have.property('type', 'embed');
            expect(mime).have.property('format', 'pdf');
            expect(mime).not.have.property('guessed');
        });
        it("application/postscript", function () {
            var mime = mimeFormat.lookup('application/postscript');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'script');
            expect(mime).have.property('guessed');
        });
        it("application/font-woff", function () {
            var mime = mimeFormat.lookup('application/font-woff');
            expect(mime).have.property('type', 'application');
            expect(mime).have.property('format', 'raw');
            expect(mime).have.property('guessed');
        });
        it("application/x-yaml", function () {
            var mime = mimeFormat.lookup('application/x-yaml');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'yaml');
            expect(mime).have.property('guessed');
        });
        it("application/xml", function () {
            var mime = mimeFormat.lookup('application/xml');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'xml');
            expect(mime).not.have.property('guessed');
        });
        it("application/xml-dtd", function () {
            var mime = mimeFormat.lookup('application/xml-dtd');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'xml');
            expect(mime).not.have.property('guessed');
        });
        it("application/xop+xml", function () {
            var mime = mimeFormat.lookup('application/xop+xml');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'xml');
            expect(mime).not.have.property('guessed');
        });
        it("application/zip", function () {
            var mime = mimeFormat.lookup('application/zip');
            expect(mime).have.property('type', 'application');
            expect(mime).have.property('format', 'raw');
            expect(mime).have.property('guessed');
        });
        it("application/gzip", function () {
            var mime = mimeFormat.lookup('application/gzip');
            expect(mime).have.property('type', 'application');
            expect(mime).have.property('format', 'raw');
            expect(mime).have.property('guessed');
        });
        it("application/graphql", function () {
            var mime = mimeFormat.lookup('application/graphql');
            expect(mime).have.property('type', 'application');
            expect(mime).have.property('format', 'raw');
            expect(mime).have.property('guessed');
        });
        it("audio/basic", function () {
            var mime = mimeFormat.lookup('audio/ogg');
            expect(mime).have.property('type', 'audio');
            expect(mime).have.property('format', 'audio');
            expect(mime).have.property('guessed');
        });
        it("audio/L24", function () {
            var mime = mimeFormat.lookup('audio/L24');
            expect(mime).have.property('type', 'audio');
            expect(mime).have.property('format', 'audio');
            expect(mime).have.property('guessed');
        });
        it("audio/mp4", function () {
            var mime = mimeFormat.lookup('audio/mp4');
            expect(mime).have.property('type', 'audio');
            expect(mime).have.property('format', 'audio');
            expect(mime).have.property('guessed');
        });
        it("audio/mpeg", function () {
            var mime = mimeFormat.lookup('audio/mpeg');
            expect(mime).have.property('type', 'audio');
            expect(mime).have.property('format', 'audio');
            expect(mime).have.property('guessed');
        });
        it("audio/ogg", function () {
            var mime = mimeFormat.lookup('audio/ogg');
            expect(mime).have.property('type', 'audio');
            expect(mime).have.property('format', 'audio');
            expect(mime).have.property('guessed');
        });
        it("audio/vorbis", function () {
            var mime = mimeFormat.lookup('audio/vorbis');
            expect(mime).have.property('type', 'audio');
            expect(mime).have.property('format', 'audio');
            expect(mime).have.property('guessed');
        });
        it("audio/vnd.rn-realaudio", function () {
            var mime = mimeFormat.lookup('audio/vnd.rn-realaudio');
            expect(mime).have.property('type', 'audio');
            expect(mime).have.property('format', 'audio');
            expect(mime).have.property('guessed');
        });
        it("audio/vnd.wave", function () {
            var mime = mimeFormat.lookup('audio/ogvnd.waveg');
            expect(mime).have.property('type', 'audio');
            expect(mime).have.property('format', 'audio');
            expect(mime).have.property('guessed');
        });
        it("audio/webm", function () {
            var mime = mimeFormat.lookup('audio/webm');
            expect(mime).have.property('type', 'audio');
            expect(mime).have.property('format', 'audio');
            expect(mime).have.property('guessed');
        });
        it("image/gif", function () {
            var mime = mimeFormat.lookup('image/gif');
            expect(mime).have.property('type', 'image');
            expect(mime).have.property('format', 'image');
            expect(mime).have.property('guessed');
        });
        it("image/jpeg", function () {
            var mime = mimeFormat.lookup('image/jpeg');
            expect(mime).have.property('type', 'image');
            expect(mime).have.property('format', 'image');
            expect(mime).have.property('guessed');
        });
        it("image/pjpeg", function () {
            var mime = mimeFormat.lookup('image/pjpeg');
            expect(mime).have.property('type', 'image');
            expect(mime).have.property('format', 'image');
            expect(mime).have.property('guessed');
        });
        it("image/png", function () {
            var mime = mimeFormat.lookup('image/png');
            expect(mime).have.property('type', 'image');
            expect(mime).have.property('format', 'image');
            expect(mime).have.property('guessed');
        });
        it("image/svg+xml", function () {
            var mime = mimeFormat.lookup('image/svg+xml');
            expect(mime).have.property('type', 'image');
            expect(mime).have.property('format', 'image');
            expect(mime).have.property('guessed');
        });
        it("image/tiff", function () {
            var mime = mimeFormat.lookup('image/tiff');
            expect(mime).have.property('type', 'image');
            expect(mime).have.property('format', 'image');
            expect(mime).have.property('guessed');
        });
        it("message/http", function () {
            var mime = mimeFormat.lookup('message/http');
            expect(mime).have.property('type', 'message');
            expect(mime).have.property('format', 'raw');
            expect(mime).have.property('guessed');
        });
        it("message/imdn+xml", function () {
            var mime = mimeFormat.lookup('message/imdn+xml');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'xml');
            expect(mime).not.have.property('guessed');
        });
        it("message/partial", function () {
            var mime = mimeFormat.lookup('message/partial');
            expect(mime).have.property('type', 'message');
            expect(mime).have.property('format', 'raw');
            expect(mime).have.property('guessed');
        });
        it("message/rfc822", function () {
            var mime = mimeFormat.lookup('message/rfc822');
            expect(mime).have.property('type', 'message');
            expect(mime).have.property('format', 'raw');
            expect(mime).have.property('guessed');
        });
        it("multipart/mixed", function () {
            var mime = mimeFormat.lookup('multipart/mixed');
            expect(mime).have.property('type', 'multipart');
            expect(mime).have.property('format', 'raw');
            expect(mime).have.property('guessed');
        });
        it("multipart/alternative", function () {
            var mime = mimeFormat.lookup('multipart/alternative');
            expect(mime).have.property('type', 'multipart');
            expect(mime).have.property('format', 'raw');
            expect(mime).have.property('guessed');
        });
        it("multipart/related", function () {
            var mime = mimeFormat.lookup('multipart/related');
            expect(mime).have.property('type', 'multipart');
            expect(mime).have.property('format', 'raw');
            expect(mime).have.property('guessed');
        });
        it("multipart/form-data", function () {
            var mime = mimeFormat.lookup('multipart/form-data');
            expect(mime).have.property('type', 'multipart');
            expect(mime).have.property('format', 'raw');
            expect(mime).have.property('guessed');
        });
        it("multipart/signed", function () {
            var mime = mimeFormat.lookup('multipart/signed');
            expect(mime).have.property('type', 'multipart');
            expect(mime).have.property('format', 'raw');
            expect(mime).have.property('guessed');
        });
        it("multipart/encrypted", function () {
            var mime = mimeFormat.lookup('multipart/encrypted');
            expect(mime).have.property('type', 'multipart');
            expect(mime).have.property('format', 'raw');
            expect(mime).have.property('guessed');
        });
        it("text/cmd", function () {
            var mime = mimeFormat.lookup('text/cmd');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'plain');
            expect(mime).have.property('guessed');
        });
        it("text/css", function () {
            var mime = mimeFormat.lookup('text/css');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'plain');
            expect(mime).have.property('guessed');
        });
        it("text/csv", function () {
            var mime = mimeFormat.lookup('text/csv');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'plain');
            expect(mime).have.property('guessed');
        });
        it("text/html", function () {
            var mime = mimeFormat.lookup('text/html');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'html');
            expect(mime).have.property('guessed');
        });
        it("text/plain", function () {
            var mime = mimeFormat.lookup('text/plain');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'plain');
            expect(mime).have.property('guessed');
        });
        it("text/vcard", function () {
            var mime = mimeFormat.lookup('text/vcard');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'plain');
            expect(mime).have.property('guessed');
        });
        it("text/xml", function () {
            var mime = mimeFormat.lookup('text/xml');
            expect(mime).have.property('type', 'text');
            expect(mime).have.property('format', 'xml');
            expect(mime).have.property('guessed');
        });
    })
});