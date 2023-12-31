(function () {
    const db_info = {
        url: 'localhost',
        username: 'webuser',
        password: 'tripPlanerUser',
        port: '24120',
        database: 'TripPlanner', //TripPlanner2 - FINAL DB
        collection: 'Events'
    };
    const moduleExports = db_info;

    if (typeof __dirname != 'undefined')
        module.exports = moduleExports;
}());