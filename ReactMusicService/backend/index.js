const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()

app.use(cors())
app.use(express.json())

const dbConnData = {
    host: process.env.HOST || '127.0.0.1',
    port: process.env.PORT || 5432,
    database: process.env.DATABASE || 'postgres',
    user: process.env.USER || 'postgres',
    password: process.env.PASSWORD || 'projekt'
}

const { Pool } = require('pg')
const client = new Pool(dbConnData)
console.log('Connection parameters: ')
console.log(dbConnData)

client
    .connect()
    .then(() => {
        client.query(`
            CREATE TABLE IF NOT EXISTS songs (
            id SERIAL PRIMARY KEY,
            title VARCHAR UNIQUE NOT NULL,
            genre VARCHAR NOT NULL,
            productionyear VARCHAR(30) NOT NULL,
            image VARCHAR NULL,
            video VARCHAR NULL
            );

            CREATE TABLE IF NOT EXISTS musicians (
            id SERIAL PRIMARY KEY,
            name VARCHAR UNIQUE NOT NULL,
            country VARCHAR(20) NOT NULL,
            year VARCHAR NOT NULL,
            image VARCHAR NULL
            );
        
            CREATE TABLE IF NOT EXISTS connections (
            id SERIAL PRIMARY KEY,
            songId INT NOT NULL,
            musicianId INT NOT NULL
        );`)
        
        const port = 5000
        app.listen(port, () => {
            console.log(`API server listening at http://localhost:${port}`)
    })
    })
    .catch(err => console.error('Connection error', err.stack))


app.get('/songs', async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM songs")
        return res.send(result.rows)
    } catch (err) {
        return res.status(500).send(err)
    }
})

app.post('/songs', async (req, res) => {
    try {
        const songFromReq = req.body
        const song = {...songFromReq, title: songFromReq.title.replace("'","''")}
        const duplicate = await client.query(`SELECT * FROM songs WHERE title = '${song.title}'`)
        if (duplicate.rows[0]) {
            return res.status(500).send("TITLE_DUPLICATE")
        }
        const insertedRow = await client.query(`INSERT INTO songs (title, genre, productionyear, image, video)
        VALUES ('${song.title}', '${song.genre}', '${song.productionyear}', '${song.image}', '${song.video}') RETURNING *`)
        return res.send(insertedRow.rows[0])
    }
    catch (err) {
        return res.status(500).send(err)
    }
})

app.post('/songs/edit/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const songFromReq = req.body
        const song = {...songFromReq, title: songFromReq.title.replace("'","''")}
        const duplicate = await client.query(`SELECT * FROM songs WHERE title = '${song.title}'`)
        if (duplicate.rows.length > 1 ) {
            return res.status(500).send("TITLE_DUPLICATE")
        }
        if (duplicate.rows.length === 1 && duplicate.rows[0].id != id) {
            return res.status(500).send("TITLE_DUPLICATE")
        }
        const editedRow = await client.query(`UPDATE songs SET title = '${song.title}', genre = '${song.genre}', 
        productionyear = '${song.productionyear}', image = '${song.image}', video = '${song.video}'
        WHERE id = '${song.id}' RETURNING *`)
        return res.send(editedRow.rows[0])
    }
    catch (err) {
        return res.status(500).send(err)
    }
})

app.delete('/songs/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)

        const deletedConnections = await client.query(`DELETE FROM connections WHERE songId=${id} RETURNING *`)
        const deletedRow = await client.query(`DELETE FROM songs WHERE id=${id} RETURNING *`)
        return res.send({song: deletedRow.rows[0], connections: deletedConnections.rows})
    }
    catch (err) {
        return res.status(500).send(err)
    }
})

app.post('/songs/:songId/:authorId', async (req, res) => {
    try {
        const songId = parseInt(req.params.songId)
        const authorId = parseInt(req.params.authorId)

        const insertedRow = await client.query(`INSERT INTO connections (songId, musicianId) VALUES ('${songId}', '${authorId}') RETURNING *`)
        return res.send(insertedRow)
    }
    catch (err) {
        return res.status(500).send(err)
    }
})

app.get('/musicians', async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM musicians")
        return res.send(result.rows)
    } catch (err) {
        return res.status(500).send(err)
    }
})

app.post('/musicians', async (req, res) => {
    try {
        const musicianFromReq = req.body
        const musician = {...musicianFromReq, name: musicianFromReq.name.replace("'","''")}
        const duplicate = await client.query(`SELECT * FROM musicians WHERE name = '${musician.name}'`)
        if (duplicate.rows[0]) {
            return res.status(500).send("NAME_DUPLICATE")
        }
        const insertedRow = await client.query(`INSERT INTO musicians (name, country, year, image)
        VALUES ('${musician.name}', '${musician.country}', '${musician.year}', '${musician.image}') RETURNING *`)
        return res.send(insertedRow.rows[0])
    }
    catch (err) {
        return res.status(500).send(err)
    }
})

app.post('/musicians/edit/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const musicianFromReq = req.body
        const musician = {...musicianFromReq, name: musicianFromReq.name.replace("'","''")}
        const duplicate = await client.query(`SELECT * FROM musicians WHERE name = '${musician.name}'`)
        if (duplicate.rows.length > 1 ) {
            return res.status(500).send("NAME_DUPLICATE")
        }
        if (duplicate.rows.length === 1 && duplicate.rows[0].id != id) {
            return res.status(500).send("NAME_DUPLICATE")
        }
        const editedRow = await client.query(`UPDATE musicians SET name = '${musician.name}', country = '${musician.country}', 
        year = '${musician.year}', image = '${musician.image}' WHERE id = '${musician.id}' RETURNING *`)
        return res.send(editedRow.rows[0])
    }
    catch (err) {
        return res.status(500).send(err)
    }
})

app.delete('/musicians/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)

        const deletedConnections = await client.query(`DELETE FROM connections WHERE musicianId=${id} RETURNING *`)
        const deletedRow = await client.query(`DELETE FROM musicians WHERE id=${id} RETURNING *`)
        return res.send({musicina: deletedRow.rows[0], connections: deletedConnections.rows})
    }
    catch (err) {
        return res.status(500).send(err)
    }
})

app.get('/connections', async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM connections")
        return res.send(result.rows)
    } catch (err) {
        return res.status(500).send(err)
    }
})

app.post('/connections', async (req, res) => {
    try {
        const connection = req.body
        const duplicate = await client.query(`SELECT * FROM connections WHERE songId = '${connection.songId}' AND musicianId = '${connection.musicianId}'`)
        if (duplicate.rows[0]) {
            return res.status(500).send("CONNECTION_DUPLICATE")
        }
        const insertedRow = await client.query(`INSERT INTO connections (songId, musicianId)
        VALUES ('${connection.songId}', '${connection.musicianId}') RETURNING *`)
        return res.send(insertedRow.rows[0])
    }
    catch (err) {
        return res.status(500).send(err)
    }
})

app.delete('/connections/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)

        const deletedRow = await client.query(`DELETE FROM connections WHERE id=${id} RETURNING *`)
        return res.send(deletedRow.rows[0])
    }
    catch (err) {
        return res.status(500).send(err)
    }
})