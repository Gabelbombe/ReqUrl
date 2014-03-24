// mod dependencies
var http = require('http'),
    url  = require('url');

/**
 * urlReq - Wraps the http.request function making it nice for unit testing APIs.
 *
 *
 * @param  {string}   reqUrl   The required url in any form
 * @param  {object}   options  An options object (this is optional)
 * @param  {Function} cb       This is passed the 'res' object from your request
 *
 */
exports.urlReq = function(reqUrl, options, cb) {
    if("function" === typeof options){ cb = options; options = {}; } // JIC no options were passed in

    // parse url to chunks
    reqUrl = url.parse(reqUrl);

    // http.request settings
    var settings = {
        host:    reqUrl.hostname,
        port:    reqUrl.port || 80,
        path:    reqUrl.pathname,
        headers: options.headers || {},
        method:  options.method || 'GET'
    };

    console.log(settings);

    // if there are params:
    if(options.params) {
        options.params = JSON.stringify(options.params);
        settings.headers['Content-Type'] = 'application/json';
        settings.headers['Content-Length'] = options.params.length;
    }

    // MAKE THE REQUEST
    var req = http.request(settings);

    // if there are params: write them to the request
    if(options.params) { req.write(options.params) }

    // when the response comes back
    req.on('response', function(res) {
        res.body = '';
        res.setEncoding('utf-8');

        // concatenates chunks
        res.on('data', function(chunk) { res.body += chunk });

        // when the response has finished
        res.on('end', function() {

            // fire callback
            cb(res.body, res);
        });
    });

    // end the request
    req.end();
};
