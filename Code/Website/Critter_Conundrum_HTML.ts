import * as BinaryTreeData from './../animal_data.json';
import { List, head, list, is_null, tail, append } from './../../lib/list'
import { Stack, pop, top, empty, push, is_empty } from './../../lib/stack'
//to run: tsc && browserify Critter_Conundrum_HTML.js -o bundle.js

//Global types
type Leaf = string;
type Tree = {value: string, left: Tree, right: Tree} | Leaf;
type nonEmptyTree = {value: string, left: Tree, right: Tree};

//Global variables
let tree_state_saved: Tree = BinaryTreeData;

let path_to_animal: List<string>;
let turns: number = 0;
let game_history: Stack<Tree>;
let tree_state: Tree;
let userInput = "start";
let game_started: boolean = false;
let submitQuestion: string = "start";
let new_animal: string = "";
let new_question: string = "";

/** Allows editing the value of a leaf
 *  in the binary tree.
 * @param path_to_animal - List containing directions to desired leaf.
 * @param tree - Binary tree with nodes representing questions and leaves 
 * representing animals.
 * @param new_input - New binary tree to replace a leaf in main binary tree.
 * @returns Returns a copy of animal_data.json where the leaf at path is 
 * replaced with the new_input tree.
 */
function edit_in_tree(path_to_animal: List<string>, 
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

/** Asks user what animal they were thinking of and a question to distinguish
 * that animal and the old.
 * @param tree - Binary tree with nodes representing questions and leaves 
 * representing animals.
 * @param path_to_animal - List containing directions to desired leaf.
 */
function add_new_animal(tree: string, 
						path_to_animal: List<string>): void {
	submitQuestion = "animal";
	new_animal_html();
	console.log("Sorry but it seems that I don't know your animal.");	
	console.log("What animal were you thinking of? -> ");

	display("Sorry but it seems that I don't know your animal. <br/>What animal were you thinking of?");
}

/** Allows you to go back a step by running game_turn on top of game_history
 * stack.
 * @param tree - Binary tree with nodes representing questions and leaves 
 * representing animals.
 */
function go_back(): void {
	if (!is_empty(game_history)){
		turns--;
		path_to_animal = tail(path_to_animal!);
		tree_state = top(game_history);
		game_history = pop(game_history);
	} else {
		console.log("You haven't made a move to undo yet.");
	}
	log_tree_value();
}

/** Traverses either to right or left branch of binary tree.
 * @param answer - Either "left" or "right"
 * @param tree - Binary tree with nodes representing questions and leaves 
 * representing animals.
 * @param new_branch Either left or right branch of tree.
 */
function go_left_or_right(answer: string, tree: nonEmptyTree, 
						  new_branch: Tree): void {
	tree_state = new_branch;
	path_to_animal = append(path_to_animal, list(answer));
	turns++;
	game_history = push(tree, game_history);
}

/** Inquires if users animal has been reached. 
 * 	If not, runs add_new_animal function.
 * @param tree - Leaf containing an animal.
 */
function process_leaf(tree: string): void {
	if(userInput === "y") {
		game_started = false;
		console.log("I'm the best! I guessed your animal in " + turns + 
					" questions!");
		display("I'm the best! I guessed your animal (" + tree + ") in " + 
				turns + " questions!");
	} else if (userInput === "n") {
		game_started = false;
		//fill json file with new animal
		add_new_animal(tree, path_to_animal);
	} else if (userInput === "b") {
		go_back();
	}
}

/** Requests user what move they want to make between yes, no or back.
 * @param tree - Binary tree with nodes representing questions and leaves 
 * representing animals.
 */
function process_node(tree: nonEmptyTree): void {
	if(userInput === "y"){
		go_left_or_right("right", tree, tree.right);
	} else if(userInput === "n" ){
		go_left_or_right("left", tree, tree.left);
	} else if (userInput === "b") {
		go_back();
	}
	log_tree_value();
}

/** Determines if a leaf or node has been reached and runs appropriate function.
 * Each function call represents a game turn.
 * @param tree - Binary tree with nodes representing questions and leaves 
 * representing animals.
 */
function game_turn(): void {
	if(typeof(tree_state) === "string") {
		process_leaf(tree_state);
	} else {
		process_node(tree_state);
	}
}
/**
 * 
 * @param message 
 */
function display(message: string) {
	document.getElementById("text-box")!.innerHTML = message;
}

/**
 * 
 */
function log_tree_value() {
	if(typeof(tree_state) !== "string") {
		console.log(tree_state.value + " (y/n/b) -> ");
		display(tree_state.value);
	} else {
		console.log("Are you thinking of a " + tree_state + " (y/n/b) -> ");
		display("Are you thinking of a " + tree_state + "?");
	}
}

//Website functions

/**
 * 
 */
function start() {
	submitQuestion = "start";
	turns = 0;
	tree_state = tree_state_saved;
	document.getElementById("text-input-div")!.style.opacity = "0";
	path_to_animal = list();
	game_history = empty();
	log_tree_value();
	game_started = true;
}
(window as any).start = start;

/**
 * 
 */
function yes_button() {
	if(game_started){
		userInput = "y";
		game_turn();
	}
}
(window as any).yes_button = yes_button;

/**
 * 
 */
function no_button() {
	if(game_started){
		userInput = "n";
		game_turn();
	}
}
(window as any).no_button = no_button;

/**
 * 
 */
function back_button() {
	if(game_started){
		userInput = "b";
		game_turn();
	}
}
(window as any).back_button = back_button;

/**
 * 
 */
function clear_text_area() {
	const textInput = document.getElementById("text-input") as HTMLTextAreaElement | null;
	textInput!.value = "";
}

/**
 * 
 */
function new_animal_html() {
	clear_text_area();
	document.getElementById("text-input-div")!.style.opacity = "1"; 
}

/**
 * 
 * @returns 
 */
function read_text_box(): string {
	const textInput = document.getElementById("text-input") as HTMLTextAreaElement | null;
	return textInput!.value;
}

/**
 * 
 */
function submit_button() {
	if(submitQuestion === "animal") {
		new_animal = read_text_box();
		
		clear_text_area();
		
		display("Give me a question that separates " + 
		new_animal + " from " + tree_state + ". <br/>Please make it as broad as possible," +
		" where your animal has the answer yes.");
		
		submitQuestion = "question";
	} else if (submitQuestion === "question") {
		new_question = read_text_box();
		
		clear_text_area();
		submitQuestion = "start";
		display("Thank you, " + new_animal + " has been added successfully!");
		tree_state_saved = edit_in_tree(path_to_animal, 
										tree_state_saved, 
										{value: new_question, 
										 left: tree_state, 
										 right: new_animal});
	}
}
(window as any).submit_button = submit_button;

/**
 * 
 * @param data 
 * @param filename 
 */
function downloadJSONFile(data: any, filename: string) {
    // Convert data to JSON string
    const jsonData = JSON.stringify(data, null, 2);
    
    // Create a Blob object from the JSON string
    const blob = new Blob([jsonData], { type: 'application/json' });

    // Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = filename; // Set the download attribute with the filename
    a.click();

    // Release the object URL
    URL.revokeObjectURL(url);
}

/**
 * 
 */
function download_json() {
	if(new_animal !== "" && new_question !== "") {
		downloadJSONFile(tree_state_saved, "animal_data.json");
	}
	new_animal = "";
	new_question = "";
	
}
(window as any).download_json = download_json;
