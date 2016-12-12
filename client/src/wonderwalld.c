/*
 * Copyright (c) 2016, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "amqp.h"
#include "download.h"
#include "display.h"

#include <stdlib.h>
#include <stdio.h>

#include <jansson.h>


#include <string.h>

const int DEFAULT_DISPLAY_TIMEOUT = 10;
char filename[FILENAME_MAX] = "/tmp/wonderwall.data";

json_t *parse_json(const char *text) {
    json_t *root;
    json_error_t error;

    root = json_loads(text, 0, &error);

    if (root) {
        return root;
    } else {
        fprintf(stderr, "error: jansson failed to parse JSON on line %d: %s\n", error.line, error.text);

        return NULL;
    }
}


void handle_message(char *message) {
    json_t *json_message;
    json_t *json_url;
    json_t *json_timeout;
    const char *url = NULL;
    unsigned int timeout = DEFAULT_DISPLAY_TIMEOUT;

    fprintf(stdout, "Handling message %s\n", message);

    json_message = parse_json(message);
    if (!json_message) {
        fprintf(stderr, "Failed to parse URL because of malformed JSON message\n");

        return;
    }

    json_url = json_object_get(json_message, "url");
    if (!json_url) {
        fprintf(stderr, "Failed to parse URL because of invalid JSON message\n");

        json_decref(json_message);

        return;
    }

    url = json_string_value(json_url);
    if (!url || strlen(url) == 0) {
        fprintf(stderr, "Failed to parse URL because of invalid JSON type\n");

        json_decref(json_message);

        return;
    }

    json_timeout = json_object_get(json_message, "timeout");
    if (json_timeout) {
        timeout = (unsigned int) json_integer_value(json_timeout);
        if (!timeout) {
            fprintf(stderr, "Failed to parse timeout because of invalid JSON type\n");

            json_decref(json_message);

            return;
        }
    }

    fprintf(stdout, "Displaying %s for %u sec\n", url, timeout);
    if (download_image(url, filename) < 0) {
        fprintf(stderr, "Failed to download URL: %s\n", url);

        json_decref(json_message);

        remove(filename);

        return;
    }

    display_image(filename, timeout);

    json_decref(json_message);

    remove(filename);
}



int main(int argc, char const *const *argv) {
    char const *hostname;
    char const *username;
    char const *password;
    char const *queue;
    int port;
    char const *exchange;
    char const *bindingkey;


    if (argc < 6) {
        fprintf(stderr, "Usage: wonderwalld host port username password\n");
        return 1;
    }

    hostname = argv[1];
    port = atoi(argv[2]);
    username = argv[3];
    password = argv[4];
    queue = argv[5];
    exchange = "amq.direct";
    bindingkey = "test queue";

    connect(hostname, port, username, password, queue, exchange, bindingkey, handle_message);

    return 0;
}