#!/bin/sh

cancel(){
  read -r
  exit
}

printf "BASH SCRIPT FOR NILE\n
VERSION 1.0.0\n
AUTHOR: MANU\n
DESCRIPTION: This is a bash script for initiating Flask and Nile. Make sure that you have
MySQL installed locally on your machine. The server.py file requires a username and password.
This script checks if you have them as global environment variables. If not, the script will add
it locally. If your don't seem to be registering, restart your IDE or terminal."

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
  echo "INFO: niledb registered"
else
  echo "ERROR: niledb could not be found on the MySQL instance"
  cancel
fi

printf "==ALL SQL CHECKS PASSED==\n"

#Using an actual python script in case people have python 2 on their computer too.
version=$(python -c 'import sys; print("".join(map(str, sys.version_info[:3])))')
re='^[0-9]+$'
if [[ -z "$version" || $version =~ re ]];
then
    echo "PYTHON WAS NOT FOUND ON THE SYSTEM. NOW EXITING..."
    cancel.
fi

verAsInt=${version//[\.]/}

if ! [[ $verAsInt -ge 375 ]];
then
  echo "PYTHON VERSION IS $version BUT REQUIRES 3.7.5 OR HIGHER"
  cancel
fi

printf "==ALL PYTHON CHECKS PASSED==\n\n"

# DEBUG TRUE - FLASK RESTARTS FOR EVERY CHANGE :)
export FLASK_DEBUG=1
export FLASK_APP=./server.py
flask run -h 127.0.0.1 &
python -mwebbrowser http://127.0.0.1:5000

read -r


