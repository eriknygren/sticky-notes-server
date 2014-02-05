exports.isNullOrUndefined = function (value) {
    if (typeof value === 'undefined') {
        return true;
    }

    return value == null;
};

exports.isString = function(value)
{
    return typeof value === 'string';
};

