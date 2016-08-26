/**
 * Created by bilal on 8/26/2016.
 */
//Lets require/import the HTTP module
var http = require('http');
var url = require('url');
var request = require('request');
var when = require('when');

//Lets define a port we want to listen to
var PORT = process.env.npm_config_port ? process.env.npm_config_port : 9090;

//We need a function which handles requests and send response
function handleRequest(request, response) {
    try {
        var currentUrl = url.parse(request.url); //currentUrl.pathname
        if (currentUrl.pathname == "/I/want/title") {

            notFoundErrorResponse({
                message: "Not Found"
            }, response);
            return
        }
        var websiteList = parseQuery(request.url);
    }catch (e){
        errorResponse(e, response);
        return
    }
    webSiteFinder(websiteList.address, function(error, results) {
        if (error) {
            errorResponse(error, response);
            return
        }
        try {
            finalResponse(response, results);
        }catch (e){
            errorResponse(e, response);
        }
        return
    });

}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function() {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});

// Load the website and parse the title.
function webSiteFinder(addr, cb) {
    try {
        var address = [];
      //  console.log(typeof(addr))
        if (addr == undefined || addr == null) {
            var error = new Error('Invalid Query');
            cb(error, null);
            return
        }
        if (typeof(addr) == "string") {
            address.push(addr);
        } else {
            address = addr;
        }
        var results = [];
        var itemProcessed = 0;
    }catch (e){
        cb(e, null);
    }
    if (address.length > 0) {
        address.forEach(function(item, index){
            /*
            * Promises control flow using when.js
            * */
            pageLoader(item).then(function(data){
                try {
                    itemProcessed++;
                    results.push(data);
                    if (itemProcessed == address.length) {
                        cb(null, results);
                        return
                    }
                }catch (e){
                    cb(e, null);
                    return
                }

            });
        })

    } else {
        var error = new Error('Invalid Query');
        cb(error, null);
        return
    }
}


// parsing query appended in the url. response will be an array
function parseQuery(_url) {
    var parsed = url.parse(_url, true, false),
        query = Object.keys(parsed.query),
        result = {};
    if (query.length > 0) {
        query.forEach(function(key) {
            if (key.match(/([^\[]+)\[([^\]]+)\]/g)) {
                key.replace(/([^\[]+)\[([^\]]+)\]/g, function($0, $1, $2) {
                    result[$1] = result[$1] || {};
                    result[$1][$2] = parsed.query[key];
                });
            } else {
                result[key] = parsed.query[key];
            }
        });
    }
    return result;
};

// send error if any occur
function errorResponse(err, response) {
    response.writeHead(200, {
        "Content-Type": "text/plain"
    });
    response.write(err.message);
    response.end();
    return
}

// send 404 error if not desired url
function notFoundErrorResponse(err, response) {
    response.writeHead(404, {
        "Content-Type": "text/plain"
    });
    response.write(err.message);
    response.end();
    return
}

// prepare final and success response.
function finalResponse(response, results) {
        response.writeHead(200, {
            "Content-Type": "text/html"
        });
        response.write("<!DOCTYPE html>");
        response.write("<html>");
        response.write("<head>");
        response.write("</head>");
        response.write("<body>");
        response.write("<h1> Following are the titles of given websites: </h1>");
        response.write("<ul>");

        results.forEach(function(item, index) {
            response.write("<li>" + item.address + " - " + item.title + "</li>");
            if (index == results.length - 1) {
                response.write("</ul>");
                response.write("</body>");
                response.write("</html>");
                response.end();
                return
            }
        });
}


function pageLoader(item) {
    try {
        var deferred = when.defer();
        var result = {};
        if (item.indexOf("www") == -1) {
            item = "http://www." + item;
        } else if (item.indexOf("http://") == -1) {
            item = "http://" + item;
        }
    }catch(e){
        var error =  {
            address: item,
            title: e.message + e.type
        };
        deferred.resolve(error);
    }
        // asynchronous call.
        request.get(item, function (err, res) { // calling url to get title
            if (err) {
                result = {
                    address: item,
                    title: err.message
                };

            } else {
                try {
                    var re = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/gi;
                    var match = re.exec(res.body);
                    if (match && match[2]) {
                       // console.log(match[2]);
                        result = {
                            address: item,
                            title: match[2]
                        };
                    }
                }catch (e){
                    var error =  {
                        address: item,
                        title: e.message + e.type
                    };
                    deferred.resolve(error);

                }

            }

            deferred.resolve(result);

        });

        return deferred.promise;

}