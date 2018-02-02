const _ = require('lodash')
const BillingCycle = require('../billingCycle/billingCycle')


function getSummary(req, res)
{
    BillingCycle.aggregate({
        $project :
        {
            credit:
            {
                $sum:"$credits.value"
            }, 
            debits:
            {
                $sum:"$debits.value"
            }
        }
    },
    {
        $group:{_id:null, credit:{$sum:"$credit"},debits:{$sum:"$debits"}}
    },
    {
        $project: {_id:0, credit:1,debits:1}
    },
    function(error,result)
    {
        if(error)
        {
            res.status(500).json({errors:[error]})
        }
        else
        {
            res.json(_.defaults(result[0],{credit:0, debit:0}))
        }
    }
)}

module.exports = {getSummary}