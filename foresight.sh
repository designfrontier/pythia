#!/usr/bin/env bash

function ADD_AUTHOR {
  read author
  found_message="Found someone who knows things! :: "

  author=$(echo $author | grep -E -o "\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}\b")

  if ! [ -z "${author// }" ]; then
    echo $found_message $author
    # add your reporting stuff here if you want... like programatically adding reviewers in gerrit etc
  fi

}

function CHECK_OWNERSHIP {
  input=($1)
  size=${input[0]}
  AUTHOR=${input[2]}
  owned_lines=${input[1]}


  OWNERSHIP=$(bc -l <<< "scale=1; ($owned_lines/$size)*100")
  OWNER=$(bc -l <<< "$OWNERSHIP>=20")

  if [ $OWNER -eq 1 ]; then
    ADD_AUTHOR $AUTHOR
  fi
}

function PROCESS_FILE {
  FILE_PATH=$1
  SIZE=$(cat $(echo $FILE_PATH) | wc -l)

  # Find the original author of the file
  git log --diff-filter=A -- $FILE_PATH | grep -E -o "\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}\b" | ADD_AUTHOR

  # Find the people with current ownership
  git blame --show-email HEAD~1 -- $1 | grep -E -o "\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}\b" | sort | uniq -c | sort -r | while read line; do CHECK_OWNERSHIP "$SIZE $line"; done
}

function FORESIGHT {
  echo ""
  echo "Looking into the past to save the future..."
  git diff-tree --no-commit-id --name-only -r HEAD | while read line; do PROCESS_FILE "$line"; done | sort | uniq
  echo ""
}
