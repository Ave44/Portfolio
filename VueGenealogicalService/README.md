# Genealogical service 🌳
Vue genealogical service is an application for creating and managing genealogical trees, chatting with other users and searching for common ancestors among other users.

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
- App was created according to *Options API* pattern
- App store is created with *Vuex*
- App requests to backend are automaticially injected with *Authorization* header with correct tocken stored in app store
- App styles are written entierly in *scss* with use of variables, and every view is responsive with plenty of various cool hover effects

<h2 id="Dependencies-Frontend">Dependencies</h2>

- vue *^3.2.13*
- vue-router *^4.1.6*
- vuex *^4.1.0*
- axios *^1.2.2*
- sass *^1.57.1*
- sass-loader *^13.2.0*
- socket.io *^4.5.4*
- socket.io-client *^4.5.4*

<h2 id="Setup-Frontend">Setup</h2>

1. After cloning repository run `npm i` in *frontend* directory
2. Make sure that your backend is working correctly ([see there](#Setup-Backend))
3. Run `npm run serve`

## Views
### Login
First view that user sees, and to which is redirected if is not logged in.

![Login](https://github.com/Ave44/Portfolio/blob/main/images/VueGenealogicalService/Login.png?raw=true)

### Sing up
View for signing in

![SignUp](https://github.com/Ave44/Portfolio/blob/main/images/VueGenealogicalService/SignUp.png?raw=true)

### Tree
Main view for logged user which allows to browse and manage tree by adding, editing and deleting people.

![Tree](https://github.com/Ave44/Portfolio/blob/main/images/VueGenealogicalService/Tree.png?raw=true)

### Edit person
View for editing people with dropdown and multiselect lists.

![Edit](https://github.com/Ave44/Portfolio/blob/main/images/VueGenealogicalService/Edit.png?raw=true)

### Add person
View for adding new person.

![Add](https://github.com/Ave44/Portfolio/blob/main/images/VueGenealogicalService/Add.png?raw=true)

### Social
View where user can acces his/hers friends and chat with all active users.

![Social](https://github.com/Ave44/Portfolio/blob/main/images/VueGenealogicalService/Social.png?raw=true)

### Friend view
View where user can look at trees of other people, chat with them and copy part of theirs trees.

![Friend](https://github.com/Ave44/Portfolio/blob/main/images/VueGenealogicalService/Friend.png?raw=true)

![FriendCopping](https://github.com/Ave44/Portfolio/blob/main/images/VueGenealogicalService/FriendCopping.png?raw=true)

### Search select
View that allows user to select searching type

![Search](https://github.com/Ave44/Portfolio/blob/main/images/VueGenealogicalService/Search.png?raw=true)

### Search by name
View that allows user to search his realtives in trees of other users by passing ancestors name and birth date.

![SearchByNameBefore](https://github.com/Ave44/Portfolio/blob/main/images/VueGenealogicalService/SearchByNameBefore.png?raw=true)

![SearchByNameAfter](https://github.com/Ave44/Portfolio/blob/main/images/VueGenealogicalService/SearchByNameAfter.png?raw=true)

### Search by surnames
View that allows user to search his realtives in trees of other users by passing set of surnames that are present in his/hers fammily tree.

![SearchBySurnameBefore](https://github.com/Ave44/Portfolio/blob/main/images/VueGenealogicalService/SearchBySurnameBefore.png?raw=true)

![SearchBySurnameAfter](https://github.com/Ave44/Portfolio/blob/main/images/VueGenealogicalService/SearchBySurnameAfter.png?raw=true)

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
4. Run `node setUpInitData.js` to populate your newly created databases
5. Run `node index.js`

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
  - GET &ensp; `/people/withLabels` - get all people with labels from database
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
  - GET &ensp; `/people/relations` - get all relations from database
  - POST `/people/relations/setMother` - set mother-child relations between two nodes
  - PUT &ensp; `/people/relations/updateMother` - change mother-child relations between three nodes
  - DEL &ensp; `/people/relations/delMother` - delete mother-child relations between two nodes
  - POST `/people/relations/setFather` - set father-child relations between two nodes
  - PUT &ensp; `/people/relations/updateFather` - change father-child relations between three nodes
  - DEL &ensp; `/people/relations/delFather` - delete father-child relations between two nodes
  - POST `/people/relations/setPossibleMothers` - set possibleMother-possibleChild relations between many nodes
  - PUT &ensp; `/people/relations/changePossibleMothers` - change possibleMother-possibleChild relations between many nodes
  - DEL &ensp; `/people/relations/delPossibleMothers` - delete possibleMother-possibleChild relations between many nodes
  - POST `/people/relations/setPossibleFathers` - set possibleFather-possibleChild relations between many nodes
  - PUT &ensp; `/people/relations/changePossibleFathers` - change possibleFather-possibleChild relations between many nodes
  - DEL &ensp; `/people/relations/delPossibleFathers` - delete possibleFather-possibleChild relations between many nodes
  - POST `/people/relations/setChildren` - set mother-child or father-child relations
  - DEL &ensp; `/people/relations/delChildren` - delete mother-child or father-child relations
  - POST `/people/relations/getPeopleRelations` - get selected people relations
  - POST `/people/relations/copyFatherRelations` - copy selected father-child relations based on *originalId* property
  - POST `/people/relations/copyMotherRelations` - copy selected mother-child relations based on *originalId* property
  - POST `/people/relations/copyPossibleFatherRelations` - copy selected possibleFather-possibleChild relations based on *originalId* property
  - POST `/people/relations/copyPossibleMotherRelations` - copy selected possibleMother-possibleChild relations based on *originalId* property
