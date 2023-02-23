const neo4j = require('neo4j-driver')
require('dotenv').config()

const dbConnData = {
    uri: process.env.NEO4J_URI || 'bolt://localhost:7687',
    user: process.env.NEO4J_USER || 'default user',
    password: process.env.NEO4J_PASSWORD || 'default password',
}

const driver = neo4j.driver(dbConnData.uri, neo4j.auth.basic(dbConnData.user, dbConnData.password))

module.exports = driver