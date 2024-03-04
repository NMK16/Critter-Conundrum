import { edit_in_tree, Tree, back_button, set_tree_state, start, read_tree_state, 
         yes_button, enable_test_mode, game_started, no_button, submit_question, 
         new_animal,  submit_button, new_question, tree_state_saved, test_output,
         process_node, user_input, go_back, turns,
         path_to_animal} from './Website/Critter_Conundrum_HTML';
import { list } from './../lib/list';

//Tests for Critter_Conundrum.ts
// test('Edit in tree replaces pig with a question to distinguish Horse from Zebra', () => {
//     expect(edit_in_tree_ts(list("right", "right"), tree, {"value": "Does it have stripes", "left": "Pig", "right": "Zebra"})).toStrictEqual(result_tree);
// });

// test('Go back function goes backwards upon call', () =>{
//     let path_to_animal = list("right");
//     let game_history = empty();
//     const old_tree: Tree = {"value": "Does it have legs", "left": "Snake", "right": {"value": "Does it live on land?", "left": "Pidgeon", "right": "Ape"}};
//     game_history = push(old_tree, game_history);

//     let game_turn_recieved: Tree = "";
//     function game_turn(tree: Tree): void {
//         game_turn_recieved = tree;
//     }

//     const tree: Tree = {"value": "Does it live on land?", "left": "Pidgeon", "right": "Ape"};

//     //go_back_ts(tree);
    
//     //expect(path_to_animal).toStrictEqual(list());
//     //expect(game_history).toStrictEqual(empty());
//     //expect(game_turn_recieved).toStrictEqual(old_tree);
// });

//Tests for Critter_Conundrum_HTML.ts

test('Answering yes, then going back returns same tree as when started', () => {
    enable_test_mode();
    const tree: Tree = {"value": "Is it livestock?",
                    "left": "Horse",
                    "right": {"value": "Does it have hooves?",
                              "left": "Cow",
                              "right": "Pig"}};

    start();
    set_tree_state(tree);

    yes_button();
    
    back_button();

    expect(read_tree_state()).toStrictEqual(tree);
});
test('Answering yes when the tree is a single leaf sets game_started to false', 
    () => {
    enable_test_mode();
    const tree: Tree = "Horse";
    start();
    set_tree_state(tree);
    expect(game_started).toStrictEqual(true); //Asks user if the animal 
                                              //they're thinking of is a horse

    yes_button();
    
    expect(game_started).toStrictEqual(false);
});
test('Answering no when the tree is a single leaf ', () => {
    enable_test_mode();
    const tree: Tree = "Horse";
    start();
    set_tree_state(tree);
    expect(game_started).toStrictEqual(true); //Asks user if the animal 
                                              //they're thinking of is a horse
    expect(submit_question).toStrictEqual("start");

    no_button();
    
    expect(submit_question).toStrictEqual("animal");
});
test('Submitting new animals and questions works', () => {
    enable_test_mode();
    const tree: Tree = "Elephant";
    start(); // Asks if Elephant was the animal the user was thinking of
    set_tree_state(tree);

    no_button(); //user answers no
    expect(new_animal).toStrictEqual(""); //No new animal has been submitted yet
    expect(new_question).toStrictEqual(""); //No new question has been submitted yet

    submit_button(); //user submits the animal: "test mode enabled" 
                     //because program can't read text area in test mode
    expect(new_animal).toStrictEqual("test mode enabled");
    submit_button();

    //The new question should now also be: "test mode enabled"
    expect(new_question).toStrictEqual("test mode enabled"); 
    
    // The new animal along with its question is added to tree_state_saved
    expect(tree_state_saved).toStrictEqual({"value": "test mode enabled", 
                                            "left": "Elephant",
                                            "right": "test mode enabled"});
});
test('Edit in tree replaces pig with a question to distinguish Horse from Zebra', 
    () => {
    const tree: Tree = {"value": "Is it livestock?",
                        "left": "Horse",
                        "right": {
                            "value": "Does it have a curly tail?",
                            "left": "Cow",
                            "right": "Pig"
                        }
                       };
    const result_tree: Tree = {"value": "Is it livestock?",
                               "left": "Horse",
                               "right": {
                                    "value": "Does it have a curly tail?",
                                    "left": {
                                        "value": "Does it have stripes", 
                                        "left": "Cow", 
                                        "right": "Zebra"
                                    },
                                    "right": "Pig"
                                }
                              };

    expect(edit_in_tree(list("right", "left"), 
                        tree, {"value": "Does it have stripes", 
                               "left": "Cow", 
                               "right": "Zebra"})).toStrictEqual(result_tree);
});
test('Incorrect path gives errors in tree', () => {
    const tree: Tree = {"value": "Is it livestock?",
                        "left": "Horse",
                        "right": "Cow"
                       };
    const result_tree: Tree = {"value": "Is it livestock?",
                               "left": "Horse",
                               "right": "error"
                              };

    const result_tree2: Tree = {"value": "Is it livestock?",
    "left": "error",
    "right": "Cow"
    };
    expect(edit_in_tree(list("right", "left"), 
                        tree, {"value": "Does it have stripes", 
                               "left": "Cow", 
                               "right": "Zebra"})).toStrictEqual(result_tree);                       
    expect(edit_in_tree(list("left", "right"), 
                        tree, {"value": "Does it have stripes", 
                               "left": "Cow", 
                               "right": "Zebra"})).toStrictEqual(result_tree2);                       

});
test('Processing Horse displays correct message', () => {
    enable_test_mode();
    const tree: Tree = "Horse";
    start();
    set_tree_state(tree);

    yes_button();
    const out: string = "I'm the best! I guessed your animal (Horse) in 0 questions!";
    expect(test_output).toStrictEqual(out);
});
test('Process node outputs the question in tree node', () => {
    enable_test_mode();
    start();
    const tree: Tree = {"value": "Is it livestock?",
                        "left": "Horse",
                        "right": "Cow"
                       };
    set_tree_state(tree);
    expect(user_input).toStrictEqual("start");
    process_node(tree);
    expect(test_output).toStrictEqual("Is it livestock?");
});
test('Go back function reduces turns and path', () => {
    enable_test_mode();
    start();
    const tree: Tree = {"value": "Is it livestock?",
                        "left": "Horse",
                        "right": "Cow"
                       };
    set_tree_state(tree);
    yes_button();
    expect(turns).toBe(1);
    expect(path_to_animal).toStrictEqual(list("right"));
    go_back();  
    expect(turns).toBe(0);
    expect(path_to_animal).toBe(list());
});
