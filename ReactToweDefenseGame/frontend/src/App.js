import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Game from './game/GameDataLodaer';
import Main from './ui/Main';
import Topbar from './ui/Topbar';
import Enemies from './ui/enemies/Enemies';
import AddEnemy from './ui/enemies/AddEnemy';
import EditEnemy from './ui/enemies/EditEnemy';
import Towers from './ui/towers/Towers';
import AddTower from './ui/towers/AddTower';
import EditTower from './ui/towers/EditTower';
import Upgrades from './ui/towers/Upgrades';
import UpgradesAdd from './ui/towers/UpgradesAdd';
import UpgradeEdit from './ui/towers/UpgradeEdit';
import Levels from './ui/levels/Levels';
import AddLevel from './ui/levels/AddLevel';
import EditLevel from './ui/levels/EditLevel';
import Cookies from 'js-cookie';
import Chat from './ui/Chat';
import { v4 as uuid } from 'uuid';
import mqtt from 'mqtt/dist/mqtt';

function App() {
  const [allEnemies, setAllEnemies] = useState({})
  const [allTowers, setAllTowers] = useState({})
  const [levels, setLevels] = useState({})
  const [upgrades, setUpgrades] = useState({})
  const [allTowersWithUpgrades, setAllTowersWithUpgrades] = useState({})

  const [id, setId] = useState(uuid().substring(0,4))
  const [client, setClient] = useState(null)

  useEffect(()=>{
    axios.get('http://localhost:5000/enemies')
    .then(res => {
      const result = res.data.reduce((pre,cur)=>{return {...pre, [cur.label]: cur}}, {})
      setAllEnemies(result)
    })
    .catch(err => {
        window.alert("Threre was a problem with connecting to database (enemies)")
        console.log(err)
    })

    axios.get('http://localhost:5000/towers')
    .then(res => {
      const result = res.data.reduce((pre,cur)=>{return {...pre, [cur.label]: cur}}, {})
      setAllTowers(result)
    })
    .catch(err => {
        window.alert("Threre was a problem with connecting to database (towers)")
        console.log(err)
    })

    axios.get('http://localhost:5000/upgrades')
    .then(res => {
      const result = res.data.reduce((pre,cur)=>{
        if(pre[cur.label1]) {
          return {...pre, [cur.label1]: [...pre[cur.label1], {label: cur.label2, name: cur.name, cost: cur.cost, id: cur.id}] }
        }
        return {...pre, [cur.label1]: [ {label: cur.label2, name: cur.name, cost: cur.cost, id: cur.id}] }
        }, {})
      setUpgrades(result)
    })
    .catch(err => {
        window.alert("Threre was a problem with connecting to database (upgrades)")
        console.log(err)
    })
    
    axios.get('http://localhost:5000/levels')
    .then(res => {
      const result = res.data.reduce((pre,cur)=>{
        const startingtowers = cur.startingtowers.split(' ')
        const waves = cur.waves.split('.').map(e=>e.split(',')).map(e=>e.map(a=>a.split(" ")))
        const path = cur.path.split(' ').map(e=>parseInt(e))
        return {...pre, [cur.id]: {...cur, startingtowers, waves, path}}}, {})
      setLevels(result)
    })
    .catch(err => {
        window.alert("Threre was a problem with connecting to database (levels)")
        console.log(err)
    })
  },[])

  useEffect(()=>{
    const result = {}
    for (const [key, value] of Object.entries(allTowers)) {
      result[key] = {...value, upgrades: upgrades[key]}
    }
    setAllTowersWithUpgrades(result)
  },[allTowers, upgrades])

  useEffect(()=>{
    const today = new Date();
    const tomorrow = new Date(new Date(today.getTime() + (24 * 60 * 60 * 1000)).setHours(0,0,0,0))

    const timer = setInterval(() => {
      const time = parseInt(Cookies.get('time'))
      if(time) { Cookies.set('time', time+1, { expires: tomorrow }) }
      else { Cookies.set('time', 1, { expires: tomorrow }) }
    }, 60000)
    return () => clearInterval(timer)
  })

  useEffect(()=>{
    setClient(mqtt.connect({path: '/mqtt', port: 8000, hostname: 'localhost'})) 
  },[])

  useEffect(()=> {
    if(client) {
      client.on('connect', function () {
        client.subscribe('chat', function (err) {
          if (!err) {
            client.publish('chat', `user ${id} have joined chat`)
          }
        })
      })
        
      client.on('message', function (topic, message) {
        // console.log('-mqtt-', message.toString())
        if(topic==='chat') {
          appendChat(message.toString())
        }
      })

      client.on('close', function (topic, message) {
        client.publish('chat', `user ${id} have left chat`)
        client.end()
      })
    }
  },[client])

  const appendChat = (text) => {
    try {
      const ul = document.getElementById("list");
      const li = document.createElement("li");
      li.appendChild(document.createTextNode(text));
      ul.appendChild(li);
    } catch { }
  }

  return (
    <Router>
      <Topbar />
      <Switch>
        <Route exact path='/'>
          <Main id={id}/>
          <Chat id={id} setId={setId} client={client} setClient={setClient}/>
        </Route>
        <Route exact path='/enemies'>
          <Enemies enemies={allEnemies}/>
        </Route>
        <Route exact path='/enemies/add'>
          <AddEnemy allEnemies={allEnemies} setAllEnemies={setAllEnemies}/>
        </Route>
        <Route exact path='/enemies/edit/:label'>
          <EditEnemy allEnemies={allEnemies} setAllEnemies={setAllEnemies}/>
        </Route>
        <Route exact path='/towers'>
          <Towers towers={allTowers}/>
        </Route>
        <Route exact path='/towers/add'>
          <AddTower allTowers={allTowers} setAllTowers={setAllTowers}/>
        </Route>
        <Route exact path='/towers/edit/:label'>
          <EditTower allTowers={allTowers} setAllTowers={setAllTowers}/>
        </Route>
        <Route exact path='/towers/upgrades/:label'>
          <Upgrades towers={allTowersWithUpgrades} upgrades={upgrades} setUpgrades={setUpgrades}/>
        </Route>
        <Route exact path='/towers/upgrades/:label/add'>
          <UpgradesAdd upgrades={upgrades} setUpgrades={setUpgrades}/>
        </Route>
        <Route exact path='/towers/upgrades/:label/edit/:id'>
          <UpgradeEdit upgrades={upgrades} setUpgrades={setUpgrades}/>
        </Route>
        <Route exact path='/levels'>
          <Levels levels={levels}/>
        </Route>
        <Route exact path='/levels/add'>
          <AddLevel levels={levels} setLevels={setLevels}/>
        </Route>
        <Route exact path='/levels/edit/:id'>
          <EditLevel levels={levels} setLevels={setLevels}/>
        </Route>
        <Route exact path='/level/:id'>
          <Game towers={allTowersWithUpgrades} enemies={allEnemies} levels={levels}/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
