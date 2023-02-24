const express = require('express')
const router = express.Router({mergeParams: true})
const driver = require('../config/neo4jDriver')

router.get('/', async (req, res) => {
    const people = []

    const session = driver.session()
    await session.run('MATCH (p:Person) RETURN p')
        .subscribe({
            onNext: record => {
                const person = {id: record.get(0).elementId, ...record.get(0).properties}
                people.push(person)
            },
            onCompleted: () => {
                session.close()
                return res.send(people)
            },
            onError: error => {
                session.close()
                return res.status(500).send({error})
            }
        })
})

router.get('/withLabels', async (req, res) => {
    const people = []

    const session = driver.session()
    await session.run('MATCH (p:Person) RETURN p')
        .subscribe({
            onNext: record => {
                const person = {id: record.get(0).elementId, ...record.get(0).properties, labels: record.get(0).labels}
                people.push(person)
            },
            onCompleted: () => {
                session.close()
                return res.send(people)
            },
            onError: error => {
                session.close()
                return res.status(500).send({error})
            }
        })
})

router.get('/:id', async (req, res) => {
    let person = null
    const id = req.params.id

    if(!id) {
        return res.status(400).send({error: "Missing querry data"})
    }

    const session = driver.session()
    await session.run(`MATCH (p:Person) WHERE id(p) = ${id} RETURN p`)
    .subscribe({
        onNext: record => {
            person = {id: record.get(0).elementId, ...record.get(0).properties}
        },
        onCompleted: () => {
            session.close()
            if(person !== null) { return res.send(person) }
            return res.send({error: "Person not found"})
        },
        onError: error => {
            session.close()
            return res.status(500).send({error})
        }
    })
})

router.get('/root/:userId', async (req, res) => {
    let person = null
    const userId = req.params.userId

    if(!userId) {
        return res.status(400).send({error: "Missing querry data"})
    }

    const session = driver.session()
    await session.run(`MATCH (p:Root) WHERE p.userId = '${userId}' RETURN p`)
    .subscribe({
        onNext: record => {
            person = {id: record.get(0).elementId, ...record.get(0).properties}
        },
        onCompleted: () => {
            session.close()
            if(person !== null) { return res.send(person) }
            return res.send({error: "Person not found"})
        },
        onError: error => {
            session.close()
            return res.status(500).send({error})
        }
    })
})

router.post('/', async (req, res) => {
    const name = req.body.name
    const birthDate = req.body.birthDate
    const gender = req.body.gender
    const userId = req.body.userId

    if(!name || !gender || !userId) {
        return res.status(400).send({error: "Missing querry data"})
    }
    let person = null

    const session = driver.session()
    await session
        .run(`CREATE (p:Person:${gender} {name : '${name}', birthDate : '${birthDate}', userId: '${userId}'}) RETURN p`)
        .subscribe({
            onNext: record => {
                person = {id: record.get(0).elementId, ...record.get(0).properties}
                console.log("NEO4J POST", person)
            },
            onCompleted: () => {
                session.close()
                return res.send(person)
            },
            onError: error => {
                console.log(error)
                session.close()
                return res.status(500).send({error})
            }
        })
})

router.post('/root', async (req, res) => {
    const name = req.body.name
    const birthDate = req.body.birthDate
    const gender = req.body.gender
    const userId = req.body.userId

    if(!name || !gender || !userId) {
        return res.status(400).send({error: "Missing querry data"})
    }
    let person = null

    const session = driver.session()
    await session
        .run(`CREATE (p:Person:${gender}:Root {name : '${name}', birthDate : '${birthDate}', userId: '${userId}', rootNode: true}) RETURN p`)
        .subscribe({
            onNext: record => {
                person = {id: record.get(0).elementId, ...record.get(0).properties}
                // console.log("NEO4J POST", person)
            },
            onCompleted: () => {
                session.close()
                return res.send(person)
            },
            onError: error => {
                console.log(error)
                session.close()
                return res.status(500).send({error})
            }
        })
})

router.post('/search', async (req, res) => {
    const name = req.body.name
    const birthDate = req.body.birthDate

    const people = []

    const session = driver.session()
    await session.run(`MATCH (p:Person)
                       WHERE toLower(p.name) CONTAINS toLower("${name}") AND p.birthDate CONTAINS "${birthDate}"
                       RETURN p`)
        .subscribe({
            onNext: record => {
                const person = {id: record.get(0).elementId, ...record.get(0).properties}
                people.push(person)
            },
            onCompleted: () => {
                session.close()
                return res.send(people)
            },
            onError: error => {
                session.close()
                return res.status(500).send({error})
            }
        })
})

router.post('/copyPeople', async (req, res) => {
    const userId = req.body.userId
    const selectedPeople = req.body.selectedPeople

    if(!userId || !selectedPeople) {
        return res.status(400).send({error: "Missing querry data"})
    }
    const people = []

    const selectedPeopleString = selectedPeople.map(p => `{originalId: ${p.id}, name: "${p.name}", birthDate: "${p.birthDate}", userId: "${userId}", gender: "${p.labels.filter(l => l == "Male" || l == "Female")[0]}"}`)
    // console.log(selectedPeopleString) // [{originalId: 16, name: "jon doe"", birthDate: "01.02.1999", userId: "123", gender: "Male"}]
    const session = driver.session()
    await session
    .run(`UNWIND [${selectedPeopleString}] as n
          WITH n
          CREATE (p:Person)
          SET p = n
          WITH p
        
          MATCH (m:Person) where m.gender = "Male" AND m.userId = "${userId}"
          SET m:Male
          REMOVE m.gender
          WITH p
          
          MATCH (f:Person) where f.gender = "Female" AND f.userId = "${userId}"
          SET f:Female
          REMOVE f.gender
          RETURN DISTINCT p`)
    .subscribe({
        onNext: record => {
            people.push({id: record.get(0).elementId, ...record.get(0).properties, labels: record.get(0).labels})
        },
        onCompleted: async () => {
            session.close()
            return res.send(people)
            },
            onError: error => { console.log(error); session.close(); return res.status(500).send({error})
            }
        })
})

router.post('/removeOriginalIdProperty', async (req, res) => {
    const userId = req.body.userId

    if(!userId) {
        return res.status(400).send({error: "Missing querry data"})
    }
    const people = []

    const session = driver.session()
    await session
    .run(`MATCH (p:Person)
          WHERE p.userId = "${userId}"
          REMOVE p.originalId
          RETURN p`)
    .subscribe({
        onNext: record => {
            people.push({id: record.get(0).elementId, ...record.get(0).properties, labels: record.get(0).labels})
        },
        onCompleted: async () => {
            session.close()
            return res.send(people)
            },
            onError: error => { console.log(error); session.close(); return res.status(500).send({error})
            }
        })
})

router.put('/:id', async (req, res) => {
    const id = req.params.id
    const name = req.body.name
    const birthDate = req.body.birthDate

    if(!id || !name) {
        return res.status(400).send({error: "Missing querry data"})
    }
    let updatedPerson = null

    const session = driver.session()
    await session
        .run(`MATCH (p:Person) WHERE id(p) = ${id}
              SET p.name = '${name}', p.birthDate = '${birthDate}'
              RETURN p`)
        .subscribe({
            onNext: record => {
                updatedPerson = {id: record.get(0).elementId, ...record.get(0).properties}
                // console.log("NEO4J PUT", updatedPerson)
            },
            onCompleted: () => {
                session.close()
                return res.send(updatedPerson)
            },
            onError: error => {
                console.log(error)
                session.close()
                return res.status(500).send({error})
            }
        })
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id

    if(!id) {
        return res.status(400).send({error: "Missing querry data"})
    }

    const session = driver.session()
    await session.run(`MATCH (p)
                       WHERE id(p) = ${id} AND NOT p:Root
                       DETACH DELETE p`)
    .subscribe({
        onCompleted: () => {
            session.close()
            return res.send(true)
        },
        onError: error => {
            session.close()
            return res.status(500).send({error})
        }
    })
})

// 

router.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId
    if(!userId) {
        return res.status(400).send({error: "Missing querry data"})
    }
    const people = []

    const session = driver.session()
    await session.run(`MATCH (p:Person) WHERE p.userId='${userId}' RETURN p`)
        .subscribe({
            onNext: record => {
                const person = {id: record.get(0).elementId, ...record.get(0).properties, labels: record.get(0).labels}
                people.push(person)
            },
            onCompleted: () => {
                session.close()
                return res.send(people)
            },
            onError: error => {
                session.close()
                return res.status(500).send({error})
            }
        })
})

router.get('/user/female/:userId', async (req, res) => {
    const userId = req.params.userId
    if(!userId) {
        return res.status(400).send({error: "Missing querry data"})
    }
    const people = []

    const session = driver.session()
    await session.run(`MATCH (p:Female) WHERE p.userId='${userId}' RETURN p`)
        .subscribe({
            onNext: record => {
                const person = {id: record.get(0).elementId, ...record.get(0).properties}
                people.push(person)
            },
            onCompleted: () => {
                session.close()
                return res.send(people)
            },
            onError: error => {
                session.close()
                return res.status(500).send({error})
            }
        })
})

router.get('/user/male/:userId', async (req, res) => {
    const userId = req.params.userId
    if(!userId) {
        return res.status(400).send({error: "Missing querry data"})
    }
    const people = []

    const session = driver.session()
    await session.run(`MATCH (p:Male) WHERE p.userId='${userId}' RETURN p`)
        .subscribe({
            onNext: record => {
                const person = {id: record.get(0).elementId, ...record.get(0).properties}
                people.push(person)
            },
            onCompleted: () => {
                session.close()
                return res.send(people)
            },
            onError: error => {
                session.close()
                return res.status(500).send({error})
            }
        })
})

router.get('/mother/:id', async (req, res) => {
    let person = null
    const id = req.params.id

    if(!id) {
        return res.status(400).send({error: "Missing querry data"})
    }

    const session = driver.session()
    await session.run(`MATCH (c:Person)-[r:Mother]->(m:Female) WHERE id(c)=${id} RETURN m`)
    .subscribe({
        onNext: record => {
            person = {id: record.get(0).elementId, ...record.get(0).properties}
        },
        onCompleted: () => {
            session.close()
            return res.send(person)
        },
        onError: error => {
            session.close()
            return res.status(500).send({error})
        }
    })
})

router.get('/father/:id', async (req, res) => {
    let person = null
    const id = req.params.id

    if(!id) {
        return res.status(400).send({error: "Missing querry data"})
    }

    const session = driver.session()
    await session.run(`MATCH (c:Person)-[r:Father]->(f:Male) WHERE id(c)=${id} RETURN f`)
    .subscribe({
        onNext: record => {
            person = {id: record.get(0).elementId, ...record.get(0).properties}
        },
        onCompleted: () => {
            session.close()
            return res.send(person)
        },
        onError: error => {
            session.close()
            return res.status(500).send({error})
        }
    })
})

router.get('/possibleMother/:id', async (req, res) => {
    let people = []
    const id = req.params.id

    if(!id) {
        return res.status(400).send({error: "Missing querry data"})
    }

    const session = driver.session()
    await session.run(`MATCH (c:Person)-[r:PossibleMother]->(m:Female) WHERE id(c)=${id} RETURN m`)
    .subscribe({
        onNext: record => {
            people.push( {id: record.get(0).elementId, ...record.get(0).properties} )
        },
        onCompleted: () => {
            session.close()
            return res.send(people)
        },
        onError: error => {
            session.close()
            return res.status(500).send({error})
        }
    })
})

router.get('/possibleFather/:id', async (req, res) => {
    let people = []
    const id = req.params.id

    if(!id) {
        return res.status(400).send({error: "Missing querry data"})
    }

    const session = driver.session()
    await session.run(`MATCH (c:Person)-[r:PossibleFather]->(f:Male) WHERE id(c)=${id} RETURN f`)
    .subscribe({
        onNext: record => {
            people.push( {id: record.get(0).elementId, ...record.get(0).properties} )
        },
        onCompleted: () => {
            session.close()
            return res.send(people)
        },
        onError: error => {
            session.close()
            return res.status(500).send({error})
        }
    })
})

router.get('/parents/:id', async (req, res) => {
    let result = [null, null]
    const id = req.params.id

    if(!id) {
        return res.status(400).send({error: "Missing querry data"})
    }

    const session = driver.session()
    await session.run(`MATCH (c:Person)-[:Mother|Father]->(p:Person)
                       WHERE id(c)=${id}
                       RETURN p`)
    .subscribe({
        onNext: record => {
            const person = record.get(0)
            if(person.labels.includes("Male")) {
                result[0] = {id: person.elementId, ...person.properties}
            } else {
                result[1] = {id: person.elementId, ...person.properties}
            }
        },
        onCompleted: () => {
            session.close()
            return res.send(result)
        },
        onError: error => {
            session.close()
            return res.status(500).send({error})
        }
    })
})

router.get('/children/:id', async (req, res) => {
    let children = []
    const id = req.params.id

    if(!id) {
        return res.status(400).send({error: "Missing querry data"})
    }

    const session = driver.session()
    await session.run(`MATCH (p:Person)-[r:Child]->(c:Person) WHERE id(p)=${id} RETURN c`)
    .subscribe({
        onNext: record => {
            children.push( {id: record.get(0).elementId, ...record.get(0).properties} )
        },
        onCompleted: () => {
            session.close()
            return res.send(children)
        },
        onError: error => {
            session.close()
            return res.status(500).send({error})
        }
    })
})

module.exports = router