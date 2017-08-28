function BasicCard(front, back) {
	this.front = front;
	this.back = back;
}

var inquirer = require('inquirer');

var cards = [];

var createCard = function() {
  if (cards.length < 5) {
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
      }
      cards.push(newCard);
      createCard();
    });
  }
}

createCard();

module.exports = BasicCard;