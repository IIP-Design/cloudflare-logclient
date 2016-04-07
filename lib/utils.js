var url = require('url');
var _ = require('underscore');

module.exports = {
  makeArgsObject: function(args, callback, required) {
    /**
      * Converts array of args to an object, making sure all required keys are present.
      * Throws an error if all required not present.
      * @param array args - array of passed command line arguments
      * @param function callback - callback that confirms all required command line args
      * have been passed
      * @param array required - an array of required command line arguments
      * @return object argObj - all required command line arguments
      */
    var len = args.length;
    var argsObj = {};
    var splitted;
    var i;

    if (typeof callback !== 'function') {
      throw new Error('You must provide a callback');
    }

    for (i = 0; i < len; i++) {
      splitted = args[i].split('=');
      argsObj[splitted[0]] = splitted[1];
    }

    return callback(required, argsObj);
  },

  checkRequired: function(required, argsObj) {
    /**
      * Checks that args object keys are found in the required array
      * @param {array} required - items to check obj keys against
      * @param {object} args - object with keys passed to the command line
      */

    var intersected = _.intersection(required, Object.keys(argsObj));

    if (required.length === intersected.length) {
      return argsObj;
    }

    throw new Error('Missing command line argument');
  },

  buildUrl: function(argsObj, callback) {
    /**
      * Builds a url string from the passed arguments
      * @param {object} arguments passed from the command line
      * @param {function} callback to generate the url query string
      */
    if (typeof callback !== 'function') {
      throw new Error('You must provide a callback');
    }

    var urlObj = {
      protocol: 'https:',
      slashes: true,
      host: 'api.cloudflare.com',
      pathname: 'client/v4/zones/' + argsObj.zone + '/logs/requests',
      query: callback(argsObj)
    };

    return url.format(urlObj);
  },

  buildQuery: function(argsObj) {
    /**
      * Builds the query string from the arguments passed from the command line
      * @param {object} arguments passed from the command line
      */
    if (_.contains(Object.keys(argsObj), 'count')) {
      return {
        start: argsObj.start,
        end: argsObj.end,
        count: argsObj.count
      };
    }

    return {
      start: argsObj.start,
      end: argsObj.end
    };
  },

  processArgs: function(argsArray, requiredArray) {
    /**
      * Processes the command line arguments by pulling all the other functions from this module together.
      * @param {array} arguments passed from the command line
      * @param {array} list of required keys
      * @return {object} required key, value pairs
      */
    var argsObj = this.makeArgsObject(argsArray, this.checkRequired, requiredArray);
    var builtUrl = this.buildUrl(argsObj, this.buildQuery);
    argsObj.url = builtUrl;
    return argsObj;
  }
};
