const User = require('../models/User')
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
    /** Validating values in the controller */
    // const { name, email, password } = req.body
    // if (!name || !email || !password) {
    //     throw new BadRequestError("Please provide name, email and password")
    // }

    // const user = await User.create({ ...req.body }); // bad practice, saving password in the db


    /** Hashing the password */
    // const { name, email, password } = req.body;
    // const salt = await bcrypt.genSalt(10); // salt is random bytes, 10 in this case
    // const hashedPassword = await bcrypt.hash(password, salt)

    // const tempUser = { name, email, password: hashedPassword }
    const user = await User.create({ ...req.body });

    // creating token
    // const token = jwt.sign({ userId: user._id, name: user.name }, 'jwtSecret', {
    //     expiresIn: '30d',
    // });
    const token = user.createJWT();
    // res.status(StatusCodes.CREATED).json({ user });
    // sending the user's name and token
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });

}

const login = async (req, res) => {
    const { email, password } = req.body;

    // checking that email and password are provided
    if (!email || !password) {
        throw new BadRequestError("Please provide email and password")
    }

    // check for user
    const user = await User.findOne({ email });

    // making sure email exists
    if (!user) {
        throw new UnauthenticatedError("Invalid credentials")
    }

    // compare password and checking if it's correct
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Invalid credentials")
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
};

module.exports = { register, login };
