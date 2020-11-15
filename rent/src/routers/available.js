const express = require('express');
const mongoose = require('mongoose');
const BodyParser = require("body-parser");
const ObjectID = require("mongodb").ObjectID;

const router = express.Router()

router.use(BodyParser.json())
router.use(BodyParser.urlencoded({ extended: true }))

const availableSchema = mongoose.Schema({
    name: {type: String},
    type: {type: String},
    price: {type: Number}
    //time: {type: String}
    //unit_Id: {type: String}
}, {
    versionKey: false
});

router.post('/available', async (req, res) => {
    try {
        const available = new Available(req.body)
        await available.save()
        //res.send()
        console.log('200')
        res.sendStatus(200)

            } catch (error) {
                res.status(500).send(error)
                console.log('500')
            }
});

router.get('/available', (req, res) => {

    const availables = mongoose.model('availables', availableSchema);
    
    availables.find({}, function(err, data) { 
        
        if (err) { 
            console.log(err)
            return res.sendStatus(500)
        }
        res.send(data); });
    
});

router.delete('/available/:id', (req, res) => {
    
    const availables = mongoose.model('availables', availableSchema);

    availables.deleteOne({ _id: ObjectID(req.params.id) }, function (err) { 
        
        if (err) {
            res.sendStatus(500)
        }});
    res.sendStatus(200)
})

const Available = mongoose.model('Available', availableSchema);

module.exports = router