module.exports = {
    mongodb: {
        // Connection URI
        server: 'localhost',
        port: 27017,

        // Database name
        db: 'carsalemanagement',

        // Optional admin credentials
        // username: '',
        // password: ''
    },
    site: {
        // Web interface port
        port: 8081,
        host: '0.0.0.0',
        ssl: false
    },
    options: {
        // Display all databases in the navigation
        // Change to false to only show carsalemanagement
        showDatabases: true
    }
}; 