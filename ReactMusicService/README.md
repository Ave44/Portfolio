# Music service 🎶

Music service react app is an application where you can store and browse your favorite tracks! It allows user to add, manage, and connect songs and authors of your choice.

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

- App store is created according to the _Ducks_ pattern.
- All forms are created with _Formik_ and validated with _Yup_
- App is fully translated into two languages, English and Russian.
- App styles are written entirely in scss, and every view is responsive with plenty of various cool hover effects.

<h2 id="Dependencies-Frontend">Dependencies</h2>

- react _^18.2.0_
- react-dom _^18.2.0_
- react-router-dom _^6.8.1_
- react-scripts _5.0.1_
- axios _^1.3.3_
- formik _^2.2.9_
- yup _^1.0.0_
- react-redux _^8.0.5_
- redux-logger _^3.0.6_
- redux-thunk _^2.4.1_
- react-player _^2.9.0_
- recharts _^2.1.8_
- react-minimal-pie-chart _^8.2.0_
- web-vitals _^3.1.1_
- @testing-library/jest-dom _^5.15.1_
- @testing-library/react _^14.0.0_
- @testing-library/user-event _^14.4.3_

<h2 id="Setup-Frontend">Setup</h2>

1. After cloning repository run `npm i` in _frontend_ directory
2. Make sure that your backend is working correctly ([see there](#Setup-Backend))
3. Run `npm start`

## Views

### Home

main site where user is greeted by four stylish widgets showing:

- Musician with most songs
- Interactive diagram of songs released each year
- Interactive chart of distribution of all song genres
- List of songs that don't have assigned author

![Home](https://github.com/Ave44/Portfolio/blob/main/images/ReactMusicApp/Home.png?raw=true)

### Song list

paginated list of all songs with expandable and animated filter box!

![SongList](https://github.com/Ave44/Portfolio/blob/main/images/ReactMusicApp/SongList.png?raw=true)
![SongListFilters](https://github.com/Ave44/Portfolio/blob/main/images/ReactMusicApp/SongListFilters.png?raw=true)

### Song details

this view allows user to edit, delete, and what is most important to listen to selected song!

![SongDetails](https://github.com/Ave44/Portfolio/blob/main/images/ReactMusicApp/SongDetails.png?raw=true)

### Song edit

neat edit form created with _Formik_ and fully validated with _yup_.
All error messages are displayed below corresponding fields.

![SongEdit](https://github.com/Ave44/Portfolio/blob/main/images/ReactMusicApp/SongEdit.png?raw=true)

### Song assign authors

view that allows assigning multiple authors to song. All authors can be filtered and sorted like in _Musicians list_ view

![AssignAuthors](https://github.com/Ave44/Portfolio/blob/main/images/ReactMusicApp/AssignAuthors.png?raw=true)

### Musicians list

paginated list of all musicians with expandable and animated filter box!

![Musicians](https://github.com/Ave44/Portfolio/blob/main/images/ReactMusicApp/Musicians.png?raw=true)
![MusiciansFilters](https://github.com/Ave44/Portfolio/blob/main/images/ReactMusicApp/MusiciansFilters.png?raw=true)

### Musician details

this view allows user to edit and delete musician, or quickly jump to one of his/hers songs!

![MusicianDetails](https://github.com/Ave44/Portfolio/blob/main/images/ReactMusicApp/MusicianDetails.png?raw=true)

### Musician edit

neat edit form created with _Formik_ and fully validated with _yup_.
All error messages are displayed below corresponding fields.

![MusicianEdit](https://github.com/Ave44/Portfolio/blob/main/images/ReactMusicApp/MusicianEdit.png?raw=true)

### Adding view

view that allows user to expand his/her collection!

![Add](https://github.com/Ave44/Portfolio/blob/main/images/ReactMusicApp/Add.png?raw=true)

### Song add

neat add form created with _Formik_ and fully validated with _yup_.
All error messages are displayed below corresponding fields.

![AddSong](https://github.com/Ave44/Portfolio/blob/main/images/ReactMusicApp/AddSong.png?raw=true)

### Musician add

neat add form created with _Formik_ and fully validated with _yup_.
All error messages are displayed below corresponding fields.

![AddMusician](https://github.com/Ave44/Portfolio/blob/main/images/ReactMusicApp/AddMusician.png?raw=true)

# Backend

App backend is using relational database **postgreSQL**, and is working by default on port _5000_. All database connection parameters can be specified with _.env_ file.

<h2 id="Dependencies-Backend">Dependencies</h2>

- cors _^2.8.5_,
- dotenv _^16.0.3_,
- express _^4.17.2_,
- pg _^8.7.1_

<h2 id="Setup-Backend">Setup</h2>

1. After cloning repository run `npm i` in _backend_ directory
2. Setup postgreSQL database on your local machine or in Docker container with `docker run --name React_Music_Service_DB -p 5432:5432 -e POSTGRES_PASSWORD=projekt -e POSTGRES_USER=postgres -d postgres`
3. Optionally create _.env_ file to change default data

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

| column name    | data type   | null? |
| -------------- | ----------- | ----- |
| id             | serial      | ❌    |
| title          | varchar     | ❌    |
| genre          | varchar     | ❌    |
| productionyear | varchar(30) | ❌    |
| image          | varchar     | ✔️    |
| video          | varchar     | ✔️    |

### **musicians**

| column name | data type   | null? |
| ----------- | ----------- | ----- |
| id          | serial      | ❌    |
| name        | varchar     | ❌    |
| country     | varchar(20) | ❌    |
| year        | varchar     | ❌    |
| image       | varchar     | ✔️️   |

### **connections**

| column name | data type | null? |
| ----------- | --------- | ----- |
| id          | serial    | ❌    |
| songId      | int       | ❌    |
| musicianId  | int       | ❌    |

## Routes

- **GET**
  - `/songs` - return all songs from database
  - `/musicians` - return all musicians from database
  - `/connections` - return all connections between songs and musicians from database
- **POST**
  - `/songs` - add new song from request body
  - `/songs/edit/:id` - edit song with specified id
  - `/songs/:songId/:authorId` - assign author with specified id to song with specified id
  - `/musicians` - add new musician from request body
  - `/musicians/edit/:id` - edit musician with specified id
  - `/connections` - add new connection from request body
- **DELETE**
  - `/songs/:id` - delete song with specified id
  - `/musicians/:id` - delete musician with specified id
  - `/connections/:id` - delete connection with specified id
