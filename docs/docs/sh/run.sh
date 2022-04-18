#!/bin/bash

INPUT_DIR="/Imagens/original"
OUTPUT_DIR="/Imagens/clipped"
DIRS="2000 2002 2004 2006 2008 2010 2012 2013 2014 2015 2016 2017 2018 2019"

cd $INPUT_DIR
for year in $DIRS; do
	for file in $(find $year -name '*.tif'); do
		wrs=$(echo "$file" | cut -d_ -f3)
		../SHP/clip_landsat.sh $wrs $INPUT_DIR/$file $OUTPUT_DIR/$file 0
	done
done

for year in $DIRS; do
	gdal_merge.py -ot Int16 -co BIGTIFF=YES -co COMPRESS=LZW -co TILED=True -n -1 -init -1000 -a_nodata -1000 -o $OUTPUT_DIR/$year-tmp.tif $OUTPUT_DIR/$year/*
done

for year in $DIRS; do
	gdal_translate -co BIGTIFF=YES -co COMPRESS=LZW -co TILED=True -ot Byte -scale 0 255 1 255 $OUTPUT_DIR/$year-tmp.tif $OUTPUT_DIR/$year.tif
done

for year in $DIRS; do
	rm -v $OUTPUT_DIR/$year-tmp.tif
done

for year in $DIRS; do
	gdaladdo -ro $OUTPUT_DIR/$year.tif 2 4 8
done
