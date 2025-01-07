const { role } = require("./role.model")

exports.user=(sequelize,Sequelize)=>{
    const User=sequelize.define('Users',{
        id:{
            type:Sequelize.INTEGER,
            allowNUll:false,
            primaryKey:true
        },
        username:{
            type:Sequelize.STRING(),
            allowNUll:false,
            unique: true
            },
        email:{
            type:Sequelize.STRING(),
            allowNUll:false,
            unique: true
        },
        password:{
            type:Sequelize.STRING(),
            allowNUll:false,
            unique: true
        },
        role_id:{
            type:Sequelize.INTEGER,
            allowNUll:false,
            references:{
                model:role,
                key:'id'
            },
            onDelete:'CASCADE'
        }
    },{
        timeStamps:true
    }
)

return User
}
