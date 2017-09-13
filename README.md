# ner-webservice

Very lightweight STANFORD NER Web server

Accepts PUT and POST methods only.
Accepts STRING data only. RAW.
as in, curl -X POST --data "Sample text data, by Frank Sinatra, in 1969, flew to the moon for $10.00" localhost:9000
Returns JSON.

Don't pass it more than 1MB of text at a time. That would be dumb.
