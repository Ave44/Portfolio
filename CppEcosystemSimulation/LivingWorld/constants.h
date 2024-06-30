#include <array>

#define WINDOW_TITLE "World"
#define WORLD_WIDTH 16
#define WORLD_HEIGHT 8

#define TILE_SIZE 64

// #define WORLD_WIDTH 4
// #define WORLD_HEIGHT 2

// #define TILE_SIZE 256

// #define WORLD_WIDTH 64
// #define WORLD_HEIGHT 32

// #define TILE_SIZE 16

#define BORDER_WIDTH 64
#define BORDER_LENGTH 64

#define TOP_PANEL_SIZE 64

#define FONT_SIZE (TOP_PANEL_SIZE / 2)
#define TEXT_COLOR \
    {              \
        0, 0, 0    \
    }

#define WINDOW_WIDTH (WORLD_WIDTH * TILE_SIZE + BORDER_WIDTH * 2)
#define WINDOW_HEIGHT (WORLD_HEIGHT * TILE_SIZE + BORDER_WIDTH * 3 + TOP_PANEL_SIZE)

#define RENDERER_DRAW_COLOR \
    std::array { 235, 235, 235, 255 }

#define MS_PER_WORLD_UPDATE_NORMAL 1000

#define DEFAULT_START_ORGANISMS                \
    std::vector                                \
    {                                          \
        std::tuple{SHEEP_SPICES, 6},           \
            std::tuple{GRASS_SPICES, 16},      \
            std::tuple{DANDELION_SPICES, 4},   \
            std::tuple{WOLF_SPICES, 1},        \
            std::tuple { TOADSTOOL_SPICES, 2 } \
    }

#define MOUFLON_SPICES "mouflon"

#define GRASS_SPICES "grass"
#define GRASS_POWER 0
#define GRASS_INITIATIVE 0
#define GRASS_LIVE_LENGTH 6
#define GRASS_TURNS_TO_REPRODUCE 3

#define SHEEP_SPICES "sheep"
#define SHEEP_POWER 3
#define SHEEP_INITIATIVE 3
#define SHEEP_LIVE_LENGTH 10
#define SHEEP_TURNS_TO_REPRODUCE 6

#define DANDELION_SPICES "dandelion"
#define DANDELION_POWER 0
#define DANDELION_INITIATIVE 0
#define DANDELION_LIVE_LENGTH 6
#define DANDELION_TURNS_TO_REPRODUCE 2

#define WOLF_SPICES "woolf"
#define WOLF_POWER 8
#define WOLF_INITIATIVE 5
#define WOLF_LIVE_LENGTH 20
#define WOLF_TURNS_TO_REPRODUCE 16

#define TOADSTOOL_SPICES "toadstool"
#define TOADSTOOL_POWER 0
#define TOADSTOOL_INITIATIVE 0
#define TOADSTOOL_LIVE_LENGTH 12
#define TOADSTOOL_TURNS_TO_REPRODUCE 4
