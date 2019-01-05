const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true,
}));

const port = 3001;

const store = {
	username: '',
	total: 1000,
};

app.post('/login', (req, res) => {
	const username = req.body.username;		
	store.username = username;
	res.cookie('auth', 'true', {
		maxAge: 60 * 60 * 1000,
		httpOnly: true,
	});
	res.redirect('account');
});

app.get('/login', (req, res) => {
	res.sendFile(path.join(__dirname, 'views/login.html'));
});

app.get('/account', (req, res) => {
	const authCookie = req.cookies.auth;
	if (!authCookie) {
		return res.redirect('/login');
	}
	return res.render('account', store);
});

app.get('/transfer', (req, res) => {
	const amt = +req.query.amt;
	store.total -= amt;
	res.sendStatus(200);
});

app.listen(port, () => console.log("app is listening at 3001"));
