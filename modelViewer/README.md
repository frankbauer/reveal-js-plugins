# Model Viewer
A plugin for [Reveal.js](https://github.com/hakimel/reveal.js) that allows you to control 
3D Models by stepping through Fragments on a slide.

The 3D Models are presented using [**&lt;model-viewer&gt;**](https://modelviewer.dev).

## Installation
1. Include [**&lt;model-viewer&gt;**](https://modelviewer.dev) into your slides. Either by downloading a alocal copy or referenceing the CDN. Make sure to include &lt;model-viewer&gt; **before** the plugin. When downloaded to a folder name `js/model-viewer` you can include it using 
```html
<script src="js/model-viewer/js/model-viewer.js"></script>
```

3. You also need to include our [FragmentEvents](https://github.com/frankbauer/reveal-js-plugins/tree/master/fragmentEvents)-Plugin, and load it **before** the ModelViewerPlugin.

2. Copy the folder `modelViewer` into the plugin folder of your reveal.js presentation, i.e. `plugin/modelViewer`, and add the plugin to your presentation:

```html
<script src="plugin/modelViewer/plugin.js"></script>

<script>
    Reveal.initialize({
        // ...
        plugins: [ FragmentEvents, ModelViewerPlugin ],
        // ...
    });
</script>
```

## Usage
We need a slide, that contains a 3D Model. Using one of the examples from [**&lt;model-viewer&gt;**](https://modelviewer.dev), we could use it like this:
```html
<section>
    <!-- See https://modelviewer.dev/ for Details on the ModelViewer Tag -->
    <model-viewer 
            id="model-armstrong" 
            camera-orbit="0 0 100%" 
            auto-rotate-delay="0"							
            min-camera-orbit="-Infinity -Infinity 5%" 
            max-camera-orbit="Infinity Infinity 500%" 
            src="shared-assets/models/NeilArmstrong.glb" 
            environment-image="shared-assets/environments/moon_4k.hdr" 
            poster="shared-assets/models/NeilArmstrong.webp" 
            shadow-intensity="1"								
    ></model-viewer>					
</section>	
```
Our Fragment command can change any attribute of the model-viewer container when a new fragment get's revealed. It will also automatically undo those changes when going backward though the fragments.

For example, we can set a new camera perspective by adding this to our slide:

```html
<span class="fragment">
    <model-viewer-command camera-orbit="90deg 0 100%" />
</span> 
```

The `model-viewer-command` is a new Tag added by this plugin. The attributes included in this tag, will be copied to **all** `model-viewer` components on this slide. This allows you to easily reconfigure your `model-viewer`. See the [**&lt;model-viewer&gt;** Documnetation](https://modelviewer.dev/docs/index.html#entrydocs-stagingandcameras-attributes-cameraOrbit) for all possible attributes.

## Special attributes
The `model-viewer-command` also uses some special attributes, that control specialized behaviour.

### Controlling specify Viewers
By default the `model-viewer-command`-Tag applies to **all** `model-viewer` components on a slide. You can add the `model-viewer` attribute to the command to specify a query-string that restricts the selection. In the following example, the camera is change on any `model-viewer` component that has the `id` set to *model-armstrong*.
```html
<span class="fragment">
    <model-viewer-command model-viewer="#model-armstrong" camera-orbit="90 -45deg 50%" />
</span>
```

### Controlling Hotspots/Annotations
**&lt;model-viewer&gt;** Allows you to add Annotations to your Models [Documentation](https://modelviewer.dev/examples/annotations/index.html). We added some special attributes to show/hide thos annotations using the `model-viewer-command`-Tag.

This example adds two different HotSpots. Please note, that they both are added to a `slot`. The slot-name has to start with `hotspot-`.

```html
<section>
    <model-viewer 
            id="model-generic" 
            auto-rotate-delay="0"	
            auto-rotate
            min-camera-orbit="-Infinity -Infinity 5%" 
            max-camera-orbit="Infinity Infinity 500%" 
            src="shared-assets/models/Astronaut.glb" 
            environment-image="shared-assets/environments/moon_4k.hdr" 								
            shadow-intensity="2"								
        >
        <!-- This data was generated using the editor at https://modelviewer.dev/editor/ -->
        <button 
            class="hotspot hidden" 
            slot="hotspot-helmet"  
            data-position="-0.00m 1.94m 0.31m" 
            data-normal="-0.29m 0.70m 0.65m"
        >
            <div class="annotation">This is a helmet</div>
        </button>
        <button 
            class="hotspot hidden" 
            slot="hotspot-hand" 
            data-position="0.52m 0.95m 0.11m" 
            data-normal="0.75m -0.02m 0.66m"
        >
            <div class="annotation">This is a Hand</div>							  
        </button>
    </model-viewer>
</section>
```
You can control the visibility of those Hotspots using the attributes `reveal-hotspot` or `hide-hotspot`.

```html
<span class="fragment">
	<model-viewer-command reveal-hotspot="hotspot-hand, hotspot-helmet" />
</span>
```

```html
<span class="fragment">
	<model-viewer-command hide-hotspot="hotspot-hand, hotspot-helmet" />
</span>
```

Both atttributes take a comma-seperated list of slot names.


### Auto-Rotation
You can add the default attribute `auto-rotate` to start a turntable animation:
```html
<span class="fragment">
	<model-viewer-command auto-rotate />
</span>
```

If you want to stop the animation, you need to set the value of the attribute to 0
```html
<span class="fragment">
	<model-viewer-command auto-rotate="0" />
</span>
```

However, when the rotation stops (either by stopping it manually or because the fragments are reversed), the turntable angle is not reset by default, resulting in rotated model.

If you do not want this behaviour, you can add a `reset-turntable-angle` attribute to your command. This will ensure, that the turntable is put into a defined state when the animation is stopped.

```html
<span class="fragment">
	<model-viewer-command auto-rotate reset-turntable-angle="0" />
</span>
```