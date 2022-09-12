const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const res = require('express/lib/response');

const router = express.Router();


let mockDatabase = []


const checkToken = (req, res, next) => {
  const authorization = req.headers.authorization.slice()
  const token = authorization.split(' ')[1]

  jwt.verify(token, process.env.SECRET_KEY, ((err, user) => {
    if (err) return res.status(403).send('Unauthenticated');
    req.user = user
    next()
  }))
}

const createToken = (user) => {
  return jwt.sign(user, process.env.SECRET_KEY)
}



const login = async (req, res) => {
  const { email, password } = req.body

  const passwordData = mockDatabase.find(item => item?.email === email)
  if (!passwordData) return res.status(404).send('User not found. Please sign up')

  const loginSuccessful = await bcrypt.compare(password, passwordData.hashedPassword)

  if (!loginSuccessful) return res.status(401).send('Wrong password')
  const token = loginSuccessful && createToken(email)


  mockDatabase = mockDatabase.map(data => {
    return JSON.stringify(data) === JSON.stringify(passwordData)
      ? { ...data, token }
      : data
  })

  console.log(mockDatabase);
  res.json({ loggedIn: loginSuccessful, token })
}


const signUp = async (req, res) => {
  const { email, password } = req.body

  // check to see if email exists on database
  if (mockDatabase.find(item => item?.email === email)) return res.status(403).send('Email already used')

  // check to see password exists
  if (password && password.length < 3) return res.status(403).send('password cannot be empty or less than 3 characters')

  // hashing password
  const hashedPassword = await bcrypt.hash(password, 10)

  const userData = { email, hashedPassword, token: '' }
  mockDatabase.push(userData)

  res.status(201).send('Created User')
}




router.post('/login', login)
router.post('/signup', signUp)

router.get('/test', checkToken, ((req, res) => {
  const authenticated = mockDatabase.find(item => item?.email === req.user)

  res.status(200).json({ currentUser: req.user, authenticated })
}))


module.exports = router 