# Generator for Alexa Voice Interface definitions

[![npm version](https://badge.fury.io/js/alexa-vui-generator.svg)](https://badge.fury.io/js/alexa-vui-generator)


## Installation

`npm install alexa-vui-generator`

## Usage

```
const generator = require('alexa-vui-generator');

generator.createVoiceInterface(intentGeneration, typeGeneration, 'alexa.json');
```

`intentGeneration` is a function that returns a Promise resolving to a list of intents as expected by the Alexa Skill Builder

`typeGeneration` is a function that returns a Promise resolving to a list of types as expected by the Alexa Skill Builder

`alexa.json` is the file name the created definition is written to

### Using intents.yaml

You can use the provided function `generator.readIntentsFromYAML` as `intentGeneration` that reads the intents from a file called `intents.yaml` and adds the Amazon default intents.

Furthermore it expands the provided texts to allow variations in the language. See example for usage.

`intents.yaml`
```yaml
MySuperIntent:
  texts:
    - (Play|Start|Open) the {channel} (channel|)
  slots:
    channel: ChannelName
```

This resolves to the following intent definition:

```json
{
  "name": "MySuperIntent",
  "samples": [
    "play the {channel} channel",
    "start the {channel} channel",
    "open the {channel} channel",
    "play the {channel}",
    "start the {channel}",
    "open the {channel}"
  ],
  "slots": [
    {
      "name": "channel",
      "type": "ChannelName",
      "samples": []
    }
  ]
}
```

### Using types.yaml

You can use the provided function `generator.readTypesFromYAML` as `typeGeneration` that reads the slot types from a file called `types.yaml`.

`types.yaml`
```yaml
ChannelName:
  rock:
    - rock
    - rock music
```

This resolves to the following intent definition:

```json
{
  "name": "ChannelName",
  "values": [
    {
      "id": "rock",
      "name": {
        "value": "rock",
        "synonyms": [
          "rock",
          "rock music"
        ]
      }
    }
  ]
}
```