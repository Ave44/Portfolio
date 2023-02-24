const express = require('express')
const router = express.Router({mergeParams: true})
const driver = require('../config/neo4jDriver')

router.get('/getAll', async (req, res) => {
    const relations = []
    const session = driver.session()
    await session
    .run(`MATCH (s)-[r]-(e)
          WITH DISTINCT r
          RETURN r`)
    .subscribe({
        onNext: record => {
            const rec = record.get(0)
            relations.push({start: rec.startNodeElementId, end: rec.endNodeElementId, type: rec.type})
        },
        onCompleted: async () => {
            session.close()
            return res.send(relations)
            },
            onError: error => { console.log(error); session.close(); return res.status(500).send({error})
            }
        })
})

// Mother
router.post('/setMother', async (req, res) => {
    const childId = req.body.childId
    const motherId = req.body.motherId

    if(!childId || !motherId) {
        return res.status(400).send({error: "Missing querry data"})
    }
    let result = null

    const session = driver.session();
    session.run(`MATCH (c:Person), (m:Female) 
                 WHERE id(c)=${childId} AND id(m)=${motherId}
                 MERGE (c)-[r1:Mother]->(m)
                 MERGE (m)-[r2:Child]->(c)
                 RETURN c, m`)
    .subscribe({
        onNext: record => {
            const mother = {id: record.get(1).elementId, ...record.get(1).properties}
            const child = {id: record.get(0).elementId, ...record.get(0).properties}
            result = {mother, child}
        },
        onCompleted: () => {
            session.close()
            return res.send(result)
        },
        onError: error => {
            return res.status(500).send({error})
        }
    })
});

router.put('/updateMother', async (req, res) => {
    const childId = req.body.childId
    const newMotherId = req.body.newMotherId
    const oldMotherId = req.body.oldMotherId

    if(!childId || !newMotherId || !oldMotherId) {
        return res.status(400).send({error: "Missing querry data"})
    }
    let result = null

    const session = driver.session();
    session.run(`MATCH (c:Person)-[r1:Mother]->(o:Female)
                 MATCH (o:Female)-[r2:Child]->(c:Person)
                 MATCH (n:Female) 
                 WHERE id(c)=${childId} AND id(o)=${oldMotherId} AND id(n)=${newMotherId}
                 MERGE (c)-[:Mother]->(n)
                 MERGE (n)-[:Child]->(c)
                 DELETE r1, r2
                 RETURN c, o, n`)
    .subscribe({
        onNext: record => {
            const newMother = {id: record.get(2).elementId, ...record.get(2).properties}
            const oldMother = {id: record.get(1).elementId, ...record.get(1).properties}
            const child = {id: record.get(0).elementId, ...record.get(0).properties}
            result = {child, oldMother, newMother}
        },
        onCompleted: () => {
            session.close()
            return res.send(result)
        },
        onError: error => {
            return res.status(500).send({error})
        }
    })
});

router.delete('/delMother', async (req, res) => {
    const childId = req.body.childId
    const motherId = req.body.motherId

    if(!childId || !motherId) {
        return res.status(400).send({error: "Missing querry data"})
    }

    const session = driver.session();
    session.run(`MATCH (c:Person)-[r1:Mother]->(m:Female) 
                 MATCH (m:Female)-[r2:Child]->(c:Person) 
                 WHERE id(c)=${childId} AND id(m)=${motherId}
                 DELETE r1, r2`)
    .subscribe({
        onCompleted: () => {
            session.close()
            return res.send(true)
        },
        onError: error => {
            return res.status(500).send({error})
        }
    })
})

// Father
router.post('/setFather', async (req, res) => {
    const childId = req.body.childId
    const fatherId = req.body.fatherId

    if(!childId || !fatherId) {
        return res.status(400).send({error: "Missing querry data"})
    }
    let result = null

    const session = driver.session();
    session.run(`MATCH (c:Person), (f:Male) 
                 WHERE id(c)=${childId} AND id(f)=${fatherId}
                 MERGE (c)-[r1:Father]->(f)
                 MERGE (f)-[r2:Child]->(c)
                 RETURN c, f`)
    .subscribe({
        onNext: record => {
            const father = {id: record.get(1).elementId, ...record.get(1).properties}
            const child = {id: record.get(0).elementId, ...record.get(0).properties}
            result = {father, child}
        },
        onCompleted: () => {
            session.close()
            return res.send(result)
        },
        onError: error => {
            return res.status(500).send({error})
        }
    })
});

router.put('/updateFather', async (req, res) => {
    const childId = req.body.childId
    const newFatherId = req.body.newFatherId
    const oldFatherId = req.body.oldFatherId

    if(!childId || !newFatherId || !oldFatherId) {
        return res.status(400).send({error: "Missing querry data"})
    }
    let result = null

    const session = driver.session();
    session.run(`MATCH (c:Person)-[r1:Father]->(o:Male)
                 MATCH (o:Male)-[r2:Child]->(c:Person)
                 MATCH (n:Male) 
                 WHERE id(c)=${childId} AND id(o)=${oldFatherId} AND id(n)=${newFatherId}
                 MERGE (c)-[:Father]->(n)
                 MERGE (n)-[:Child]->(c)
                 DELETE r1, r2
                 RETURN c, o, n`)
    .subscribe({
        onNext: record => {
            const newFather = {id: record.get(2).elementId, ...record.get(2).properties}
            const oldFather = {id: record.get(1).elementId, ...record.get(1).properties}
            const child = {id: record.get(0).elementId, ...record.get(0).properties}
            result = {child, oldFather, newFather}
        },
        onCompleted: () => {
            session.close()
            return res.send(result)
        },
        onError: error => {
            return res.status(500).send({error})
        }
    })
});

router.delete('/delFather', async (req, res) => {
    const childId = req.body.childId
    const fatherId = req.body.fatherId

    if(!childId || !fatherId) {
        return res.status(400).send({error: "Missing querry data"})
    }

    const session = driver.session();
    session.run(`MATCH (c:Person)-[r1:Father]->(f:Male) 
                 MATCH (f:Male)-[r2:Child]->(c:Person) 
                 WHERE id(c)=${childId} AND id(f)=${fatherId}
                 DELETE r1, r2`)
    .subscribe({
        onCompleted: () => {
            session.close()
            return res.send(true)
        },
        onError: error => {
            return res.status(500).send({error})
        }
    })
})

// Possible Mother
router.post('/setPossibleMothers', async (req, res) => {
    const possibleChildId = req.body.possibleChildId
    const possibleMothersId = req.body.possibleMothersId

    if(!possibleChildId || !possibleMothersId) {
        return res.status(400).send({error: "Missing querry data"})
    }
    let result = null

    const session = driver.session();
    session.run(`MATCH (c:Person), (m:Female) 
                 WHERE id(c)=${possibleChildId} AND id(m) IN [${possibleMothersId}]
                 MERGE (c)-[r1:PossibleMother]->(m)
                 MERGE (m)-[r2:PossibleChild]->(c)
                 RETURN c, m`)
    .subscribe({
        onNext: record => {
            const possibleMothers = {id: record.get(1).elementId, ...record.get(1).properties}
            const possibleChild = {id: record.get(0).elementId, ...record.get(0).properties}
            result = {possibleMothers, possibleChild}
        },
        onCompleted: () => {
            session.close()
            return res.send(result)
        },
        onError: error => {
            return res.status(500).send({error})
        }
    })
});

router.put('/changePossibleMothers', async (req, res) => {
    const possibleChildId = req.body.possibleChildId
    const PossibleMothersIdToAdd = req.body.PossibleMothersIdToAdd
    const PossibleMothersIdToDelete = req.body.PossibleMothersIdToDelete

    if(!possibleChildId || !PossibleMothersIdToAdd || !PossibleMothersIdToDelete) {
        return res.status(400).send({error: "Missing querry data"})
    }
    let result = null

    const session = driver.session();
    session.run(`MATCH (c:Person), (o:Female), (n:Female)
                 WHERE id(c)=${possibleChildId} AND id(o) IN [${PossibleMothersIdToDelete}] AND id(n) IN [${PossibleMothersIdToAdd}]
                 MERGE (c)-[:PossibleMother]->(n)
                 MERGE (n)-[:PossibleChild]->(c)
                 WITH c, n, o
                 MATCH (c:Person)-[r1:PossibleMother]->(o:Female)
                 MATCH (o:Female)-[r2:PossibleChild]->(c:Person)
                 DELETE r1, r2
                 RETURN c, o, n`)
    .subscribe({
        onNext: record => {
            const newPossibleMothers = {id: record.get(2).elementId, ...record.get(2).properties}
            const oldPossibleMothers = {id: record.get(1).elementId, ...record.get(1).properties}
            const possibleChild = {id: record.get(0).elementId, ...record.get(0).properties}
            result = {possibleChild, oldPossibleMothers, newPossibleMothers}
        },
        onCompleted: () => {
            session.close()
            return res.send(result)
        },
        onError: error => {
            return res.status(500).send({error})
        }
    })
});

router.delete('/delPossibleMothers', async (req, res) => {
    const possibleChildId = req.body.possibleChildId
    const possibleMothersId = req.body.possibleMothersId

    if(!possibleChildId || !possibleMothersId) {
        return res.status(400).send({error: "Missing querry data"})
    }

    const session = driver.session();
    session.run(`MATCH (c:Person)-[r1:PossibleMother]->(m:Female) 
                 MATCH (m:Female)-[r2:PossibleChild]->(c:Person) 
                 WHERE id(c)=${possibleChildId} AND id(m) IN [${possibleMothersId}]
                 DELETE r1, r2`)
    .subscribe({
        onCompleted: () => {
            session.close()
            return res.send(true)
        },
        onError: error => {
            return res.status(500).send({error})
        }
    })
})

// Possible Father
router.post('/setPossibleFathers', async (req, res) => {
    const possibleChildId = req.body.possibleChildId
    const possibleFathersId = req.body.possibleFathersId

    if(!possibleChildId || !possibleFathersId) {
        return res.status(400).send({error: "Missing querry data"})
    }
    let result = null

    const session = driver.session();
    session.run(`MATCH (c:Person), (f:Male) 
                 WHERE id(c)=${possibleChildId} AND id(f) IN [${possibleFathersId}]
                 MERGE (c)-[r1:PossibleFather]->(f)
                 MERGE (f)-[r2:PossibleChild]->(c)
                 RETURN c, f`)
    .subscribe({
        onNext: record => {
            const possibleFathers = {id: record.get(1).elementId, ...record.get(1).properties}
            const possibleChild = {id: record.get(0).elementId, ...record.get(0).properties}
            result = {possibleFathers, possibleChild}
        },
        onCompleted: () => {
            session.close()
            return res.send(result)
        },
        onError: error => {
            return res.status(500).send({error})
        }
    })
});

router.delete('/delPossibleFathers', async (req, res) => {
    const possibleChildId = req.body.possibleChildId
    const possibleFathersId = req.body.possibleFathersId

    if(!possibleChildId || !possibleFathersId) {
        return res.status(400).send({error: "Missing querry data"})
    }

    const session = driver.session();
    session.run(`MATCH (c:Person)-[r1:PossibleFather]->(f:Male) 
                 MATCH (f:Male)-[r2:PossibleChild]->(c:Person) 
                 WHERE id(c)=${possibleChildId} AND id(f) IN [${possibleFathersId}]
                 DELETE r1, r2`)
    .subscribe({
        onCompleted: () => {
            session.close()
            return res.send(true)
        },
        onError: error => {
            return res.status(500).send({error})
        }
    })
})

// Children
router.post('/setChildren', async (req, res) => {
    const personId = req.body.personId
    const childrenId = req.body.childrenId

    if(!personId || !childrenId) {
        return res.status(400).send({error: "Missing querry data"})
    }
    const children = []

    const session = driver.session();
    session.run(`MATCH (f:Male), (c:Person)
                 WHERE id(f)=${personId} AND id(c) IN [${childrenId}]
                 MERGE (f)-[r1:Child]->(c)
                 MERGE (c)-[r2:Father]->(f)
                 RETURN f AS parent, c
                 UNION
                 MATCH (m:Female), (c:Person)
                 WHERE id(m)=${personId} AND id(c) IN [${childrenId}]
                 MERGE (m)-[r1:Child]->(c)
                 MERGE (c)-[r2:Mother]->(m)
                 RETURN m AS parent, c`)
    .subscribe({
        onNext: record => {
            children.push({id: record.get(1).elementId, ...record.get(1).properties})
        },
        onCompleted: () => {
            session.close()
            return res.send(children)
        },
        onError: error => {
            return res.status(500).send({error})
        }
    })
});

router.delete('/delChildren', async (req, res) => {
    const personId = req.body.personId
    const childrenId = req.body.childrenId

    if(!personId || !childrenId) {
        return res.status(400).send({error: "Missing querry data"})
    }

    const session = driver.session();
    session.run(`MATCH (f:Male)-[r1:Child]->(c:Person) 
                 MATCH (c:Person)-[r2:Father]->(f:Male)
                 WHERE id(f)=${personId} AND id(c) IN [${childrenId}]
                 DELETE r1, r2
                 UNION
                 MATCH (m:Female)-[r1:Child]->(c:Person) 
                 MATCH (c:Person)-[r2:Mother]->(m:Female)
                 WHERE id(m)=${personId} AND id(c) IN [${childrenId}]
                 DELETE r1, r2`)
    .subscribe({
        onCompleted: () => {
            session.close()
            return res.send(true)
        },
        onError: error => {
            return res.status(500).send({error})
        }
    })
})

// Coppying
router.post('/getPeopleRelations', async (req, res) => {
    const peopleToCoppyId = req.body.peopleToCoppyId

    if(!peopleToCoppyId) {
        return res.status(400).send({error: "Missing querry data"})
    }
    const relations = []

    const session = driver.session()
    await session
    .run(`MATCH (s)-[r]-(e)
          WHERE id(s) IN [${peopleToCoppyId}] AND id(e) IN [${peopleToCoppyId}]
          WITH DISTINCT r
          RETURN r`)
    .subscribe({
        onNext: record => {
            const rec = record.get(0)
            relations.push({start: rec.startNodeElementId, end: rec.endNodeElementId, type: rec.type})
        },
        onCompleted: async () => {
            session.close()
            return res.send(relations)
            },
            onError: error => { console.log(error); session.close(); return res.status(500).send({error})
            }
        })
})

router.post('/copyFatherRelations', async (req, res) => {
    const userId = req.body.userId
    const fatherRelations = req.body.fatherRelations

    if(!userId || !fatherRelations) {
        return res.status(400).send({error: "Missing querry data"})
    }
    const relations = []
    const fatherRelationsString = fatherRelations.map(r => `{start: ${r.start}, end: ${r.end}}`)

    const session = driver.session()
    await session
    .run(`UNWIND  [${fatherRelationsString}] AS r
          MATCH (c:Person {originalId: r.start, userId: '${userId}'}), (f:Male {originalId: r.end, userId: '${userId}'})
          CREATE (c)-[:Father]->(f)
          CREATE (f)-[:Child]->(c)
          RETURN c, f`)
    .subscribe({
        onNext: record => {
            const child = {id: record.get(0).elementId, ...record.get(0).properties}
            const father = {id: record.get(1).elementId, ...record.get(1).properties}
            relations.push({child, father})
        },
        onCompleted: async () => {
            session.close()
            return res.send(relations)
            },
            onError: error => { console.log(error); session.close(); return res.status(500).send({error})
            }
        })
})

router.post('/copyMotherRelations', async (req, res) => {
    const userId = req.body.userId
    const motherRelations = req.body.motherRelations

    if(!userId || !motherRelations) {
        return res.status(400).send({error: "Missing querry data"})
    }
    const relations = []
    const motherRelationsString = motherRelations.map(r => `{start: ${r.start}, end: ${r.end}}`)

    const session = driver.session()
    await session
    .run(`UNWIND  [${motherRelationsString}] AS r
          MATCH (c:Person {originalId: r.start, userId: '${userId}'}), (m:Female {originalId: r.end, userId: '${userId}'})
          CREATE (c)-[:Mother]->(m)
          CREATE (m)-[:Child]->(c)
          RETURN c, m`)
    .subscribe({
        onNext: record => {
            const child = {id: record.get(0).elementId, ...record.get(0).properties}
            const mother = {id: record.get(1).elementId, ...record.get(1).properties}
            relations.push({child, mother})
        },
        onCompleted: async () => {
            session.close()
            return res.send(relations)
            },
            onError: error => { console.log(error); session.close(); return res.status(500).send({error})
            }
        })
})

router.post('/copyPossibleFatherRelations', async (req, res) => {
    const userId = req.body.userId
    const possibleFatherRelations = req.body.possibleFatherRelations

    if(!userId || !possibleFatherRelations) {
        return res.status(400).send({error: "Missing querry data"})
    }
    const relations = []
    const possibleFatherRelationsString = possibleFatherRelations.map(r => `{start: ${r.start}, end: ${r.end}}`)

    const session = driver.session()
    await session
    .run(`UNWIND  [${possibleFatherRelationsString}] AS r
          MATCH (c:Person {originalId: r.start, userId: '${userId}'}), (f:Male {originalId: r.end, userId: '${userId}'})
          CREATE (c)-[:PossibleFather]->(f)
          CREATE (f)-[:PossibleChild]->(c)
          RETURN c, f`)
    .subscribe({
        onNext: record => {
            const possibleChild = {id: record.get(0).elementId, ...record.get(0).properties}
            const possibleFather = {id: record.get(1).elementId, ...record.get(1).properties}
            relations.push({possibleChild, possibleFather})
        },
        onCompleted: async () => {
            session.close()
            return res.send(relations)
            },
            onError: error => { console.log(error); session.close(); return res.status(500).send({error})
            }
        })
})

router.post('/copyPossibleMotherRelations', async (req, res) => {
    const userId = req.body.userId
    const possibleMotherRelations = req.body.possibleMotherRelations

    if(!userId || !possibleMotherRelations) {
        return res.status(400).send({error: "Missing querry data"})
    }
    const relations = []
    const possibleMotherRelationsString = possibleMotherRelations.map(r => `{start: ${r.start}, end: ${r.end}}`)

    const session = driver.session()
    await session
    .run(`UNWIND  [${possibleMotherRelationsString}] AS r
          MATCH (c:Person {originalId: r.start, userId: '${userId}'}), (m:Female {originalId: r.end, userId: '${userId}'})
          CREATE (c)-[:PossibleMother]->(m)
          CREATE (m)-[:PossibleChild]->(c)
          RETURN c, m`)
    .subscribe({
        onNext: record => {
            const possibleChild = {id: record.get(0).elementId, ...record.get(0).properties}
            const possibleMother = {id: record.get(1).elementId, ...record.get(1).properties}
            relations.push({possibleChild, possibleMother})
        },
        onCompleted: async () => {
            session.close()
            return res.send(relations)
            },
            onError: error => { console.log(error); session.close(); return res.status(500).send({error})
            }
        })
})

module.exports = router