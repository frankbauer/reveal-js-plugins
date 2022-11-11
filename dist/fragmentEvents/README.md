# Fragment Events
A plugin for [Reveal.js](https://github.com/hakimel/reveal.js) having some simplified Fragment Event Hooks.

Reveals own `fragmentshown` and `fragmenthidden` events do not reliably fire when a slide deck is reloaded, or when you move backwards through your presentation.

This plugin adds a new event, that contains a full the complete fragement state in all thos circumstances.


## Installation
Copy the folder [`fragmentEvents`](https://github.com/frankbauer/reveal-js-plugins/tree/master/dist/fragmentEvents) into the plugin folder of your reveal.js presentation, i.e. `plugin/fragmentEvents`, and add the plugin to your presentation:

```html
<script src="plugin/fragmentEvents/plugin.js"></script>

<script>
    Reveal.initialize({
        // ...
        plugins: [ FragmentEvents ],
        // ...
    });
</script>
```


## Usage
This plugin emits two additional events called `fragmentevent_init` and `fragmentevent_change`.

### `fragmentevent_init`
This event fires, when a slide and its fragments first get loaded. If your fragment handling needs additional states to work, this is the place where you want to set it up.

For example, we use this to capture the initial state of some Slide-Elements before they get changed by other fragments. This will later allow us to reset the initial state of elements when going backwards through the fragments.

You can check out our [ModelViewer](https://github.com/frankbauer/reveal-js-plugins/tree/master/src/modelViewer)-Plugin for an example of this.


```javascript
Reveal.on('fragmentevent_init', event => {
    /* Do stuff */
});
```

The `event` object only contains the common data (see below). The event fires only once per slide just before the slide gets revealed.

### Common Event Data
The `event` object will always contain the following properties and methods:

#### Properties
- `slide` The slide (`<section>`-Element) that contains the fragments. 

#### Methods
- `getFragment(idx)`: Returns the first Fragment on the current slide that has the given fragment-index
- `getFragments(idx)`: Returns all Fragments on the current slide that have the given fragment-index. You can assign the same index to fragments using the built-in `data-fragment-index` attribute.
- `hasData(name)`: Slides can store arbitrary data for you. This method tests if there is already an entry available for the current name.
- `getData(name)`: Returns the set of data you previsouly stored with this name.
- `setData(name, data)`: Changes/Sets the data for the given name.