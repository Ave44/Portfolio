#pragma once
#include "../Organism.h"

class Animal : public Organism
{
private:
	bool survivedMove = true;

public:
	Animal(Position position, World *world);
	Animal(int id, int power, int liveLength, int turnsToReproduce, int positionX, int positionY, list<int> ancestorsId, World *world);

	void loadTexture(string textureName);

	void nextTurn();
	void move();
	virtual Animal *createChild() = 0;
	void competeWithOrganism(Organism *organism);
	void getKilled(Organism *attacker);

	string toString();
};
