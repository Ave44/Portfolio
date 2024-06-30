#include "TextureLoader.h"
#include "constants.h"
#include "Renderer.h"
#include <stdexcept>
#include <iostream>

TextureLoader::TextureLoader()
{
    std::cout << "Textures loading" << std::endl;
    loadAnimalTextures();
    loadPlantTextures();
    loadUiTextures();
    font = TTF_OpenFont("assets/pixelFont.ttf", FONT_SIZE);
    std::cout << "Textures loaded" << std::endl;
}

void TextureLoader::loadTexture(map<string, SDL_Texture *> &textureMap, string filePath, string name)
{
    checkIfMapContainsKey(textureMap, name);
    SDL_Renderer *renderer = Renderer::getInstance().getRenderer();

    SDL_Surface *loadedImage = IMG_Load(filePath.c_str());
    SDL_Texture *loadedTexture = SDL_CreateTextureFromSurface(renderer, loadedImage);
    SDL_FreeSurface(loadedImage);

    if (loadedTexture == NULL)
    {
        string errorMsg = "Couldn't load texture: " + name + " Error: " + IMG_GetError();
        throw std::runtime_error(errorMsg.c_str());
    }

    textureMap.insert(std::pair<string, SDL_Texture *>(name, loadedTexture));
}

void TextureLoader::checkIfMapContainsKey(map<string, SDL_Texture *> &textureMap, string name)
{
    if (textureMap.count(name))
    {
        string errorMsg = "Texture name duplicate: " + name;
        throw std::runtime_error(errorMsg.c_str());
    }
}

void TextureLoader::loadAnimalTextures()
{
    string basePath = "assets/images/organisms/";
    loadTexture(this->animalTextures, basePath + "sheep.png", SHEEP_SPICES);
    loadTexture(this->animalTextures, basePath + "mouflon.png", MOUFLON_SPICES);
    loadTexture(this->animalTextures, basePath + "wolf.png", WOLF_SPICES);
}

void TextureLoader::loadPlantTextures()
{
    string basePath = "assets/images/organisms/";
    loadTexture(this->plantTextures, basePath + "grass.png", GRASS_SPICES);
    loadTexture(this->plantTextures, basePath + "dandelion.png", DANDELION_SPICES);
    loadTexture(this->plantTextures, basePath + "toadstool.png", TOADSTOOL_SPICES);
}

void TextureLoader::loadUiTextures()
{
    string basePath = "assets/images/";
    loadTexture(this->uiTextures, basePath + "tile.png", "tile");
    loadTexture(this->uiTextures, basePath + "border/border.png", "border");
    loadTexture(this->uiTextures, basePath + "border/border_rose.png", "border_corner");
    loadTexture(this->uiTextures, basePath + "border/border_rose_corner_template.png", "border_corner_joiner");
}

SDL_Texture *TextureLoader::getAnimalTexture(string name)
{
    return this->animalTextures[name];
}

SDL_Texture *TextureLoader::getPlantTexture(string name)
{
    return this->plantTextures[name];
}

SDL_Texture *TextureLoader::getUiTexture(string name)
{
    return this->uiTextures[name];
}

TTF_Font *TextureLoader::getFont() { return this->font; }

void TextureLoader::destroyTextures()
{
    // SDL_DestroyTexture(texture);
}