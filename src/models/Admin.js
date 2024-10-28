const { type } = require('express/lib/response')
const mongoose = require('mongoose')
const { trim, isLowercase } = require('validator')
const bcrypt = require('bcryptjs')
const validator = require('validator')


const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            Lowercase: true,
            validator(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email!')
                }
            }
        },
        password: {
            type: String,
            require: true,
            minlength: 7,
            validate(value) {
                if (value.includes('password')) {
                    throw new Error('password must not contain "password"')
                }
            }
        },
    }
)

adminSchema.statics.verifyCredentials = async (email, password) => {
    const user= await Admin.findOne({ email })

    if (!user) {
        throw new Error('invalid login!')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('invalid login!')
    }

    return user
}

adminSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin