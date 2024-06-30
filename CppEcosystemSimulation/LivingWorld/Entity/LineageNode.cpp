#include "LineageNode.h"

map<int, LineageNode *> LineageNode::allLineageNodes;

LineageNode::LineageNode(int organismId, int birthTurn, int deathTurn)
{
    this->organismId = organismId;
    this->birthTurn = birthTurn;
    this->deathTurn = deathTurn;

    allLineageNodes[organismId] = this;
}

LineageNode *LineageNode::getNodeById(int id)
{
    return allLineageNodes[id];
}

void LineageNode::recordDeath(int turn) { this->deathTurn = turn; }

int LineageNode::getOrganismId() { return this->organismId; }
int LineageNode::getBirthTurn() { return this->birthTurn; }
int LineageNode::getDeathTurn() { return this->deathTurn; }

string LineageNode::toString()
{
    string deathTurnInfo = deathTurn == -1 ? "alive" : to_string(deathTurn);
    return "Ancestor{id: " + to_string(organismId) +
           ", birthTurn: " + to_string(birthTurn) +
           ", deathTurn: " + deathTurnInfo + "}";
}

vector<nlohmann::json> LineageNode::getSaveJson()
{
    vector<nlohmann::json> allLineageNodesData;

    map<int, LineageNode *>::iterator iter = allLineageNodes.begin();
    for (iter; iter != allLineageNodes.end(); ++iter)
    {
        LineageNode *value = iter->second;

        nlohmann::json nodeData;
        nodeData["organismId"] = value->getOrganismId();
        nodeData["birthTurn"] = value->getBirthTurn();
        nodeData["deathTurn"] = value->getDeathTurn();

        allLineageNodesData.push_back(nodeData);
    }

    return allLineageNodesData;
}

void LineageNode::deleteAllLineageNodes()
{
    map<int, LineageNode *>::iterator iter = allLineageNodes.begin();
    for (iter; iter != allLineageNodes.end(); ++iter)
    {
        LineageNode *value = iter->second;
        delete value;
    }
    allLineageNodes.clear();
}