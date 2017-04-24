#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const argv = require('minimist')(process.argv.slice(2));

// Handle flag and argument input
if (argv.h === true || !argv.f) {

  const usage = `
  parseFile.js - Read in a .txt file and catalogue the words used.

  Options:
    -f <file name> full file path and name, i.e. /home/path/to/file.txt
    -l include words not on lists in final stats (not included by default)
    -p show words used x % or more of the time

  Example:
    ./parseFile.js -f modest_proposal_raw.txt
    or
    ./parseFile.js -f modest_proposal_raw.txt -l
    or
    ./parseFile.js -f modest_proposal_raw.txt -p 5
  `;

  console.log(usage);
  process.exit(1);
}

let fileToRun;
if (argv.f) {
  fileToRun = argv.f;
}
let includeUnlistedWords = false;
if (argv.l) {
  includeUnlistedWords = true;
}
let showOftenUsedWords = false;
let percentUsed = 0;
if (argv.p) {
  showOftenUsedWords = true;
  if (_.isNumber(argv.p)) {
    percentUsed = argv.p > 100 ? 100 : argv.p || 10; // defaults to 10%;
  } else {
    percentUsed = 10; // defaults to 10%;
  }
}

// Read in all txt files in the wordLists directory
const wordLists = {};
const wordListsDir = path.join(__dirname, './wordLists/');
fs.readdirSync(wordListsDir).map((file) => {
  //Load up the the word lists
  if (file.substr(-4) === '.txt') {
    const wordListName = file.replace('.txt', '');
    wordLists[wordListName] = fs.readFileSync(
      wordListsDir + file,
      'utf8'
    ).toString().split('\n');
  }
});

function parseFile() {
  console.time('read in text file');
  const textFile = fs.readFileSync(fileToRun, 'utf8');
  console.timeEnd('read in text file');

  // Clean up the text and split all words into an array
  console.time('remove punctuation and formatting');
  let punctuationless = textFile.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  punctuationless = punctuationless.replace(/(?:\r\n|\r|\n)/g, ' ');
  punctuationless = punctuationless.replace(/  +/g, ' ');

  // Create array of words from the cleaned string of text
  const arrayOfText = punctuationless.toLowerCase().split(' ');
  console.timeEnd('remove punctuation and formatting');

  console.time('create an ordered list of all words and their usage count');
  const wordCountObj = {};
  for (let i = 0, j = arrayOfText.length; i < j; i++) {
    wordCountObj[arrayOfText[i]] = (wordCountObj[arrayOfText[i]] || 0) + 1;
  }
  console.timeEnd('create an ordered list of all words and their usage count');

  // Get total word count
  const totalWordCount = _.keys(wordCountObj).length;

  const selectWordStats = [];
  const wordsNotInLists = [];

  console.time('filter for words in provided lists');
  // Using each here strictly out of simplicity to preserver list order
  // @TODO - switch to _.map for speed and add a sort step
  _.each(wordLists, (nextList, listName) => {
    _.each(nextList, (nextWord) => {
      const low = nextWord.toLowerCase();
      if (wordCountObj[low]) {
        selectWordStats.push({
          category: listName,
          word: low,
          count: wordCountObj[low],
          proportionalUse: _round(
            ((wordCountObj[low] / totalWordCount) * 100), // Get % (0-100)
            3                                             // Show 3 decimals
          )
        });
      } else if (includeUnlistedWords) {
        // Add unused words to a third category
        wordsNotInLists.push({
          category: 'wordsNotOnAList', word: low, count: 0, proportionalUse: 0
        });
      }
    });
  });

  // Include unlisted words if flag was present in command
  if (includeUnlistedWords) {
    selectWordStats.push.apply(selectWordStats, wordsNotInLists);
  }
  console.timeEnd('filter for words in provided lists');

  console.time('write stats to csv file');
  fs.writeFile('wordUsage.csv', _formatCSV(selectWordStats), (err) => {
    if (err) {
      return console.log('Problem writing csv file', err);
    }
    console.log('Successfully parsed text file into csv of stats');
  });
  console.timeEnd('write stats to csv file');
}

function _formatCSV(data) {
  let csvContent = 'category,word,count,proportionalUse(%)\n';

  _.each(data, (next) => {
    if (showOftenUsedWords && (next.proportionalUse >= percentUsed)) {
      console.log(
        `• '${next.word}' was used ${next.proportionalUse}% of the time.`
      );
    }
    csvContent += `${next.category},`;          // col 1
    csvContent += `${next.word},`;              // col 2
    csvContent += `${next.count},`;             // col 3
    csvContent += `${next.proportionalUse}\n`;  // col 4
  });

  return csvContent;
}

function _round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

parseFile();
