const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide a company name'],
        maxlength: 50,
    },
    position: {
        type: String,
        required: [true, 'Please provide a position title'],
        maxlength: 100,
    },
    status: {
        type: String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending',
    },
    // ties the job to its user
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User', // which model are we using
        required: [true, 'Please provide user']
    },
}, { timestamps: true });

module.exports = mongoose.model("Job", JobSchema);
