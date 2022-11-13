'use strict';

const roads = [
	"Alice's House-Bob's House",   "Alice's House-Cabin",
	"Alice's House-Post Office",   "Bob's House-Town Hall",
	"Daria's House-Ernie's House", "Daria's House-Town Hall",
	"Ernie's House-Grete's House", "Grete's House-Farm",
	"Grete's House-Shop",          "Marketplace-Farm",
	"Marketplace-Post Office",     "Marketplace-Shop",
	"Marketplace-Town Hall",       "Shop-Town Hall"
  ];

function buildGraph(edges){
	let graph = Object.create(null);

	let addEdges = function(from, to){
		if(!(from in graph)){
			graph[from] = [to];
		} else {
			graph[from].push(to)
		}
	}

	for(let [from, to] of edges.map(p => p.split("-"))){
		addEdges(from, to);
		addEdges(to, from);
	}

	return graph;
}

const roadGraph = buildGraph(roads);

// a robot is tasked to deliver parcels to their destination, along the way it may pick up other parcels with various destination
// at any given configuration of current location and parcels in storage, find the most optimal way to deliver till no parcels
// are left


// first build a virtual world to show where the robot is and where the parcels are

class VillageState {
	constructor(place, parcels) {
		this.place = place;
		this.parcels = parcels;
	}

	move(destination) {
		if (!roadGraph[this.place].includes(destination))  {			//cant do roadGraph.this.place.includes, cos rmb this.place is a string?
			console.log("Invalid Move")	
			return this;
		}
		let parcels = this.parcels.map(p => {							//wut the de fuck, .map is to ensure the parcel is picked up in the first place lol, I would've phrased it if p.place = this.place return {place:destination, address}; return p
			if (p.place != this.place) return p;
			return {place: destination, address: p.address};
		}).filter(
			p => p.address != p.place									//this work cause place can only change once the .map reaches the place
		)

		return new VillageState(destination, parcels)
	}
}

// or instead of updating the virtual world, return a new one...
// if next destination doesn't have a path, return the old state instead
// onced moved to new place, if any parcels 

// Parcel objects aren't changed but recreated
// the move method gives us a new village state but leaves the old one entirely intact

// btw place is where the parcel is currently -_-, address, is destination

// this should allow us to give the robot memory

function runRobot(state, robot, memory) {
	for (let turn = 0;;turn++){
		if(state.parcels.length == 0){
			console.log(`Done in ${turn} turns`)
			break
		}
		let action = robot(state, memory)
		state = state.move(action.direction)
		memory = action.memory;
	}
}

function randomPick(array){
	let choice = Math.floor(Math.random() * array.length);
	return array[choice]
}

VillageState.random = function(parcelCount = 5) {
	let parcels = [];
	let place = ""
	let address = ""
	for (let i = 0; i < parcelCount; i++) {
	 	place = randomPick(Object.keys(roadGraph));
		do {	
			address = randomPick(Object.keys(roadGraph));
		} while (place == address);
		parcels.push({place, address});
	}
	return new VillageState("Post Office", parcels);
}

//somehow the first.move("Marketplace") was changing the console.log(parcels) below it, try copying the exact same thing from eloquentJS code for move and it fixed it

//this is const so in can't be modified and it can be reused again
const mailRoute = [
	"Alice's House", "Cabin", "Alice's House", "Bob's House",
	"Town Hall", "Daria's House", "Ernie's House",
	"Grete's House", "Shop", "Grete's House", "Farm",
	"Marketplace", "Post Office"
];

function randomRobot(state){
	console.log(roadGraph[state.place])
	return {direction: randomPick(roadGraph[state.place])}
}

// runRobot(VillageState.random(), randomRobot);

function routeRobot(state, memory) {
	if (memory.length == 0) {		//runs incase there are still parcels to be handed out
		memory = mailRoute; 	
	}
	return {direction: memory[0], memory: memory.slice(1)};
}

// runRobot(VillageState.random(), routeRobot, [])		//the memory parameter should be an empty array, the robot will have the route

// a function to find the route without relying on recursion
function findRoute(graph, from, to) {
	let work = [{at: from, route: []}]
	for (let i = 0; i < work.length; i++){
		let {at, route} = work[i];
		for(let place of graph[at]){
			if(place == to) return route.concat(place)
			//test without this condition
			if(!work.some(w => w.at == place))
				work.push({at: place, route: route.concat(place)})
		}
	}
}

//!!!!!!!!!!!!!!!!!!!!!attempt findRoute with recursion too
function goalOrientedRobot({place, parcels}, route){
	if (route.length == 0){
		let parcel = parcels[0] // do the first parcel first
		if(parcel.place != place) //if not already at place
			route = findRoute(roadGraph, place, parcel.place)
		else
			route = findRoute(roadGraph, place, parcel.address)
	}
	return{direction: route[0], memory: route.slice(1)}
}

function myRobot({place, parcels}, route) {
	//compute shortest pick ups first, then shortest deliveries
	if(route.length == 0) {
		let shortestRouteLength = Infinity;
		let temp; 
		let isAllPickedUp = true;

		for (let parcel of parcels){
			//check for parcels that haven't been picked up parcel.place != place
			if (parcel.place != place){
				isAllPickedUp = false;

				temp = findRoute(roadGraph, place, parcel.place)

				if (temp.length < shortestRouteLength){
					shortestRouteLength = temp.length;
					route = temp;
				} 		
			}
		}

		if(isAllPickedUp){
			for (let parcel of parcels){
				temp = findRoute(roadGraph, place, parcel.address)
				if (temp.length < shortestRouteLength) {
					shortestRouteLength = temp.length;
					route = temp;
				}
			}
		}
	} 
	return{direction: route[0], memory: route.slice(1)}
}
// solution from eloquent javascript
function lazyRobot({place, parcels}, route) {
	if (route.length == 0) {
	  // Describe a route for every parcel (myNotes: uses parcels.map for each element to return routes to route array)
	  let routes = parcels.map(parcel => {
		if (parcel.place != place) {
		  return {route: findRoute(roadGraph, place, parcel.place),
				  pickUp: true};
		} else {
		  return {route: findRoute(roadGraph, place, parcel.address),
				  pickUp: false};
		}
	  });
  
	  // This determines the precedence a route gets when choosing.
	  // Route length counts negatively, routes that pick up a package
	  // get a small bonus.
	  function score({route, pickUp}) {
		return (pickUp ? 0.5 : 0) - route.length;
	  }
	  route = routes.reduce((a, b) => score(a) > score(b) ? a : b).route;
	}
  
	return {direction: route[0], memory: route.slice(1)};
  }

//my a more concise version of my robot, huh it seems their not exactly the same whatever
function myConciseRobot({place, parcels}, route){
	if(route.length == 0){
		let routes = parcels.map(parcel =>{
			if (parcel.place != place)
			 	return {route: findRoute(roadGraph, place, parcel.place), isPickedUp: false};
			else 
				return {route: findRoute(roadGraph, place, parcel.address), isPickedUp: true};
		})


		function findShortest(a, c) {
			return a.route.length < c.route.length ? a : c;
		}
	
		//if still have parcels to pick up
		if(routes.some(route => !route.isPickedUp)){
			route = routes.filter(route => !route.isPickedUp).reduce(findShortest).route;
		}
		else
			route = routes.reduce(findShortest).route;
	}

	return {direction: route[0], memory: route.slice(1)}
}	

function compareRobots(robot1, initialMemory1, robot2, initialMemory2) {
	let totalTurn1 = 0;
	let totalTurn2 = 0;

	//100 comparisons
	for(let i = 0; i < 100000; i++){
		//initilize a deep copy of state for robot2? a deep copy is not necessary cause this objects .move returns a new object rather than modifying properties within
		let state1 = VillageState.random();
		let state2 = state1; 
		
		//could have done a count step function for each robot
		//robot1
		let memory1 = initialMemory1;
		for(;;totalTurn1++){
			if(state1.parcels.length == 0)break;
			let action1 = robot1(state1, memory1);
			state1 = state1.move(action1.direction);
			memory1 = action1.memory;
		}

		//robot2
		let memory2 = initialMemory2;
		for(;;totalTurn2++){
			if(state2.parcels.length == 0)break;
			let action2 = robot2(state2, memory2)
			state2 = state2.move(action2.direction);
			memory2 = action2.memory;
		}
	}

	console.log(`robot1 avg: ${totalTurn1/100000}, robot2 avg ${totalTurn2/100000}`)

}

compareRobots(myRobot, [], myConciseRobot, [])

// conventionally static methods of a class is written above the constructor

// you can write static methods by directly adding them to the constructor

// btw add whatever you learnt to a note
// persistent data, data structures that don't change are called immutable or persistent.
// kind of like strings and numbers

// in JS, just about everything can chagne, so working with values that are supposed to be persistent requires restraint
// so example VillageState has methods very similar to those of strings and numbers which return new strings and numbers,
// rather than modify it's current one

// note: in c char* (string literals) are mutable, in javascript strings are immutable

// Object.freeze ensures that writings to its properties are ignored 
// effectively making it immutable?
/* however
	freezing requires computer to do more work
	freezing tends to confuse people, more than them doing the wrong thing
	"So I usually prefer to tell people that a given object shouldn't be messed with and hope they remember it" -marijin */

// why does marijin want his objects to be immutable? 
// it just make's it easier to understand, kind of like how in C, it's easier to deal with chars, ints and strings compared to arrays
// can consider operations on them in isoation, always having to create a new binding for a new state, helps you keep track of them

// "anything that makes your code easier to understand makes it possible to build a more ambitious system" - marijin

// persistent group
/*
	most data structures provided in standard JS aren't well suited for persistent use. arrays have a few methods, that create new arrays without damaging the old ones, but set has none.
*/