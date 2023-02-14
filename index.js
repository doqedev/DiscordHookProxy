const express = require('express')
const app = express()
const cloudscraper = require('cloudscraper')
const axios = require('axios')
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
    windowMs: 1000 * 60,
    max: 29,
    standardHeaders: true,
    legacyHeaders: false
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/webhooks', limiter)


app.get('/api/webhooks/:id/:token', (req, res) => {
    cloudscraper.get(`https://discord.com/api/webhooks/${req.params.id}/${req.params.token}`).then((resp) => {
        res.json(JSON.parse(resp))
    }, console.error)
})

app.post('/api/webhooks/:id/:token', (req, res) => {
    var config = {
        method: 'post',
        url: `https://discord.com/api/webhooks/${req.params.id}/${req.params.token}`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: req.body
    };

    axios(config)
        .then(function (response) {
            res.send(response.data)
        })
        .catch(function (error) {
            res.status(500).send("Something went wrong!")
            console.log(error);
        });
})

app.listen(3000, () => {
    console.log("Ready!")
})