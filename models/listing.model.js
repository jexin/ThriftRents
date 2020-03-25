const mongoose = require('mongoose')

const listingSchema = new mongoose.Schema({
    title: {type: String, required: true},
    address: {type: String, required: true},
    location: {
        type: {
            type: String, 
            enum: ['Point'], 
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: {type: [Buffer]},
    description: {type: String},
    price: {type: Number, required: true},
    type: {type: String, required: true},
    bed: {type: Number, required: true},
    bath: {type: Number, required: true},
    gender: {type: String, required: true},
    term: {type: [String], required: true},
    length: {type: String, required: true},
    start: {type: Date, required: true},
    end: {type: Date, required: true},
    included: {type: [String]},
    rows: [{
        room: { type: String },
        name: { type: String },
        tags: { type: String }
    }],
    contact: {
        instagram: { type: String },
        facebook: {type: String },
        twitter: {type: String },
        reddit: {type: String },
        snapchat: {type: String },
        wechat: {type: String },
        phone: {type: String },
        email: {type: String }
    },
    userId: { type: String }
}, {
    timestamps: true
})

const Listing = mongoose.model('Listing', listingSchema)

module.exports = Listing