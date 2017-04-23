'use strict';

function runValidators(next) {
    this.options.new = true;
    this.options.runValidators = true;
    this.options.context = 'query';

    next();
}

function autoPopulate(options) {
    return function enablePopulate(next) {
        this.populate(options.populating, options.fields);
        this.sort('_id');

        next();
    };
}

function runValidatorsPlugin(schema) {
    schema.pre('findOneAndUpdate', runValidators);
}

function autoPopulatePlugin(schema, options) {
    schema.pre('find', autoPopulate(options));
    schema.pre('findOne', autoPopulate(options));
}

module.exports = {
    runValidatorsPlugin,
    autoPopulatePlugin
};
