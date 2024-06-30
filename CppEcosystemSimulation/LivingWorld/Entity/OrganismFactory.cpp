#include "OrganismFactory.h"

#include "Plant/Grass.h"
#include "Plant/Dandelion.h"
#include "Plant/Toadstool.h"
#include "Animal/Sheep.h"
#include "Animal/Wolf.h"

Organism *OrganismFactory::createOrganism(string species, Position position, World *world)
{
    if (species == SHEEP_SPICES)
    {
        return new Sheep(position, world);
    }
    if (species == WOLF_SPICES)
    {
        return new Wolf(position, world);
    }
    if (species == GRASS_SPICES)
    {
        return new Grass(position, world);
    }
    if (species == DANDELION_SPICES)
    {
        return new Dandelion(position, world);
    }
    if (species == TOADSTOOL_SPICES)
    {
        return new Toadstool(position, world);
    }
    throw std::runtime_error("Couldn't create organism, spices: " + species);
}

Organism *OrganismFactory::createOrganism(string species, int id, int power, int liveLength, int turnsToReproduce, int positionX, int positionY, list<int> ancestorsId, World *world)
{
    if (species == SHEEP_SPICES)
    {
        return new Sheep(id, power, liveLength, turnsToReproduce, positionX, positionY, ancestorsId, world);
    }
    if (species == WOLF_SPICES)
    {
        return new Wolf(id, power, liveLength, turnsToReproduce, positionX, positionY, ancestorsId, world);
    }
    if (species == GRASS_SPICES)
    {
        return new Grass(id, power, liveLength, turnsToReproduce, positionX, positionY, ancestorsId, world);
    }
    if (species == DANDELION_SPICES)
    {
        return new Dandelion(id, power, liveLength, turnsToReproduce, positionX, positionY, ancestorsId, world);
    }
    if (species == TOADSTOOL_SPICES)
    {
        return new Toadstool(id, power, liveLength, turnsToReproduce, positionX, positionY, ancestorsId, world);
    }
    throw std::runtime_error("Couldn't create organism, spices: " + species);
}