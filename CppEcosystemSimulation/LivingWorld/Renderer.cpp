#include "Renderer.h"
#include "constants.h"
#include "FpsCounter.h"
#include <iostream>
#include <SDL2/SDL.h>
#include <string>

Renderer::Renderer()
{
    std::cout << "Creating renderer" << std::endl;
    Window &window = Window::getInstance();
    renderer = SDL_CreateRenderer(window.getWindow(), -1, SDL_RENDERER_ACCELERATED);

    if (renderer == NULL)
    {
        std::string errorMsg = "Could not create renderer: " + std::string(SDL_GetError());
        throw std::runtime_error(errorMsg.c_str());
    }

    SDL_SetRenderDrawColor(renderer,
                           RENDERER_DRAW_COLOR[0],
                           RENDERER_DRAW_COLOR[1],
                           RENDERER_DRAW_COLOR[2],
                           RENDERER_DRAW_COLOR[3]);
}

void Renderer::clear()
{
    SDL_RenderClear(renderer);
}

void Renderer::renderOnWorld(SDL_Texture *texture, Position position, SDL_Rect *srcRect)
{
    SDL_Rect destRect;
    destRect.x = position.getX() * TILE_SIZE + BORDER_WIDTH;
    destRect.y = position.getY() * TILE_SIZE + BORDER_WIDTH * 2 + TOP_PANEL_SIZE;
    destRect.w = TILE_SIZE;
    destRect.h = TILE_SIZE;
    SDL_RenderCopy(renderer, texture, srcRect, &destRect);
}

void Renderer::renderOrganism(Organism &o)
{
    renderOnWorld(o.getTexture(), o.getPosition());
}

void Renderer::renderWorld(World &world)
{
    int worldWidth = world.getWorldWidth();
    int worldHeight = world.getWorldHeight();
    for (int x = 0; x < worldWidth; x++)
    {
        for (int y = 0; y < worldHeight; y++)
        {
            renderOnWorld(world.getTileTexture(), Position(x, y));
        }
    }

    for (Organism *o : world.getOrganisms())
    {
        renderOrganism(*o);
    }
}

void Renderer::renderBorders()
// rendering using small parts is ~20% faster than creating one gigant texture
// if that texture contains transparency, it it worth testing again with no transparency
// also there is another approach where i create "table of offsets"
// and use it to calculate positions possibly quicker
{
    TextureLoader &textureLoader = TextureLoader::getInstance();

    SDL_Texture *borderTexture = textureLoader.getUiTexture("border");
    // vertical edges
    renderBorder(borderTexture, BORDER_WIDTH, (TOP_PANEL_SIZE + BORDER_WIDTH), (WORLD_WIDTH * TILE_SIZE) / BORDER_LENGTH, 1, true);
    renderBorder(borderTexture, BORDER_WIDTH, (TOP_PANEL_SIZE + 2 * BORDER_WIDTH + WORLD_HEIGHT * TILE_SIZE), (WORLD_WIDTH * TILE_SIZE) / BORDER_LENGTH, 1, true);
    renderBorder(borderTexture, BORDER_WIDTH, 0, (WORLD_WIDTH * TILE_SIZE) / BORDER_LENGTH, 1, true);

    // horizontal edges
    // it is faster to render edges as one (despite fact that some parts will be rended over) instead of rendering multiple parts separately
    renderBorder(borderTexture, 0, 0, 1, WINDOW_HEIGHT / 4, false);
    renderBorder(borderTexture, WINDOW_WIDTH - BORDER_WIDTH, 0, 1, WINDOW_HEIGHT / 4, false);

    // corners
    SDL_Texture *cornerTexture = textureLoader.getUiTexture("border_corner");
    SDL_Texture *cornerJoinerTexture = textureLoader.getUiTexture("border_corner_joiner");

    renderBorderCorner(cornerTexture, 0, 0, cornerJoinerTexture, vector<int>{0, 270});
    renderBorderCorner(cornerTexture, WINDOW_WIDTH - BORDER_WIDTH, 0, cornerJoinerTexture, vector<int>{0, 90});

    renderBorderCorner(cornerTexture, 0, BORDER_WIDTH + TOP_PANEL_SIZE, cornerJoinerTexture, vector<int>{0, 180, 270});
    renderBorderCorner(cornerTexture, WINDOW_WIDTH - BORDER_WIDTH, BORDER_WIDTH + TOP_PANEL_SIZE, cornerJoinerTexture, vector<int>{0, 90, 180});

    renderBorderCorner(cornerTexture, 0, WINDOW_HEIGHT - BORDER_WIDTH, cornerJoinerTexture, vector<int>{180, 270});
    renderBorderCorner(cornerTexture, WINDOW_WIDTH - BORDER_WIDTH, WINDOW_HEIGHT - BORDER_WIDTH, cornerJoinerTexture, vector<int>{90, 180});
}

void Renderer::renderBorder(SDL_Texture *borderTexture, int startX, int startY, int repetitionsX, int repetitionsY, bool isVertical)
{
    int xOffset = isVertical ? BORDER_LENGTH : BORDER_WIDTH;
    int yOffset = isVertical ? BORDER_WIDTH : BORDER_LENGTH;
    for (int x = 0; x < repetitionsX; x++)
    {
        for (int y = 0; y < repetitionsY; y++)
        {
            SDL_Rect destRect;
            destRect.x = startX + x * xOffset;
            destRect.y = startY + y * yOffset;
            destRect.w = xOffset;
            destRect.h = yOffset;
            if (isVertical)
            {
                SDL_RenderCopyEx(renderer, borderTexture, NULL, &destRect, 90, NULL, SDL_FLIP_NONE);
            }
            else
            {
                SDL_RenderCopy(renderer, borderTexture, NULL, &destRect);
            }
        }
    }
}

void Renderer::renderBorderCorner(SDL_Texture *cornerTexture, int xPos, int yPos, SDL_Texture *cornerJoinerTexture, vector<int> joinerAngles)
{
    SDL_Rect destRect;
    destRect.x = xPos;
    destRect.y = yPos;
    destRect.w = BORDER_WIDTH;
    destRect.h = BORDER_WIDTH;
    SDL_RenderCopy(renderer, cornerTexture, NULL, &destRect);
    for (int &angle : joinerAngles)
    {
        SDL_RenderCopyEx(renderer, cornerJoinerTexture, NULL, &destRect, angle, NULL, SDL_FLIP_NONE);
    }
}

void Renderer::renderText(string text, int x, int y)
{
    TTF_Font *font = TextureLoader::getInstance().getFont();
    SDL_Surface *textSurface = TTF_RenderText_Solid(font, text.c_str(), TEXT_COLOR);

    SDL_Texture *textTexture = SDL_CreateTextureFromSurface(renderer, textSurface);

    SDL_Rect destRect;
    destRect.x = x;
    destRect.y = y;
    destRect.w = textSurface->w;
    destRect.h = textSurface->h;

    SDL_RenderCopy(renderer, textTexture, NULL, &destRect);

    SDL_FreeSurface(textSurface);
    SDL_DestroyTexture(textTexture);
}

void Renderer::renderTexts(World &world)
{
    int panelY = BORDER_WIDTH + (BORDER_LENGTH / 4);

    string turnText = "Turn: " + to_string(world.getTurn());
    renderText(turnText, BORDER_WIDTH + (BORDER_LENGTH / 2), panelY);

    string fpsText = "FPS: " + to_string(FpsCounter::getFps());
    renderText(fpsText, WINDOW_WIDTH - (BORDER_LENGTH * 4), panelY);
}

void Renderer::renderGame(World &world)
{
    renderWorld(world);
    renderBorders();
    renderTexts(world);
}

void Renderer::update()
{
    SDL_RenderPresent(renderer);
}

SDL_Renderer *Renderer::getRenderer()
{
    return renderer;
};

void Renderer::destroyRenderer()
{
    SDL_DestroyRenderer(renderer);
}