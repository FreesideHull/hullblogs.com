#!/usr/bin/env bash
set -e;

# ██████  ██    ██ ██ ██      ██████
# ██   ██ ██    ██ ██ ██      ██   ██
# ██████  ██    ██ ██ ██      ██   ██
# ██   ██ ██    ██ ██ ██      ██   ██
# ██████   ██████  ██ ███████ ██████

log_msg "Installing website dependencies";

npm install;

log_msg "Building website";

npm run build;
