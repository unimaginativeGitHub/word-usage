# Word Usage

- - -

## Abstract

The goal of this project is to deconstruct text (input accepted from `.txt` and handled as a string) in order to assertain which words have been used as well as how many times each word has been used and in what proportion.  The secondary goal of this project was to compare the words used within the text to any number of words contained in any numer of line-break-deliniated lists of words.

## Requirements

This project was written using node.js and is run as an executable from the command line.  Node and NPM are required (compatible with *nix, Mac and Windows).

Node install instructions:  [Node.js Homepage](https://nodejs.org/en/download/)

## Installation

1. Clone, fork or download and unzip this repository
2. Navigate to the project root direcotry
3. Run `npm install`

## Usage

1. Call method like so:  `./parseText.js -f absolute/path/to/file.txt`
2. Examine results either directly or in an application like Excel, Numbers, MatLab etc. by opening or importing `wordUsage.csv`

Text is compared to any line-break-delineated list or lists of words contained within the `wordList` directory.  Three word lists are included with the repository, the first 1000 most commonly used words, the second 1000(+) words and a list of academic words (~570 words).  If you wish to augment or replace those lists, simply place the lists you wish compared in that directory.

##  Credit/Sources

* Software designed and developed by Bradley Cooper, Compuer Scientist and Developer, April 2017
* Project propsed and conducted by Ben Robertson - (Graduate Student) University of Colorado in Boulder, April 2017
* (default) Word lists provided by _____________

- - -