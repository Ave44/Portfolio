#pragma once
#include "../Organism.h"

class Plant : public Organism
{
public:
	Plant(Position position, World *world);
	Plant(int id, int power, int liveLength, int turnsToReproduce, int positionX, int positionY, list<int> ancestorsId, World *world);

	void loadTexture(string textureName);

	void nextTurn();
	virtual Plant *createChild() = 0;

	string toString();
};
