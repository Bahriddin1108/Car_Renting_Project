const { booking } = require("./booking.model")


exports.transaction=(sequelize,Sequelize)=>{
    const Transaction=sequelize.define('Transaction',{
        id:{
            type:Sequelize.INTEGER,
            allowNUll:false,
            primaryKey:true
        },
       
        amountPaid:{
            type:Sequelize.FLOAT,
            allowNUll:false,
                    },
        paymentDate:{
            type:Sequelize.DATE,
            allowNUll:false,
        },
        paymentStatus:{
            type:Sequelize.STRING(),
            default:'completed'    
        },
        bookingId:{
            type:Sequelize.INTEGER,
            references:{
                model:booking,
                key:'id'
            },
            onDelete:'CASCADE'
        }
    },{
        timeStamps:true
    }
)


return Transaction
}
