/* -- FP Helpers -- */

function reverseArgs (fn) {
  return (...args) => fn(...args.reverse())
};

function curry (fn, arity = fn.length) {
  return (function currying(...prev) {
    return (...next) => {
      const args = [...prev, ...next];
      return args.length >= arity ? fn(...args) : currying(...args);
    };
  }());
}

function compose(...fns) {
  return fns.reduce((a,b) => (...args) => a(b(...args)));
}

/* -- app function -- */
const createElement = document.createElement.bind(document);

function prop(obj, name) {
  return obj[name];
}

function setElem(elem, value) {
  elem.innerHTML = value;
  return elem;
}

function addElem(parent, elem) {
  parent.appendChild(elem);
  return parent;
}

const selectValue = compose(
  curry(reverseArgs(prop), 2)('value'),
  document.getElementById.bind(document)
);

const item = compose(
  curry(setElem),
  createElement
);

const createTodoItem = compose(
  item('li'),
  selectValue
);

const createAndAddTodo = compose(
  curry(addElem)(document.getElementById('todoItems')),
  createTodoItem
);

const addBtn = document.getElementById('add');
addBtn.onclick = () => {
  createAndAddTodo('todo');
  