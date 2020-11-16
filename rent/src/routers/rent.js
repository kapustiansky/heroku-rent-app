const express = require('express');
const mongoose = require('mongoose');
const BodyParser = require("body-parser");
const ObjectID = require("mongodb").ObjectID;

const router = express.Router()

router.use(BodyParser.json())
router.use(BodyParser.urlencoded({ extended: true }))

const rentSchema = mongoose.Schema({
    name: {type: String},
    type: {type: String},
    price: {type: Number},
    time: {type: Number},
    cost: {type: Number}
}, {
    versionKey: false
});

router.post('/rent', async (req, res) => {
    try {
        const rent = new Rent(req.body)
        await rent.save()
        res.sendStatus(200)

            } catch (error) {
                res.status(500).send(error)
            }
});

router.get('/rent', (req, res) => {

    const rents = mongoose.model('rents', rentSchema);
    
    rents.find({}, function(err, data) { 
        
        if (err) { 
            console.log(err)
            return res.sendStatus(500)
        }
        res.send(data); });
    
});

router.delete('/rent/:id', (req, res) => {
    
    const rents = mongoose.model('rents', rentSchema);

    rents.deleteOne({ _id: ObjectID(req.params.id) }, function (err) { 
        
        if (err) {
            res.sendStatus(500)
        }});
    res.sendStatus(200)
})

const Rent = mongoose.model('Rent', rentSchema);

module.exports = router