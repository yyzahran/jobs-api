const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors')
const Job = require('../models/Job');

const getAllJobs = async (req, res) => {
    // get only the jobs that are associated with a specific user
    // sort fetched jobs by createdBy date
    const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

const getJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req;

    // asserting the userId and jobId from the request match an entry in the db
    const job = await Job.findOne({
        _id: jobId, createdBy: userId
    });

    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ job })
};

const createJob = async (req, res) => {
    // the User model is in req.user
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job })
}

const updateJob = async (req, res) => {
    const { body: { company, position },
        user: { userId },
        params: { id: jobId } } = req;

    if (company === '' || position === '') {
        throw new BadRequestError(`Company and position fields cannot be empty!`)
    }

    /**
     * We wanna pass in what we wanna update
     * We wanna pass in which job we're looking for
     * Options to get back to updated version or run the validators
     */
    const job = await Job.findOneAndUpdate({
        _id: jobId, createdBy: userId
    },
        req.body, { new: true, runValidators: true }
    )

    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req;

    const job = await Job.findByIdAndRemove({
        _id: jobId, createdBy: userId
    })

    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).send();
}

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob }
