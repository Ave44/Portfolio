#pragma once
#include "LineageNode.h"
#include <list>
#include <string>

using namespace std;

class Lineage
{
private:
    list<LineageNode *> ancestors;

public:
    Lineage();
    Lineage(list<int> ancestorsId);
    Lineage(Lineage &Lineage, LineageNode *node);

    string toString();
    list<int> getSaveJson();
};