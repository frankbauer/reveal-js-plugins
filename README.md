# Plugins

This is a collection of plugins for [Reveal.js](https://github.com/hakimel/reveal.js) we use for Lectures at [FAU](https://www.fau.de) in the [Visual Computing Group](https://lgdv.tf.fau.de).

Currently this collection includes:
- [**FragmentEvents**](https://github.com/frankbauer/reveal-js-plugins/tree/master/dist/fragmentEvents): Adds a more versatile Fragment Event hook, that helps you to restore a precices fragment state when a deck is reloaded or users move backward through the fragments on a slide. This is mostly a utility used by other plugins.

- [**ModelViewer**](https://github.com/frankbauer/reveal-js-plugins/tree/master/dist/modelViewer): Allows you to control 3D-Models in [**&lt;model-viewer&gt;**](https://modelviewer.dev) Components using fragments on a slide. ([Demo](https://frankbauer.github.io/reveal-js-demos/modelViewer/demo.html))


## Building
If you want to build the Plugins you will need to have **gulp** and **npm** installed.

Just run `npm i` after you first cloned the repository to initialize the dependencies. Whenever you need to build a new version, you can use `npm run build`.
