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

function randomPick(array){
	let choice = Math.floor(Math.random() * array.length);
	return array[choice]
}

parcels = []
let place = ""
let address = ""
for (let i = 0; i < 100; i++){
    place = randomPick(Object.keys(roadGraph))
    do {
        address = randomPick(Object.keys(roadGraph))
    } while(place == address)

    parcels.push({place, address})
}

console.log(parcels)