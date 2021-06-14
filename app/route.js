const express = require('express')
const route = express.Router()
const controller = require('./controller')

route.post('/login',controller.login)

route.post('/signup',controller.signup)

route.post('/createpoll',controller.createPoll)

route.post('/deletepoll',controller.deletePoll)

route.get('/mypolls/:id',controller.getMyPoll)

route.post('/vote',controller.vote)

module.exports = route