import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { useEffect, useState } from 'react';
import store from './ducks/store';
import { getSongsFromApi } from './ducks/songs/operations';
import { getMusiciansFromApi } from './ducks/musicians/operations';
import { getConnectionsFromApi } from './ducks/connections/operations';
import Topbar from './ui/Topbar';
import Sidebar from './ui/Sidebar';
import Add from './ui/Add';
import Main from './ui/Main';
import SongForm from './ui/songs/SongForm'
import SongList from './ui/songs/SongList';
import SongDetails from './ui/songs/SongDetails';
import SongEdit from './ui/songs/SongEdit';
import SongAsignAuthors from './ui/songs/SongAsignAuthors';
import MusicianForm from './ui/musicians/MusicianForm'
import MusicianList from './ui/musicians/MusicianList';
import MusicianDetails from './ui/musicians/MusicianDetails';
import MusicianEdit from './ui/musicians/MusicianEdit';

function App() {

  useEffect(()=> {
    const songPromise = getSongsFromApi()
    const musiciansPromise = getMusiciansFromApi()
    const connectionsPromise = getConnectionsFromApi()
    const dbInit = [songPromise, musiciansPromise, connectionsPromise]
    Promise.all(dbInit)
    .catch(err => {
      console.log({err})
      alert("there was a problem with connecting to database, plese check if it is working correctly, otherwise you wont be able to edit or add data")
    })
  }, [])

  const [site, setSite] = useState("Home")
  
  return (
    <Provider store={store}>
      <Router>
        <Topbar site={site}/>
        <div className="content">
          <Sidebar site={site} setSite={setSite}/>
          <Routes>
            <Route exact path='/' element={ <Main setSite={setSite}/> } />
            <Route exact path='/music' element={<SongList />} />
            <Route exact path='/music/:title' element={ <SongDetails setSite={setSite}/> } />
            <Route exact path='/music/:title/edit' element={ <SongEdit /> } />
            <Route exact path='/music/:title/asign/:id' element={ <SongAsignAuthors /> } />
            <Route exact path='/musicians' element={ <MusicianList /> } />
            <Route exact path='/musicians/:name' element={ <MusicianDetails setSite={setSite}/> } />
            <Route exact path='/musicians/:name/edit' element={ <MusicianEdit /> } />
            <Route exact path='/add' element={ <Add /> } />
            <Route exact path='/add/song' element={ <SongForm /> } />
            <Route exact path='/add/musician' element={ <MusicianForm /> } />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
