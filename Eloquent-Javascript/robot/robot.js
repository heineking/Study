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

function findBestRoute(state) {
  const { mailbag, parcels, place: source, roadGraph } = state;

  // get the possible destinations but prefer the unpicked up parcels first
  const parcelAddresses = parcels
    .map(parcel => parcel.sender);
 
  const mailBagAddresses = mailbag 
    .map(mail => mail.to);
 
  const destinations = [...new Set([...parcelAddresses, ...mailBagAddresses])];
  
  let bestRoute = [];
  for(let destination of destinations) {
    let route = findShortestRoute(roadGraph, source, destination);

    if (route.length === 1)
      return route;

    if (route.length < (bestRoute.length || Infinity))
      bestRoute = route;
  }

  return bestRoute;
}

const pickUpMail = (state) => {
  const { mailbag, place, parcels } = state;
  return {
    ...state,
    parcels: parcels.filter(parcel => parcel.sender !== place),
    mailbag: mailbag.concat(parcels.filter(parcel => parcel.sender === place))
  };
};

const dropOffMail = (state) => {
  const { mailbag, place } = state;
  const deliver = mailbag
    .filter(mail => mail.to === place)
    .reduce((deliver, mail) => {
      deliver[mail.to] = (deliver[mail.to] || []).concat(mail);
      return deliver;
    }, state.deliver);

  return {
    ...state,
    deliver,
    mailbag: mailbag.filter(mail => mail.to !== place)
  };
};

const moveToDestination = (destination) => (state) => {
  const { moves, place, route } = state;
  return {
    ...state,
    place: destination,
    moves: moves + 1,
    route: place ? [...route, place] : route
  };
}

const moveRobot = (state, destination) => {
  const { place } = state;
  
  return compose(
    pickUpMail,
    dropOffMail,
    moveToDestination(destination)
  )(state);
};

const runRobot = (state) => {
  let route = [];
  while (state.mailbag.length || state.parcels.length) {
    route = state.place === "" 
      ? ["Post Office"]
      : route.length ? route : findBestRoute(state);

    state = moveRobot(state, route.shift())
  }
  return state;
};

let roadGraph = buildGraph(roads);
let addresses = Object.keys(roadGraph);

function getAverage(n) {
  const results = [];
  for (let i = 0; i < 50; ++i) {
    let state = {
      addresses,
      deliver: {},
      mailbag: [],
      moves: 0,
      parcels: [...randomParcels(addresses, n)],
      place: "",
      roadGraph,
      route: []
    };

    state = runRobot(state);
    results.push(state.moves);
  }

  return results.reduce((sum, moves) => sum + moves, 0) / results.length;
}

const n1 = addresses.length * 2;
console.log(`Delivering ${n1} packages for ${addresses.length} addresses takes ${getAverage(n1)} moves on average`);
// takes roughly 21 moves to deliver 22 packages... only slightly better than
// the mailman route of looping all addresses twice which would take 22 moves.

const n2 = addresses.length * 10;
console.log(`Delivering ${n2} packages for ${addresses.length} addresses takes ${getAverage(n2)} moves on average`);
// takes 25 moves. Definitely worse than the constant 22 moves...