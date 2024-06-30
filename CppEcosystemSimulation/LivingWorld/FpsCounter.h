#pragma once
#include <iostream>
#include <SDL2/SDL.h>

using namespace std;

class FpsCounter
{
private:
    static int frames_drawn;
    static Uint32 fps_counter;
    static float fps;
    static Uint32 prev_ticks;

public:
    FpsCounter() = delete;
    FpsCounter(FpsCounter &fpsCounter) = delete;
    void operator=(FpsCounter const &) = delete;

    static int getFps();

    static void nextTurn();
};