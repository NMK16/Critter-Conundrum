import { List, head, list, is_null, tail, append } from '../lib/list'
import * as BinaryTreeData from './test.json';

//to run: tsc Critter_Conundrum.ts --resolveJsonModule && node Critter_Conundrum.js

type Leaf = string;
type Tree = {value: string, left: Tree, right: Tree} | Leaf;
type nonEmptyTree = {value: string, left: Tree, right: Tree};
/**
 * 
 * @param path 
 * @param tree 
 * @param new_input 
 * @returns 
 */
function edit_in_tree(path: List<string>, tree: Tree, new_input: nonEmptyTree): Tree {
	if(is_null(path)) {
		return new_input;
	} else if(head(path) === "right") {
		if(typeof(tree) === "string") {
      console.log("error: premature leaf found");
			return "error";
		} else {
			return {value: tree.value, 
              left: tree.left, 
              right: edit_in_tree(tail(path), tree.right, new_input)};
		}
	} else if(head(path) === "left") {
		if(typeof(tree) === "string") {
      console.log("error: premature leaf found");
			return "error";
		} else {
			return {value: tree.value, 
              left: edit_in_tree(tail(path), tree.left, new_input), 
              right: tree.right};
		}
	} else {
		return "error: incorrect list format";
	}
}
function add_new_animal(question: string, old_animal: string, new_animal: string, path: List<string>): void {
	const fs = require('fs');
	const fileName = './test.json';
	let file = require(fileName);
		
	file = edit_in_tree(path, BinaryTreeData, {value: question, left: old_animal, right: new_animal});
		
	fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
	  if (err) return console.log(err);
	  console.log(JSON.stringify(file, null, 2));
	  console.log('writing to ' + fileName);
	});
}
let path_to_animal: List<string> = list();
let turns: number = 0;
/**
 * 
 * @param tree 
 */
function game_turn(tree: Tree): void {
	if(typeof(tree) === "string") {
		const readline = require('readline').createInterface({
			input: process.stdin,
			output: process.stdout
		});
		
		readline.question("Are you thinking of a " + tree + " (y/n) -> ", userInput  => {
			readline.close();
			if(userInput === "y") {
				console.log("I'm the best! I guessed your animal in " + turns + " questions!")
			} else if (userInput === "n"){
				//fill json file with new animal
				let userInput_animal: string = "";
				let userInput_question: string = "";
				const readline2 = require('readline').createInterface({
					input: process.stdin,
					output: process.stdout
				});
				console.log("Sorry but it seems that I don't know your animal.");
				readline2.question("What animal were you thinking of? -> ", userInput  => {
					userInput_animal = userInput;
					readline2.close();

					const readline3 = require('readline').createInterface({
						input: process.stdin,
						output: process.stdout
					});
					console.log("Give me a question that separates " + userInput_animal + " from " + tree + ".");
					readline3.question("Please make it as broad as possible, where your animal has the answer yes. -> ", userInput  => {
						userInput_question = userInput;
						readline3.close();
						add_new_animal(userInput_question, tree, userInput_animal, path_to_animal);
					});
				});
				

			} else {
				console.log("Wrong input");
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
			readline.close();
			path_to_animal = append(path_to_animal, list("right"));
			console.log(path_to_animal);
			turns++;
			game_turn(tree.right);
		} else if(userInput === "n" ){
			readline.close();
			path_to_animal = append(path_to_animal, list("left"));
			console.log(path_to_animal);
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
