var fs = require('fs');
var glob = require('glob');
var chai = require('chai');
var cloudflare = require('../lib/cloudflare.js');
var utils = require('../lib/utils');
var expect = chai.expect;


describe('utils.checkRequired', function() {
  var argsObj = {
    email: 'example@example.com',
    key: 'xxxxxxxxxxxxxxxxxx',
    zone: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    destination: 'path/to/file.gz',
    start: '1459782073620',
    end: '1459782058543',
    count: '1000'
  };

  it('should throw an error if object keys do not include all "required" array items', function() {
    var required = ['email', 'destination', 'count', 'eagle'];
    expect(function() { utils.checkRequired(required, argsObj) }).to.throw(Error);
  });

  it('should return the argsObj if object keys include all "required" array items', function() {
    var required = ['email', 'destination', 'count'];
    expect(utils.checkRequired(required, argsObj)).to.equal(argsObj);
  });
});


describe('utils.makeArgsObject', function() {
  var args = [
    'email=example@example.com',
    'key=xxxxxxxxxxxxxxxxxx',
    'zone=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'destination=path/to/file.gz',
    'start=1459782073620',
    'end=1459782058543',
    'count=1000'
  ];
  var required = ['email', 'key', 'zone', 'start', 'end'];
  var result = utils.makeArgsObject(args, utils.checkRequired, required);

  it('should parse an array and return an object with the passed options as key value pairs', function() {
    expect(Object.keys(result).length).to.equal(args.length);
    expect(result.email).to.equal('example@example.com');
    expect(result.key).to.equal('xxxxxxxxxxxxxxxxxx');
    expect(result.zone).to.equal('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    expect(result.destination).to.equal('path/to/file.gz');
    expect(result.start).to.equal('1459782073620');
    expect(result.end).to.equal('1459782058543');
    expect(result.count).to.equal('1000');
  });

  it('should throw an error if a callback is not provided', function() {
    expect(function() { utils.makeArgsObject(args, required); }).to.throw(Error);
  });

  it('should throw an error if "email" missing', function() {
    var args = [
      'key=xxxxxxxxxxxxxxxxxx',
      'zone=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      'destination=path/to/file.gz',
      'start=1459782073620',
      'end=1459782058543',
      'count=1000'
    ];
    expect(function() { utils.makeArgsObject(args, utils.checkRequired, required); }).to.throw(Error);
  });

  it('should throw an error if "key" missing', function() {
    var args = [
      'email=example@example.com',
      'zone=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      'destination=path/to/file.gz',
      'start=1459782073620',
      'end=1459782058543',
      'count=1000'
    ];
    expect(function() { utils.makeArgsObject(args, utils.checkRequired, required); }).to.throw(Error);
  });

  it('should throw an error if "zone" missing', function() {
    var args = [
      'email=example@example.com',
      'key=xxxxxxxxxxxxxxxxxx',
      'destination=path/to/file.gz',
      'start=1459782073620',
      'end=1459782058543',
      'count=1000'
    ];
    expect(function() { utils.makeArgsObject(args, utils.checkRequired, required); }).to.throw(Error);
  });

  it('should throw an error if "start" missing', function() {
    var args = [
      'email=example@example.com',
      'key=xxxxxxxxxxxxxxxxxx',
      'zone=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      'destination=path/to/file.gz',
      'end=1459782058543',
      'count=1000'
    ];
    expect(function() { utils.makeArgsObject(args, utils.checkRequired, required); }).to.throw(Error);
  });

  it('should throw an error if "end" missing', function() {
    var args = [
      'email=example@example.com',
      'key=xxxxxxxxxxxxxxxxxx',
      'zone=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      'destination=path/to/file.gz',
      'start=1459782073620',
      'count=1000'
    ];
    expect(function() { utils.makeArgsObject(args, utils.checkRequired, required); }).to.throw(Error);
  });

  it('should throw and error if all required fields are missing', function() {
    var args = [
      'destination=path/to/file.gz',
      'count=1000'
    ];
    expect(function() { utils.makeArgsObject(args, utils.checkRequired, required); }).to.throw(Error);
  });
});


describe('utils.buildQuery', function() {
  it('should return a url query object properly regardless of whether count is passed', function() {
    var argsObj = {
      email: 'example@example.com',
      key: 'xxxxxxxxxxxxxxxxxx',
      zone: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      destination: 'path/to/file.gz',
      start: '1459782073620',
      end: '1459782058543',
      count: '1000'
    };
    var argsObj2 = {
      email: 'example@example.com',
      key: 'xxxxxxxxxxxxxxxxxx',
      zone: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      destination: 'path/to/file.gz',
      start: '1459782073620',
      end: '1459782058543'
    };
    var result = utils.buildQuery(argsObj);
    var result2 = utils.buildQuery(argsObj2);

    expect(result).to.have.all.keys({ start: 'test', end: 'test', count: 'test' });
    expect(result2).to.have.all.keys({ start: 'test', end: 'test' });
  });
});


describe('utils.buildUrl', function() {
  var args = {
    email: 'example@example.com',
    key: 'xxxxxxxxxxxxxxxxxx',
    zone: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    destination: 'path/to/file.gz',
    start: '1459782073620',
    end: '1459782058543',
    count: '1000'
  };
  var result = utils.buildUrl(args, utils.buildQuery);
  var url = 'https://api.cloudflare.com/client/v4/zones/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/logs/requests?start=1459782073620&end=1459782058543&count=1000';

  it('should return an Error if a callback to build the query string is not passed', function() {
    expect(function() { utils.buildUrl(args) }).to.throw(Error);
  });

  it('should build the url from the passed arguments', function() {
    expect(result).to.equal(url);
  });

  it('should build the url if count is missing', function() {
    var args = {
      email: 'example@example.com',
      key: 'xxxxxxxxxxxxxxxxxx',
      zone: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      destination: 'path/to/file.gz',
      start: '1459782073620',
      end: '1459782058543'
    };
    var result = utils.buildUrl(args, utils.buildQuery);
    var url = 'https://api.cloudflare.com/client/v4/zones/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/logs/requests?start=1459782073620&end=1459782058543';
    expect(result).to.equal(url);
  });
});


describe('utils.processArgs', function() {
  var args = [
    'email=example@example.com',
    'key=xxxxxxxxxxxxxxxxxx',
    'zone=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'destination=path/to/file.gz',
    'start=1459782073620',
    'end=1459782058543',
    'count=1000'
  ];
  var url = 'https://api.cloudflare.com/client/v4/zones/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/logs/requests?start=1459782073620&end=1459782058543&count=1000';
  var required = ['email', 'key', 'zone', 'start', 'end'];
  var result = utils.processArgs(args, required);

  it('should return an args object with required fields checked and url built', function() {
    expect(result.email).to.equal('example@example.com');
    expect(result.key).to.equal('xxxxxxxxxxxxxxxxxx');
    expect(result.zone).to.equal('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    expect(result.destination).to.equal('path/to/file.gz');
    expect(result.start).to.equal('1459782073620');
    expect(result.end).to.equal('1459782058543');
    expect(result.count).to.equal('1000');
    expect(result.url).to.equal(url);
  });
});


describe('cloudflare.init', function() {
  var args = [
    'email=example@example.com',
    'key=xxxxxxxxxxxxxxxxxx',
    'zone=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'destination=path/to/file.gz',
    'start=1459782073620',
    'end=1459782058543',
    'count=1000'
  ];
  var required = ['email', 'key', 'zone', 'start', 'end'];
  var argsObj = utils.processArgs(args, required);
  var result = cloudflare.init(argsObj);
  var url = 'https://api.cloudflare.com/client/v4/zones/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/logs/requests?start=1459782073620&end=1459782058543&count=1000';

  it('should accept the an object of arguments and return an options object', function() {
    expect(result.url).to.equal(url);
    expect(result.headers['X-Auth-Email']).to.equal('example@example.com');
    expect(result.headers['X-Auth-Key']).to.equal('xxxxxxxxxxxxxxxxxx');
    expect(result.headers['Content-Type']).to.equal('application/json');
    expect(result.headers['Accept-encoding']).to.equal('gzip');
  });
});


describe('cloudflare.connect', function() {
  var args = [
    'email=example@example.com',
    'key=xxxxxxxxxxxxxxxxxx',
    'zone=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'destination=path/to/file.gz',
    'start=1459782073620',
    'end=1459782058543',
    'count=1000'
  ];
  var required = ['email', 'key', 'zone', 'start', 'end'];
  var argsObj = utils.processArgs(args, required);
  var options = cloudflare.init(argsObj);

  it('should connect to the cloudflare api and throw an error because the email, key, and zone are fake', function() {
    // See this discussion for why bind(): http://stackoverflow.com/a/21587239
    expect(cloudflare.connect.bind(options)).to.throw(Error);
  });
});


describe('cloudflare.download', function() {
  var args = [
    'email=example@example.com',
    'key=xxxxxxxxxxxxxxxxxx',
    'zone=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'destination=path/to/file.gz',
    'start=1459782073620',
    'end=1459782058543',
    'count=1000'
  ];
  var required = ['email', 'key', 'zone', 'start', 'end'];
  var argsObj = utils.processArgs(args, required);
  var options = cloudflare.init(argsObj);
  var destination = 'test_logs.json.gz';

  after(function() {
    glob('*.gz', function(err, files) {
      try {
        var i = 0;
        var len = files.length;

        for (; i < len; i++) {
          fs.unlink(files[i]);
        }
      } catch (error) {
        console.log(error);
      }
    });
  });

  it('should throw an error when trying to write output to a directory', function() {
    var directory = '/Users/nathankleekamp/Projects/cloudflare-logclient';
    expect(cloudflare.download.bind(options, directory)).to.throw(Error);
  });

  it('should create a file with default name "logs_1460033679360.json.gz", where 1460033679360 is unix time in milliseconds', function() {
    var now = Date.now();
    var myFiles = glob.sync('*.gz');

    // Get just the unix time from the file name and convert to number
    var time = +(myFiles.toString().split('_')[1].split('.')[0]);

    expect(time).to.be.closeTo(now, 10);
  });

  it('should create a file in a specified location with provided destination filename', function() {
    cloudflare.download(options, destination);
    expect(fs.accessSync('test_logs.json.gz', fs.F_OK)).to.be.empty;
  });
});
