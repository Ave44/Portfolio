#include "Wolf.h"
#include "../../constants.h"

Wolf::Wolf(Position position, World *world) : Animal(position, world)
{
    setOrganismData(WOLF_SPICES, WOLF_POWER, WOLF_INITIATIVE, WOLF_LIVE_LENGTH, WOLF_TURNS_TO_REPRODUCE);
    loadTexture(getSpecies());
}

Wolf::Wolf(int id, int power, int liveLength, int turnsToReproduce, int positionX, int positionY, list<int> ancestorsId, World *world) : Animal(id, power, liveLength, turnsToReproduce, positionX, positionY, ancestorsId, world)
{
    setOrganismData(WOLF_SPICES, WOLF_POWER, WOLF_INITIATIVE, WOLF_LIVE_LENGTH, WOLF_TURNS_TO_REPRODUCE);
    loadTexture(getSpecies());
}

Wolf *Wolf::createChild()
{
    Wolf *child = new Wolf(*this);
    child->setOrganismData(WOLF_SPICES, WOLF_POWER, WOLF_INITIATIVE, WOLF_LIVE_LENGTH, WOLF_TURNS_TO_REPRODUCE);
    child->setNewId();
    child->lineage = Lineage(lineage, lineageNode);
    child->lineageNode = createChildLineageNode(child->id);
    return child;
}