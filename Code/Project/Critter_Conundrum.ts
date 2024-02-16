import * as BinaryTreeData from './animal_data.json';
//type: mammal, reptile, insect, avians
//skin: dotted fur, striped fur, fur, feathers, hair, scales
//feet: hooves, paws, 
// console.log(BinaryTreeData);


//Questions
//Does it fly/live in water/live on land?

//Is it a carnivore/herbivore/omnivore?

//Is it a mammal/avian/insect/amphebian/reptile?

//Does it have fur/feathers/skin/hair/an exoskeleton

//Is it domesticated?

type Leaf = string;
type Tree = {value: string, left: Tree, right: Tree} | Leaf;

function add_new_animal(question: string, new_animal: string): void {
	const fs = require('fs');
	const fileName = './test.json';
	const file = require(fileName);
		
	file.value = "";
		
	fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
	  if (err) return console.log(err);
	  console.log(JSON.stringify(file, null, 2));
	  console.log('writing to ' + fileName);
	});
}

let turns: number = 0;
let new_tree: Tree = {};
/**
 * 
 * @param tree 
 */
function game_turn(tree: Tree) {
	if(typeof(tree) === "string") {
		const readline = require('readline').createInterface({
			input: process.stdin,
			output: process.stdout
		});
		
		readline.question("Are you thinking of a " + tree + " (y/n) -> ", userInput  => {
			if(userInput === "y") {
				readline.close();
				console.log("I'm the best! I guessed your animal in " + turns + " questions!")
			} else if (userInput === "n"){
				//fill json file with new animal
				const readline = require('readline').createInterface({
					input: process.stdin,
					output: process.stdout
				});
				console.log("Sorry but it seems that I don't know your animal.");
				readline.question("What animal were you thinking of?", userInput_animal  => {
					const readline = require('readline').createInterface({
						input: process.stdin,
						output: process.stdout
					});
					
					readline.question("Give me a question that separates your animal from a " + tree + ", where your animal has the answer yes.", userInput_question  => {
						add_new_animal(userInput_question, userInput_animal);
					})

				});
			} else {
				console.log("Wrong input");
				readline.close();
				game_turn(tree);
			}
		});
	} else {
		const readline = require('readline').createInterface({
			input: process.stdin,
			output: process.stdout
		});
		
		readline.question(tree.value + " (y/n) -> ", userInput  => {
		if(userInput === "y"){
			new_tree;
			readline.close();
			turns++;
			game_turn(tree.right);
		} else if(userInput === "n" ){
			readline.close();
			turns++;
			game_turn(tree.left);
		} else {
			console.log("Wrong input");
			readline.close();
			game_turn(tree);
			}
		});
	}
}

game_turn(BinaryTreeData);

