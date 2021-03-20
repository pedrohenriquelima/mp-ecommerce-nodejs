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

    let preference = {
        items: [
            {
                id: 1234,
                title: req.query.title,
                description: 'Dispositivo móvil de Tienda e-commerce',
                picture_url: req.headers.host + req.query.img.substring(1),
                unit_price: parseFloat(req.query.price),
                quantity: parseInt(req.query.unit),
            }
        ],
        payer: {
            name: 'Lalo',
            surname: 'Landa',
            identification: {
                type: 'DNI',
                number: '22333444'
            },
            email: 'test_user_63274575@testuser.com',
            phone: {
                area_code: '011',
                number: 22223333
            },
            address: {
                street_name: 'Falsa',
                street_number: 123,
                zip_code: '1111'
            }
        },
        external_reference: 'pedrolimaesilva95@gmail.com',
        back_urls: {
            success: req.headers.host + '/success',
            pending: req.headers.host + '/pending',
            failure: req.headers.host + '/failure'
        },
        auto_return: 'approved',
        payment_methods: {
            excluded_payment_methods: [
                {
                    id: 'amex'
                }
            ],
            excluded_payment_types: [
                {
                    id: 'atm'
                }
            ],
            installments: 6
        },
        notification_url: "https://pedrohenriquelima-checkout.herokuapp.com/notification",
    };

    mercadopago.preferences.create(preference)
        .then(function (response) {
            req.query.preference_id = response.body.id;
            res.render('detail', req.query);
        }).catch(function (error) {
            console.log(error);
            res.render('failure', req.query);
        });

});

app.get('/checkout', function (req, res) {
    res.render('checkout', req.query);
});

app.get('/success', function (req, res) {
    res.render('success', req.query);
});

app.get('/pending', function (req, res) {
    res.render('pending', req.query);
});

app.get('/failure', function (req, res) {
    res.render('failure', req.query);
});

app.listen(port);