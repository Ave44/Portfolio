#pragma once
#include <SDL2/SDL.h>
#include "World.h"

class EventHandler
{
private:
    bool *programRunning;
    SDL_Event sdlEvent;

public:
    EventHandler(bool *programRunning);

    void update(World *world);
};
