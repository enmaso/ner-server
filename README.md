# ner-webservice

> Lightweight web server for Stanford NER

## Requirements
[Stanford NER](http://nlp.Stanford.edu/software/CRF-NER.shtml)
[Java 1.8 Runtime](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

## Installation
### Unpack Stanford NER lib into bin/
#### All you really need is the lib/ and classifiers/ directories and the stanford-ner.jar and build.xml files. And obviously the server.sh that already exists in bin/

## Notes
Accepts PUT and POST methods only.
Accepts STRING data only. RAW.
```
curl -X POST --data "Sample text data, by Frank Sinatra, in 1969, flew to the moon for $10.00" localhost:9000
```
Returns JSON.

Don't pass it more than 1MB of text at a time. That would be dumb.
