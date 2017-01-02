#
# This CMake file tries to find the the Jansson library
#
# The following variables are set:
#   JANSSON_FOUND - Jansson library has been found in the system
#   JANSSON_INCLUDE_DIRS - Jansson library path
#   JANSSON_LIBRARIES - Jansson headers path
#

if (JANSSON_LIBRARIES AND JANSSON_INCLUDE_DIRS)
    # in cache already
    set(JANSSON_FOUND TRUE)
else (JANSSON_LIBRARIES AND JANSSON_INCLUDE_DIRS)
    find_path(JANSSON_INCLUDE_DIR
            NAMES
            jansson.h
            PATHS
            /usr/include
            /usr/local/include
            /opt/local/include
            /sw/include
            )

    find_library(JANSSON_LIBRARY
            NAMES
            jansson
            PATHS
            /usr/lib
            /usr/local/lib
            /opt/local/lib
            /sw/lib
            )

    set(JANSSON_INCLUDE_DIRS
            ${JANSSON_INCLUDE_DIR}
            )

    if (JANSSON_LIBRARY)
        set(JANSSON_LIBRARIES
                ${JANSSON_LIBRARIES}
                ${JANSSON_LIBRARY}
                )
    endif (JANSSON_LIBRARY)

    include(FindPackageHandleStandardArgs)
    find_package_handle_standard_args(Jansson DEFAULT_MSG
            JANSSON_LIBRARIES JANSSON_INCLUDE_DIRS)

    # show the JANSSON_INCLUDE_DIRS and JANSSON_LIBRARIES variables only in the advanced view
    mark_as_advanced(JANSSON_INCLUDE_DIRS JANSSON_LIBRARIES)

endif (JANSSON_LIBRARIES AND JANSSON_INCLUDE_DIRS)


