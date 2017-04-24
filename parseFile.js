#!/usr/bin/env node

const _ = require('underscore');
const fs = require('fs');

// Make these an input via folder
const oneThousandPath = 'firstThousand.txt';
const twoThousandPath = 'secondThousand.txt';
const academicWordsPath = 'academicWordList.txt';

var wc = new WordCounter();

function runMe() {

  let wordCount = 0;

  // @TODO - make this an input via arg (a la RepairPDF...)
  const fileToRun = 'modest_proposal_raw.txt';

  // @TODO - make this a map for each file in the directory provided (or input?)
  let wordCounter = {
    'firstThousand': [],
    'secondThousand': [],
    'academicWords': []
  };

  const one = fs.readFileSync(oneThousandPath).toString().split('\n');
  const two = fs.readFileSync(twoThousandPath).toString().split('\n');
  const three = fs.readFileSync(academicWordsPath).toString().split('\n');
  // @TODO - make this part of the map


  console.time('read in text file');
  const testText = fs.readFileSync(fileToRun, 'utf8');
  console.timeEnd('read in text file');

  // @TODO - Clean up the text and split all words into an array
  console.time('remove punctuation and formatting');
  let punctuationless = testText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
  punctuationless = punctuationless.replace(/(?:\r\n|\r|\n)/g, ' ');
  punctuationless = punctuationless.replace(/  +/g, ' ');

  // Create array of words from the cleaned string of text
  let arrayOfText = punctuationless.toLowerCase().split(' ');
  console.timeEnd('remove punctuation and formatting');

  console.time('create an ordered list of all words and their usage count');
  let wordCountObject = {};
  for (let i = 0, j = arrayOfText.length; i < j; i++) {
    wordCountObject[arrayOfText[i]] = (wordCountObject[arrayOfText[i]] || 0) + 1;
  }
  console.timeEnd('create an ordered list of all words and their usage count');

  // Get total word count
  const totalWordCount = _.keys(wordCountObject).length;

  let selectWordStats = [];

  // @TODO - Replace these three maps with an `each` or `map` over imported files - key = fileName
  
  console.time('filter for words in provided lists');
  _.map(one, (nextOne) => {
    const lowerWord = nextOne.toLowerCase();
    if (wordCountObject[lowerWord]) {
      selectWordStats.push({
        category: 'one', // using map - make this index = name of file
        word: lowerWord,
        count: wordCountObject[lowerWord],
        proportionalUse: _round(((wordCountObject[lowerWord] / totalWordCount) * 100), 3)
      });
    }
  });

  _.map(two, (nextTwo) => {
    const lowerWord = nextTwo.toLowerCase();
    if (wordCountObject[lowerWord]) {
      selectWordStats.push({
        category: 'two', // using map - make this index = name of file
        word: lowerWord,
        count: wordCountObject[lowerWord],
        proportionalUse: _round(((wordCountObject[lowerWord] / totalWordCount) * 100), 3)
      });
    }
  });

  _.map(three, (nextThree) => {
    const lowerWord = nextThree.toLowerCase();
    if (wordCountObject[lowerWord]) {
      selectWordStats.push({
        category: 'three', // using map - make this index = name of file
        word: lowerWord,
        count: wordCountObject[lowerWord],
        proportionalUse: _round(((wordCountObject[lowerWord] / totalWordCount) * 100), 3)
      });
    }
  });
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
    csvContent += `${next.category},${next.word},${next.count},${next.proportionalUse}\n`;
  });

  return csvContent;
};

function _round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

runMe();