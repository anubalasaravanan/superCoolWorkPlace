
exports.up = function(knex) {
    return knex.schema.createTable('userWorkSpaceMoodTable', (table) => {
        table.increments('id');
        table.string('employee');
        table.text('week');
        table.integer('year');
        table.integer('month');
        table.integer('day');
        table.integer('happinessLevel');
        table.string('date');
        

    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('userWorkSpaceMoodTable');

};
