var orm = require("../orm");
var seq = orm.Seq();

module.exports = {
    model:
    {
        board_id: seq.INTEGER,
        user_id: seq.INTEGER
    },
    options:
    {
        freezeTableName: true,
        timestamps: false
    }
};
