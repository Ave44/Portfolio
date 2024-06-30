#pragma once
#include <SDL2/SDL.h>
#include <string>
#include "../Position.h"
#include "../TextureLoader.h"
#include "Lineage.h"
#include "LineageNode.h"
#include <iostream>
#include "../src/include/json.hpp"

class World;
class Organism
{
protected:
	string species;
	int power;
	int initiative;
	int liveLength;
	int turnsToReproduce;
	int defaultTurnsToReproduce;
	int id;
	Position position;
	SDL_Texture *texture;
	World *world;
	Lineage lineage;
	LineageNode *lineageNode;

	static int ID;

public:
	Organism(Position position, World *world, Lineage lineage = Lineage());
	Organism(int id, int power, int liveLength, int turnsToReproduce, int positionX, int positionY, list<int> ancestorsId, World *world);

	~Organism();

	string getSpecies();
	int getPower();
	int getInitiative();
	Position getPosition();
	int getId();
	static int getStaticId();
	Lineage &getLineage();

	void setSpecies(string spec);
	void setPower(int power);
	void setInitiative(int initiative);
	void setLiveLength(int liveLength);
	void setTurnsToReproduce(int turnsToReproduce);
	void setPosition(Position position);
	void setNewId();
	static void setStaticId(int id);

	SDL_Texture *getTexture();
	void setTexture(SDL_Texture *texture);
	virtual void loadTexture(string textureName) = 0;

	void setOrganismData(string species, int power, int initiative, int liveLength, int turnsToReproduce);

	string toString();
	nlohmann::json getSaveJson();

	virtual void nextTurn() = 0;
	void gainPower(int power = 1);
	void lowerAmountOfTurnsToReproduce(int turns = 1);
	void decreaseLiveLength(int turns = 1);
	virtual void getKilled(Organism *attacker);
	void die();
	virtual Organism *createChild() = 0;
	LineageNode *createChildLineageNode(int id);
};