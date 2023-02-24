const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()

app.use(cors());
app.use(express.json());

const fs = require('fs');

const dbConnData = {
    host: process.env.HOST || '127.0.0.1',
    port: process.env.PORT || 5432,
    database: process.env.DATABASE || 'postgres',
    user: process.env.USER || 'postgres',
    password: process.env.PASSWORD || 'projekt'
};

const { Pool } = require('pg');
const client = new Pool(dbConnData);
console.log('Connection parameters: ');
console.log(dbConnData);

client
    .connect()
    .then(() => {
        client.query(`
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
            );`
        );

        const port = 5000
        app.listen(port, () => {
            console.log(`API server listening at http://localhost:${port}`);
    });
    })
    .catch(err => console.error('Connection error', err.stack));

///////////////////////////////// Towers

app.get('/towers', async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM towers");
        return res.send(result.rows);
    } catch (err) {
        return res.status(500).send(err)
    }
});

app.post('/towers', async (req, res) => {
    try {
        const tower  = req.body
        if(tower.label && tower.img && tower.name && tower.type) {
            const duplicate = await client.query(`SELECT * FROM towers WHERE label = '${tower.label}'`);
            if (duplicate.rows[0]) {
                return res.status(500).send("LABEL_DUPLICATE");
            }
            const insertedRow = await client.query(`INSERT INTO towers (label, name, img, type, minDamage, maxDamage, speed, range, cost)
            VALUES ('${tower.label}', '${tower.name}', '${tower.img}', '${tower.type}', '${tower.mindamage}',
            '${tower.maxdamage}', '${tower.speed}', '${tower.range}', '${tower.cost}') RETURNING *`);
            return res.send(insertedRow.rows[0]);
        }
        return res.status(500).send("MISSING_FIELDS");
    }
    catch (err) {
        return res.status(500).send(err)
    }
});

app.post('/towers/edit/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const tower  = req.body
        if(tower.label && tower.img && tower.name && tower.type) {
            const duplicate = await client.query(`SELECT * FROM towers WHERE label = '${tower.label}'`); 
            if (duplicate.rows.length > 1 ) {
                return res.status(500).send("LABEL_DUPLICATE");
            }
            if (duplicate.rows.length === 1 && duplicate.rows[0].id !== id) {
                return res.status(500).send("LABEL_DUPLICATE");
            }
            const editedRow = await client.query(`UPDATE towers SET
            label = '${tower.label}', name = '${tower.name}', img = '${tower.img}', type = '${tower.type}', minDamage = '${tower.mindamage}', 
            maxDamage = '${tower.maxdamage}', speed = '${tower.speed}', range = '${tower.range}', cost = '${tower.cost}'
            WHERE id = '${id}' RETURNING *`);
            return res.send(editedRow.rows[0]);
        }
        return res.status(500).send("MISSING_FIELDS");
    }
    catch (err) {
        return res.status(500).send(err)
    }
});

app.delete('/towers/:label', async (req, res) => {
    try {
        const label = req.params.label;

        const deletedUpgrades1 = await client.query(`DELETE FROM upgrades WHERE label1='${label}' RETURNING *`);
        const deletedUpgrades2 = await client.query(`DELETE FROM upgrades WHERE label2='${label}' RETURNING *`);
        const deletedRow = await client.query(`DELETE FROM towers WHERE label='${label}' RETURNING *`);
        return res.send({ tower: deletedRow.rows[0] })
    }
    catch (err) {
        return res.status(500).send(err)
    }
});

///////////////////////////////// Upgrades

app.get('/upgrades', async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM upgrades");
        return res.send(result.rows);
    } catch (err) {
        return res.status(500).send(err)
    }
});

app.post('/upgrades', async (req, res) => {
    try {
        const upgrade  = req.body
        if(upgrade.label1 && upgrade.label2 && upgrade.name && upgrade.cost) {
            const insertedRow = await client.query(`INSERT INTO upgrades (label1, label2, name, cost)
            VALUES ('${upgrade.label1}', '${upgrade.label2}', '${upgrade.name}', '${upgrade.cost}') RETURNING *`);
            return res.send(insertedRow.rows[0]);
        }
        return res.status(500).send("MISSING_FIELDS");
    }
    catch (err) {
        return res.status(500).send(err)
    }
});

app.post('/upgrades/edit/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const upgrade  = req.body;
        if(upgrade.label1 && upgrade.label2 && upgrade.name && upgrade.cost) {
            const editedRow = await client.query(`UPDATE upgrades SET
            label1 = '${upgrade.label1}', label2 = '${upgrade.label2}', name = '${upgrade.name}', cost = '${upgrade.cost}'
            WHERE id = '${id}' RETURNING *`);
            return res.send(editedRow.rows[0]);
        }
        return res.status(500).send("MISSING_FIELDS");
    }
    catch (err) {
        return res.status(500).send(err)
    }
});

app.delete('/upgrades/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const deletedRow = await client.query(`DELETE FROM upgrades WHERE id='${id}' RETURNING *`);
        return res.send({ upgrade: deletedRow.rows[0] })
    }
    catch (err) {
        return res.status(500).send(err)
    }
});

///////////////////////////////// Enemies

app.get('/enemies', async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM enemies");
        return res.send(result.rows);
    } catch (err) {
        return res.status(500).send(err)
    }
});

app.post('/enemies', async (req, res) => {
    try {
        const enemy  = req.body;
        if(enemy.label && enemy.img && enemy.name) {
            const insertedRow = await client.query(`INSERT INTO enemies (label, name, hp, maxHp, speed, loss, armor, magicResistance, gold, img)
            VALUES ('${enemy.label}', '${enemy.name}', '${enemy.hp}', '${enemy.maxhp}', '${enemy.speed}', '${enemy.loss}', '${enemy.armor}', '${enemy.magicresistance}', '${enemy.gold}', '${enemy.img}') RETURNING *`);
            return res.send(insertedRow.rows[0]);
        }
        return res.status(500).send("MISSING_FIELDS");
    }
    catch (err) {
        return res.status(500).send(err)
    }
});

app.post('/enemies/edit/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const enemy  = req.body;
        if(enemy.label && enemy.img && enemy.name) {
            const editedRow = await client.query(`UPDATE enemies SET
            label = '${enemy.label}', name = '${enemy.name}', hp = '${enemy.hp}', maxHp = '${enemy.maxhp}', speed = '${enemy.speed}', loss = '${enemy.loss}',
            armor = '${enemy.armor}', magicResistance = '${enemy.magicresistance}', gold = '${enemy.gold}', img = '${enemy.img}'
            WHERE id = '${id}' RETURNING *`);
            return res.send(editedRow.rows[0]);
        }
        return res.status(500).send("MISSING_FIELDS");
    }
    catch (err) {
        return res.status(500).send(err)
    }
});

app.delete('/enemies/:label', async (req, res) => {
    try {
        const label = req.params.label;

        const deletedRow = await client.query(`DELETE FROM enemies WHERE label='${label}' RETURNING *`);
        return res.send({ enemy: deletedRow.rows[0] })
    }
    catch (err) {
        return res.status(500).send(err)
    }
});

///////////////////////////////// Levels

app.get('/levels', async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM levels");
        return res.send(result.rows);
    } catch (err) {
        return res.status(500).send(err)
    }
});

app.post('/levels', async (req, res) => {
    try {
        const level  = req.body;

        const insertedRow = await client.query(`INSERT INTO levels (name, width, height, path, waves, gold, startingtowers)
        VALUES ('${level.name}', '${level.width}', '${level.height}', '${level.path}', '${level.waves}', '${level.gold}', '${level.startingtowers}') RETURNING *`);
        return res.send(insertedRow.rows[0]);
    }
    catch (err) {
        return res.status(500).send(err)
    }
});

app.post('/levels/edit/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const level  = req.body;

        const editedRow = await client.query(`UPDATE levels SET
        name = '${level.name}', width = '${level.width}', height = '${level.height}', path = '${level.path}', waves = '${level.waves}', gold = '${level.gold}', startingtowers = '${level.startingtowers}'
        WHERE id = '${id}' RETURNING *`);
        return res.send(editedRow.rows[0]);
    }
    catch (err) {
        return res.status(500).send(err)
    }
});

app.delete('/levels/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const deletedRow = await client.query(`DELETE FROM levels WHERE id='${id}' RETURNING *`);
        return res.send({ level: deletedRow.rows[0] })
    }
    catch (err) {
        return res.status(500).send(err)
    }
});

///////////////////////////////// Logs

app.post('/logs', async (req, res) => {
    try {
        const log  = req.body.log
        const stream = fs.createWriteStream("log.txt", {flags:'a'});
        stream.write(log + "\n");
        stream.end();
        return res.send(log);
    }
    catch (err) {
        return res.status(500).send(err)
    }
});