#!/bin/bash
LOG_FILE="/Volumes/12AM_VuAn_SSD/Code/Vu An Edit Web/git_final_debug.log"
exec > "$LOG_FILE" 2>&1

echo "=== START DEBUG ==="
date
pwd

echo "--- GIT VERSION ---"
git --version

echo "--- REMOTE ---"
git remote -v

echo "--- BRANCH ---"
git branch
git symbolic-ref --short HEAD

echo "--- STATUS ---"
git status

echo "--- LOG (Last 3) ---"
git log -n 3 --oneline

echo "--- ATTEMPTING PUSH ---"
git push origin main --verbose

echo "=== END DEBUG ==="
