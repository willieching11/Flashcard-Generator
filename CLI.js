var type = process.argv[2];

if (type === "basic") {
	var BasicCard = require("./BasicCard.js");
	BasicCard();
} 
else if (type === "cloze") {
	var ClozeCard = require("./ClozeCard.js");
	ClozeCard();
}
else {
	console.log("Invalid command: choose to use basic or cloze flashcards")
}