#include <iostream>
#include <list>
#include <SDL2/SDL.h>
#include <SDL2/SDL_ttf.h>
#include "Window.h"
#include "Renderer.h"
#include "TextureLoader.h"
#include "EventHandler.h"
#include "World.h"
#include "FpsCounter.h"

int main(int argc, char *argv[])
{
	SDL_Init(SDL_INIT_EVERYTHING);
	TTF_Init();
	Window &window = Window::getInstance();
	Renderer &renderer = Renderer::getInstance();
	TextureLoader &textureLoader = TextureLoader::getInstance();

	bool programRunning = true;
	EventHandler eventHandler = EventHandler(&programRunning);

	World world = World(WORLD_WIDTH, WORLD_HEIGHT, DEFAULT_START_ORGANISMS);

	int msPerWorldUpdate = MS_PER_WORLD_UPDATE_NORMAL;

	Uint64 frameEndTime = SDL_GetTicks64() + msPerWorldUpdate;
	while (programRunning)
	{

		if (SDL_GetTicks64() > frameEndTime)
		{
			world.nextTurn();
			frameEndTime = SDL_GetTicks64() + msPerWorldUpdate;
		}

		eventHandler.update(&world);

		renderer.clear();
		renderer.renderGame(world);
		renderer.update();

		FpsCounter::nextTurn();
	}

	textureLoader.destroyTextures();
	renderer.destroyRenderer();
	window.destroyWindow();
	TTF_Quit();
	SDL_Quit();

	return EXIT_SUCCESS;
}
