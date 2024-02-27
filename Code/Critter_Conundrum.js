"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.game_turn = exports.process_node = exports.process_leaf = exports.go_left_or_right = exports.go_back = exports.add_new_animal = exports.edit_in_tree = void 0;
const BinaryTreeData = require("./animal_data.json");
const list_1 = require("./../lib/list");
const stack_1 = require("./../lib/stack");
//Global variables
let path_to_animal = (0, list_1.list)();
let turns = 0;
let game_history = (0, stack_1.empty)();
/** Allows editing the value of a leaf
 *  in the binary tree.
 * @param path_to_animal - List containing directions to desired leaf.
 * @param tree - Binary tree with nodes representing questions and leaves
 * representing animals.
 * @param new_input - New binary tree to replace a leaf in main binary tree.
 * @returns Returns a copy of animal_data.json where the leaf at path is
 * replaced with the new_input tree.
 */
function edit_in_tree(path_to_animal, tree, new_input) {
    if ((0, list_1.is_null)(path_to_animal)) {
        return new_input;
    }
    else if ((0, list_1.head)(path_to_animal) === "right") {
        if (typeof (tree) === "string") {
            console.log("error: premature leaf found");
            return "error";
        }
        else {
            return { value: tree.value,
                left: tree.left,
                right: edit_in_tree((0, list_1.tail)(path_to_animal), tree.right, new_input) };
        }
    }
    else if ((0, list_1.head)(path_to_animal) === "left") {
        if (typeof (tree) === "string") {
            console.log("error: premature leaf found");
            return "error";
        }
        else {
            return { value: tree.value,
                left: edit_in_tree((0, list_1.tail)(path_to_animal), tree.left, new_input),
                right: tree.right };
        }
    }
    else {
        return "error: incorrect list format";
    }
}
exports.edit_in_tree = edit_in_tree;
/** Adds a new animal and question to the JSON file.
 * @param question - User added question.
 * @param old_animal - Animal to be moved to left branch of new node.
 * @param new_animal - Animal to be moved to right branch of new node.
 * @param path_to_animal - List containing directions to desired leaf.
 */
function write_to_json(question, old_animal, new_animal, path_to_animal) {
    const fs = require('fs');
    const file_name = './animal_data.json';
    let file = require(file_name);
    file = edit_in_tree(path_to_animal, BinaryTreeData, { value: question, left: old_animal, right: new_animal });
    fs.writeFile(file_name, JSON.stringify(file, null, 2), function write_json(err) {
        if (err)
            return console.log(err);
        console.log('writing to ' + file_name);
    });
}
/** Asks user what animal they were thinking of and a question to distinguish
 * that animal and the old.
 * @param tree - Binary tree with nodes representing questions and leaves
 * representing animals.
 * @param path_to_animal - List containing directions to desired leaf.
 */
function add_new_animal(tree, path_to_animal) {
    let user_input_animal = "";
    let user_input_question = "";
    const readline2 = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    console.log("Sorry but it seems that I don't know your animal.");
    readline2.question("What animal were you thinking of? -> ", (user_input) => {
        user_input_animal = user_input;
        readline2.close();
        const readline3 = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        console.log("Give me a yes or no question that separates " +
            user_input_animal + " from " + tree + ".");
        readline3.question("Please make it as broad as possible," +
            " where your animal has the answer yes. -> ", (user_input) => {
            user_input_question = user_input;
            readline3.close();
            write_to_json(user_input_question, tree, user_input_animal, path_to_animal);
        });
    });
}
exports.add_new_animal = add_new_animal;
/** Allows you to go back a step by running game_turn on top of game_history
 * stack.
 * @param tree - Binary tree with nodes representing questions and leaves
 * representing animals.
 */
function go_back(tree) {
    if (!(0, stack_1.is_empty)(game_history)) {
        turns--;
        path_to_animal = (0, list_1.tail)(path_to_animal);
        game_turn((0, stack_1.top)(game_history));
        game_history = (0, stack_1.pop)(game_history);
    }
    else {
        console.log("You haven't made a move to undo yet.");
        game_turn(tree);
    }
}
exports.go_back = go_back;
/** Traverses either to right or left branch of binary tree.
 * @param answer - Either "left" or "right"
 * @param tree - Binary tree with nodes representing questions and leaves
 * representing animals.
 * @param new_branch Either left or right branch of tree.
 */
function go_left_or_right(answer, tree, new_branch) {
    path_to_animal = (0, list_1.append)(path_to_animal, (0, list_1.list)(answer));
    turns++;
    game_history = (0, stack_1.push)(tree, game_history);
    game_turn(new_branch);
}
exports.go_left_or_right = go_left_or_right;
/** Inquires if users animal has been reached.
 * 	If not, runs add_new_animal function.
 * @param tree - Leaf containing an animal.
 */
function process_leaf(tree) {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    readline.question("Are you thinking of a " + tree + " (y/n/b) -> ", (user_input) => {
        readline.close();
        if (user_input === "y") {
            console.log("I'm the best! I guessed your animal in " + turns +
                " questions!");
        }
        else if (user_input === "n") {
            //fill json file with new animal
            add_new_animal(tree, path_to_animal);
        }
        else if (user_input === "b") {
            go_back(tree);
        }
        else {
            console.log("Wrong input");
            game_turn(tree);
        }
    });
}
exports.process_leaf = process_leaf;
/** Requests user what move they want to make between yes, no or back.
 * @param tree - Binary tree with nodes representing questions and leaves
 * representing animals.
 */
function process_node(tree) {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    readline.question(tree.value + " (y/n/b) -> ", (user_input) => {
        if (user_input === "y") {
            readline.close();
            go_left_or_right("right", tree, tree.right);
        }
        else if (user_input === "n") {
            readline.close();
            go_left_or_right("left", tree, tree.left);
        }
        else if (user_input === "b") {
            readline.close();
            go_back(tree);
        }
        else {
            console.log("Wrong input.");
            readline.close();
            game_turn(tree);
        }
    });
}
exports.process_node = process_node;
/** Determines if a leaf or node has been reached and runs appropriate function.
 * Each function call represents a game turn.
 * @param tree - Binary tree with nodes representing questions and leaves
 * representing animals.
 */
function game_turn(tree) {
    if (typeof (tree) === "string") {
        process_leaf(tree);
    }
    else {
        process_node(tree);
    }
}
exports.game_turn = game_turn;
game_turn(BinaryTreeData);
