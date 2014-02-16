var orm = require("../orm");
var seq = orm.Seq();

module.exports = {
    model:
    {
        id:
        {
            type: seq.INTEGER,
            autoIncrement: true
        },
        owner_user_id: seq.INTEGER,
        name: seq.STRING
    },
    options:
    {
        freezeTableName: true,
        timestamps: false
    }
};