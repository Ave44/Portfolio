#include "Toadstool.h"
#include "../../constants.h"

Toadstool::Toadstool(Position position, World *world) : Plant(position, world)
{
    setOrganismData(TOADSTOOL_SPICES, TOADSTOOL_POWER, TOADSTOOL_INITIATIVE, TOADSTOOL_LIVE_LENGTH, TOADSTOOL_TURNS_TO_REPRODUCE);
    loadTexture(getSpecies());
}

Toadstool::Toadstool(int id, int power, int liveLength, int turnsToReproduce, int positionX, int positionY, list<int> ancestorsId, World *world) : Plant(id, power, liveLength, turnsToReproduce, positionX, positionY, ancestorsId, world)
{
    setOrganismData(TOADSTOOL_SPICES, TOADSTOOL_POWER, TOADSTOOL_INITIATIVE, TOADSTOOL_LIVE_LENGTH, TOADSTOOL_TURNS_TO_REPRODUCE);
    loadTexture(getSpecies());
}

Toadstool *Toadstool::createChild()
{
    Toadstool *child = new Toadstool(*this);
    child->setOrganismData(TOADSTOOL_SPICES, TOADSTOOL_POWER, TOADSTOOL_INITIATIVE, TOADSTOOL_LIVE_LENGTH, TOADSTOOL_TURNS_TO_REPRODUCE);
    child->setNewId();
    child->lineage = Lineage(lineage, lineageNode);
    child->lineageNode = createChildLineageNode(child->id);
    return child;
}

void Toadstool::getKilled(Organism *attacker)
{
    attacker->getKilled(this);
    this->die();
}