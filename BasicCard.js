var fs = require("fs");

var action = process.argv[3];
var count = process.argv[4];

function BasicCard(front, back) {
	this.front = front;
	this.back = back;
}

var inquirer = require('inquirer');

var cards = [];

var num = 0;

var start = {
	fillCards: function() {
		fs.readFile("basic.txt", "utf8", function(err, data) {
	        if (err) {
	            console.log(err);
	        } else {
	            var dataArray = data.split('"');
	            var num = (dataArray.length-1)/8;
	            var frontIndex = 3;
	            var backIndex = 7;
	            for(var i = 0; i < num; i++) {
	            	var newCard = new BasicCard(dataArray[frontIndex], dataArray[backIndex]);
	            	frontIndex = frontIndex + 8;
	            	backIndex = backIndex + 8;
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
                    console.log("Front: " + cards[count-1].front);
                    console.log("Back: " + cards[count-1].back);
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
	        name: "front",
	        message: "What is the flashcard's question?"
	      }, {
	        name: "back",
	        message: "What is the flashcard's answer?"
	      }
	    ]).then(function (answers) {

	      var newCard = new BasicCard(
	        answers.front,
	        answers.back);
	      cards.push(newCard);
	      num++;
		  fs.writeFile('basic.txt', JSON.stringify(cards), function (err) {
			if (err) {
				return console.log(err);
			}
		  });
	      start.createCards();
	    });
	  }
	},

	study: function() {
		if (cards.length >= 1) {
			var randomQuestion = Math.floor(Math.random() * cards.length);
			console.log(cards[randomQuestion].front);
			console.log('Press enter for the answer.');
			process.stdin.once('data', function () {
			  console.log("--------------------");
			  console.log(cards[randomQuestion].back);
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

module.exports = BasicCard;