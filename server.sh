#!/bin/sh

# Put this in the directory in which you extracted the STANFORD NER package.

scriptdir=`dirname $0`
port=$1

# Configure classifiers and port to your need

java -mx1000m -cp "$scriptdir/bin/stanford-ner.jar:$scriptdir/bin/lib/*" edu.stanford.nlp.ie.NERServer  -loadClassifier $scriptdir/bin/classifiers/english.muc.7class.distsim.crf.ser.gz -port $port -outputFormat inlineXML
