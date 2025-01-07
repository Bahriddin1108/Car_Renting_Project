const { car } = require("./car.model")
const { user } = require("./user.model")
exports.booking=(sequelize,Sequelize)=>{
    const Booking=sequelize.define('Booking',{
        id:{
            type:Sequelize.INTEGER,
            allowNUll:false,
            primaryKey:true
        },
        userId:{
            type:Sequelize.INTEGER,
            allowNUll:false,
            reference:{
                model:user,
                key:'id'
            },
            onDelete:'CASCADE'
            },
            carId:{
                type:Sequelize.INTEGER,
                allowNUll:false,
                reference:{
                    model:car,
                    key:'id'
                },
                onDelete:'CASCADE'
                },    
        startDate:{
            type:Sequelize.DATE(),
            allowNUll:false,
            },
        endDate:{
            type:Sequelize.DATE(),
            allowNUll:false,
        },
        totalCost:{
            type:Sequelize.FLOAT,
            allowNUll:false,
        },
        status:{
            type:Sequelize.STRING(),
            defaultValue:'pending',
        }
    },{
        timeStamps:true
    }
)
return Booking
}

