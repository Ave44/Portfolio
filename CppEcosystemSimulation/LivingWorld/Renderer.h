#pragma once
#include <SDL2/SDL.h>
#include "Window.h"
#include "Position.h"
#include "World.h"
#include "Entity/Organism.h"
#include <vector>

class Renderer
{
private:
    Renderer();
    int width;
    int height;
    SDL_Renderer *renderer;

public:
    static Renderer &getInstance()
    {
        static Renderer instance;
        return instance;
    }

    Renderer(Renderer const &) = delete;
    void operator=(Renderer const &) = delete;

    void resetRendererTarget();
    void clear();
    void renderOnWorld(SDL_Texture *texture, Position position, SDL_Rect *srcRect = NULL);
    void renderOrganism(Organism &o);
    void renderWorld(World &world);
    void renderBorders();
    void renderBorder(SDL_Texture *borderTexture, int startX, int startY, int repetitionsX, int repetitionsY, bool isVertical);
    void renderBorderCorner(SDL_Texture *cornerTexture, int xPos, int yPos, SDL_Texture *cornerJoinerTexture, vector<int> joinerAngles);
    void renderTexts(World &world);
    void renderText(string text, int x, int y);

    void renderGame(World &world);
    void update();

    SDL_Renderer *getRenderer();
    void destroyRenderer();
};
