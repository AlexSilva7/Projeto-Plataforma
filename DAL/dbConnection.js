const { Pool } = require('pg')
const fs = require('fs')

const config = fs.readFileSync('./DAL/settings.json').toString()
const configJson = JSON.parse(config)
    // console.log(configJson.connectString)

const client = new Pool({
    connectionString: configJson.connectString,
    ssl: {
        rejectUnauthorized: false,
    }
})

module.exports = client