#! /bin/bash

if [[ $OSTYPE == linux* ]]; then

ping -w 10 -c 1 8.8.8.8 2> /dev/null 1> /dev/null # wait 1 seconds

if [ $? -eq 0 ]; then

  exit 0

else

      exit 1
  fi

fi

elif [[ $OSTYPE == darwin* ]]; then

  ping -t 10 -c 1 8.8.8.8 2> /dev/null 1> /dev/null # wait 1 seconds

  if [ $? -eq 0 ]; then

    exit 0

  else

        exit 1
    fi

  fi


else

  exit 1


fi
