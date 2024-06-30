#pragma once
#include "Plant.h"
#include "../../constants.h"

using namespace std;

class Grass : public Plant
{
public:
    Grass(Position position, World *world);
    Grass(int id, int power, int liveLength, int turnsToReproduce, int positionX, int positionY, list<int> ancestorsId, World *world);

    Grass *createChild();
};