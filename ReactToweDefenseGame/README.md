# React tower defense game 🎮

React tower defense game is an application where you can playing awesome tower defense game! Additionally you can edit the game, create new levels or chat with other users.

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

- App has a global chat that utilizes the mqtt protocol
- App uses cookies to store useful data
- App styles are written entirely in scss, and every view is responsive with plenty of various cool hover effects
- All textures are original and hand drawn

<h2 id="Dependencies-Frontend">Dependencies</h2>

- react _^17.0.2_
- react-dom _^17.0.2_
- react-router-dom _^5.2.0_
- react-scripts _5.0.0_
- axios _^0.25.0_
- uuid _^8.3.2_
- js-cookie _^3.0.1_
- mqtt _^4.2.1_
- "web-vitals _^2.1.3_
- @testing-library/jest-dom _^5.16.1_
- @testing-library/react _^12.1.2_
- @testing-library/user-event _^13.5.0_

<h2 id="Setup-Frontend">Setup</h2>

1. After cloning repository run `npm i` in _frontend_ directory
2. Make sure that your backend is working correctly ([see there](#Setup-Backend))
3. Download and setup your mqtt broker (see [HiveMQ](https://www.hivemq.com/) for example) so it is working on port _8000_ (skipping this step will make you unable to chat, but game and all its functionalities will still be working correctly)
4. Run `npm start`

## Views

### Game

main game view, player can see there his/hers health points, gold, number of current wave, and most importantly can play by placing towers on selected tiles to fight off hordes of enemies! Towers can be upgraded into stronger versions, or sold if player changes mind. Additionally player can see towers range by hovering over them. Game is won if player manages to survive all waves without loosing all health points.

![Game1](https://github.com/Ave44/Portfolio/blob/main/images/ReactTowerDefenseGame/Game1.png?raw=true)
![Game2](https://github.com/Ave44/Portfolio/blob/main/images/ReactTowerDefenseGame/Game2.png?raw=true)
![Game3](https://github.com/Ave44/Portfolio/blob/main/images/ReactTowerDefenseGame/Game3.png?raw=true)

### Main

main site where user can save his/hers score and chat with others.

![Main](https://github.com/Ave44/Portfolio/blob/main/images/ReactTowerDefenseGame/Main.png?raw=true)

### Enemies

gallery of all enemies

![Enemies](https://github.com/Ave44/Portfolio/blob/main/images/ReactTowerDefenseGame/Enemies.png?raw=true)

### Add enemy

form for adding new enemy

![EnemyAdd](https://github.com/Ave44/Portfolio/blob/main/images/ReactTowerDefenseGame/EnemyAdd.png?raw=true)

### Edit enemy

form for editing selected enemy

![EnemyEdit](https://github.com/Ave44/Portfolio/blob/main/images/ReactTowerDefenseGame/EnemyEdit.png?raw=true)

### Towers

gallery of all towers

![Towers](https://github.com/Ave44/Portfolio/blob/main/images/ReactTowerDefenseGame/Towers.png?raw=true)

### Add tower

form for adding new tower

![TowerAdd](https://github.com/Ave44/Portfolio/blob/main/images/ReactTowerDefenseGame/TowerAdd.png?raw=true)

### Edit tower

form for editing selected tower

![TowerEdit](https://github.com/Ave44/Portfolio/blob/main/images/ReactTowerDefenseGame/TowerEdit.png?raw=true)

### Tower upgrades

gallery of tower upgrades

![TowerUpgrades](https://github.com/Ave44/Portfolio/blob/main/images/ReactTowerDefenseGame/TowerUpgrades.png?raw=true)

### Add tower upgrade

form for adding new upgrade for a tower

![TowerUpgradeAdd](https://github.com/Ave44/Portfolio/blob/main/images/ReactTowerDefenseGame/TowerUpgradeAdd.png?raw=true)

### Edit tower upgrade

form for editing upgrade of a tower

![TowerUpgradeEdit](https://github.com/Ave44/Portfolio/blob/main/images/ReactTowerDefenseGame/TowerUpgradeEdit.png?raw=true)

### Levels

gallery of all levels

![Levels](https://github.com/Ave44/Portfolio/blob/main/images/ReactTowerDefenseGame/Levels.png?raw=true)

### Add level

form for adding new level

![LevelAdd](https://github.com/Ave44/Portfolio/blob/main/images/ReactTowerDefenseGame/LevelAdd.png?raw=true)

### Edit level

form for editing selected level

![LevelEdit](https://github.com/Ave44/Portfolio/blob/main/images/ReactTowerDefenseGame/LevelEdit.png?raw=true)

# Backend

App backend allows database communication and saving user logs to _.txt_ file.

<h2 id="Dependencies-Backend">Dependencies</h2>

- cors _^2.8.5_
- express _^4.17.2_
- fs _^0.0.1-security_
- pg _^8.7.1_
- dotenv _^16.0.3_

<h2 id="Setup-Backend">Setup</h2>

1. After cloning repository run `npm i` in _backend_ directory
2. Setup postgreSQL database on your local machine or in Docker container with `docker run --name React_Tower_Defense_Game_DB -p 5432:5432 -e POSTGRES_PASSWORD=projekt -e POSTGRES_USER=postgres -d postgres`
3. Optionally create _.env_ file to change default data

```
HOST = '127.0.0.1'
PORT = 5432
DATABASE = 'postgres'
USER = 'postgres'
PASSWORD = 'projekt'
```

4. Run `node setUpInitData.js` to populate your newly created databases
5. Run `node index.js`

## Tables

### **enemies**

| column name     | data type      | null? |
| --------------- | -------------- | ----- |
| id              | SERIAL         | ❌    |
| label           | VARCHAR UNIQUE | ❌    |
| name            | VARCHAR        | ❌    |
| hp              | INT            | ❌    |
| maxHp           | INT            | ❌    |
| speed           | FLOAT          | ❌    |
| loss            | INT            | ❌    |
| armor           | FLOAT          | ❌    |
| magicResistance | FLOAT          | ❌    |
| gold            | INT            | ❌    |
| img             | VARCHAR        | ❌    |

### **towers**

| column name | data type      | null? |
| ----------- | -------------- | ----- |
| id          | SERIAL         | ❌    |
| label       | VARCHAR UNIQUE | ❌    |
| name        | VARCHAR        | ❌    |
| img         | VARCHAR        | ❌    |
| type        | VARCHAR        | ❌    |
| minDamage   | INT            | ❌    |
| maxDamage   | INT            | ❌    |
| speed       | INT            | ❌    |
| range       | INT            | ❌    |
| cost        | INT            | ❌    |

### **upgrades**

| column name | data type | null? |
| ----------- | --------- | ----- |
| id          | SERIAL    | ❌    |
| label1      | VARCHAR   | ❌    |
| label2      | VARCHAR   | ❌    |
| name        | VARCHAR   | ❌    |
| cost        | INT       | ❌    |

### **levels**

| column name    | data type | null? |
| -------------- | --------- | ----- |
| id             | SERIAL    | ❌    |
| name           | VARCHAR   | ❌    |
| width          | INT       | ❌    |
| height         | INT       | ❌    |
| path           | VARCHAR   | ❌    |
| waves          | VARCHAR   | ❌    |
| gold           | INT       | ❌    |
| startingtowers | VARCHAR   | ❌    |

## Routes

- Towers
  - GET &ensp; `/towers` - get all towers from database
  - POST `/towers` - create new tower
  - POST `/towers/edit/:id` - edit existing tower
  - DEL &ensp; `/towers/:label` - delete tower
- Upgrades
  - GET &ensp; `/upgrades` - get all upgrades from database
  - POST `/upgrades` - create new upgrade
  - POST `/upgrades/edit/:id` - edit existing upgrade
  - DEL &ensp; `/upgrades/:id` - delete upgrade
- Enemies
  - GET &ensp; `/enemies` - get all enemies from database
  - POST `/enemies` - create new enemy
  - POST `/enemies/edit/:id` - edit existing enemy
  - DEL &ensp; `/enemies/:label` - delete enemy
- Levels
  - GET &ensp; `/levels` - get all levels from database
  - POST `/levels` - create new level
  - POST `/levels/edit/:id` - edit existing level
  - DEL &ensp; `/levels/:id` - delete level
- Logs
  - POST `/logs` - save logs to _.txt_ file
