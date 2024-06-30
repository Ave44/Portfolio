#pragma once
#include "Organism.h"
#include "../constants.h"

using namespace std;

class OrganismFactory
{
public:
    OrganismFactory() = delete;
    OrganismFactory(OrganismFactory &organismFactory) = delete;
    void operator=(OrganismFactory const &) = delete;

    static Organism *createOrganism(string species, Position position, World *world);
    static Organism *createOrganism(string species, int id, int power, int liveLength, int turnsToReproduce, int positionX, int positionY, list<int> ancestorsId, World *world);
};