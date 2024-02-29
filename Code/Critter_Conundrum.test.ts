import { edit_in_tree as edit_in_tree_ts, Leaf, NonEmptyTree, 
         Tree, go_back as go_back_ts, path_to_animal as path_to_animal_ts,
         game_history as game_history_ts, turns as turns_ts, game_turn as game_turn_ts} from './Critter_Conundrum'
import { edit_in_tree as edit_in_tree_html, go_back as go_back_html, back_button, set_tree_state, start, read_tree_state, yes_button, set_user_input, game_turn as game_turn_html, enable_test_mode} from './Website/Critter_Conundrum_HTML'
import { List, head, list, is_null, tail, append } from './../lib/list';
import { Stack, pop, top, empty, push, is_empty } from './../lib/stack';

const tree: Tree = {"value": "Is it livestock?",
                    "left": "Horse",
                    "right": {"value": "Does it have hooves?",
                              "left": "Cow",
                              "right": "Pig"}};

const result_tree: Tree = {"value": "Is it livestock?",
                           "left": "Horse",
                           "right": {"value": "Does it have hooves?",
                                     "left": "Cow",
                                     "right": {"value": "Does it have stripes", 
                                               "left": "Pig", 
                                               "right": "Zebra"}}};


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

test('answering yes, then going back returns same tree as when started', () => {
    enable_test_mode();
    const tree: Tree = {"value": "Is it livestock?",
                    "left": "Horse",
                    "right": {"value": "Does it have hooves?",
                              "left": "Cow",
                              "right": "Pig"}};

    start();
    set_tree_state(tree);
    //start_node_env();

    yes_button();
    
    back_button();

    expect(read_tree_state()).toStrictEqual(tree);
    

});