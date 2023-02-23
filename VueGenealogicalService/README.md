# Genealogical service 🌳

## Table of Contents
- [Frontend](#Frontend)
  - [Dependencies](#Dependencies-Frontend)
  - [Setup](#Setup-Frontend)
  - [Views](#Views)
- [Backend](#Backend)
  - [Dependencies](#Dependencies-Backend)
  - [Setup](#Setup-Backend)
  - [Security](#Security)
  - [Websockets](#Websockets)
  - [Data structure](#Data-structure)
  - [Routes](#Routes)

# Frontend

<h2 id="Dependencies-Frontend">Dependencies</h2>

<h2 id="Setup-Frontend">Setup</h2>

## Views

# Backend
App backend is composed of four main parts
- [**passport**](#Security) confuguration with *JWT strategy*
- [**Neo4j**](#Neo4j) configuration
- [**MongoDB**](#Mongodb) configuration
- [**socket.io**](#Websockets) configuration

<h2 id="Dependencies-Backend">Dependencies</h2>

- cors *^2.8.5*
- express *^4.18.2*
- http *^0.0.1-security*
- dotenv *^16.0.3*
- passport *^0.6.0*
- passport-jwt *^4.0.1*
- jsonwebtoken *^9.0.0*
- bcryptjs *^2.4.3*
- mongoose *^6.9.0*
- neo4j-driver *^5.5.0*
- socket.io *^4.5.4*

<h2 id="Setup-Backend">Setup</h2>

1. After cloning repository run `npm i` in *backend* directory
2. Set up databases
- Setup **mongoDB** database on your local machine or in Docker container with `docker run --name Genealogical_Service_MongoDB -p 27017:27017 mongo`
- Setup **Neo4j** database on your local machine or in Docker container with `docker run --name Genealogical_Service_Neo4j -p 7474:7474 -p 7687:7687 -e NEO4J_AUTH=neo4j/s3cr3t-p455w0r0 neo4j`
3. Optionally create *.env* file to change default data
```
NEO4J_URI = 'bolt://localhost:7687'
NEO4J_USER = 'neo4j'
NEO4J_PASSWORD = 's3cr3t-p455w0r0'

MONGO_HOST = '127.0.0.1'
MONGO_PORT = 27017
MONGO_DATABASE = 'projekt'

SECRET = '3p53k63nai6l0w8b1n68'

PORT = 5000
```
4. Run `node index.js`

## Security
Backend is securied with *passport* using JWT strategy. Users passwords are safely stored in database encrypted and salted with *bcryptjs*. All backend routes *(beside two routes for signing in and logging in)* are protected with use of middleware.

## Websockets
Backend allows users to chat in one global chat or create private chat rooms. All private chat rooms are dynamicaly created when needed.

## Data structure
### Mongodb
### **User**
column name | data type | null?
--- | --- | ---
_id  | ObjectId | ❌
name | String | ❌
surname | String | ❌
login | String | ❌
password | String | ❌
birthdate | String | ✔️

### **Chat**
column name | data type | null?
--- | --- | ---
_id  | ObjectId | ❌
members | Array | ❌
history | Array | ❌

### Neo4j
- **Nodes labels**
  - Root - root node of a user that is created along with users creation, cant be deleted on frontend side
  - Person - main label that marks all people
  - Male - label for males
  - Female - label for females

Gender labels are improving searching performance.

- **Nodes properties**

property name | data type | null?
--- | --- | ---
id  | Integer | ❌
name | String | ❌
birthDate | String | ❌
userId | String | ❌
rootNode | Boolean | ✔️

- **Nodes relationships**
  - Child
  - Father
  - Mother
  - PossibleChild
  - PossibleFather
  - PossibleMother

## Routes
All routes have theirs corresponding postman test that are prsenting theirs funcionality

### MongoDB
- User
  - GET &ensp; `/users` - get all users from database
  - GET &ensp; `/users/:id` - get user by id
  - POST `/unprotected` - create new user
  - POST `/unprotected/login` - login user to get jwt
  - PUT &ensp; `/users/:id` - update user
  - DEL &ensp; `/users/:id` - delete user
- Chat
  - GET &ensp; `/chats` - get all chats from database
  - GET &ensp; `/chats/:id` - get chat by id
  - POST `/chats` - create new chat
  - PUT &ensp; `/chats/:id` - update chat
  - DEL &ensp; `/chats/:id` - delete chat
### Neo4j
- People
  - GET &ensp; `/people` - get all people from database
  - GET &ensp; `/people/:id` - get person by id
  - GET &ensp; `/people/root/:userId` - get root node of user
  - POST `/people` - create person
  - POST `/people/root` - create root node
  - POST `/people/search` - get people with matching name and birth date
  - POST `/people/coprPeople` - copy selected people (leaves original userId as additional property)
  - POST `/people/removeOriginalIdProperty` - removes *originalId* property from selected nodes
  - PUT &ensp; `/people/:id` - update node
  - DEL &ensp; `/people/:id` - delete node
  - GET &ensp; `/people/user/:userId` - get all nodes belonging to user
  - GET &ensp; `/people/user/female/:userId` - get all nodes with label *female* belonging to user
  - GET &ensp; `/people/user/male/:userId` - get all nodes with label *male* belonging to user
  - GET &ensp; `/people/mother/:id` - get mother of person
  - GET &ensp; `/people/father/:id` - get father of person
  - GET &ensp; `/people/possibleMother/:id` - get all possible mothers of person
  - GET &ensp; `/people/possibleFather/:id` - get all possible fathers of person
  - GET &ensp; `/people/parents/:id` - get parents of person
  - GET &ensp; `/people/children/:id` - get children of person
- Relations
  - POST `/relations/setMother` - set mother-child relations between two nodes
  - PUT &ensp; `/relations/updateMother` - change mother-child relations between three nodes
  - DEL &ensp; `/relations/delMother` - delete mother-child relations between two nodes
  - POST `/relations/setFather` - set father-child relations between two nodes
  - PUT &ensp; `/relations/updateFather` - change father-child relations between three nodes
  - DEL &ensp; `/relations/delFather` - delete father-child relations between two nodes
  - POST `/relations/setPossibleMothers` - set possibleMother-possibleChild relations between many nodes
  - PUT &ensp; `/relations/changePossibleMothers` - change possibleMother-possibleChild relations between many nodes
  - DEL &ensp; `/relations/delPossibleMothers` - delete possibleMother-possibleChild relations between many nodes
  - POST `/relations/setPossibleFathers` - set possibleFather-possibleChild relations between many nodes
  - PUT &ensp; `/relations/changePossibleFathers` - change possibleFather-possibleChild relations between many nodes
  - DEL &ensp; `/relations/delPossibleFathers` - delete possibleFather-possibleChild relations between many nodes
  - POST `/relations/setChildren` - set mother-child or father-child relations
  - DEL &ensp; `/relations/delChildren` - delete mother-child or father-child relations
  - POST `/relations/getPeopleRelations` - get selected people relations
  - POST `/relations/copyFatherRelations` - copy selected father-child relations based on *originalId* property
  - POST `/relations/copyMotherRelations` - copy selected mother-child relations based on *originalId* property
  - POST `/relations/copyPossibleFatherRelations` - copy selected possibleFather-possibleChild relations based on *originalId* property
  - POST `/relations/copyPossibleMotherRelations` - copy selected possibleMother-possibleChild relations based on *originalId* property
