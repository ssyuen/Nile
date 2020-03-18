#!/bin/sh

printf "BASH SCRIPT FOR NILE\n
VERSION 1.0.0\n
AUTHOR: MANU\n
DESCRIPTION: This is a bash script for initiating Flask and Nile. Make sure that you have
MySQL installed locally on your machine. The server.py file requires a username and password.
This script checks if you have them as global environment variables. If not, the script will add
it locally."

printf "\n\n"
echo "--------------------------------------------------------------------"
printf "\n\n"

echo "Hello $(whoami)"


if [[ -z "${DB_USER}" ]]; then
  read -r -p "Enter Your MySQL Username: "  uname
  eval "export DB_USER=$uname"
fi


if [[ -z "${DB_PASS}" ]]; then
  read -s -r -p "Enter Your MySQL Password: "  pwd
  printf "\n"
  eval "export DB_PASS=$pwd"
fi

if [[ ! -z "`mysql -qfsBe "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME='niledb'" 2>&1`" ]];
then
  echo "niledb registered"
else
  echo "niledb does not exist"
  read
  exit
fi

export FLASK_APP=./server.py
flask run -h 127.0.0.1