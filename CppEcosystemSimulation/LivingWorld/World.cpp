#include "World.h"
#include "Entity/Organism.h"
#include "Entity/OrganismFactory.h"
#include <fstream>
#include "src/include/json.hpp"

string World::getOrganismSpeciesFromPosition(int x, int y)
{
	Organism *organism = getOrganismFromPosition(x, y);
	if (organism)
	{
		return organism->getSpecies();
	}
	return "";
}

Organism *World::getOrganismFromPosition(int x, int y)
{
	for (Organism *org : organisms)
	{
		Position orgPos = org->getPosition();
		if (orgPos.getX() == x && orgPos.getY() == y)
			return org;
	}
	return nullptr;
}

bool World::isPositionOnWorld(int x, int y)
{
	return (x >= 0 && y >= 0 && x < getWorldWidth() && y < getWorldHeight());
}

bool World::isPositionFree(Position position)
{
	if (getOrganismFromPosition(position.getX(), position.getY()))
	{
		return false;
	}
	return true;
}

vector<Position> World::getVectorOfFreePositionsAround(Position position)
{
	int xCurr = position.getX();
	int yCurr = position.getY();
	vector<Position> availablePositions;

	for (int xOffset = -1; xOffset <= 1; ++xOffset)
	{
		for (int yOffset = -1; yOffset <= 1; ++yOffset)
		{
			Position possiblePos = Position(xCurr + xOffset, yCurr + yOffset);
			if ((xOffset != 0 || yOffset != 0) &&
				isPositionOnWorld(xCurr + xOffset, yCurr + yOffset) &&
				isPositionFree(possiblePos))
			{
				availablePositions.push_back(Position(xCurr + xOffset, yCurr + yOffset));
			}
		}
	}

	return availablePositions;
}

vector<tuple<Position, Organism *>> World::getVectorOfPositionsNotContainingSpecies(Position position, string species)
{
	int xCurr = position.getX();
	int yCurr = position.getY();
	vector<tuple<Position, Organism *>> availablePositions;

	for (int xOffset = -1; xOffset <= 1; ++xOffset)
	{
		for (int yOffset = -1; yOffset <= 1; ++yOffset)
		{
			int posX = xCurr + xOffset;
			int posY = yCurr + yOffset;
			if ((xOffset != 0 || yOffset != 0) &&
				isPositionOnWorld(posX, posY))
			{
				Organism *organism = getOrganismFromPosition(posX, posY);
				if (organism && organism->getSpecies() == species)
				{
					continue;
				}
				tuple<Position, Organism *> pair = make_tuple(Position(posX, posY), organism);
				availablePositions.push_back(pair);
			}
		}
	}

	return availablePositions;
}

Position World::getRandomFreePosition()
{
	int countdown = 1000;
	while (countdown > 0)
	{
		int randX = std::rand() % WORLD_WIDTH;
		int randY = std::rand() % WORLD_HEIGHT;
		Position pos = Position(randX, randY);
		if (isPositionFree(pos))
		{
			return pos;
		}
		countdown--;
	}
	throw std::runtime_error("Generation error - Couldn't find free space on map");
}

World::World(int worldWidth, int worldHeight, vector<tuple<const char *, int>> startOrganismsData)
{
	setWorldWidth(worldWidth);
	setWorldHeight(worldHeight);
	TextureLoader &textureLoader = TextureLoader::getInstance();
	this->tileTexture = textureLoader.getUiTexture("tile");

	spawnStartingOrganisms(startOrganismsData);
}

void World::spawnStartingOrganisms(vector<tuple<const char *, int>> startOrganismsData)
{
	for (tuple<string, int> pair : startOrganismsData)
	{
		spawnOrganisms(get<0>(pair), get<1>(pair));
	}
}

void World::spawnOrganisms(string species, int amount)
{
	for (int i = 0; i < amount; ++i)
	{
		Position pos = getRandomFreePosition();
		Organism *org = OrganismFactory::createOrganism(species, pos, this);
		addOrganism(org);
	}
}

int World::getWorldWidth()
{
	return this->worldWidth;
}

void World::setWorldWidth(int worldWidth)
{
	this->worldWidth = worldWidth;
}

int World::getWorldHeight()
{
	return this->worldHeight;
}

void World::setWorldHeight(int worldHeight)
{
	this->worldHeight = worldHeight;
}

std::list<Organism *> World::getOrganisms()
{
	return this->organisms;
}

int World::getTurn()
{
	return this->turn;
}

SDL_Texture *World::getTileTexture()
{
	return this->tileTexture;
}

void World::addOrganism(Organism *organism)
{
	int initiative = organism->getInitiative();
	list<Organism *>::iterator addIterator = organisms.begin();
	while (addIterator != organisms.end())
	{
		if ((*addIterator)->getInitiative() <= initiative)
		{
			break;
		}
		addIterator++;
	}
	organisms.insert(addIterator, organism);
}

void World::deleteOrganism(Organism *organism)
{
	// cout << "del org: " << organism << endl;
	int id = organism->getId();
	list<Organism *>::iterator delIterator = organisms.begin();
	while (delIterator != organisms.end())
	{
		if ((*delIterator)->getId() == id)
		{
			if (nextTurnIterator != organisms.end() && (*nextTurnIterator)->getId() == id)
			{
				nextTurnIterator++;
			}
			organisms.erase(delIterator);
			break;
		}
		delIterator++;
	}
}

void World::deleteAllOrganisms()
{
	while (!organisms.empty())
	{
		delete organisms.front();
		organisms.pop_front();
	}
}

void World::nextTurn()
{
	// cout << "\nturn: " << turn << endl;
	nextTurnIterator = organisms.begin();
	// cout << "size bef: " << organisms.size() << endl;
	while (nextTurnIterator != organisms.end())
	{
		Organism *organism = *nextTurnIterator;
		nextTurnIterator++;

		// cout << "iter* " << organism << endl;
		// cout << organism->toString() << endl;
		organism->nextTurn();
		// cout << "size aft: " << organisms.size() << endl;
	}
	turn++;
}

void World::saveWorld(string fileName)
{
	cout << "Saving into savefile: " << fileName << endl;

	ofstream file("savefiles/" + fileName + ".json");
	if (!file.is_open())
	{
		cout << "Couldn't open file" << endl;
		return;
	}

	nlohmann::json json;
	json["turn"] = turn;
	json["organismStaticId"] = Organism::getStaticId();
	json["lineageNodes"] = LineageNode::getSaveJson();

	vector<nlohmann::json> organismsData;
	for (Organism *organism : organisms)
	{
		nlohmann::json organismData = organism->getSaveJson();
		organismsData.push_back(organismData);
	}
	json["organisms"] = organismsData;

	file << std::setw(4) << json;

	cout << "Saving into savefile - Sukces" << endl;
}

void World::loadWorld(string fileName)
{
	cout << "Loading from savefile: " << fileName << endl;

	ifstream file("savefiles/" + fileName + ".json");
	if (!file.is_open())
	{
		cout << "Couldn't open file" << endl;
		return;
	}

	deleteAllOrganisms();
	LineageNode::deleteAllLineageNodes();

	stringstream buffer;
	buffer << file.rdbuf();
	auto json = nlohmann::json::parse(buffer.str());

	this->turn = json["turn"];
	Organism::setStaticId(json["organismStaticId"]);

	for (auto nodeData : json["lineageNodes"])
	{
		new LineageNode(nodeData["organismId"], nodeData["birthTurn"], nodeData["deathTurn"]);
	}

	for (auto organismData : json["organisms"])
	{
		string species = organismData["species"];
		int id = organismData["id"];
		int power = organismData["power"];
		int liveLength = organismData["liveLength"];
		int turnsToReproduce = organismData["turnsToReproduce"];
		int positionX = organismData["positionX"];
		int positionY = organismData["positionY"];
		list<int> ancestorsId = organismData["ancestorsId"];

		Organism *org = OrganismFactory::createOrganism(species, id, power, liveLength, turnsToReproduce, positionX, positionY, ancestorsId, this);
		addOrganism(org);
	}

	cout << "Loading from savefile - Sukces" << endl;
}

string World::toString()
{
	string result = "\nturn: " + to_string(getTurn()) + "\n";
	string spec;

	for (int wY = 0; wY < getWorldHeight(); ++wY)
	{
		for (int wX = 0; wX < getWorldWidth(); ++wX)
		{
			spec = getOrganismSpeciesFromPosition(wX, wY);
			if (spec != "")
				result += spec;
			else
				result += separator;
		};
		result += "\n";
	}
	return result;
}

void World::printAllLineages()
{
	cout << "All lineages:" << endl;
	for (Organism *organism : organisms)
	{
		cout << organism->getLineage().toString() << endl;
	}
}
