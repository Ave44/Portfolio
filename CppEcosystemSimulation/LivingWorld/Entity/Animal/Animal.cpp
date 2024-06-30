#include "Animal.h"
#include "../../World.h"

Animal::Animal(Position position, World *world) : Organism(position, world)
{
}

Animal::Animal(int id, int power, int liveLength, int turnsToReproduce, int positionX, int positionY, list<int> ancestorsId, World *world) : Organism(id, power, liveLength, turnsToReproduce, positionX, positionY, ancestorsId, world)
{
}

void Animal::loadTexture(string textureName)
{
	TextureLoader &textureLoader = TextureLoader::getInstance();
	setTexture(textureLoader.getAnimalTexture(textureName));
}

void Animal::move()
{
	std::vector<tuple<Position, Organism *>> possibleMoves = this->world->getVectorOfPositionsNotContainingSpecies(position, species);
	int amountOfPossibleMoves = possibleMoves.size();
	if (amountOfPossibleMoves > 0)
	{
		int randomIndex = rand() % amountOfPossibleMoves;
		Position newPosition = get<0>(possibleMoves[randomIndex]);
		Organism *organism = get<1>(possibleMoves[randomIndex]);
		if (organism)
		{
			competeWithOrganism(organism);
		}
		else
		{
			this->setPosition(newPosition);
		}
	}
}

void Animal::competeWithOrganism(Organism *organism)
{
	if (organism->getPower() > this->getPower())
	{
		this->getKilled(organism);
	}
	else
	{
		this->setPosition(organism->getPosition());
		organism->getKilled(this);
	}
}

void Animal::getKilled(Organism *attacker)
{
	this->survivedMove = false;
	Organism::getKilled(attacker);
}

void Animal::nextTurn()
{
	this->move();
	if (this->survivedMove)
	{
		this->gainPower();
		this->lowerAmountOfTurnsToReproduce();
		this->decreaseLiveLength();
	}
}

string Animal::toString()
{
	return "Animal{ species: " + getSpecies() +
		   ", power: " + to_string(getPower()) +
		   ", position: " + getPosition().toString() + "}";
}