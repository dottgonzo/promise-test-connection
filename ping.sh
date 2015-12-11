#! /bin/bash

ping -w 1 8.8.8.8 2> /dev/null 1> /dev/null

if [ $? -eq 0 ]; then

  exit 0

else

  ping -w 5 8.8.8.8 2> /dev/null 1> /dev/null
  if [ $? -eq 0 ]; then
    exit 0
  else
    ping -w 10 8.8.8.8 2> /dev/null 1> /dev/null
    if [ $? -eq 0 ]; then
      exit 0
    else
      exit 1
    fi
  fi
  
fi
