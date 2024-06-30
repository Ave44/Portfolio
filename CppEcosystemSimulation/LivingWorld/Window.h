#pragma once
#include <SDL2/SDL.h>

class Window
{
private:
	Window();
	Window(int width, int height);
	int width;
	int height;
	SDL_Window *window;

public:
	static Window &getInstance()
	{
		static Window instance;
		return instance;
	}

	Window(Window const &) = delete;
	void operator=(Window const &) = delete;

	int getWidth();
	void setWidth(int width);

	int getHeight();
	void setHeight(int height);

	SDL_Window *getWindow();
	void destroyWindow();
};
