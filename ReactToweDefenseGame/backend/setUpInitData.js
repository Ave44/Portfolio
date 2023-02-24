require('dotenv').config()

const dbConnData = {
    host: process.env.HOST || '127.0.0.1',
    port: process.env.PORT || 5432,
    database: process.env.DATABASE || 'postgres',
    user: process.env.USER || 'postgres',
    password: process.env.PASSWORD || 'projekt'
}

const { Pool } = require('pg')
const pool = new Pool(dbConnData)
console.log('Connection parameters: ')
console.log(dbConnData)

const initData = require("./initData.json")
const towers = initData.towers.reduce((pre, cur) => {
    return `${pre}, ('${cur.label}', '${cur.name}', '${cur.img}', '${cur.type}', '${cur.mindamage}', '${cur.maxdamage}', '${cur.speed}', '${cur.range}', '${cur.cost}')`
}, "").slice(2)
console.log({towers})
const enemies = initData.enemies.reduce((pre, cur) => {
    return `${pre}, ('${cur.label}', '${cur.name}', '${cur.hp}', '${cur.maxhp}', '${cur.speed}', '${cur.loss}', '${cur.armor}', '${cur.magicresistance}', '${cur.gold}', '${cur.img}')`
}, "").slice(2)
console.log({enemies})
const upgrades = initData.upgrades.reduce((pre, cur) => {
    return `${pre}, ('${cur.label1}', '${cur.label2}', '${cur.name}', '${cur.cost}')`
}, "").slice(2)
console.log({upgrades})
const levels = initData.levels.reduce((pre, cur) => {
    return `${pre}, ('${cur.name}', '${cur.width}', '${cur.height}', '${cur.path}', '${cur.waves}', '${cur.gold}', '${cur.startingtowers}')`
}, "").slice(2)
console.log({levels})

pool.query(`
    CREATE TABLE IF NOT EXISTS enemies (
    id SERIAL PRIMARY KEY,
    label VARCHAR UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    hp INT NOT NULL,
    maxHp INT NOT NULL,
    speed FLOAT NOT NULL,
    loss INT NOT NULL,
    armor FLOAT NOT NULL,
    magicResistance FLOAT NOT NULL,
    gold INT NOT NULL,
    img VARCHAR NOT NULL
    );

    CREATE TABLE IF NOT EXISTS towers (
    id SERIAL PRIMARY KEY,
    label VARCHAR UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    img VARCHAR NOT NULL,
    type VARCHAR NOT NULL,
    minDamage INT NOT NULL,
    maxDamage INT NOT NULL,
    speed INT NOT NULL,
    range INT NOT NULL,
    cost INT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS upgrades (
    id SERIAL PRIMARY KEY,
    label1 VARCHAR NOT NULL,
    label2 VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    cost INT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS levels (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    width INT NOT NULL,
    height INT NOT NULL,
    path VARCHAR NOT NULL,
    waves VARCHAR NOT NULL,
    gold INT NOT NULL,
    startingtowers VARCHAR NOT NULL
    );

    INSERT INTO towers (label, name, img, type, minDamage, maxDamage, speed, range, cost)
    VALUES ${towers};

    INSERT INTO enemies (label, name, hp, maxHp, speed, loss, armor, magicResistance, gold, img)
    VALUES ${enemies};

    INSERT INTO upgrades (label1, label2, name, cost)
    VALUES ${upgrades};

    INSERT INTO levels (name, width, height, path, waves, gold, startingtowers)
    VALUES ${levels};
    `
)
.then(res => {
    console.log("Database populated correctly!")
    pool.end()
})
.catch(err => {
    console.log(err)
    pool.end()
})
