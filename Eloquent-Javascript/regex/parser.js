const fs = require("fs");
const path = require("path");

const parseINI = (ini) => {
  const config = {};
  let section = config;
  ini.split(/\r?\n/).forEach(line => {
    let match;
    if (match = line.match(/^(\w+)=(.*)$/)) {
      section[match[1]] = match[2];
    } else if (match = line.match(/\[(.*)\]/)) {
      section = (config[match[1]] = {});
    } else if (!/^\s*(;.*)?$/.test(line)) {
      throw new Error(`Line ${line} is not valid`);
    }
  });
  return config;
};

const ini = fs
  .readFileSync(path.resolve(__dirname, "./config.ini"))
  .toString();

const config = parseINI(ini);
console.log(JSON.stringify(config, null, 2));
/*=>
{
  "searchengine": "https://duckduckgo.com/?q=$1",
  "spitefulness": "9.7",
  "larry": {
    "fullname": "Larry Doe",
    "type": "kindergarten bully",
    "website": "http://www.geocities.com/CapeCnaveral/11451"
  },
  "davaeorn": {
    "fullname": "Davaeorn",
    "type": "evil wizard"
  }
}
*/