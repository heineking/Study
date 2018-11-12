const simpleLevelPlan = `
......................
..#................#..
..#..............=.#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`;

const vector = ({ x, y }) => ({
  x, y,
  plus({ x: dx, y: dy }) {
    return vector({ x: x + dx, y: y + dy });
  },
  times(factor) {
    return vector({ x: x * factor, y: y * factor });
  },
});

const store = (() => {
  // state
  let state = {
    status: "",
    level: {
      height: 0,
      width: 0,
      rows: []
    },
    actors: [],
  };

  // listener callbacks
  const listeners = [];

  // prototypes
  const prototypes = {
    coin: {
      size: vector({ x: 0.6, y: 0.6 }),
    },
    lava: {
      size: vector({ x: 1, y: 1 }),
    },
    player: {
      size: vector({
        x: 0.8,
        y: 1.5,
      }),
    }
  };

  // reducers
  const mutations = {
    initialize(state, { plan }) {
      const rows = plan.trim().split(/\r?\n/).map(row => [...row]);
      return {
        ...state,
        level: {
          height: rows.length,
          width: rows[0].length,
          rows,
        },
      };
    },
    convertLevelChar(state, { x, y, text }) {
      // in memory mutation :/
      state.level.rows[y][x] = text;
      return state;
    },
    createCoin(state, { x, y }) {
      const coin = Object.create(prototypes.coin);

      const position = vector({ x, y });
      Object.assign(coin, {
        position: position.plus({ x: 0.2, y: 0.1 }),
        basePosition: position.plus({ x: 0.2, y: 0.1 }),
        type: "coin",
        wobble: Math.random() * Math.PI * 2,
      });

      return {
        ...state,
        actors: state.actors.concat(coin),
      }
    },
    createLava(state, { x, y, ch }) {	
      const lava = Object.create(prototypes.lava);
      Object.assign(lava, {
        position: vector({ x, y }),
        type: "lava",
      });

      if (ch === "=") {
        lava.speed = vector({ x: 2, y: 0 });
      } else if (ch === "|") {
        lava.speed = vector({ x: 0, y: 2 });
      } else if (ch === "v") {
        lava.speed = vector({ x: 0, y: 3 });
        lava.reset = vector(lava.position);
      }

      return {
        ...state,
        actors: state.actors.concat(lava),
      };
    },
    createPlayer(state, { x, y }) {
      const player = Object.create(prototypes.player);
      Object.assign(player, {
        type: "player",
        position: vector({ x, y }).plus({ x: 0, y: -0.5 }),
        speed: vector({ x: 0, y: 0 }),
      });

      return {
        ...state,
        actors: state.actors.concat(player),
      };
    }
  };

  const reducer = (state, { type, payload }) => {
    const mutation = mutations[type];
    return mutation ? mutation(state, payload) : state;
  };

  // utilities
  const getState = () => state;

  const subscribe = (listener) => {
    listeners.push(listener);
  };

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };

  // middleware
  const logger = store => next => action => {
    console.group(action.type);
    console.info("dispatching", action);
    let result = next(action);
    console.log("next state", store.getState());
    console.groupEnd();
    return result;
  };

  // store api
  const middlewareAPI = {
    getState,
    dispatch: (...args) => dispatch(...args),
  };

  return {
    getState,
    subscribe,
    dispatch: logger(middlewareAPI)(dispatch),
  };
})();

store.dispatch({
  type: "initialize",
  payload: {
    plan: simpleLevelPlan
  },
});

const { level: { rows } } = store.getState();

const actorCharsToActionType = {
  "@": "createPlayer",
  "o": "createCoin",
  "=": "createLava",
  "|": "createLava",
  "v": "createLava",
};

const gridCharsToGridTypes = {
  ".": "empty",
  "#": "wall",
  "+": "lava",
};

rows.forEach((row, y) => {
  return row.forEach((ch, x) => {
    // create the actor
    const actorActionType = actorCharsToActionType[ch];

    if (actorActionType) {
      store.dispatch({ type: actorActionType, payload: { x, y, ch } });
      store.dispatch({ type: "convertLevelChar", payload: { x, y, text: "empty" } });
    }

    const gridType = gridCharsToGridTypes[ch];
    if (gridType) {
      store.dispatch({ type: "convertLevelChar", payload: { x, y, text: gridType } });
    }
  });
});

const scale = 20;
function drawGrid(level) {
  return elt("table", {
    class: "background",
    style: `width: ${level.width * scale}px`
  }, ...level.rows.map(row => 
    elt("tr", { style: `height: ${scale}px`},
          ...row.map(type => elt("td", { class: type })))
  ));
}

function drawActors(actors) {
  return elt("div", {}, ...actors.map(actor => {
    let rect = elt("div", { class: `actor ${actor.type}`});
    rect.style.width = `${actor.size.x * scale}px`;
    rect.style.height = `${actor.size.y * scale}px`;
    rect.style.left = `${actor.position.x * scale}px`;
    rect.style.top = `${actor.position.y * scale}px`;
    return rect;
  }))
}

// Game
const dom = elt("div", { class: "game" }, drawGrid(store.getState().level));

let actorLayer = null;

function syncState() {
  if (actorLayer) actorLayer.remove();
  const state = store.getState();
  actorLayer = drawActors(state.actors);
  dom.appendChild(actorLayer);
  dom.className = `game ${state.status}`;
}

const app = document.getElementById("level");
app.appendChild(dom);
syncState();