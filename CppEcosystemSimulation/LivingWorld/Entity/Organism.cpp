#include "Organism.h"
#include "../Position.h"
#include "../../World.h"

int Organism::ID = 0;

Organism::Organism(Position position, World *world, Lineage lineage)
{
	// std::cout << "organism constructor" << std::endl;
	setPosition(position);
	this->world = world;
	setNewId();
	this->lineageNode = new LineageNode(this->getId(), world->getTurn(), -1);
	this->lineage = lineage;
}

Organism::Organism(int id, int power, int liveLength, int turnsToReproduce, int positionX, int positionY, list<int> ancestorsId, World *world)
{
	this->id = id;
	this->power = power;
	this->liveLength = liveLength;
	this->turnsToReproduce = turnsToReproduce;
	this->position = Position(positionX, positionY);

	Lineage reconstructedLineage = Lineage(ancestorsId);
	this->lineage = reconstructedLineage;
	this->lineageNode = LineageNode::getNodeById(id);
	this->world = world;
}

Organism::~Organism()
{
	// cout << "dec called " << this->id << endl;
}

int Organism::getPower() { return this->power; }

Lineage &Organism::getLineage() { return this->lineage; }

int Organism::getInitiative() { return this->initiative; }

void Organism::setPower(int power) { this->power = power; }

void Organism::gainPower(int power) { setPower(this->power + power); }

void Organism::lowerAmountOfTurnsToReproduce(int turns)
{
	int newAmountOfTurns = this->turnsToReproduce - turns;
	if (newAmountOfTurns <= 0)
	{
		std::vector<Position> freePos = this->world->getVectorOfFreePositionsAround(this->position);
		if (!freePos.empty())
		{
			Organism *child = this->createChild();
			Position randPos = freePos[std::rand() % freePos.size()];
			child->setPosition(randPos);
			this->world->addOrganism(child);
			setTurnsToReproduce(this->defaultTurnsToReproduce);
			// cout << this->toString() << " reproduced " << child->toString() << endl;
		}
	}
	else
	{
		setTurnsToReproduce(newAmountOfTurns);
	}
}

void Organism::decreaseLiveLength(int turns)
{
	int newLiveLength = liveLength - turns;
	if (newLiveLength <= 0)
	{
		this->die();
	}
	else
	{
		setLiveLength(newLiveLength);
	}
}

void Organism::getKilled(Organism *attacker)
{
	this->die();
}

void Organism::die()
{
	this->world->deleteOrganism(this);
	this->lineageNode->recordDeath(world->getTurn());
	this->~Organism();
}

Position Organism::getPosition() { return this->position; }

void Organism::setPosition(Position position)
{
	this->position = position;
	// this->position.setX(position.getX());
	// this->position.setY(position.getY());
}

LineageNode *Organism::createChildLineageNode(int id)
{
	return new LineageNode(id, world->getTurn(), -1);
}

string Organism::toString()
{
	return "Organism{ id: " + to_string(getId()) +
		   ", species: " + getSpecies() +
		   ", power: " + to_string(getPower()) +
		   ", initiative: " + to_string(initiative) +
		   ", liveLength: " + to_string(liveLength) +
		   ", turnsToReproduce: " + to_string(turnsToReproduce) +
		   ", position: " + getPosition().toString() + "}";
}

nlohmann::json Organism::getSaveJson()
{
	nlohmann::json organismData;

	organismData["species"] = species;
	organismData["power"] = power;
	organismData["liveLength"] = liveLength;
	organismData["turnsToReproduce"] = turnsToReproduce;
	organismData["id"] = id;
	organismData["positionX"] = position.getX();
	organismData["positionY"] = position.getY();
	organismData["ancestorsId"] = lineage.getSaveJson();

	return organismData;
}

string Organism::getSpecies() { return this->species; }

void Organism::setSpecies(string species) { this->species = species; }

SDL_Texture *Organism::getTexture() { return this->texture; }

void Organism::setTexture(SDL_Texture *texture) { this->texture = texture; }

int Organism::getId() { return this->id; }

int Organism::getStaticId() { return ID; }

void Organism::setNewId() { this->id = id = ++ID; }

void Organism::setStaticId(int id) { ID = id; }

void Organism::setInitiative(int initiative) { this->initiative = initiative; }

void Organism::setLiveLength(int liveLength) { this->liveLength = liveLength; }

void Organism::setTurnsToReproduce(int turnsToReproduce) { this->turnsToReproduce = turnsToReproduce; }

void Organism::setOrganismData(string species, int power, int initiative, int liveLength, int turnsToReproduce)
{
	setSpecies(species);
	setPower(power);
	setInitiative(initiative);
	setLiveLength(liveLength);
	setTurnsToReproduce(turnsToReproduce);
	this->defaultTurnsToReproduce = turnsToReproduce;
}