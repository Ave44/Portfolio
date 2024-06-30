#include "EventHandler.h"
#include "constants.h"
#include <iostream>
#include <SDL2/SDL.h>

EventHandler::EventHandler(bool *programRunning)
{
    std::cout << "Creating event handler" << std::endl;

    SDL_Event sdlEvent;
    this->sdlEvent = sdlEvent;
    this->programRunning = programRunning;
}

void EventHandler::update(World *world)
{
    if (SDL_PollEvent(&sdlEvent))
    {
        if (SDL_QUIT == sdlEvent.type)
        {
            *this->programRunning = false;
        }
        else if (SDL_KEYDOWN == sdlEvent.type)
        {
            if (SDLK_p == sdlEvent.key.keysym.sym)
            {
                world->printAllLineages();
            }
            else if (SDLK_l == sdlEvent.key.keysym.sym)
            {
                world->loadWorld();
            }
            else if (SDLK_s == sdlEvent.key.keysym.sym)
            {
                world->saveWorld();
            }
        }
    }
};
