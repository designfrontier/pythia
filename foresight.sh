#!/usr/bin/env bash
set -e

function ADD_AUTHOR {
  local author_to_add=$1

  local author_to_add="$(echo $author_to_add | grep -E -o "\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}\b")"

  if ! [ -z "${author_to_add}" ]; then
    # make a request to add the author to a review... using your platform
  fi

}

function CHECK_OWNERSHIP {
  local line=$1
  read -a input <<< "${line}"

  local size=${input[0]}
  local owned_lines=${input[1]}
  local author=${input[2]}
  local file_path=${input[3]}

  local ownership="$(bc -l <<< "scale=1; ($owned_lines/$size)*100")"
  local is_owner="$(bc -l <<< "$ownership>=20")"

  if [ $is_owner -eq 1 ]; then
    echo $author " owns: " $ownership " percent of " $file_path
    ADD_AUTHOR $author
  fi
}

function PROCESS_FILE {
  local FILE_PATH=$1
  local FILE_SIZE="$(cat $(echo $FILE_PATH) | wc -l)"

  # Find the people with current ownership
  git blame --show-email HEAD~1 -- $1 &> /dev/null && git blame --show-email HEAD~1 -- $1 | grep -E -o "<\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}\b>" | grep -E -o "\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}\b" | sort | uniq -c | while read line; do CHECK_OWNERSHIP "$FILE_SIZE $line $FILE_PATH"; done
}

function FORESIGHT {
  echo "FORESIGHT!"
  echo "Looking into the past to save the future..."
  echo "-------------------------------------------"
  git diff-tree --no-commit-id --name-only -r HEAD | while read line; do PROCESS_FILE "$line"; done | sort | uniq
  echo "-------------------------------------------"
  echo ""
}
