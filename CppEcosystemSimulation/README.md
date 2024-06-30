# C++ ecosystem simulation 🐑

C++ ecosystem simulation is an application that allows user to set up simple ecosystem and watch as it changes through consecutive epochs!

## Table of Contents

1. [Starting](#Starting)
1. [Hotkeys](#Hotkeys)
1. [Interface](#Interface)

## Starting

After cloning repository find file `Simulation.exe` and simply double click it to run the program. If you would like to modify the simulation and use custom properties, then find file `constants.h` and change it according to your liking. To apply the changes it is necessary to recompile file `GameLoop.cpp` using task provided in `.vscode/tasks.json`.

## Hotkeys

**s** - save current simulation status

**l** - load saved simulation status

**p** - print in console all organisms ancestry lineages

## Interface

![Application](https://github.com/Ave44/Portfolio/blob/main/images/CppEcosystemSimulation/Application.png?raw=true)

Interface consists of two main parts - simulation statistics and simulation map. Additionally border around them is modular, hence is entirely drawn using only three base images _(border segment, border corner and segment-corner connector)_. This approach provides full flexibility in terms of the size of each interface component.

<sub><sup>_(all graphics are original and hand drawn)_</sup></sub>

### Statistics

- **Turn counter** - shows current simulation epoch
- **FPS counter** - shows applications current frame rate

### Simulation map

Size of the simulation map is determined in file `constants.h` and can be easily adjusted due to fact that application was created with responsiveness in mind. Values such as `WORLD_WIDTH`, `WORLD_HEIGHT` and `TILE_SIZE` are used to redefine corresponding aspects of the map.
