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

function game_turn(tree: Tree) {
	if(typeof(tree) === "string") {
		console.log("Are you thinking of a " + tree + "?  (y/n)");
	} else {
		const readline = require('readline').createInterface({
			input: process.stdin,
			output: process.stdout
		});
		
		readline.question(tree.value + " (y/n) -> ", userInput  => {
		if(userInput === "y"){
			readline.close();
			game_turn(tree.right);
		} else if(userInput === "n" ){
			readline.close();
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

