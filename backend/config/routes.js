const express = require('express')
const auth = require('./auth')

module.exports = function(server){


    /**
     *  Rotas Abertas
     */
    const openApi = express.Router()
    server.use('/oapi',openApi)
    const AuthService = require('../api/User/authService')
    openApi.post('/login',AuthService.login)
    openApi.post('/signup',AuthService.signup)
    openApi.post('/validateToken',AuthService.validateToken)


    /**
     * Rotas protegidas por token JWT
     */
    const protectedApi = express.Router()
    server.use('/api',protectedApi)
    protectedApi.use(auth)


    //Api de Rotas
    // const router = express.Router()
    // server.use('/api',router)

    const billingCycleService = require('../api/billingCycle/billingCycleService')
    billingCycleService.register(protectedApi,'/billingCycles')


    const billingSummaryService = require('../api/billingSummary/billingSummary')
    protectedApi.route('/billingSummary').get(billingSummaryService.getSummary)
}