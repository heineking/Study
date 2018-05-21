// https://medium.com/basecs/breaking-down-breadth-first-search-cebe696709d9

const { compose, filter, map, split } = require("./utils.js");

const roads = [
  "Alice's House-Bob's House",   "Alice's House-Cabin",
  "Alice's House-Post Office",   "Bob's House-Town Hall",
  "Daria's House-Ernie's House", "Daria's House-Town Hall",
  "Ernie's House-Grete's House", "Grete's House-Farm",
  "Grete's House-Shop",          "Marketplace-Farm",
  "Marketplace-Post Office",     "Marketplace-Shop",
  "Marketplace-Town Hall",       "Shop-Town Hall"
];

// utilites

const addEdge = (graph, [a, b]) => {
  return Object.assign(
    {},
    graph,
    { 
      [a]: (graph[a] || []).concat(b),
      [b]: (graph[b] || []).concat(a) 
    }
  )
};

function buildGraph(edges) {
  const graph = Object.create(null);
  return edges
    .map(split("-"))
    .reduce(addEdge, graph);
}

function randomAddress(addresses) {
  const idx = Math.floor(Math.random()*addresses.length);
  return addresses[idx];
}

function* randomParcels(addresses, count) {
  while (count-- > 0) {
    let sender = randomAddress(addresses);
    let to = randomAddress(addresses.filter(addr => addr !== sender));
    yield {
      sender,
      to
    };
  }
}

function move(state, destination) {
  const { 
    bag, 
    moves,
    parcels, 
    place, 
    roadGraph, 
  } = state;

  if (!roadGraph[place].includes(destination))
    return state;

  const pickUp = parcels.filter(parcel => parcel.sender === place);

  return {
    ...state,
    moves: moves + 1,
    place: destination,
    bag: bag.filter(mail => mail.to !== place).concat(pickUp),
    parcels: parcels.filter(parcel => parcel.sender !== place)
  };
}

function dfs(graph, source, destination, stack = []) {
  if (source === destination)
    return stack;
  
  let neighbors = graph[source];
  for(let neighbor of neighbors) {
    if (!stack.includes(neighbor))
      return dfs(graph, neighbor, destination, [...stack, neighbor])
  }
}

function findShortestRoute(graph, source, destination) {
  let queue = [{ node: source, route: [] }];
  for (let { node, route } of queue) {
    for (let neighbor of graph[node]) {
      if (!queue.some(visited => visited.node === neighbor))
        queue.push({ node: neighbor, route: [...route, neighbor] });
    }
    if (node === destination)
      return route;
  }
}

let roadGraph = buildGraph(roads);
let addresses = Object.keys(roadGraph);

let state = {
  addresses,
  bag: [],
  moves: 0,
  parcels: [...randomParcels(addresses, 5)],
  place: "Post Office",
  roadGraph,
};

const route = findShortestRoute(roadGraph, "Post Office", "Town Hall");
debugger;