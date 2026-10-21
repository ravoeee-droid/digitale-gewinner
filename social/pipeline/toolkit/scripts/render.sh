#!/bin/bash
# Aufruf im Ordner toolkit:  scripts/render.sh R4013   (Composition-Name aus src/Root.jsx)
# Lokal reicht Remotion mit seinem eigenen Chrome (kein --browser-executable nötig).
set -e
c=$1; mkdir -p out
npx remotion render src/index.jsx $c out/${c}_nz.mp4 --crf=18
ffmpeg -loglevel error -y -i out/${c}_nz.mp4 -c:v copy -af "alimiter=limit=0.9:level=disabled,loudnorm=I=-14:TP=-1.5:LRA=9" -c:a aac -b:a 192k -movflags +faststart out/${c}_hq.mp4
ffmpeg -loglevel error -y -i out/${c}_hq.mp4 -c:v libx264 -crf 25 -preset medium -c:a copy -movflags +faststart out/${c}_send.mp4
python3 ../qa_video.py out/${c}_send.mp4 --hook
