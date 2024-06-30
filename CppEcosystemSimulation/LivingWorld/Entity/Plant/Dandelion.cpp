#include "Dandelion.h"
#include "../../constants.h"

Dandelion::Dandelion(Position position, World *world) : Plant(position, world)
{
    setOrganismData(DANDELION_SPICES, DANDELION_POWER, DANDELION_INITIATIVE, DANDELION_LIVE_LENGTH, DANDELION_TURNS_TO_REPRODUCE);
    loadTexture(getSpecies());
}

Dandelion::Dandelion(int id, int power, int liveLength, int turnsToReproduce, int positionX, int positionY, list<int> ancestorsId, World *world) : Plant(id, power, liveLength, turnsToReproduce, positionX, positionY, ancestorsId, world)
{
    setOrganismData(DANDELION_SPICES, DANDELION_POWER, DANDELION_INITIATIVE, DANDELION_LIVE_LENGTH, DANDELION_TURNS_TO_REPRODUCE);
    loadTexture(getSpecies());
}

Dandelion *Dandelion::createChild()
{
    Dandelion *child = new Dandelion(*this);
    child->setOrganismData(DANDELION_SPICES, DANDELION_POWER, DANDELION_INITIATIVE, DANDELION_LIVE_LENGTH, DANDELION_TURNS_TO_REPRODUCE);
    child->setNewId();
    child->lineage = Lineage(lineage, lineageNode);
    child->lineageNode = createChildLineageNode(child->id);
    return child;
}