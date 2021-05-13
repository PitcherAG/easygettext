const Pofile = require('pofile');
const {MARKER_NO_CONTEXT} = require('./constants.js');

function lineNumToString(withLineNumbers = false) {
  return (withLineNumbers && this.line)
    ? `${ this.file }:${ this.line }`
    : this.file;
}

function toPoItem(withLineNumbers = false) {
  let poItem = new Pofile.Item();

  poItem.msgid = this.msgid;
  poItem.msgid_plural = this.plural;
  poItem.references = [ this.reference.toString(withLineNumbers) ];
  poItem.msgctxt = this.msgctxt === MARKER_NO_CONTEXT ? null : this.msgctxt;
  poItem.msgstr = [];

  return poItem;
}

function getTextEntries(filename, textEntries) {
  return textEntries.map((entry) => {
    return Object.assign(
      {},
      {
        reference: {
          file: filename,
          line: entry.token.loc.start.line,
          toString: lineNumToString,
        },
        msgctxt: MARKER_NO_CONTEXT,
        toPoItem,
      },
      entry.data,
    );
  });
}

const findTextEntriesInXmlExpression = (exp) =>
  (exp.match(/'(.*?)'/g) || []) // single quotes
    .concat(exp.match(/`(.*?)`/g) || []) // backticks
    .concat(exp.match(/"(.*?)"/g) || []) // double quotes
    .reduce((acc, m) => {
      if (/^[^a-zA-Z0-9]+$/.test(m)) return acc; // filter out matches that are only special characters

      acc.push(m.slice(1, m.length - 1)); // drop single quotes, backticks or double quotes from text

      return acc;
    }, []);

module.exports = {
  getTextEntries,
  findTextEntriesInXmlExpression,
};
