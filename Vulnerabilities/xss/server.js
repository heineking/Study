const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const port = 3000;

app.set('view engine', 'pug');
app.set('views', './views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

const store = {
  name: 'Unknown!',
  ssn: [],
};

app.get('/persisted', (req, res) => {
  res.render('persisted', {
    title: 'Reflected',
    name: store.name,
  });
});

app.post('/persisted', (req, res) => {
  const name = req.body.name;
  store.name = name;
  res.redirect('/persisted');
});

app.get('/reflected', (req, res) => {
  const term = req.query.term;
  res.render('reflected', {
    title: 'Reflected',
    term: term,
  });
});

app.get('/dom', (req, res) => {
  res.render('dom', {
    ssn: '123-45-6789',
    parts: `parts: ${store.ssn.join(', ')}`,
  });
});

app.get('/dom-xss', (req) => {
  const part = req.query.part;
  store.ssn.push(part);
});

app.listen(port, () => console.log('app listening on port 3000'));
