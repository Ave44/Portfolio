#include "Plant.h"
#include "../../World.h"

Plant::Plant(Position position, World *world) : Organism(position, world)
{
}

Plant::Plant(int id, int power, int liveLength, int turnsToReproduce, int positionX, int positionY, list<int> ancestorsId, World *world) : Organism(id, power, liveLength, turnsToReproduce, positionX, positionY, ancestorsId, world)
{
}

void Plant::loadTexture(string textureName)
{
    TextureLoader &textureLoader = TextureLoader::getInstance();
    setTexture(textureLoader.getPlantTexture(textureName));
}

void Plant::nextTurn()
{
    this->lowerAmountOfTurnsToReproduce();
    this->decreaseLiveLength();
}

string Plant::toString()
{
    return "Plant{ species: " + getSpecies() +
           ", power: " + to_string(getPower()) +
           ", position: " + getPosition().toString() + "}";
}