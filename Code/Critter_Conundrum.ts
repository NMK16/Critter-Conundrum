import * as BinaryTreeData from './animal_data.json';
import { List, head, list, is_null, tail, append } from './../lib/list'
import { Stack, pop, top, empty, push, is_empty } from './../lib/stack'
//to run: tsc Critter_Conundrum.ts --resolveJsonModule && node Critter_Conundrum.js (for linux)

//Global types
export type Leaf = string;
export type Tree = {value: string, left: Tree, right: Tree} | Leaf;
export type nonEmptyTree = {value: string, left: Tree, right: Tree};

//Global variables
let path_to_animal: List<string> = list();
let turns: number = 0;
let game_history: Stack<Tree> = empty();

/** Allows editing the value of a leaf
 *  in the binary tree.
 * @param path_to_animal - List containing directions to desired leaf.
 * @param tree - Binary tree with nodes representing questions and leaves 
 * representing animals.
 * @param new_input - New binary tree to replace a leaf in main binary tree.
 * @returns Returns a copy of animal_data.json where the leaf at path is 
 * replaced with the new_input tree.
 */
export function edit_in_tree(path_to_animal: List<string>, 
							 tree: Tree, 
							 new_input: nonEmptyTree): Tree {
	if(is_null(path_to_animal)) {
		return new_input;
	} else if(head(path_to_animal) === "right") {
		if(typeof(tree) === "string") { 
      		console.log("error: premature leaf found");
			return "error";
		} else {
			return {value: tree.value, 
            		left: tree.left, 
            		right: edit_in_tree(tail(path_to_animal), 
										tree.right, 
										new_input)};
		}
	} else if(head(path_to_animal) === "left") {
		if(typeof(tree) === "string") {
      		console.log("error: premature leaf found");
			return "error";
		} else {
			return {value: tree.value, 
            		left: edit_in_tree(tail(path_to_animal), 
									   tree.left, 
									   new_input), 
            		right: tree.right};
		}
	} else {
		return "error: incorrect list format";
	}
}

/** Adds a new animal and question to the JSON file.
 * @param question - User added question.
 * @param old_animal - Animal to be moved to left branch of new node.
 * @param new_animal - Animal to be moved to right branch of new node.
 * @param path_to_animal - List containing directions to desired leaf.
 */
function write_to_json(question: string, old_animal: string, 
					   new_animal: string, path_to_animal: List<string>): void {
	const fs = require('fs');
	const fileName = './animal_data.json';
	let file = require(fileName);
		
	file = edit_in_tree(path_to_animal, BinaryTreeData, 
						{value: question, left: old_animal, right: new_animal});
		
	fs.writeFile(fileName, JSON.stringify(file, null, 2), 
				 function writeJSON(err: string) {
		if (err) return console.log(err);
		console.log('writing to ' + fileName);
	});
}

/** Asks user what animal they were thinking of and a question to distinguish
 * that animal and the old.
 * @param tree - Binary tree with nodes representing questions and leaves 
 * representing animals.
 * @param path_to_animal - List containing directions to desired leaf.
 */
export function add_new_animal(tree: string, 
							   path_to_animal: List<string>): void {
	let userInput_animal: string = "";
	let userInput_question: string = "";
	const readline2 = require('readline').createInterface({
		input: process.stdin,
		output: process.stdout
	});
	console.log("Sorry but it seems that I don't know your animal.");
	readline2.question("What animal were you thinking of? -> ", 
					   (userInput: string)  => {
		userInput_animal = userInput;
		readline2.close();
	
		const readline3 = require('readline').createInterface({
			input: process.stdin,
			output: process.stdout
		});
		console.log("Give me a question that separates " + 
					userInput_animal + " from " + tree + ".");
		readline3.question("Please make it as broad as possible," + 
						   " where your animal has the answer yes. -> ", 
						   (userInput: string)  => {
			userInput_question = userInput;
			readline3.close();
			write_to_json(userInput_question, tree, 
						  userInput_animal, path_to_animal);
		});});
}

/** Allows you to go back a step by running game_turn on top of game_history
 * stack.
 * @param tree - Binary tree with nodes representing questions and leaves 
 * representing animals.
 */
export function go_back(tree: Tree): void {
	if (!is_empty(game_history)){
		turns--;
		path_to_animal = tail(path_to_animal!);
		game_turn(top(game_history));
		game_history = pop(game_history);
	} else {
		console.log("You haven't made a move to undo yet.");
		game_turn(tree);
	}
}

/** Traverses either to right or left branch of binary tree.
 * @param answer - Either "left" or "right"
 * @param tree - Binary tree with nodes representing questions and leaves 
 * representing animals.
 * @param new_branch Either left or right branch of tree.
 */
export function go_left_or_right(answer: string, tree: nonEmptyTree, 
							     new_branch: Tree): void {
	path_to_animal = append(path_to_animal, list(answer));
	turns++;
	game_history = push(tree, game_history);
	game_turn(new_branch);
}

/** Inquires if users animal has been reached. 
 * 	If not, runs add_new_animal function.
 * @param tree - Leaf containing an animal.
 */
export function process_leaf(tree: string): void {
	const readline = require('readline').createInterface({
		input: process.stdin,
		output: process.stdout
	});
	readline.question("Are you thinking of a " + tree + " (y/n/b) -> ", 
					  (userInput: string)  => {
		readline.close();
		if(userInput === "y") {
			console.log("I'm the best! I guessed your animal in " + turns + 
						" questions!")
		} else if (userInput === "n") {
			//fill json file with new animal
			add_new_animal(tree, path_to_animal);
		} else if (userInput === "b") {
			go_back(tree);
		} else {
			console.log("Wrong input");
			game_turn(tree);
		}
	});
}

/** Requests user what move they want to make between yes, no or back.
 * @param tree - Binary tree with nodes representing questions and leaves 
 * representing animals.
 */
export function process_node(tree: nonEmptyTree): void {
	const readline = require('readline').createInterface({
		input: process.stdin,
		output: process.stdout
	});
	readline.question(tree.value + " (y/n/b) -> ", (userInput: string)  => {
	if(userInput === "y"){
		readline.close();
		go_left_or_right("right", tree, tree.right);
	} else if(userInput === "n" ){
		readline.close();
		go_left_or_right("left", tree, tree.left);
	} else if (userInput === "b") {
		readline.close();
		go_back(tree);
	} else {
		console.log("Wrong input.");
		readline.close();
		game_turn(tree);
		}
	});
}

/** Determines if a leaf or node has been reached and runs appropriate function.
 * Each function call represents a game turn.
 * @param tree - Binary tree with nodes representing questions and leaves 
 * representing animals.
 */
export function game_turn(tree: Tree): void {
	if(typeof(tree) === "string") {
		process_leaf(tree);
	} else {
		process_node(tree);
	}
}

game_turn(BinaryTreeData);