#!/bin/sh
export FLASK_APP=./scripts/server.py
flask run -h 0.0.0.0
