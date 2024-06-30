#include "Lineage.h"

Lineage::Lineage() {}

Lineage::Lineage(list<int> ancestorsId)
{
    for (int id : ancestorsId)
    {
        LineageNode *node = LineageNode::getNodeById(id);
        ancestors.push_back(node);
    }
}

Lineage::Lineage(Lineage &Lineage, LineageNode *node)
{
    list<LineageNode *> ancestorsCopy(Lineage.ancestors);
    ancestorsCopy.push_back(node);

    this->ancestors = ancestorsCopy;
}

string Lineage::toString()
{
    string str = "Lineage{";

    list<LineageNode *>::iterator ancestorsIterator = ancestors.begin();
    while (ancestorsIterator != ancestors.end())
    {
        str += (*ancestorsIterator)->toString();
        str += ", ";
        ancestorsIterator++;
        if (ancestorsIterator == ancestors.end())
        {
            str.erase(str.length() - 2);
        }
    }
    str += "}";
    return str;
}

list<int> Lineage::getSaveJson()
{
    list<int> ancestorsId;

    for (LineageNode *node : ancestors)
    {
        ancestorsId.push_back(node->getOrganismId());
    }

    return ancestorsId;
}
