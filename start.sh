#!/bin/sh

trap "trap_ctrlc" 2

cancel(){
  read -r -p "Press ENTER to EXIT"
  exit
}

trap_ctrlc ()
{
    echo "Ctrl-C caught...performing clean up"
    echo "Killing...$f_pid"
    kill "$f_pid"

    # Allow the user to see the message, so sleep for 4 seconds
    echo "Exiting In: "
    for i in 2 1
    do
       echo "$i... "
       sleep 1
    done
    exit
}

printf "BASH SCRIPT FOR NILE\n
VERSION 1.0.0\n
AUTHOR: MANU\n
DESCRIPTION: This is a bash script for initiating Flask and Nile. Make sure that you have
MySQL installed locally on your machine. The server.py file requires a username and password.
This script checks if you have them as global environment variables. If not, the script will add
it locally. If your environment variables don't seem to be registering, restart your IDE or terminal."

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
printf "==ALL PYTHON CHECKS PASSED==\n\n"


if [[ -z "$version" || $version =~ re ]];
then
    echo "PYTHON WAS NOT FOUND ON THE SYSTEM."
    cancel
fi

if [[ -z "${DB}" ]]; then
  eval "export DB=niledb"
  echo "exported DB"
fi

if [[ -z "${DB_HOST}" ]]; then
  eval "export DB_HOST=localhost"
  echo "exported DB_HOST"
fi

if [[ -z "${MAIL_SERVER}" ]]; then
  eval "export MAIL_SERVER=smtp.gmail.com"
  echo "exported MAIL_SERVER"
fi

if [[ -z "${MAIL_PORT}" ]]; then
  eval "export MAIL_PORT=465"
  echo "exported MAIL_PORT"
fi

if [[ -z "${MAIL_USER}" ]]; then
  eval "export MAIL_USER=rootatnilebookstore@gmail.com"
  echo "exported MAIL_USER"
fi

if [[ -z "${MAIL_PASS}" ]]; then
  eval "export MAIL_PASS=Testing1"
  echo "exported MAIL_PASS"
fi

if [[ -z "${FERNET_KEY}" ]]; then
  eval "export FERNET_KEY=Testing1"
  echo "exported FERNET_KEY"
fi

verAsInt=${version//[\.]/}

if ! [[ $verAsInt -ge 375 ]];
then
  echo "PYTHON VERSION IS $version BUT REQUIRES 3.7.5 OR HIGHER"
  cancel
fi

# DEBUG TRUE - FLASK RESTARTS FOR EVERY CHANGE :)
export FLASK_DEBUG=1
export FLASK_APP=server:create_server

flask run -h 127.0.0.1 &
f_pid=$!

python -mwebbrowser http://127.0.0.1:5000
wait

