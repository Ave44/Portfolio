#pragma once
#include <map>
#include <string>
#include <SDL2/SDL.h>
#include <SDL2/SDL_image.h>
#include <SDL2/SDL_ttf.h>

using namespace std;

class TextureLoader
{
private:
    TextureLoader();
    map<string, SDL_Texture *> animalTextures;
    map<string, SDL_Texture *> plantTextures;
    map<string, SDL_Texture *> uiTextures;
    TTF_Font *font;

public:
    static TextureLoader &getInstance()
    {
        static TextureLoader instance;
        return instance;
    }

    TextureLoader(TextureLoader const &) = delete;
    void operator=(TextureLoader const &) = delete;

    void loadTexture(map<string, SDL_Texture *> &textureMap, string filePath, string name);
    void checkIfMapContainsKey(map<string, SDL_Texture *> &textureMap, string name);

    SDL_Texture *getAnimalTexture(string name);
    SDL_Texture *getPlantTexture(string name);
    SDL_Texture *getUiTexture(string name);
    TTF_Font *getFont();

    void loadAnimalTextures();
    void loadPlantTextures();
    void loadUiTextures();

    void destroyTextures();
};