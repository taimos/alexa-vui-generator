# Generator for Alexa Voice Interface definitions

[![npm version](https://badge.fury.io/js/alexa-vui-generator.svg)](https://badge.fury.io/js/alexa-vui-generator)


## Installation

`npm install alexa-vui-generator`

## Usage

```
const generator = require('alexa-vui-generator');

generator.createLanguageModel(options, locale);
```

`options` is an object which configures the generation of the language model

* `intentCreators` is a function or an array of functions that return a Promise resolving to a list of intents as expected by the Alexa Skill Builder.
* `typeCreators` is a function or an array of functions that return a Promise resolving to a list of types as expected by the Alexa Skill Builder.
* `invocation` is a string that denotes the invocation name of the skill
* `postProcessor` is an optional function with one argument to post process the generated VUI 
* `pretty` defines if the output should be pretty printed. By default it is minified.

`locale` is the locale that is generated and denotes the file name. (models/{locale}.json). It is forwarded to the generator functions as the first argument.

### Using intents.yaml

You can use the provided function `generator.readIntentsFromYAML` as a function in `intentCreators` that reads the intents from a file called `intents.yaml` and adds the Amazon default intents.

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

To support different locales you can provide an object as texts with the locales as keys instead of a string array.

`intents.yaml`
```yaml
MySuperIntent:
  texts:
    'en-US':
      - (Play|Start|Open) the {channel} (channel|)
    'de-DE':
      - (Spiele|Starte|Öffne) den {channel} (channel|Kanal|)
  slots:
    channel: ChannelName
```


### Using types.yaml

You can use the provided function `generator.readTypesFromYAML` as a function in `typeCreators` that reads the slot types from a file called `types.yaml`.

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

To support different locales you can provide an object as values with the locales as keys instead of a string array.

`types.yaml`
```yaml
ChannelName:
  rock:
    'en-US':
      - rock
      - rock music
    'de-DE':
      - rock
      - rock musik
```

### Other generator functions used as `intentCreators`

`createAudioPlayerIntents` - Creates the intents needed when using the AudioPlayer functionality.
`createDisplayIntents` - Creates the intents needed when using the Display functionality.