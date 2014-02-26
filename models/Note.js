var orm = require("../orm")
    , Seq = orm.Seq();

//Creating our module
module.exports = {
    model:{
        id: {type: Seq.INTEGER, autoIncrement: true},
        board_id: Seq.INTEGER,
        title: Seq.TEXT,
        body: Seq.TEXT,
        created: Seq.DATE,
        author: Seq.INTEGER
    },
    relations:{
        //hasOne: (user, {as: 'author'})
    },
    options:{
        freezeTableName: true,
        timestamps: false
    }
}