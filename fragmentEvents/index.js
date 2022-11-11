var FragmentEvents = () => {

	// The reveal.js instance this plugin is attached to
	let reveal;	

	

    function eventProcessor(event){
		const slide = reveal.getCurrentSlide();
		const idx = reveal.getState().indexf;
		const fragmentState = slide.hasAttribute('data-fragment-event-state')?+slide.getAttribute('data-fragment-event-state'):-2;
		
		const showFragments = fragmentState<=idx				
		
		const fragmentIndices = []
		const fragmentIndicesHide = []
		if (showFragments){
			for (let i=fragmentState+1; i<=idx; i++){
				fragmentIndices.push(i);
			}												
		} else {
			fragmentIndices.push(idx)
			for (let i=fragmentState; i>idx; i--){
				fragmentIndicesHide.push(i);
			}
		}
		const data = {
			getFragment:(idx) => slide.querySelector(`[data-fragment-index="${idx}"]`),
			getFragments:(idx) => slide.querySelectorAll(`[data-fragment-index="${idx}"]`),
			setData:(name, data) => slide.setAttribute(`data-fe-${name}`, data),
			getData:(name) => slide.getAttribute(`data-fe-${name}`),
			hasData:(name) => slide.hasAttribute(`data-fe-${name}`),
			slide:slide
		}

		console.log(`idx: ${idx}, last:${fragmentState}, show:${fragmentIndices}, hide:${fragmentIndicesHide}, attr:${slide.getAttribute('data-fragment-event-state')}`);		
		if (fragmentState===-2){
			reveal.dispatchEvent({
				type:'fragmentevent_init',
				data:data
			})
		}
		if (fragmentIndices.length>0 || fragmentIndicesHide.length>0 ){
			reveal.dispatchEvent({
				type:'fragmentevent_change',
				data:{
					...data,
					showFragments:fragmentIndices,
					hideFragments:fragmentIndicesHide,
					lastActiveFragment:fragmentState,
					fragmentIndex:idx
				}
			})
		}
		
		slide.setAttribute('data-fragment-event-state', idx)
    }

	function convertFragmentContainers(){
		//Have a simplified Fragment container Controller Stage
		const fragments = document.getElementsByTagName('Fragment')
		for (const el of fragments) {
			el.classList.add("fragment")
		}
	}

	return {
		id: 'fragmentevents',

		/**
		 * Starts processing and converting Markdown within the
		 * current reveal.js deck.
		 */
		init: function( revealIn ) {
			reveal = revealIn;
			
			convertFragmentContainers();

            revealIn.on( 'ready', eventProcessor );
			revealIn.on( 'slidechanged', eventProcessor);
			revealIn.on( 'fragmentshown', eventProcessor);
			revealIn.on( 'fragmenthidden', eventProcessor );
		}
	}

};