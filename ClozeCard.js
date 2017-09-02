var fs = require("fs");

var action = process.argv[3];
var count = process.argv[4];

function ClozeCard(text, cloze) {
	this.text = text;
	this.cloze = cloze;
	this.cut = function() {
		this.partial = text.replace(cloze, '...');
	};
}

var inquirer = require('inquirer');

var cards = [];

var num = 0;

var start = {
	fillCards: function() {
		fs.readFile("cloze.txt", "utf8", function(err, data) {
	        if (err) {
	            console.log(err);
	        } else {
	            var dataArray = data.split('"');
	            var num = (dataArray.length-1)/12;
	            var textIndex = 3;
	            var clozeIndex = 7;
	            var partialIndex = 11;
	            for(var i = 0; i < num; i++) {
	            	var newCard = new ClozeCard(dataArray[textIndex], dataArray[clozeIndex]);
	            	newCard.cut();
	            	textIndex = textIndex + 12;
	            	clozeIndex = clozeIndex + 12;
	            	cards.push(newCard);
	            }
	        }
	        if (action === "read") {
	        	if (data === "") {
		        	console.log("No Flashcards created yet");
		        	return;
	        	} 
		        if (count === undefined) {
			    	console.log(cards);
			    } else {
                    console.log("Text: " + cards[count-1].text);
                    console.log("Cloze: " + cards[count-1].cloze);
                    console.log("Partial: " + cards[count-1].partial);
			    }
			} else if (action === "add") {
				start.createCards();
			} else if (action === "study") {
				if (data === "") {
		        	console.log("No Flashcards created yet");
		        	return;
	        	} 
				start.study();
			} else {
				console.log("Action not recognized." +
					"\nAvailable actions include add, read, or study");
			}
	    });
	},

	createCards: function() {
	  if (num < count) {
	    inquirer.prompt([
	      {
	        name: "text",
	        message: "What is the Cloze-flashcard's text?"
	      }, {
	        name: "cloze",
	        message: "What is the Cloze-flashcard's answer"
	      }
	    ]).then(function (answers) {

	      var newCard = new ClozeCard(answers.text, answers.cloze);
	      newCard.cut();
		  if (answers.text.indexOf(answers.cloze) === -1) {
			console.log("The answer does not appear to be in the text. Try again");
			return;
		  } else {
		      cards.push(newCard);
		      num++;
			  fs.writeFile('cloze.txt', JSON.stringify(cards), function (err) {
				if (err) {
					return console.log(err);
				}
			  });
		      start.createCards();
	  	  }
	    });
	  }
	},

	study: function() {
		if (cards.length >= 1) {
			var randomQuestion = Math.floor(Math.random() * cards.length);
			console.log(cards[randomQuestion].partial);
			console.log('Press enter for the answer.');
			process.stdin.once('data', function () {
			  console.log("--------------------");
			  console.log(cards[randomQuestion].cloze);
			  console.log("--------------------");
		      cards.splice(randomQuestion, 1);
			  start.study();
			});
		}
		else {
			console.log("You have no cards left to study!");
			process.exit(0);
		}
	}
}

start.fillCards();

module.exports = ClozeCard;