(function($) {
	$.fn.ewdGallery = function(settings) {
		return this.each(function() {
			new $.echoGallery(this, settings);
		})
	}
	
	$.echoGallery  = function(obj, settings) {
		this.settings = {
			navWrapper 			: $('#gallery-thumbs'),
			slidesWrapper		: $('#gallery-images'),
			easing				: 'easeInOutQuad',
			duration			: 600,
			auto 				: true,
			interval 			: 5000
		}
		
		$.extend( this.settings, settings ||{} );	
		
		this.obj = obj;
		this.slides = this.settings.slidesWrapper.find('li');
		this.currentNo 		= 0;
		
		// exit if we have no slides
		if (!this.slides.length) return;
		
		this.thumbs = this.settings.navWrapper.find('li img');
		
		// preload and run the slideshow
		this.preloadImages();
		
		
	}
	
	// prototype and extend
	$.echoGallery.fn =  $.echoGallery.prototype;
	$.echoGallery.fn.extend =  $.echoGallery.extend = $.extend;
	
	
	// functions
	$.echoGallery.fn.extend({
		
		preloadImages : function(  callback ){
			var self = this;
			var images = this.settings.slidesWrapper.find( 'img' );

			var count = 0;
			images.each( function(index,image){ 
				
				if( !image.complete ){				  
					
					image.onload = function(){
						count++;
						if( count >= images.length ){
							self.onComplete();
						}
					}
					
					image.onerror =function(){ 
						count++;
						if( count >= images.length ){
							self.onComplete();
						}	
					}
					
				} else {
					count++;
					if( count >= images.length ){
						self.onComplete();
					}	
				}
			} );
		},
		
		onComplete : function() {
			
			setTimeout(
				function(){ 
					$('.preload').fadeOut( 900, function(){ $('.preload').remove(); } ); 
				}, 
				400
			);	
			
			this.startUp( );
		},
		
		startUp : function() {
			
			var self = this;
			
			// Display image of thumbnail clicked
			this.thumbs.each(function(index, element) {
				$(element).bind('click', (function() {
					self.showslide(index, true);
				}));
			});
			
			// Pause on hover
			$( this.obj ).hover(
				function(){
					self.stop();	
				}, 
				function(){
					if(	self.settings.auto ){
						self.play( self.settings.interval, 'next', true );		
					}
				} 
			);
			
			// hide all but the first slide
			$(this.slides).css({'opacity':0,'z-index':1}).eq(this.currentNo).css({'opacity':1,'z-index':3});
			
			
			this.play(this.settings.interval, 'next', true);
			
			return this;
		},
		
		play : function(delay, direction, wait) {
			
			this.stop();
			
			if (!wait){ 
				this[direction](false); 
			}
			
			var self  = this;
			
			this.isRun = setTimeout(function() { self[direction](true); }, delay);
			
		},
		
		stop : function(){ 
			
			if (this.isRun == null) return;
			
			clearTimeout(this.isRun);
			
            this.isRun = null;
			
		},
		
		next : function( manual , item){
			
			this.currentNo += (this.currentNo < this.slides.length-1) ? 1 : (1 - this.slides.length);
			this.fxStart( this.currentNo, this ).finishFx( manual );
			
		},
		
		previous : function( manual, item ){
			
			this.currentNo += this.currentNo > 0 ? -1 : this.slides.length - 1;
			this.fxStart( this.currentNo, this ) .finishFx( manual );
			
		},
		
		showslide : function( index, manual ) {
			
			this.stop();
			
			if( this.currentNo == index ) return;

			this.fxStart( index, this ).finishFx( manual );	
			
			this.currentNo = index;
			
		},
		
		fxStart : function( index, currentObj ){
			
			var self = this;

			$(this.slides).stop().animate(
				{
					opacity : 0
				}, 
				{
					duration: this.settings.duration,
					easing:this.settings.easing,
					complete:function(){
						self.slides.css("z-index","1")
						self.slides.eq(index).css("z-index","3");																			}
				} 
			);
			
			$(this.slides).eq(index).stop().animate( 
				{opacity:1}, 
				{ 
					duration : this.settings.duration, 
					easing   :this.settings.easing,
					complete :function() {}
				} 
			);
				
			return this;
			
		},
		
		finishFx:function( manual ){
			
			if( manual ) this.stop();
			if( manual && this.settings.auto ){ 
				this.play( this.settings.interval, 'next', true );
			}
		},
	});
	
	
})(jQuery);