
var ModelViewerPlugin = () => {
    const INITIAL_DATA_ATTRIBUTE_NAME = 'data-initial-state'  
    const MODEL_VIEWER_TAG_NAME = 'model-viewer'  
    const MODEL_VIEWER_COMMAND_TAG_NAME = 'model-viewer-command'

	// The reveal.js instance this plugin is attached to
	let reveal;	

    function setAnnotationVisibility(viewer, value, visible){
        const names = value.split(',');
        for (const name of names){
            const annotation = viewer.querySelector(`[slot="${name.trim()}"]`);
            if (annotation){
                if (visible) annotation.classList.remove('hidden')
                else annotation.classList.add('hidden')
            }
        }
    }

    function afterRemove(viewer, name, value){
        if (name === "reset-turntable-angle"){
            viewer.resetTurntableRotation(+value)
        } else if (name==="reveal-hotspot"){
            setAnnotationVisibility(viewer, value, false);            
        } else if (name==="hide-hotspot"){
            setAnnotationVisibility(viewer, value, true);            
        } 
    }

    function afterChange(viewer, name, value, attributes){  
        if (name==="camera-target"){
            if (value.startsWith('hotspot-')){
                const annotation = viewer.querySelector(`[slot="${value}"]`);
                if (annotation && annotation.hasAttribute('data-position')){
                    viewer.setAttribute(name, annotation.getAttribute('data-position'))
                }
            }
        } else if (name==="reveal-hotspot"){
            setAnnotationVisibility(viewer, value, true);            
        } else if (name==="hide-hotspot"){
            setAnnotationVisibility(viewer, value, false);
        }else if (name==="auto-rotate" && value==="0"){
            viewer.removeAttribute("auto-rotate")
            const reset = attributes['reset-turntable-angle'] 
            if (reset!==undefined && viewer.resetTurntableRotation){
                viewer.resetTurntableRotation(+reset)
            }           
        }
    }

	function onInitFragment(event){
        const viewers = event.slide.querySelectorAll(MODEL_VIEWER_TAG_NAME)
        
        //make sure we capture the initial state of each viewer
        viewers.forEach(viewer => {
            if (!viewer.hasAttribute(INITIAL_DATA_ATTRIBUTE_NAME)){
                const initial = {}				
                for (var i = 0, atts = viewer.attributes, n = atts.length, arr = []; i < n; i++){      
                    if (atts[i].nodeName==='id') continue              
                    initial[atts[i].nodeName] = atts[i].nodeValue;
                }
                
                viewer.setAttribute(INITIAL_DATA_ATTRIBUTE_NAME, JSON.stringify(initial))
            }
        })
    }

    function viewersForElement(event, command){
        return event.slide.querySelectorAll(command.getAttribute(MODEL_VIEWER_TAG_NAME)||MODEL_VIEWER_TAG_NAME)
    }

    function copyData(viewerData, viewer, command){
        for (var i = 0, atts = command.attributes, n = atts.length, arr = []; i < n; i++){
            if (atts[i].nodeName === 'id' || atts[i].nodeName === MODEL_VIEWER_TAG_NAME || atts[i].nodeName===INITIAL_DATA_ATTRIBUTE_NAME) continue;            
            viewerData[viewer.id][atts[i].nodeName] = atts[i].nodeValue;
        }
    }

    

    function collectForFragment(event, lastFragment){
        const viewers = event.slide.querySelectorAll(MODEL_VIEWER_TAG_NAME);
        const viewerData = {};
        
        //get initial values from viewers
        for (const viewer of viewers){
            if (viewer.hasAttribute(INITIAL_DATA_ATTRIBUTE_NAME)){
                viewerData[viewer.id] = JSON.parse(viewer.getAttribute(INITIAL_DATA_ATTRIBUTE_NAME));                
            }
        }
        
        //apply the commands in order
        for (let idx = 0; idx <= lastFragment; idx++){
            const fragments = event.getFragments(idx)
            for(const frag of fragments){
            const commands = frag.querySelectorAll(MODEL_VIEWER_COMMAND_TAG_NAME)
                for(const cmd of commands){
                    const fragmentViewers = viewersForElement(event, cmd);
                    for (const viewer of fragmentViewers){
                        copyData(viewerData, viewer, cmd);
                    }
                }
            }
        }
          
        //set the viewer attributes to reflect the current command state
        for (const viewer of viewers){
            const data = viewerData[viewer.id];
            
            //set attributes that where change in commands
            for (const k of Object.keys(data)){                                                
                if (viewer.getAttribute(k) !== data[k]){
                    viewer.setAttribute(k, data[k])
                    afterChange(viewer, k, data[k], data)
                }
            }

            //remove attributes previously added but not added at this stage
            const removeList = []            
            for (var i = 0, atts = viewer.attributes, n = atts.length; i < n; i++){      
                const name = atts[i].nodeName;
                if (name==='id' || name===INITIAL_DATA_ATTRIBUTE_NAME) continue    
                if (data[name] === undefined) {
                    removeList.push(name)                        
                    
                }
            }            
            removeList.forEach( k => {
                const value = viewer.getAttribute(k)
                viewer.removeAttribute(k)                
                afterRemove(viewer, k, value);
            })
        }    
        
        
    }

    function onFragmentChange(event) {        
        collectForFragment(event, event.fragmentIndex)        
    }

    function hideModelViewerCommands(){
		const css = `${MODEL_VIEWER_COMMAND_TAG_NAME} { display: none; }`,
              head = document.head || document.getElementsByTagName('head')[0],
              style = document.createElement('style');        
        
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));        
        head.appendChild(style);
    }

    function functionAddLoaderHTML(){
		//Have a simplified Fragment container Controller Stage
		const loaders = document.getElementsByTagName('Loading')

        for (const loading of loaders){
            loading.setAttribute('slot', 'poster')
            loading.classList.add("loading-text")
            loading.innerHTML = `<span class="loading-text-words">L</span>
            <span class="loading-text-words">O</span>
            <span class="loading-text-words">A</span>
            <span class="loading-text-words">D</span>
            <span class="loading-text-words">I</span>
            <span class="loading-text-words">N</span>
            <span class="loading-text-words">G</span>`		
        }
	}

    function assignIDs(){   
        const viewers = document.getElementsByTagName(MODEL_VIEWER_TAG_NAME);
        let ct = 0;
        for (const viewer of viewers){
            if (viewer.id===undefined || viewer.id === null || viewer.id===''){
                viewer.id = `${MODEL_VIEWER_TAG_NAME}-${ct}`
            }
            ct++;
        }
	}

	return {
		id: 'modelviewer',

		/**
		 * Starts processing and converting Markdown within the
		 * current reveal.js deck.
		 */
		init: function( revealIn ) {
			reveal = revealIn;

            functionAddLoaderHTML();
            assignIDs();
            hideModelViewerCommands();

			Reveal.on('fragmentevent_init', onInitFragment);
            Reveal.on('fragmentevent_change', onFragmentChange);
		}
	}

};