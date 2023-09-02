#!/bin/bash

INPUT_WRS=$1
INPUT_RASTER=$2
OUTPUT_RASTER=$3
NODATA=$4

PIXEL_SIZE="0.000273679007020"

INPUT_GRID='/SHP/cerrado_limite_util_utmzone.shp'

ogr2ogr -overwrite -f 'ESRI Shapefile' -where "wrs_img ='$INPUT_WRS'" $INPUT_WRS.shp $INPUT_GRID

BASE=`basename $INPUT_WRS.shp .shp`
EXTENT=`ogrinfo -so $INPUT_WRS.shp $BASE | grep Extent \
| sed 's/Extent: //g' | sed 's/(//g' | sed 's/)//g' \
| sed 's/ - /, /g'`
EXTENT=`echo $EXTENT | awk -F ',' '{print $1 " " $4 " " $3 " " $2}'`

gdalwarp -r lanczos -tap -tr $PIXEL_SIZE $PIXEL_SIZE -ot Int16 -srcnodata -1 -dstnodata -1  \
		-overwrite -co INTERLEAVE=BAND -co COMPRESS=LZW -co TILED=TRUE -t_srs 'EPSG:4674' -cblend 2 -cutline $INPUT_WRS.shp \
		$INPUT_RASTER $OUTPUT_RASTER
