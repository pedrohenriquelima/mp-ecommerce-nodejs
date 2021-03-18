var express = require('express');
var exphbs = require('express-handlebars');
var port = process.env.PORT || 3000

var app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    const mercadopago = require('mercadopago');

    mercadopago.configure({
        access_token: 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398',
        integrator_id: 'dev_24c65fb163bf11ea96500242ac130004'
    });
    console.log(req)
    let preference = {
        items: [
            {
                title: req.query.title,
                picture_url: req.headers.host + req.query.img.substring(1),
                unit_price: parseFloat(req.query.price),
                quantity: parseInt(req.query.unit),
            }
        ]
    };
    
    mercadopago.preferences.create(preference)
        .then(function (response) {
            console.log(response)
            global.id = response.body.id;
        }).catch(function (error) {
            console.log(error);
        });

    res.render('detail', req.query);
});

app.get('/checkout', function (req, res) {
    res.render('checkout', req.query);
});

app.listen(port);