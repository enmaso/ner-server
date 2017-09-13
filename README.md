# ner-webservice

Very lightweight STANFORD NER Web server

PREREQUISITES
Must have JRE 1.8 Installed
Must have STANFORD NER library unpacked in bin/

All you really need is the lib/ and classifiers/ directories and the stanford-ner.jar and build.xml files. And obviously the server.sh that already exists in bin/

Accepts PUT and POST methods only.
Accepts STRING data only. RAW.
as in, curl -X POST --data "Sample text data, by Frank Sinatra, in 1969, flew to the moon for $10.00" localhost:9000
Returns JSON.

Don't pass it more than 1MB of text at a time. That would be dumb.
