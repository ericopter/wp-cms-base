<?php 
header('Content-type: text/javascript'); 
include 'tinymce_shortcode_array.php' 
?>(function() {
    
    "use strict";   
 
    tinymce.PluginManager.add( 'ewd_tinymce_shortcodes_plugin', function( editor, url ) {

        editor.addButton( 'ewd_tinymce_shortcodes_select', {
            type: 'listbox',
            text: 'Shortcodes',
            icon: false,
            onselect: function(e) {
            }, 
            values: [
             
            <?php 
                foreach($sc_array as $key => $value) {
                ?>

                    {
                        text: '<?php echo $key; ?>', 
                        onclick : function() {

                            var value = '<?php echo $value ?>';
                            var split_value = value.split('\x00');
                            value = (tinyMCE.activeEditor.selection.getContent() != '') ? split_value[0] + tinyMCE.activeEditor.selection.getContent() + split_value[2] : value;
                            tinyMCE.activeEditor.selection.setContent(value)

                        }
                    },

                <?php
                }
            ?>

            ]
 
        });
 
  });
 
})();