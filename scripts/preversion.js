const fs = require("fs");
const path = require("path");

const CURRENT_VERSION = process.env.npm_old_version;
const NEW_VERSION = process.env.npm_new_version;

const manifestPath = path.resolve(__dirname, "../public/manifest.json");

fs.readFile(manifestPath, "utf8", function (err, data) {
  if (err) {
    return console.log(err);
  }

  const currentVersionRegex = new RegExp(CURRENT_VERSION, "g");
  const result = data.replace(currentVersionRegex, NEW_VERSION);

  fs.writeFile(manifestPath, result, "utf8", function (err) {
    if (err) return console.log(err);
  });
});
