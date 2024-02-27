import * as BinaryTreeData from './../animal_data.json';
import { List, head, list, is_null, tail, append } from './../../lib/list';
import { Stack, pop, top, empty, push, is_empty } from './../../lib/stack';
//to run: tsc && browserify Critter_Conundrum_HTML.js -o bundle.js

//Global types
type Leaf = string;
type Tree = {value: string, left: Tree, right: Tree} | Leaf;
type NonEmptyTree = {value: string, left: Tree, right: Tree};

//Global variables
let tree_state_saved: Tree = BinaryTreeData;

let path_to_animal: List<string>;
let turns: number = 0;
let game_history: Stack<Tree>;
let tree_state: Tree;
let user_input = "start";
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
							 new_input: NonEmptyTree): Tree {
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
function add_new_animal(): void {
	submitQuestion = "animal";
	clear_text_area();
	show_element("buttonSubmit");
	show_element("text-input");
	show_element("text-input-div");
	hide_element("buttonDownload");
	display("Sorry but it seems that I don't know your animal" +
			". <br/>What animal were you thinking of?");
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
function go_left_or_right(answer: string, tree: NonEmptyTree, 
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
	if(user_input === "y") {
		game_started = false;
		display("I'm the best! I guessed your animal (" + tree + ") in " + 
				turns + " questions!");
	} else if (user_input === "n") {
		game_started = false;
		//fill json file with new animal
		add_new_animal();
	} else if (user_input === "b") {
		go_back();
	}
}

/** Requests user what move they want to make between yes, no or back.
 * @param tree - Binary tree with nodes representing questions and leaves 
 * representing animals.
 */
function process_node(tree: NonEmptyTree): void {
	if(user_input === "y"){
		go_left_or_right("right", tree, tree.right);
	} else if(user_input === "n" ){
		go_left_or_right("left", tree, tree.left);
	} else if (user_input === "b") {
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

/** Displays message on text box.
 * @param message - String representing message to be displayed.
 */
function display(message: string): void {
	document.getElementById("text-box")!.innerHTML = message;
}

/** Displays either the question or the animal, depending on if tree_state is a
 * tree or a singular leaf. 
 */
function log_tree_value(): void {
	if(typeof(tree_state) !== "string") {
		display(tree_state.value);
	} else {
		display("Are you thinking of a " + tree_state + "?");
	}
}

//Website functions

/** Resets the game by resetting tree_state to tree_state_saved, hiding the 
 * submit and download button. Clearing turns, path_to_animal, game_history and
 * setting game_started to true. 
 */
function start(): void {
	hide_element("buttonSubmit");
	hide_element("buttonDownload");
	submitQuestion = "start";
	turns = 0;
	tree_state = tree_state_saved;
	hide_element("text-input");
	path_to_animal = list();
	game_history = empty();
	log_tree_value();
	game_started = true;
}
(window as any).start = start;

/** If game has started and the yes button is pressed on the website, 
 * then it sets user_input to "y" and runs game_turn.
 */
function yes_button(): void {
	if(game_started){
		user_input = "y";
		game_turn();
	}
}
(window as any).yes_button = yes_button;

/** If game has started and the no button is pressed on the website, 
 * then it sets user_input to "n" and runs game_turn.
 */
function no_button(): void {
	if(game_started){
		user_input = "n";
		game_turn();
	}
}
(window as any).no_button = no_button;

/** If game has started and the back button is pressed on the website, 
 * then it sets user_input to "b" and runs game_turn.
 */
function back_button(): void {
	if(game_started){
		user_input = "b";
		game_turn();
	}
}
(window as any).back_button = back_button;

/** Clears the text area by setting its value to "".
 */
function clear_text_area(): void {
	const textInput = document.getElementById("text-input") as 
											  HTMLTextAreaElement | null;
	textInput!.value = "";
}

/** Retrieves contents of the text box. 
 * @returns - String in the text box
 */
function read_text_box(): string {
	const textInput = document.getElementById("text-input") as 
											  HTMLTextAreaElement | null;
	return textInput!.value;
}

/** Saves either a user created animal or a question, depending on if 
 * animal has been found or not, while displaying relevant text instructions. 
 * Updates tree_state_saved if question was submitted.
 */
function submit_button(): void {
	if(submitQuestion === "animal") {
		new_animal = read_text_box();
		show_element("buttonSubmit");
		display("Give me a yes or no question that separates " + new_animal + 
		" from " + tree_state + ". <br/>Please make it as broad as possible," +
		" where your animal has the answer yes.");
		submitQuestion = "question";
	} else if (submitQuestion === "question") {
		new_question = read_text_box();
		submitQuestion = "start";
		display("Thank you, " + new_animal + " has been added successfully!");
		show_element("buttonDownload");
		hide_element("buttonSubmit");
		tree_state_saved = edit_in_tree(path_to_animal, 
										tree_state_saved, 
										{value: new_question, 
										 left: tree_state, 
										 right: new_animal});
	}
	clear_text_area();
}
(window as any).submit_button = submit_button;

/** Sends a download link to the jsonfile containing 'data' and names it 
 * 'filename'.
 * @param data - Tree to be put in the new json file.
 * @param filename - String representing the files name.
 */
function downloadJSONFile(data: Tree, filename: string): void {
    const json_data = JSON.stringify(data, null, 2);    
    const blob = new Blob([json_data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

/** Hides element from the website by lowering the opacity to "0" and the cursor
 * to "default".
 * @param id - String respresenting the elements ID.
 */
function hide_element(id: string): void {
	document.getElementById(id)!.style.opacity = "0";
	document.getElementById(id)!.style.cursor = "default";
}

/** Shows element from the website by increasing the opacity to "1" and the
 * cursor to "pointer".
 * @param id - String respresenting the elements ID.
 */
function show_element(id: string): void {
	document.getElementById(id)!.style.opacity = "1";
	document.getElementById(id)!.style.cursor = "pointer";
}

/** If new_animal and new_question isn't an empty string, downloads 
 * Json file containing tree_state_saved and with the file name 
 * "animal_data.json". 
 */
function download_json(): void {
	if(new_animal !== "" && new_question !== "") {
		downloadJSONFile(tree_state_saved, "animal_data.json");
	}
	new_animal = "";
	new_question = "";
}
(window as any).download_json = download_json;
