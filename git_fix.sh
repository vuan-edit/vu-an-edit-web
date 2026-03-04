#!/bin/bash
echo "--- GIT STATUS ---"
git status
echo "--- GIT LOG ---"
git log -n 5 --oneline
echo "--- ATTEMPTING COMMIT ---"
git add .
git commit -m "feat: finalize update with contact page and fixes"
echo "--- ATTEMPTING PUSH ---"
git push origin main 2>&1
echo "--- FINAL STATUS ---"
git status
