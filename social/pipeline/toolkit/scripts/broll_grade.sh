#!/bin/bash
# B-Roll (Mixkit u. a.) in einheitlichen dunklen, warmen Kino-Look bringen (9:16, 30 fps).
# Aufruf: scripts/broll_grade.sh roh.mp4 public/broll/b<id>.mp4 [start_sekunden]
ffmpeg -loglevel error -y -ss "${3:-1}" -t 6 -i "$1" -an -vf "scale=-2:1920:flags=lanczos,crop=1080:1920,fps=30,eq=contrast=1.06:saturation=0.88:brightness=-0.03,curves=all='0/0.02 0.25/0.2 0.6/0.6 1/0.96',colorbalance=rs=-0.03:bs=0.05:rh=0.05:bh=-0.03,unsharp=5:5:0.5,vignette=PI/5,noise=alls=7:allf=t,format=yuv420p" -c:v libx264 -crf 17 -preset medium "$2"
