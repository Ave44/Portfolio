# Music service 🎶
Music service react app is an application where you can store and browse your favourite tracks! It allows user to add, manage, and connect songs and authors of His/Hers choice.

## Table of Contents
- [Frontend](#Frontend)
  - [Dependencies](#Dependencies-Frontend)
  - [Setup](#Setup-Frontend)
  - [Views](#Views)
- [Backend](#Backend)
  - [Dependencies](#Dependencies-Backend)
  - [Setup](#Setup-Backend)
  - [Tables](#Tables)
  - [Routes](#Routes)

# Frontend
App is fully translated into two languages, English and Russian.
App styles are written entierly in scss, and every view is responsive with plenty of various cool hover effects.

<h2 id="Dependencies-Frontend">Dependencies</h2>

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

<h2 id="Setup-Frontend">Setup</h2>

1. After cloning repository run `npm i` in *frontend* directory
2. Make sure that your backend is working correctly ([see there](#Setup-Backend))
3. Run `npm start`

## Views
### Home
main site where user is greeted by four stylish widgets showing:
- Musician with most songs
- Interactive diagram of songs relased each year
- Interactive chart of distribution of all song genres
- List of songs that dont have assigned author

![Home](https://github.com/Ave44/Portfolio/blob/main/images/ReactMusicApp/Home.png?raw=true)

### Song list
paginated list of all songs with expandable and animated filter box!

![SongList](https://github.com/Ave44/Portfolio/blob/main/images/ReactMusicApp/SongList.png?raw=true)
![SongListFilters](https://github.com/Ave44/Portfolio/blob/main/images/ReactMusicApp/SongListFilters.png?raw=true)

### Song details
this view allows user to edit, delete, and what is most important to listen to selected song!

![SongDetails](https://github.com/Ave44/Portfolio/blob/main/images/ReactMusicApp/SongDetails.png?raw=true)

### Song edit
neat edit form creadted with *Formik* and fully validated with *yup*.
All error messages are displayed below corresponding fields.

![SongEdit](https://github.com/Ave44/Portfolio/blob/main/images/ReactMusicApp/SongEdit.png?raw=true)

### Song assign authors
view that allows assigning multiple authors to song. All authors can be filtered and sorted like in *Musicians list* view

![AssignAuthors](https://github.com/Ave44/Portfolio/blob/main/images/ReactMusicApp/AssignAuthors.png?raw=true)

### Musicians list
paginated list of all musicians with expandable and animated filter box!

![Musicians](https://github.com/Ave44/Portfolio/blob/main/images/ReactMusicApp/Musicians.png?raw=true)
![MusiciansFilters](https://github.com/Ave44/Portfolio/blob/main/images/ReactMusicApp/MusiciansFilters.png?raw=true)

### Musician details
this view allows user to edit and delete musician, or quickly jump to one of his/hers songs!

![MusicianDetails](https://github.com/Ave44/Portfolio/blob/main/images/ReactMusicApp/MusicianDetails.png?raw=true)

### Musician edit
neat edit form creadted with *Formik* and fully validated with *yup*.
All error messages are displayed below corresponding fields.

![MusicianEdit](https://github.com/Ave44/Portfolio/blob/main/images/ReactMusicApp/MusicianEdit.png?raw=true)

### Adding view
view that allows user to expand his/her collection!

![Add](https://github.com/Ave44/Portfolio/blob/main/images/ReactMusicApp/Add.png?raw=true)

### Song add
neat add form creadted with *Formik* and fully validated with *yup*.
All error messages are displayed below corresponding fields.

![AddSong](https://github.com/Ave44/Portfolio/blob/main/images/ReactMusicApp/AddSong.png?raw=true)

### Musician add
neat add form creadted with *Formik* and fully validated with *yup*.
All error messages are displayed below corresponding fields.

![AddMusician](https://github.com/Ave44/Portfolio/blob/main/images/ReactMusicApp/AddMusician.png?raw=true)

# Backend
App backend is using relational batabase **postgreSQL**, and is working by default on port *5000*. All database connection parameters can be specified with *.env* file.

<h2 id="Dependencies-Backend">Dependencies</h2>

- cors *^2.8.5*,
- dotenv *^16.0.3*,
- express *^4.17.2*,
- pg *^8.7.1*

<h2 id="Setup-Backend">Setup</h2>

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