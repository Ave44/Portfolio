#pragma once
#include "Animal.h"
#include "../../constants.h"

using namespace std;

class Sheep : public Animal
{
public:
    Sheep(Position position, World *world);
    Sheep(int id, int power, int liveLength, int turnsToReproduce, int positionX, int positionY, list<int> ancestorsId, World *world);

    Sheep *createChild();
};