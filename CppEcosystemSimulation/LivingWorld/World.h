#pragma once

#include <list>
#include <vector>
#include <ctime>
#include "Entity/Organism.h"
#include "constants.h"

class World
{
private:
	int worldWidth;
	int worldHeight;
	int turn = 0;
	std::list<Organism *>::iterator nextTurnIterator;
	std::list<Organism *> organisms;
	char separator = '.';
	SDL_Texture *tileTexture;

	Organism *getOrganismFromPosition(int x, int y);
	string getOrganismSpeciesFromPosition(int x, int y);
	bool isPositionOnWorld(int x, int y);
	bool isPositionFree(Position position);
	Position getRandomFreePosition();

public:
	World(int worldWidth, int worldHeight, vector<tuple<const char *, int>> startOrganismsData);
	// World() : World(WORLD_WIDTH, WORLD_HEIGHT, DEFAULT_START_ORGANISMS){};

	int getWorldWidth();
	void setWorldWidth(int worldWidth);
	int getWorldHeight();
	void setWorldHeight(int worldHeight);
	std::list<Organism *> getOrganisms();
	int getTurn();

	void spawnStartingOrganisms(vector<tuple<const char *, int>> startOrganismsData);
	void spawnOrganisms(string species, int amount);
	void addOrganism(Organism *organism);
	void deleteOrganism(Organism *organism);
	void deleteAllOrganisms();
	std::vector<Position> getVectorOfFreePositionsAround(Position position);
	std::vector<tuple<Position, Organism *>> getVectorOfPositionsNotContainingSpecies(Position position, string species);
	void nextTurn();

	void saveWorld(string fileName = "save1");
	void loadWorld(string fileName = "save1");

	SDL_Texture *getTileTexture();

	string toString();
	void printAllLineages();
};
