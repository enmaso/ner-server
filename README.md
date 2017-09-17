# ner-server
Lightweight Nodejs Stanford Named Entity Recognition server <br>
This is **not** a node_module, this is a standalone server

## Requirements
* Java 1.8+
* [Stanford NER Download](https://nlp.stanford.edu/software/stanford-ner-2017-06-09.zip)

## Installation
Unpack *stanford-ner-2017-06-09.zip* to bin/ directory
```
> cd ner-server
> wget https://nlp.stanford.edu/software/stanford-ner-2017-06-09.zip
> unzip stanford-ner-2017-06-09.zip
> cp stanford-ner-2017-06-09/ bin/
```

## Running the server
```
npm start
```

## Usage
Passing a string to the server
```
curl -X PUT --data "Frank Sinatra, in 1969, sang New York, New York" localhost:8080
```
Passing a file to the server
```
curl -T test/sample.txt localhost:8080
```

Returns a JSON string
