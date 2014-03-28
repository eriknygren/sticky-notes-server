var orm = require("../orm")
    , Seq = orm.Seq();

//Creating our module
module.exports = {
    model:{
        id: {type: Seq.INTEGER, autoIncrement: true},
        first_name: Seq.STRING,
        surname: Seq.STRING,
        email: Seq.STRING,
        password: Seq.STRING
    },
    relations:{
        //hasOne: (user, {as: 'author'})
    },
    options:{
        freezeTableName: true,
        timestamps: false
    }
}