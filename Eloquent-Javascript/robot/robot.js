// https://medium.com/basecs/breaking-down-breadth-first-search-cebe696709d9

const { curryN, compose, filter, map, split } = require("./utils.js");

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

let createState = (n) => ({
  addresses,
  deliver: {},
  mailbag: [],
  moves: 0,
  parcels: [...randomParcels(addresses, n)],
  place: "",
  roadGraph,
  route: []
});

function getStats(n) {
  const results = [];
  for (let i = 0; i < 50; ++i) {
    let state = createState(n);
    state = runRobot(state);
    results.push(state.moves);
  }
  let average = results.reduce((sum, moves) => sum + moves, 0) / results.length;
  let min = Math.min(...results);
  let max = Math.max(...results);
  let median = [...results].sort()[25];
  return {min, median, max, average};
}

const n1 = addresses.length * 2;
console.log(`${n1}, ${addresses.length} stats: ${JSON.stringify(getStats(n1))}`);
// takes roughly 21 moves to deliver 22 packages... only slightly better than
// the mailman route of looping all addresses twice which would take 22 moves.

const n2 = addresses.length * 10;
console.log(`${n2}, ${addresses.length} stats: ${JSON.stringify(getStats(n2))}`);
// takes 25 moves. Definitely worse than the constant 22 moves...

let createPad = (len) => {
  let pad = "";
  for (let i = 0; i < len; ++i)
    pad += " ";
  return pad;
};

let padEnd = curryN((width, n) => {
  let str = `${n}`;
  while (str.length < width)
    str += " ";
  return str;
});

let table = ` n     | mn    | md    | mx    | ag    |`;
for(let i = 0; i < 100; ++i) {
  let stats = getStats(i);
  let { min, max, median, average } = getStats(i);
  let cell = padEnd(6); 
  table += `\n ${cell(i)}| ${cell(min)}| ${cell(median)}| ${cell(max)}| ${cell(average)}|`;
}

// Results:
//  n     | mn    | md    | mx    | ag    |
//  0     | 0     | 0     | 0     | 0     |
//  1     | 3     | 5     | 9     | 5.56  |
//  2     | 5     | 6     | 12    | 8.02  |
//  3     | 6     | 13    | 15    | 10.56 |
//  4     | 8     | 12    | 16    | 11.54 |
//  5     | 9     | 13    | 17    | 12.84 |
//  6     | 8     | 14    | 21    | 14.12 |
//  7     | 10    | 15    | 20    | 15.08 |
//  8     | 11    | 15    | 20    | 15.18 |
//  9     | 13    | 16    | 22    | 16.78 |
//  10    | 12    | 17    | 25    | 17.58 |
//  11    | 13    | 18    | 23    | 17.66 |
//  12    | 12    | 17    | 25    | 17.66 |
//  13    | 13    | 18    | 22    | 18.18 |
//  14    | 14    | 19    | 26    | 19    |
//  15    | 14    | 20    | 24    | 19.68 |
//  16    | 14    | 19    | 24    | 19.32 |
//  17    | 14    | 19    | 24    | 19.14 |
//  18    | 16    | 20    | 24    | 19.98 |
//  19    | 15    | 20    | 28    | 20.46 |
//  20    | 16    | 20    | 24    | 20.06 |
//  21    | 16    | 21    | 26    | 21.08 |
//  22    | 18    | 21    | 26    | 20.94 |
//  23    | 15    | 21    | 26    | 20.94 |
//  24    | 16    | 21    | 27    | 21.46 |
//  25    | 16    | 21    | 27    | 21.24 |
//  26    | 18    | 22    | 25    | 21.54 |
//  27    | 17    | 22    | 28    | 21.5  |
//  28    | 18    | 22    | 27    | 22.2  |
//  29    | 18    | 22    | 27    | 22.42 |
//  30    | 19    | 22    | 30    | 22.32 |
//  31    | 18    | 23    | 28    | 22.32 |
//  32    | 18    | 23    | 28    | 23.08 |
//  33    | 19    | 23    | 29    | 22.88 |
//  34    | 18    | 23    | 30    | 23.14 |
//  35    | 19    | 23    | 29    | 23.28 |
//  36    | 19    | 23    | 29    | 22.94 |
//  37    | 19    | 23    | 29    | 23.42 |
//  38    | 19    | 23    | 26    | 22.82 |
//  39    | 18    | 24    | 29    | 23.32 |
//  40    | 19    | 24    | 29    | 23.66 |
//  41    | 18    | 24    | 29    | 23.86 |
//  42    | 19    | 24    | 29    | 23.98 |
//  43    | 19    | 23    | 28    | 23.68 |
//  44    | 21    | 24    | 29    | 24.22 |
//  45    | 19    | 24    | 30    | 23.84 |
//  46    | 19    | 23    | 31    | 23.86 |
//  47    | 20    | 23    | 35    | 23.68 |
//  48    | 19    | 24    | 30    | 23.98 |
//  49    | 19    | 24    | 31    | 24.68 |
//  50    | 19    | 24    | 31    | 24.06 |
//  51    | 19    | 24    | 31    | 24.22 |
//  52    | 20    | 24    | 30    | 24.4  |
//  53    | 18    | 25    | 30    | 24.3  |
//  54    | 21    | 24    | 31    | 24.68 |
//  55    | 20    | 24    | 31    | 24.54 |
//  56    | 21    | 24    | 28    | 24.46 |
//  57    | 22    | 24    | 33    | 24.22 |
//  58    | 20    | 25    | 32    | 25.1  |
//  59    | 21    | 25    | 29    | 24.6  |
//  60    | 20    | 25    | 31    | 24.9  |
//  61    | 21    | 25    | 31    | 25.2  |
//  62    | 20    | 24    | 29    | 24.42 |
//  63    | 19    | 25    | 32    | 25.04 |
//  64    | 21    | 25    | 33    | 25.64 |
//  65    | 21    | 25    | 33    | 25.24 |
//  66    | 21    | 25    | 33    | 25    |
//  67    | 21    | 25    | 31    | 25.18 |
//  68    | 21    | 25    | 31    | 25.78 |
//  69    | 21    | 25    | 32    | 24.98 |
//  70    | 21    | 25    | 31    | 24.8  |
//  71    | 22    | 25    | 35    | 26.06 |
//  72    | 22    | 25    | 32    | 25.54 |
//  73    | 21    | 25    | 31    | 25.18 |
//  74    | 20    | 25    | 31    | 25.18 |
//  75    | 21    | 25    | 30    | 25.46 |
//  76    | 21    | 25    | 31    | 25.14 |
//  77    | 21    | 25    | 29    | 24.98 |
//  78    | 21    | 25    | 32    | 25.72 |
//  79    | 21    | 26    | 33    | 25.78 |
//  80    | 20    | 25    | 32    | 25.66 |
//  81    | 21    | 26    | 34    | 26.2  |
//  82    | 22    | 26    | 31    | 26.16 |
//  83    | 21    | 25    | 31    | 25.54 |
//  84    | 20    | 25    | 32    | 25.78 |
//  85    | 21    | 26    | 33    | 25.72 |
//  86    | 21    | 25    | 31    | 25.56 |
//  87    | 22    | 25    | 32    | 25.58 |
//  88    | 20    | 27    | 32    | 26.56 |
//  89    | 21    | 25    | 33    | 25.8  |
//  90    | 21    | 25    | 32    | 25.4  |
//  91    | 22    | 25    | 34    | 26.14 |
//  92    | 20    | 26    | 32    | 25.82 |
//  93    | 21    | 26    | 35    | 26.4  |
//  94    | 21    | 26    | 31    | 25.7  |
//  95    | 22    | 26    | 33    | 26.24 |
//  96    | 21    | 25    | 31    | 25.78 |
//  97    | 22    | 26    | 33    | 26.52 |
//  98    | 22    | 26    | 32    | 26.18 |
//  99    | 21    | 25    | 31    | 25.26 |
