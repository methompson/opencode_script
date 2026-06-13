# opencode_script

## A personal scripting project to help me install and use an OpenCode instance

This is a CLI project that helps me run OpenCode in a Docker instance with my LMStudio installations locally.

Install dependencies with `npm ci`
Run the app with `npm run opencode`
Build the app using `npm run build`

There are 3 main operations:

`opencode -d` - Opens the debug menu. Where you can do the following:

* Clear the local files from OpenCode
* Clear the local configuration files from OpenCode
* Clear both the local files and configuration
* Build the docker image
* Delete the docker image

`opencode -m` - Opens the LLM menu. Where you can do the following:

* Load Models into LMStudio
* Unload Models from LMStudio

The menu is based upon the model configuration that you have.

THe `install_opencode_cli.sh` script is a helper script that copies the built CLI file into the `/usr/local/bin` directory. The script include a Node shebang at the top of the file, so that it can be run directly from the command line.