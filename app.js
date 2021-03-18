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

    // Agrega credenciales
    mercadopago.configure({
        access_token: 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398'
    });

    // Crea un objeto de preferencia
    let preference = {
        items: [
            {
                title: req.body.tittle,
                picture_url: req.body.img,
                unit_price: req.body.price,
                quantity: req.body.unit,
            }
        ]
    };

    mercadopago.preferences.create(preference)
        .then(function (response) {
            // Este valor reemplazará el string "<%= global.id %>" en tu HTML
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