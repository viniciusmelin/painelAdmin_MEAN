const restful = require('node-restful')
const mongoose = restful.mongoose

const creditSchema = new mongoose.Schema({
    name: { type: String, required:true},
    value: { type: Number,min:0, required:true}
})

const debtSchema = new mongoose.Schema({
    name: { type: String, required:true},
    value: { type: Number,min:0, required:[true,`O atributo é obrigatório`]},
    status: {type: String, required:false, uppercase:true, enum:['PAGO','PENDENTE','AGENDADO']}
})

const billingCycleSchmea = new mongoose.Schema({
    name: {type: String, required:true},
    month: {type:Number, required:[true,"O atributo é obrigatório"], min:1,max:12},
    year:{type:Number, min:1970,max:2100,required:true},
    credits:[creditSchema],
    debits: [debtSchema]
})

module.exports = restful.model('billingCycle', billingCycleSchmea)