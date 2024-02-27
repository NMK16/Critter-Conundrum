(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BinaryTreeData = require("./../animal_data.json");
const list_1 = require("./../../lib/list");
const stack_1 = require("./../../lib/stack");
//Global variables
let tree_state_saved = BinaryTreeData;
let path_to_animal;
let turns = 0;
let game_history;
let tree_state;
let userInput = "start";
let game_started = false;
let submitQuestion = "start";
let new_animal = "";
let new_question = "";
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
/** Asks user what animal they were thinking of and a question to distinguish
 * that animal and the old.
 * @param tree - Binary tree with nodes representing questions and leaves
 * representing animals.
 * @param path_to_animal - List containing directions to desired leaf.
 */
function add_new_animal() {
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
function go_back() {
    if (!(0, stack_1.is_empty)(game_history)) {
        turns--;
        path_to_animal = (0, list_1.tail)(path_to_animal);
        tree_state = (0, stack_1.top)(game_history);
        game_history = (0, stack_1.pop)(game_history);
    }
    else {
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
function go_left_or_right(answer, tree, new_branch) {
    tree_state = new_branch;
    path_to_animal = (0, list_1.append)(path_to_animal, (0, list_1.list)(answer));
    turns++;
    game_history = (0, stack_1.push)(tree, game_history);
}
/** Inquires if users animal has been reached.
 * 	If not, runs add_new_animal function.
 * @param tree - Leaf containing an animal.
 */
function process_leaf(tree) {
    if (userInput === "y") {
        game_started = false;
        display("I'm the best! I guessed your animal (" + tree + ") in " +
            turns + " questions!");
    }
    else if (userInput === "n") {
        game_started = false;
        //fill json file with new animal
        add_new_animal();
    }
    else if (userInput === "b") {
        go_back();
    }
}
/** Requests user what move they want to make between yes, no or back.
 * @param tree - Binary tree with nodes representing questions and leaves
 * representing animals.
 */
function process_node(tree) {
    if (userInput === "y") {
        go_left_or_right("right", tree, tree.right);
    }
    else if (userInput === "n") {
        go_left_or_right("left", tree, tree.left);
    }
    else if (userInput === "b") {
        go_back();
    }
    log_tree_value();
}
/** Determines if a leaf or node has been reached and runs appropriate function.
 * Each function call represents a game turn.
 * @param tree - Binary tree with nodes representing questions and leaves
 * representing animals.
 */
function game_turn() {
    if (typeof (tree_state) === "string") {
        process_leaf(tree_state);
    }
    else {
        process_node(tree_state);
    }
}
/** Displays message on text box.
 * @param message - String representing message to be displayed.
 */
function display(message) {
    document.getElementById("text-box").innerHTML = message;
}
/** Displays either the question or the animal, depending on if tree_state is a
 * tree or a singular leaf.
 */
function log_tree_value() {
    if (typeof (tree_state) !== "string") {
        display(tree_state.value);
    }
    else {
        display("Are you thinking of a " + tree_state + "?");
    }
}
//Website functions
/** Resets the game by resetting tree_state to tree_state_saved, hiding the
 * submit and download button. Clearing turns, path_to_animal, game_history and
 * setting game_started to true.
 */
function start() {
    hide_element("buttonSubmit");
    hide_element("buttonDownload");
    submitQuestion = "start";
    turns = 0;
    tree_state = tree_state_saved;
    hide_element("text-input");
    path_to_animal = (0, list_1.list)();
    game_history = (0, stack_1.empty)();
    log_tree_value();
    game_started = true;
}
window.start = start;
/** If game has started and the yes button is pressed on the website,
 * then it sets user_input to "y" and runs game_turn.
 */
function yes_button() {
    if (game_started) {
        userInput = "y";
        game_turn();
    }
}
window.yes_button = yes_button;
/** If game has started and the no button is pressed on the website,
 * then it sets user_input to "n" and runs game_turn.
 */
function no_button() {
    if (game_started) {
        userInput = "n";
        game_turn();
    }
}
window.no_button = no_button;
/** If game has started and the back button is pressed on the website,
 * then it sets user_input to "b" and runs game_turn.
 */
function back_button() {
    if (game_started) {
        userInput = "b";
        game_turn();
    }
}
window.back_button = back_button;
/** Clears the text area by setting its value to "".
 */
function clear_text_area() {
    const textInput = document.getElementById("text-input");
    textInput.value = "";
}
/** Retrieves contents of the text box.
 * @returns - String in the text box
 */
function read_text_box() {
    const textInput = document.getElementById("text-input");
    return textInput.value;
}
/** Saves either a user created animal or a question, depending on if
 * animal has been found or not, while displaying relevant text instructions.
 * Updates tree_state_saved if question was submitted.
 */
function submit_button() {
    if (submitQuestion === "animal") {
        new_animal = read_text_box();
        show_element("buttonSubmit");
        display("Give me a yes or no question that separates " + new_animal +
            " from " + tree_state + ". <br/>Please make it as broad as possible," +
            " where your animal has the answer yes.");
        submitQuestion = "question";
    }
    else if (submitQuestion === "question") {
        new_question = read_text_box();
        submitQuestion = "start";
        display("Thank you, " + new_animal + " has been added successfully!");
        show_element("buttonDownload");
        hide_element("buttonSubmit");
        tree_state_saved = edit_in_tree(path_to_animal, tree_state_saved, { value: new_question,
            left: tree_state,
            right: new_animal });
    }
    clear_text_area();
}
window.submit_button = submit_button;
/** Sends a download link to the jsonfile containing 'data' and namned 'filename'.
 * @param data
 * @param filename
 */
function downloadJSONFile(data, filename) {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
/**
 *
 * @param id
 */
function hide_element(id) {
    document.getElementById(id).style.opacity = "0";
    document.getElementById(id).style.cursor = "default";
}
/**
 *
 * @param id
 */
function show_element(id) {
    document.getElementById(id).style.opacity = "1";
    document.getElementById(id).style.cursor = "pointer";
}
/**
 *
 */
function download_json() {
    if (new_animal !== "" && new_question !== "") {
        downloadJSONFile(tree_state_saved, "animal_data.json");
    }
    new_animal = "";
    new_question = "";
}
window.download_json = download_json;

},{"./../../lib/list":3,"./../../lib/stack":4,"./../animal_data.json":2}],2:[function(require,module,exports){
module.exports={
  "value": "Does it live on land?",
  "left": {
    "value": "Does it fly?",
    "left": {
      "value": "Is it a carnivore?",
      "left": {
        "value": "Does it have an exoskeleton?",
        "left": {
          "value": "Does it give birth to live animals?",
          "left": {
            "value": "Is it typically kept as a pet?",
            "left": "Salmon",
            "right": "Gold fish"
          },
          "right": "Dolphin"
        },
        "right": "Crab"
      },
      "right": {
        "value": "is it a mammal?",
        "left": {
          "value": "Is it a reptile?",
          "left": "Shark",
          "right": "Crocodile"
        },
        "right": "Killer whale"
      }
    },
    "right": {
      "value": "Is it a carnivore?",
      "left": "Pidgeon",
      "right": "Eagle"
    }
  },
  "right": {
    "value": "Is it a mammal?",
    "left": {
      "value": "Is it a reptile?",
      "left": {
        "value": "Is it a bird?",
        "left": "Ant",
        "right": {
          "value": "Does it live in cold climates?",
          "left": "Chicken",
          "right": "Penguin"
        }
      },
      "right": "Snake"
    },
    "right": {
      "value": "Is it domesticated?",
      "left": {
        "value": "Is it a herbivore?",
        "left": {
          "value": "Does it have spots?",
          "left": {
            "value": "Does your animal exist in northern nature?",
            "left": {
              "value": "Does it have stripes?",
              "left": "Lion",
              "right": "Tiger"
            },
            "right": {
              "value": "Is it bipedal?",
              "left": {
                "value": "Does it have white fur?",
                "left": {
                  "value": "Does it hibernate during the winter?",
                  "left": "Bear",
                  "right": "Fox"
                },
                "right": "Polar bear"
              },
              "right": "Human"
            }
          },
          "right": "Cheetah"
        },
        "right": {
          "value": "Is the animal typically found in bodies of water?",
          "left": {
            "value": "Does it have a long neck?",
            "left": {
              "value": "Is it smaller than a fox?",
              "left": "Elephant",
              "right": "Squirrel"
            },
            "right": "Giraffe"
          },
          "right": "Capybara"
        }
      },
      "right": {
        "value": "Does it have hair? (not fur)",
        "left": {
          "value": "Does it eat cat food?",
          "left": {
            "value": "Is your animal an herbivore?",
            "left": "Dog",
            "right": {
              "value": "Is it larger than the average dog?",
              "left": "Bunny",
              "right": "Sheep"
            }
          },
          "right": "Cat"
        },
        "right": {
          "value": "Is it livestock?",
          "left": "Horse",
          "right": {
            "value": "Does it have a curly tail?",
            "left": "Cow",
            "right": "Pig"
          }
        }
      }
    }
  }
}
},{}],3:[function(require,module,exports){
"use strict";
// Provides a typed implementation of Source lists
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatten = exports.fold_left = exports.accumulate = exports.list_ref = exports.enum_list = exports.all = exports.filter = exports.remove_all = exports.remove = exports.member = exports.append = exports.reverse = exports.for_each = exports.build_list = exports.map = exports.length = exports.to_string = exports.list = exports.is_null = exports.tail = exports.head = exports.pair = void 0;
/**
 * Construct a pair.
 * @template H the type of the head
 * @template T the type of the tail
 * @param hd head (first component)
 * @param tl tail (second component)
 * @returns Returns a pair whose head is hd and whose tail is y.
 */
function pair(hd, tl) {
    return [hd, tl];
}
exports.pair = pair;
/**
 * Retrieve the head element from a pair.
 * @param p input pair
 * @returns Returns the head (first component) of pair p.
 */
function head(p) {
    return p[0];
}
exports.head = head;
/**
 * Retrieve the tail element from a pair.
 * @param p input pair
 * @returns Returns the tail (second component) of pair p.
 */
function tail(p) {
    return p[1];
}
exports.tail = tail;
/**
 * Check whether a value is null.
 * @param v value to check
 * @returns Returns true if v is equal to null (using ===).
 */
function is_null(v) {
    return v === null;
}
exports.is_null = is_null;
/**
 * Create a list from an array.
 * @template S the element type of the new list
 * @param elements An array of values
 * @returns Returns a new list whose values are the same as in the elements array
 *     (in the same order).
 */
function list(...elements) {
    let lst = null;
    for (let i = elements.length - 1; i >= 0; i = i - 1) {
        lst = pair(elements[i], lst);
    }
    return lst;
}
exports.list = list;
/**
 * The empty list of a given type.
 * Convenience function.
 * @template T the element type
 * @returns the empty list of type T
 */
function empty_list() {
    return null;
}
/**
 * Give a string representation of a list
 * @template T the element type of the list
 * @param xs the list
 * @returns a string representation of xs
 */
function to_string(xs) {
    function print(s) {
        const tl = tail(s);
        return is_null(tl)
            ? head(s) + ""
            : head(s) + ", " + print(tl);
    }
    if (xs === null) {
        return "list()";
    }
    else {
        return "list(" + print(xs) + ")";
    }
}
exports.to_string = to_string;
/**
 * Tally the length of a list
 * Tail recursive.
 * @template T
 * @param xs a list
 * @returns the length of xs
 */
function length(xs) {
    function $length(xs, acc) {
        return is_null(xs) ? acc : $length(tail(xs), acc + 1);
    }
    return $length(xs, 0);
}
exports.length = length;
/**
 * Map a function over all entries in a list, creating a new list with the results
 * Tail recursive.
 * @template T the element type of the argument list
 * @template U the return type of the function
 * @param f the function to map
 * @param xs the argument list
 * @returns the result of mapping f over xs
 */
function map(f, xs) {
    function $map(f, xs, acc) {
        return is_null(xs)
            ? reverse(acc)
            : $map(f, tail(xs), pair(f(head(xs)), acc));
    }
    return $map(f, xs, null);
}
exports.map = map;
/**
 * Build a list using a function from list indices to entries
 * Tail recursive.
 * @template T the type of elements in the list to build
 * @param fun Calling fun(i) yields the element at index i (starting at 0)
 * @param n the length of the new list
 * @returns the new list
 */
function build_list(fun, n) {
    function $build_list(i, fun, already_built) {
        return i < 0 ? already_built : $build_list(i - 1, fun, pair(fun(i), already_built));
    }
    return $build_list(n - 1, fun, null);
}
exports.build_list = build_list;
/**
 * Call a function on each element in a list
 * Iterative.
 * @template T the element type of the list
 * @template U the return type of the function (ignored)
 * @param fun the function to call on each element
 * @param xs the list
 */
function for_each(fun, xs) {
    while (!is_null(xs)) {
        fun(head(xs));
        xs = tail(xs);
    }
}
exports.for_each = for_each;
/**
 * Reverse a list.
 * Tail recursive.
 * @template T the element type of the list
 * @param xs the list to reverse
 * @returns a new list containing the entries of xs in reverse order
 */
function reverse(xs) {
    function $reverse(original, reversed) {
        return is_null(original)
            ? reversed
            : $reverse(tail(original), pair(head(original), reversed));
    }
    return $reverse(xs, null);
}
exports.reverse = reverse;
/**
 * Concatenate two lists.
 * Tail recursive.
 * @template T the element type of the lists
 * @param xs first list
 * @param ys second list
 * @returns Returns a list that results from appending the list ys to the end
 *     of list xs.
 */
function append(xs, ys) {
    function $append(xs, ys, cont) {
        return is_null(xs)
            ? cont(ys)
            : $append(tail(xs), ys, zs => cont(pair(head(xs), zs)));
    }
    return $append(xs, ys, xs => xs);
}
exports.append = append;
/**
 * Search for an element in a list
 * Tail recursive.
 * @template T the element type of the list
 * @param elem the element to search for
 * @param xs the list to search in
 * @returns the first postfix sublist that has elem as its first element,
 *     or null if elem does not exist in xs.
 */
function member(elem, xs) {
    return is_null(xs)
        ? null
        : elem === head(xs)
            ? xs
            : member(elem, tail(xs));
}
exports.member = member;
/**
 * Remove one occurrence of an element from a list
 * @template T the element type of the list
 * @param elem the element to remove
 * @param xs the list to remove elem from
 * @returns a version of xs where the first occurrence of elem (if any) has been removed
 */
function remove(elem, xs) {
    function $remove(v, xs, acc) {
        // Ensure that typechecking of append and reverse are done independently
        const app = append;
        const rev = reverse;
        return is_null(xs)
            ? app(rev(acc), xs)
            : v === head(xs)
                ? app(rev(acc), tail(xs))
                : $remove(v, tail(xs), pair(head(xs), acc));
    }
    return $remove(elem, xs, null);
}
exports.remove = remove;
/**
 * Remove all occurrences of an element from a list
 * @template T the element type of the list
 * @param elem the element to remove
 * @param xs the list to remove elem from
 * @returns a version of xs where all occurrences of elem (if any) have been removed
 */
function remove_all(v, xs) {
    function $remove_all(v, xs, acc) {
        // Ensure that typechecking of append and reverse are done independently
        const app = append;
        const rev = reverse;
        return is_null(xs)
            ? app(rev(acc), xs)
            : v === head(xs)
                ? $remove_all(v, tail(xs), acc)
                : $remove_all(v, tail(xs), pair(head(xs), acc));
    }
    return $remove_all(v, xs, null);
}
exports.remove_all = remove_all;
/**
 * Keep the elements satisfying a given predicate
 * Tail recursive.
 * @template T the element type of the list
 * @param pred the predicate
 * @param xs the list
 * @returns the sublist of xs containing exactly those elements for which pred is true.
 */
function filter(pred, xs) {
    function $filter(pred, xs, acc) {
        return is_null(xs)
            ? reverse(acc)
            : pred(head(xs))
                ? $filter(pred, tail(xs), pair(head(xs), acc))
                : $filter(pred, tail(xs), acc);
    }
    return $filter(pred, xs, null);
}
exports.filter = filter;
/**
 * Check if a predicate holds for all elements of a list
 * @template T the element type of the list
 * @param pred the predicate
 * @param xs the list
 * @returns true iff pred returns true for all elements in xs
 */
function all(pred, xs) {
    return is_null(xs) ? true : pred(head(xs)) && all(pred, tail(xs));
}
exports.all = all;
/**
 * Create a list containing successive numbers
 * Tail recursive.
 * @param start the first and smallest number in the list
 * @param end the last number in the list
 * @returns a list containing the numbers from start to end, inclusive, in order.
 */
function enum_list(start, end) {
    function $enum_list(start, end, acc) {
        // Ensure that typechecking of reverse are done independently
        const rev = reverse;
        return start > end
            ? rev(acc)
            : $enum_list(start + 1, end, pair(start, acc));
    }
    return $enum_list(start, end, null);
}
exports.enum_list = enum_list;
/**
 * Get the element at a given index of a list
 * Tail recursive. Indices start at 0.
 * @template T the element type of the list
 * @param xs the list to index into
 * @param i the index
 * @returns the element at index i,
 *     or undefined if i is greater than or equal to the length of the list.
 */
function list_ref(xs, i) {
    return is_null(xs) ? undefined : i === 0 ? head(xs) : list_ref(tail(xs), i - 1);
}
exports.list_ref = list_ref;
/**
 * Combines all elements of a list using a binary operation, in right-to-left order.
 * Tail recursive.
 * accumulate(op, zero, list(1, 2, 3)) results in op(1, op(2, op(3, zero)))
 * @template T the element type of the list
 * @template U the type of the result of the binary operation
 * @param op the binary operation
 * @param initial the initial value
 * @param xs the list
 * @returns the result of combining the elements of xs using op,
 *      from right to left starting with initial.
 */
function accumulate(op, initial, xs) {
    function $accumulate(op, initial, xs, cont) {
        return is_null(xs)
            ? cont(initial)
            : $accumulate(op, initial, tail(xs), x => cont(op(head(xs), x)));
    }
    return $accumulate(op, initial, xs, x => x);
}
exports.accumulate = accumulate;
/**
 * Combines all elements of a list using a binary operation, in left-to-right order.
 * Tail recursive.
 * fold_left(op, zero, list(1, 2, 3)) results in op(op(op(zero, 1), 2), 3)
 * @template T the element type of the list
 * @template U the type of the result of the binary operation
 * @param op the binary operation
 * @param initial the initial value
 * @param xs the list
 * @returns the result of combining the elements of xs using op,
 *      from left to right starting with initial.
 */
function fold_left(f, initial, xs) {
    return is_null(xs)
        ? initial
        : fold_left(f, f(initial, head(xs)), tail(xs));
}
exports.fold_left = fold_left;
/**
 * Flatten a list of lists into a single list, in order.
 * @template T the element type of the lists
 * @param xss the list of lists
 * @returns the result of concatenating all the lists, in order.
 */
function flatten(xss) {
    return accumulate(append, empty_list(), xss);
}
exports.flatten = flatten;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.display_stack = exports.pop = exports.top = exports.push = exports.is_empty = exports.empty = void 0;
const list_1 = require("./list");
/**
 * Constructs a stack without any elements.
 * @template T type of all stack elements
 * @returns Returns an empty stack.
 */
function empty() {
    return null;
}
exports.empty = empty;
/**
 * Checks whether a stack is empty.
 * @template T type of all stack elements
 * @param stck stack to check for emptiness
 * @returns Returns true, if the stack stck has to elements, false otherwise.
 */
function is_empty(stck) {
    return (0, list_1.is_null)(stck);
}
exports.is_empty = is_empty;
/**
 * Pushes an element onto a stack.
 * @template T type of all stack elements
 * @param e element to add
 * @param stck stack to add the element to
 * @returns Returns a new stack with element e on top of the elements of stck.
 */
function push(e, stck) {
    return (0, list_1.pair)(e, stck);
}
exports.push = push;
/**
 * Retrieves the top element of a stack.
 * @template T type of all stack elements
 * @param stck stack to get the top element of
 * @returns Returns the element of the stack stck that was last pushed.
 */
function top(stck) {
    return (0, list_1.head)(stck);
}
exports.top = top;
/**
 * Removes the top element of a stack.
 * @template T type of all stack elements
 * @param stck stack to remove the top element of
 * @returns Returns a stack with all of the elements of stck except for the
 *     top element.
 */
function pop(stck) {
    return (0, list_1.tail)(stck);
}
exports.pop = pop;
/**
 * Pretty-prints the contents of a stack to standard output.
 * @template T type of all stack elements
 * @param stck stack to pretty-print
 */
function display_stack(stck) {
    function print(s) {
        const tl = (0, list_1.tail)(s); // needs to be a variable for type-checking
        return is_empty(tl)
            ? (0, list_1.head)(s) + ""
            : (0, list_1.head)(s) + ", " + print(tl);
    }
    if (is_empty(stck)) {
        console.log("stack()");
    }
    else {
        console.log("stack(" + print(stck) + ")");
    }
}
exports.display_stack = display_stack;

},{"./list":3}]},{},[1]);
