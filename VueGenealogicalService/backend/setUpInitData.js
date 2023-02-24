const express = require('express')
const app = express()
const intiData = require('./initData.json')
require('dotenv').config()

app.use(express.json())

// Neo4j
const neo4j = require('neo4j-driver')

const neo4jConnData = {
    uri: process.env.NEO4J_URI || 'bolt://localhost:7687',
    user: process.env.NEO4J_USER || 'default user',
    password: process.env.NEO4J_PASSWORD || 'default password',
}

const driver = neo4j.driver(neo4jConnData.uri, neo4j.auth.basic(neo4jConnData.user, neo4jConnData.password))


const copyNodes = async () => {
    const creationString = intiData.nodes.reduce((pre, cur) => {
        const labels = cur.labels.map(l => `:${l}`).join("")

        const curString = `(${labels} {originalId: "${cur.id}", name: "${cur.name}", userId: "${cur.userId}", birthDate: "${cur.birthDate}"${cur.rootNode ? ", rootNode: true" : ""} }), `
        return pre + curString
    }, "")
    const creationStringFinal = creationString.slice(0,-2)
    // console.log(creationStringFinal)

    const session = driver.session()
    await session.run(`CREATE ${creationStringFinal}`)
    session.close()
    return true
}

const copyFatherRelations = async () => {
    const fatherRelations = intiData.relations.filter(r => r.type == "Father")
    const fatherRelationsString = fatherRelations.map(r => `{start: "${r.start}", end: "${r.end}"}`)

    const session = driver.session()
    await session.run(`UNWIND  [${fatherRelationsString}] AS r
                       MATCH (c:Person {originalId: r.start}), (f:Male {originalId: r.end})
                       CREATE (c)-[:Father]->(f)
                       CREATE (f)-[:Child]->(c)
                       RETURN c, f`)
    session.close()
    return true
}

const copyMotherRelations = async () => {
    const motherRelations = intiData.relations.filter(r => r.type == "Mother")
    const motherRelationsString = motherRelations.map(r => `{start: "${r.start}", end: "${r.end}"}`)

    const session = driver.session()
    await session.run(`UNWIND  [${motherRelationsString}] AS r
                       MATCH (c:Person {originalId: r.start}), (m:Female {originalId: r.end})
                       CREATE (c)-[:Mother]->(m)
                       CREATE (m)-[:Child]->(c)
                       RETURN c, m`)
    session.close()
    return true
}

const copyPossibleFatherRelations = async () => {
    const possibleFatherRelations = intiData.relations.filter(r => r.type == "PossibleFather")
    const possibleFatherRelationsString = possibleFatherRelations.map(r => `{start: "${r.start}", end: "${r.end}"}`)

    const session = driver.session()
    await session.run(`UNWIND  [${possibleFatherRelationsString}] AS r
                       MATCH (c:Person {originalId: r.start}), (f:Male {originalId: r.end})
                       CREATE (c)-[:PossibleFather]->(f)
                       CREATE (f)-[:PossibleChild]->(c)
                       RETURN c, f`)
    session.close()
    return true
}

const copyPossibleMotherRelations = async () => {
    const possibleMotherRelations = intiData.relations.filter(r => r.type == "PossibleMother")
    const possibleMotherRelationsString = possibleMotherRelations.map(r => `{start: "${r.start}", end: "${r.end}"}`)

    const session = driver.session()
    await session.run(`UNWIND  [${possibleMotherRelationsString}] AS r
                       MATCH (c:Person {originalId: r.start}), (m:Female {originalId: r.end})
                       CREATE (c)-[:PossibleMother]->(m)
                       CREATE (m)-[:PossibleChild]->(c)
                       RETURN c, m`)
    session.close()
    return true
}

const removeOriginalIdProperty = async () => {
    const session = driver.session()
    await session.run(`MATCH (p:Person) REMOVE p.originalId`)
    session.close()
    return true
}

const setupNeo4j = async () => {
    const s1 = await copyNodes()
    console.log('Neo4j copy Nodes:', s1)
    const s2 = await copyFatherRelations()
    console.log('Neo4j copy Father Relations:', s2)
    const s3 = await copyMotherRelations()
    console.log('Neo4j copy Mother Relations:', s3)
    const s4 = await copyPossibleFatherRelations()
    console.log('Neo4j copy Possible Father Relations:', s4)
    const s5 = await copyPossibleMotherRelations()
    console.log('Neo4j copy Possible Mother Relations:', s5)
    const s6 = await removeOriginalIdProperty()
    console.log('Neo4j remove OriginalId Property:', s6)

    console.log("Neo4j is setted up")
    driver.close()
}

setupNeo4j()

// MongoDB
const mongoose = require('mongoose')
const User = require('./models/User')
const Chat = require('./models/Chat')

const mongoDbConnData = {
    host: process.env.MONGO_HOST || '127.0.0.1',
    port: process.env.MONGO_PORT || 27017,
    database: process.env.MONGO_DATABASE || 'default'
};

const copyUsers = async () => {
    const users = intiData.users
    const usersToAdd = users.map(u => new User(u))

    return await User.insertMany(usersToAdd)
    .then(res => {
        return true
    })
    .catch(err => {
        console.log(err)
        return false
    })
}

const copyChats = async () => {
    const chats = intiData.chats
    const chatsToAdd = chats.map(c => new Chat(c))
    return await Chat.insertMany(chatsToAdd)
    .then(res => {
        return true
    })
    .catch(err => {
        console.log(err)
        return false
    })
}

const setupMongo = async (mongoose) => {
    // await mongoose.connection.db.dropDatabase() you can uncomment this to drop database before data init, but make sure to create backup!
    
    const s1 = await copyUsers()
    console.log('MongoDB copy Users:', s1)
    const s2 = await copyChats()
    console.log('MongoDB copy Chats:', s2)

    console.log("MongoDB is setted up")
    mongoose.connection.close()
}

mongoose.set("strictQuery", false) // this allows to save fields not specified in model to be saved anyway (I'm setting this to avoid deprication warning, right now it is true by deffault, but will be false in Moongose 7)
mongoose
    .connect(`mongodb://${mongoDbConnData.host}:${mongoDbConnData.port}/${mongoDbConnData.database}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(response => {
        console.log(`Connected to MongoDB. Database name: "${response.connections[0].name}"`)

        setupMongo(mongoose)
    })
    .catch(err => { return err });
