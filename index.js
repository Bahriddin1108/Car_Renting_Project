const express=require('express')
const db=require('./config/db')


const app=express()
const PORT=process.env.PORT||4000

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/',require('./routes/user.route'))
app.use('/',require('./routes/role.route'))
app.use('/',require('./routes/car.route'))
app.use('/',require('./routes/booking.route'))
app.use('/',require('./routes/transaction.route'))
const start=async ()=>{
    try {
        const connect=await db.sequelize.sync({forced:true})
     
        app.listen(PORT,()=>{
            console.log('Working in:'+PORT)
        })
    } catch (error) {
        console.log(error)
    }
}

start()
