#include "Sheep.h"
#include "../../constants.h"

Sheep::Sheep(Position position, World *world) : Animal(position, world)
{
    setOrganismData(SHEEP_SPICES, SHEEP_POWER, SHEEP_INITIATIVE, SHEEP_LIVE_LENGTH, SHEEP_TURNS_TO_REPRODUCE);
    loadTexture(getSpecies());
}

Sheep::Sheep(int id, int power, int liveLength, int turnsToReproduce, int positionX, int positionY, list<int> ancestorsId, World *world) : Animal(id, power, liveLength, turnsToReproduce, positionX, positionY, ancestorsId, world)
{
    setOrganismData(SHEEP_SPICES, SHEEP_POWER, SHEEP_INITIATIVE, SHEEP_LIVE_LENGTH, SHEEP_TURNS_TO_REPRODUCE);
    loadTexture(getSpecies());
}

Sheep *Sheep::createChild()
{
    Sheep *child = new Sheep(*this);
    child->setOrganismData(SHEEP_SPICES, SHEEP_POWER, SHEEP_INITIATIVE, SHEEP_LIVE_LENGTH, SHEEP_TURNS_TO_REPRODUCE);
    child->setNewId();
    child->lineage = Lineage(lineage, lineageNode);
    child->lineageNode = createChildLineageNode(child->id);
    return child;
}