#pragma once
#include "Plant.h"
#include "../../constants.h"

using namespace std;

class Toadstool : public Plant
{
public:
    Toadstool(Position position, World *world);
    Toadstool(int id, int power, int liveLength, int turnsToReproduce, int positionX, int positionY, list<int> ancestorsId, World *world);

    Toadstool *createChild();

    void getKilled(Organism *attacker);
};