#include "FpsCounter.h"

int FpsCounter::frames_drawn = 0;
Uint32 FpsCounter::fps_counter = 0;
float FpsCounter::fps = 0.0f;
Uint32 FpsCounter::prev_ticks = SDL_GetTicks();

void FpsCounter::nextTurn()
{
    Uint32 ticks_now = SDL_GetTicks64();
    Uint32 diff = ticks_now - prev_ticks;
    fps_counter += diff;
    prev_ticks = ticks_now;
    frames_drawn += 1;

    if (fps_counter >= 1000)
    {
        fps = (float)frames_drawn / (float)(fps_counter / 1000.0f);
        frames_drawn = 0;
        fps_counter = 0;
    }
}

int FpsCounter::getFps() { return fps; }