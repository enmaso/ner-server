# ner-server
> Lightweight web server for Stanford NER

## Requirements
* [Stanford NER](http://nlp.Stanford.edu/software/CRF-NER.shtml)
* [Java 1.8 Runtime](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

## Installation
### Unpack Stanford NER lib into bin/
#### All you really need is the lib/ and classifiers/ directories and the stanford-ner.jar and build.xml files. And obviously the server.sh that already exists in bin/

## Notes
Accepts PUT method only.

PUT a string
```
curl -X PUT --data "Sample text data, by Frank Sinatra, in 1969, flew to the moon for $10.00" localhost:9000
```
PUT a text file
```
curl -T yourfile.txt localhost:9000
```

Returns JSON.

## Config
Open config.js and change
```
web.port
ner.port
put.limit
```
The port values are self explanatory. The PUT limit is the file size limit to which the server accepts. Default is 2MB, I wouldn't recommend going higher than that.
