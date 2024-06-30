#include "Grass.h"
#include "../../constants.h"

Grass::Grass(Position position, World *world) : Plant(position, world)
{
    setOrganismData(GRASS_SPICES, GRASS_POWER, GRASS_INITIATIVE, GRASS_LIVE_LENGTH, GRASS_TURNS_TO_REPRODUCE);
    loadTexture(getSpecies());
}

Grass::Grass(int id, int power, int liveLength, int turnsToReproduce, int positionX, int positionY, list<int> ancestorsId, World *world) : Plant(id, power, liveLength, turnsToReproduce, positionX, positionY, ancestorsId, world)
{
    setOrganismData(GRASS_SPICES, GRASS_POWER, GRASS_INITIATIVE, GRASS_LIVE_LENGTH, GRASS_TURNS_TO_REPRODUCE);
    loadTexture(getSpecies());
}

Grass *Grass::createChild()
{
    Grass *child = new Grass(*this);
    child->setOrganismData(GRASS_SPICES, GRASS_POWER, GRASS_INITIATIVE, GRASS_LIVE_LENGTH, GRASS_TURNS_TO_REPRODUCE);
    child->setNewId();
    child->lineage = Lineage(lineage, lineageNode);
    child->lineageNode = createChildLineageNode(child->id);
    return child;
}