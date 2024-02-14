//type: mammal, reptile, insect, avians
//skin: dotted fur, striped fur, fur, feathers, hair, scales
//feet: hooves, paws, 
const Animals: Array<Record<string, string>> = 
                [{name: "Lion", element: "land", diet: "carnivore", 
                  type: "mammal", skin: "fur", domesticated: "false"},
                     
                 {name: "Eagle", element: "air", diet: "carnivore", 
                  type: "avian", skin: "feathers", domesticated: "false"},
                     
                 {name: "Shark", element: "water", diet: "carnivore", 
                  type: "fish", skin: "scales", domesticated: "false"},
                     
                 {name: "Salmon", element: "water", diet: "herbivore", 
                  type: "fish", skin: "scales", domesticated: "false"},
                     
                 {name: "Crab", element: "water", diet: "omnivore", 
                  type: "shellfish", skin: "exoskeleton", domesticated: "false"},
                     
                 {name: "Cat", element: "land", diet: "omnivore", 
                  type: "mammal", skin: "fur", domesticated: "true"},
                     
                 {name: "Dog", element: "land", diet: "omnivore", 
                  type: "mammal", skin: "fur", domesticated: "true"},
                     
                 {name: "Pidgeon", element: "air", diet: "omnivore", 
                  type: "avian", skin: "feathers", domesticated: "true"},
                    
                 {name: "Horse", element: "land", diet: "herbivore", 
                  type: "mammal", skin: "hair", domesticated: "true"},
                     
                 {name: "Elephant", element: "land", diet: "herbivore", 
                  type: "mammal", skin: "skin", domesticated: "false"},

                 {name: "Ant", element: "land", diet: "herbivore", 
                  type: "insect", skin: "exoskeleton", domesticated: "false"},];
//Questions
//Does it fly/live in water/live on land?

//Is it a carnivore/herbivore/omnivore?

//Is it a mammal/avian/insect/amphebian/reptile?

//Does it have fur/feathers/skin/hair/an exoskeleton

//Is it domesticated?

export function one_turn(animals: Array<Record<string, string>>): Array<Record<string, string>> {
	let on_land: number = 0;
	let in_water: number = 0;
	let in_air: number = 0;

	let carnivore: number = 0;
	let omnivore: number = 0;
	let herbivore: number = 0;

	let mammal: number = 0;
	let avian: number = 0;
	let reptile: number = 0;
	let insect: number = 0;

	let exoskeleton: number = 0;
	let fur: number = 0;
	let hair: number = 0;
	let scales: number = 0;
	let feathers: number = 0;
	let skin: number = 0;

	let domesticated: number = 0;
	let not_domesticated: number = 0;
}
