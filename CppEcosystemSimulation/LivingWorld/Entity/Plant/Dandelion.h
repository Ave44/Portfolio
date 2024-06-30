#pragma once
#include "Plant.h"
#include "../../constants.h"

using namespace std;

class Dandelion : public Plant
{
public:
    Dandelion(Position position, World *world);
    Dandelion(int id, int power, int liveLength, int turnsToReproduce, int positionX, int positionY, list<int> ancestorsId, World *world);

    Dandelion *createChild();
};