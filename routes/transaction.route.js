const Router=require('express')
const { 
    addTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction 
} = require('../controllers/transaction.controllers')
const adminAccess = require('../middlewares/access')
const router=Router()

router.post('/transactions',addTransaction)

router.get('/transactions',getTransactions)
router.put('/transactions/:id',updateTransaction)
router.delete('/transactions/:id',adminAccess,deleteTransaction)
module.exports=router