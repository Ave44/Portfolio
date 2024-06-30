#pragma once
#include "Animal.h"
#include "../../constants.h"

using namespace std;

class Wolf : public Animal
{
public:
    Wolf(Position position, World *world);
    Wolf(int id, int power, int liveLength, int turnsToReproduce, int positionX, int positionY, list<int> ancestorsId, World *world);

    Wolf *createChild();
};