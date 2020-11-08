const {Router, request} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()


// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'error email').isEmail(),
        check('password', 'error pass leng')
            .isLength({min:6})
    ],
    async (req,res)=>{
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'error data reg'
            })
            
        }

        const {email, password} = req.body

        const candidate = await User.findOne({email})
        if(candidate){
            res.status(400).json({message:'polz susestvuet'})
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({ email, password: hashedPassword})

        await user.save()

        res.status(201).json({message:'Polz sozdan'})

    } catch (e) {
        res.status(500).json({message: 'error 500'})
    }
})

// /api/auth/login
router.post(
    '/login', 
    [
        check('email', 'Enter corr email').normalizeEmail().isEmail(),
        check('password', 'Enter pass').exists()
    ],
    async (req,res)=>{
    try {

        console.log('Body:', req.body)

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'error data auth'
            })            
        }
        const {email,password} = req.body

        const user = await User.findOne({ email})

        if (!user){
            return res.status(400).json({message:'no user'})
        }
       
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({message: 'Error pass'})
        }

        const token = jwt.sign(
            { userId: user.id },
            config.get('jwtSecret'),
            { expiresIn: '1h'}
        )

        res.json({ token, userId: user.id})
    } catch (e) {
        res.status(500).json({message: 'error 500'})
    }
})



module.exports = router