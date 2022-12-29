const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Public
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) return res.status(400).json({ message: 'No users found' })

    res.json(users)
});

// @desc Create new user
// @route POST /users
// @access Public
const createNewUser = asyncHandler(async (req, res) => {
    const { 
        username, 
        password, 
        firstName, 
        lastName,
        email
    } = req.body
    
    // Confirm data
    if (!username || !password || !firstName || !lastName || !email) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicates
    const duplicateUsername = await User.findOne({ username })
        .collation({ locale: 'en', strength: 2 }).lean().exec()
    if (duplicateUsername) return res.status(409).json({ message: 'Duplicate username' })

    const duplicateEmail = await User.findOne({ email })
        .collation({ locale: 'en', strength: 2 }).lean().exec()
    if (duplicateEmail) return res.status(409).json({ message: 'Duplicate email' })

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10);

    // Create and store new user
    const user = await User.create({
        username, 'password': hashedPwd, firstName, lastName, email
    })

    if (user) {
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

// @desc Update user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { 
        id, 
        username, 
        firstName, 
        lastName,
        about,
        image,
        role, 
        active, 
        password 
    } = req.body
    
    // Confirm data 
    if (!id || !username || !firstName || !lastName || !role || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'Please enter all required fields' })
    }

    // Does the user exist to update?
    const user = await User.findById(id).exec()

    if (!user) return res.status(400).json({ message: 'User not found' })

    // Check for duplicate 
    const duplicate = await User.findOne({ username })
        .collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow updates to the original user 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user.username = username
    user.firstName = firstName
    user.lastName = lastName
    user.about = about ? about : undefined
    user.role = role
    user.active = active
    user.image = image ? image : undefined

    if (password) user.password = await bcrypt.hash(password, 10)

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
});

// @desc Delete user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) return res.status(400).json({ message: 'User ID required' });

    const user = await User.findById(id).exec();

    if (!user) return res.status(400).json({ message: 'User not found' });

    const result = await user.deleteOne();

    const reply = `Username ${result.username} with ID ${result._id} deleted`;

    res.json(reply);
})

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser }