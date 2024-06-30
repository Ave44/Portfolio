#include "Window.h"
#include "constants.h"
#include <iostream>
#include <SDL2/SDL.h>
#include <string>

// constructor delegation
Window::Window() : Window(WINDOW_WIDTH, WINDOW_HEIGHT)
{
}

Window::Window(int width, int height)
{
    std::cout << "Creating window" << std::endl;
    setWidth(width);
    setHeight(height);

    window = SDL_CreateWindow(WINDOW_TITLE, SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED, width, height, SDL_WINDOW_ALLOW_HIGHDPI);

    if (window == NULL)
    {
        std::string errorMsg = "Could not create window: " + std::string(SDL_GetError());
        throw std::runtime_error(errorMsg.c_str());
    }
}

int Window::getWidth()
{
    return width;
};

void Window::setWidth(int width)
{
    if (width >= 0)
        this->width = width;
    else
        this->width = 0;
};

int Window::getHeight()
{
    return height;
};

void Window::setHeight(int height)
{
    if (height >= 0)
        this->height = height;
    else
        this->height = 0;
};

SDL_Window *Window::getWindow()
{
    return window;
};

void Window::destroyWindow()
{
    SDL_DestroyWindow(window);
}