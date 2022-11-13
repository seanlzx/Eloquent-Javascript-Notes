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
// when the robot moves and does a deilivery, the current position and the undelivered parcel collection should update

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

        let parcels = this.parcels.map(p => {
			if (p.place != this.place) {return p};                  //wut the de fuck this is to ensure the parcel is picked up in the first place lol
			return {place: destination, address: p.address};
		}).filter(
			p => p.address != p.place
		);

		return new VillageState(destination, parcels);
	}
}

// or instead of updating the virtual world, return a new one...
// if next destination doesn't have a path, return the old state instead
// onced moved to new place, if any parcels 

// Parcel objects aren't changed but recreated
// the move method gives us a new village state but leaves the old one entirely intact

// btw place is where the parcel is currently -_-, address, is destination

// this should allow us to give the robot memory

function runRobot(state, robot, memroy) {
	for (let turn = 0;;turn++){
		if(state.parcels.length == 0){
			console.log(`Done in ${turn} turns`)
			break
		}
		let action = robot(state, memory)
		state = state.move(action.direction)
		memory = action.memory;
		console.log(`Moved to ${action.direction}`)
	}
}

function randomPick(array){
	let choice = Math.floor(Math.random() * array.length);
	return array[choice]
}

function randomRobot(state){
	return {direction: randomPick(roadGraph[state.place])};
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


let first = new VillageState("Post Office", 
[
    {place: 'Post Office', address: "Bob's House"}, 
    {place: 'Post Office', address: 'Farm'}, 
    {place: 'Post Office', address: 'Shop'},
    {place: 'Post Office', address: "Daria's House"},
    {place: 'Post Office', address: 'Cabin'}
]);
console.log(first)

let second = first.move("Marketplace");
console.log(second);

let third = second.move("Farm");
console.log(third);

let Fourth = third.move("Grete's House");
console.log(Fourth);

let Fifth = Fourth.move("Shop");
console.log(Fifth);