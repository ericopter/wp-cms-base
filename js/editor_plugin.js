(
	function(){
	
		tinymce.create(
			"tinymce.plugins.echothemeShortcodes",
			{
				init: function(d,e) {
					abs_url = e;
				},
				createControl:function(d,e)
				{
				
					if(d=="echotheme_shortcodes_button"){
					
						d=e.createMenuButton( "echotheme_shortcodes_button",{
							title:"Insert Theme Shortcodes",
							icons:false,
							image : abs_url + '/../images/icon-e-small.png'
							});
							
							var a=this;d.onRenderMenu.add(function(c,b){
								
								a.addImmediate(b,"Tabs", '[tabs]<br />[tab title="Tab Title"]Content here[/tab]<br />[/tabs]');
								a.addImmediate(b, 'Toggle Content', '[toggle_content title="Read more"]<br>Content Here<br>[/toggle_content]');
								a.addImmediate(b,"Clear", '[clear]');
								a.addImmediate(b,"Horizontal Rule", '[hr]');
								a.addImmediate(b, 'Div', '[div id="" class=""]<br>Content Here<br>[/div]');
								
								b.addSeparator();
								
								// Sliders
								d=b.addMenu({title:"Gallery Sliders"});
									// a.addImmediate(d,"jQuery Cycle", "[jquerycycle]");
									a.addImmediate(d,"Flexslider", "[flexslider]");
									// a.addImmediate(d,"Nivo Slider", "[nivoslider]");
							});
						return d
					
					} // End IF Statement
					
					return null
				},
		
				addImmediate:function(d,e,a){d.add({title:e,onclick:function(){tinyMCE.activeEditor.execCommand( "mceInsertContent",false,a)}})}
				
			}
		);
		
		tinymce.PluginManager.add( "echothemeShortcodes", tinymce.plugins.echothemeShortcodes);
	}
)();