var fs = require('fs');
var request = require('request');

module.exports = {
  init: function(args) {
    /**
      * Generate an options object to be passed to this.connect
      * @param {object} argument passed from the command line
      * @return {object} options object
      */
    var options = {
      url: args.url,
      headers: {
        'X-Auth-Email': args.email,
        'X-Auth-Key': args.key,
        'Content-Type': 'application/json',
        'Accept-encoding': 'gzip'
      }
    };
    return options;
  },

  connect: function(options) {
    /**
      * Send an http GET request to Cloudflare's api
      * @param {object} options object to be passed to the request library
      * @return {function} immediately returns the request
      */
    return request(options).on('response', function callback(response) {
      try {
        if (response.statusCode !== 200) {
          var msg = 'Cloudflare responded with a ' + response.statusCode + ' status code.';
          throw new Error(msg);
        }
      } catch (error) {
        console.log(error);
      }
    }).on('error', function callback(error) {
      try {
        throw error;
      } catch (err) {
        console.log(err);
      }
    });
  },

  download: function(options, destination) {
    /**
      * Orchestrates the connection to CloudFlare and writes the response to disk
      * @param {object} options object to be passed to the request library
      * @param {string} optional path to a gziped file
      */
    var now = Date.now();

    try {
      if (destination === undefined) {
        var dest = 'logs_' + now + '.json.gz';
      } else {
        var dest = destination;
      }
    } catch (err) {
      console.log(err);
    }

    // Create the writeStream
    var writeStream = fs.createWriteStream(dest);

    writeStream.on('error', function callback(err) {
      console.log(err);
    });

    // Connect to CloudFlare and write the logs to the writeStream
    this.connect(options).pipe(writeStream);
  }
};
