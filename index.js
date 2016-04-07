var cloudflare = require('./lib/cloudflare');
var utils = require('./lib/utils');
var argsArray = process.argv.slice(2);

var requiredArgs = ['email', 'key', 'zone', 'start', 'end'];
var args = utils.processArgs(argsArray, requiredArgs);
var options = cloudflare.init(args);

cloudflare.download(options, args.destination);
