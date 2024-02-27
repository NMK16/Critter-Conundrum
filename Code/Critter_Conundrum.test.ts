import { edit_in_tree, Leaf, NonEmptyTree, Tree } from './Critter_Conundrum'
import { List, head, list, is_null, tail, append } from './../lib/list'

// const test_tree: Tree = 
// {
//     "value": "Does it live on land?",
//     "left": {
//       "value": "Does it fly?",
//       "left": {
//         "value": "Is it a carnivore?",
//         "left": {
//           "value": "Does it have an exoskeleton?",
//           "left": "Salmon",
//           "right": "Crab"
//         },
//         "right": "Shark"
//       },
//       "right": {
//         "value": "Is it a carnivore?",
//         "left": "Pidgeon",
//         "right": "Eagle"
//       }
//     },
//     "right": {
//       "value": "Is it a mammal?",
//       "left": {
//         "value": "Is it a reptile?",
//         "left": {
//           "value": "Is it a bird?",
//           "left": "Ant",
//           "right": "Chicken"
//         },
//         "right": "Snake"
//       },
//       "right": {
//         "value": "Is it domesticated?",
//         "left": {
//           "value": "Is it a herbivore?",
//           "left": {
//             "value": "Does it have spots?",
//             "left": {
//               "value": "Does your animal exist in northern nature?",
//               "left": "Lion",
//               "right": {
//                 "value": "Is it bipedal?",
//                 "left": "Bear",
//                 "right": "Human"
//               }
//             },
//             "right": "Cheetah"
//           },
//           "right": "Elephant"
//         },
//         "right": {
//           "value": "Does it have hair? (not fur!)",
//           "left": {
//             "value": "Does it eat cat food?",
//             "left": {
//               "value": "Is your animal an herbivore?",
//               "left": "Dog",
//               "right": "Bunny"
//             },
//             "right": "Cat"
//           },
//           "right": {
//             "value": "Is it livestock?",
//             "left": "Horse",
//             "right": {
//               "value": "Does it have hooves?",
//               "left": "Cow",
//               "right": "Pig"
//             }
//           }
//         }
//       }
//     }
//   }

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

test('Edit in tree replaces pig with a question to distinguish Horse from Zebra', () => {
    expect(edit_in_tree(list("right", "right"), tree, {"value": "Does it have stripes", "left": "Pig", "right": "Zebra"})).toStrictEqual(result_tree);
});
