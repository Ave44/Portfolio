#pragma once
#include <string>
#include <map>
#include "../src/include/json.hpp"

using namespace std;

class LineageNode
{
private:
    int organismId;
    int birthTurn;
    int deathTurn;

    static map<int, LineageNode *> allLineageNodes;

public:
    LineageNode(int organismId, int birthTurn, int deathTurn);

    static LineageNode *getNodeById(int id);

    void recordDeath(int turn);

    int getOrganismId();
    int getBirthTurn();
    int getDeathTurn();

    string toString();
    static vector<nlohmann::json> getSaveJson();
    static void deleteAllLineageNodes();
};