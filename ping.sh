#! /bin/bash

if [[ $OSTYPE == linux* ]]; then

ping -w 1 8.8.8.8 2> /dev/null 1> /dev/null # wait 1 seconds

if [ $? -eq 0 ]; then

  exit 0

else

  ping -w 5 8.8.8.8 2> /dev/null 1> /dev/null # wait 5 seconds
  if [ $? -eq 0 ]; then
    exit 0
  else
    ping -w 10 8.8.8.8 2> /dev/null 1> /dev/null # wait 10 seconds
    if [ $? -eq 0 ]; then
      exit 0
    else
      exit 1
    fi
  fi

fi

elif [[ $OSTYPE == darwin* ]]; then

  ping -t 1 8.8.8.8 2> /dev/null 1> /dev/null # wait 1 seconds

  if [ $? -eq 0 ]; then

    exit 0

  else

    ping -t 5 8.8.8.8 2> /dev/null 1> /dev/null # wait 5 seconds
    if [ $? -eq 0 ]; then
      exit 0
    else
      ping -t 10 8.8.8.8 2> /dev/null 1> /dev/null # wait 10 seconds
      if [ $? -eq 0 ]; then
        exit 0
      else
        exit 1
      fi
    fi

  fi



else

  exit 1


fi
