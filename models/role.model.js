exports.role=(sequelize,Sequelize)=>{
    const Role=sequelize.define('Roles',{
        id:{
            type:Sequelize.INTEGER,
            allowNUll:false,
            primaryKey:true
        },
        role_name:{
            type:Sequelize.STRING,
            allowNUll:false,
        }
    }
)
return Role
}