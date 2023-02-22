# Music service 🎶
Music service react app is an application where you can store and browse your favourite tracks! It allows user to add, manage, and connect songs and authors of His/Hers choice.

# Frontend
## Views
- Home

![home](https://github.com/Ave44/Portfolio/blob/71cc04fc663f595d23ae41492c9f74aa0b027723/images/ReactMusicApp/Home.png?raw=true)

- Song list
- Song details
- Song edit
- Song asign authors
- Musicians list
- Musician details
- Musician edit
- Adding view
- Song add
- Musician add

App styles are written entierly in scss, and every view is responsive.

## Dependencies
- react *^18.2.0*
- react-dom *^18.2.0*
- react-router-dom *^6.8.1*
- react-scripts *5.0.1*
- axios *^1.3.3*
- formik *^2.2.9*
- yup *^1.0.0*
- react-redux *^8.0.5*
- redux-logger *^3.0.6*
- redux-thunk *^2.4.1*
- react-player *^2.9.0*
- recharts *^2.1.8*
- react-minimal-pie-chart *^8.2.0*
- web-vitals *^3.1.1*
- @testing-library/jest-dom *^5.15.1*
- @testing-library/react *^14.0.0*
- @testing-library/user-event   *^14.4.3*

# Backend
App backend is using relational batabase **postgreSQL**, and is working by default on port *5000*. All database connection parameters can be specified with *.env* file.

## Dependencies
- cors *^2.8.5*,
- dotenv *^16.0.3*,
- express *^4.17.2*,
- pg *^8.7.1*

## Setup
1. After cloning repository run `npm i` in *backend* directory
2. Setup postgreSQL database on your local machine or in Docker container with `docker run --name React_Music_Service_DB -p 5432:5432 -e POSTGRES_PASSWORD=projekt -e POSTGRES_USER=postgres -d postgres`
3. Optionally create *.env* file to change default data
```
HOST = '127.0.0.1',
PORT = 5432,
DATABASE = 'postgres',
USER = 'postgres',
PASSWORD = 'projekt'
BACKEND_PORT = 5000
```
4. Run `node index.js`

## Tables
### **songs**
column name | data type | null?
--- | --- | ---
id  | serial | ❌
title | varchar | ❌
genre | varchar | ❌
productionyear | varchar(30) | ❌
image | varchar | ✔️
video | varchar | ✔️

### **musicians**
column name | data type | null?
--- | --- | ---
id  | serial | ❌
name | varchar | ❌
country | varchar(20) | ❌
year | varchar | ❌
image | varchar | ✔️️

### **connections**
column name | data type | null?
--- | --- | ---
id  | serial | ❌
songId | int | ❌
musicianId | int | ❌

## Routes
- **GET**
  - `/songs` - return all songs from database
  - `/musicians` - return all musicians from database
  - `/connections` - return all connections between songs and musicians from database
- **POST**
  - `/songs` - add new song from request body
  - `/songs/edit/:id` - edit song with specified id
  - `/songs/:songId/:authorId` - asign author with specified id to song with specified id
  - `/musicians` - add new musician from request body
  - `/musicians/edit/:id` - edit musician with specified id
  - `/connections` - add new connection from request body
- **DELETE**
  - `/songs/:id` - delete song with specified id
  - `/musicians/:id` - delete musician with specified id
  - `/connections/:id` - delete connection with specified id