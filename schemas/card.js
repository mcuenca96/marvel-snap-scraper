const { Schema, model, models } = require('mongoose');

const cardSchema = new Schema({
    id: {
        type: String,
        unique: true,
    },
    name: String,
    ability: String,
    power: String,
    cost: String,
    image: String,
});

const Card = (models.Card || model('Card', cardSchema))

module.exports = Card;