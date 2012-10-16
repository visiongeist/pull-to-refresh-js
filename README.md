# pull-to-refresh.js

This plugin enables a pull-to-refresh functionality in mobile safari for scrollable block elements with native scrolling on iOS (!)

Just create this markup

	<div class="scrollable">
        <div class="wrap">
        	<!-- Your content here -->
        </div>
    </div>

and enable the plugin through passing a callback which returns a promise e.g.

	$('.scrollable').pullToRefresh({
        callback: function() {
            var def = $.Deferred();
            
            setTimeout(function() {
                def.resolve();      
            }, 3000); 

            return def.promise();
        }
    });

Don't forget to include jquery.plugin.pullToRefresh.js and pull-to-refresh.css

Works for iOS5 and newer.

## Links

* [How this works](http://damien.antipa.at/2012/10/16/ios-pull-to-refresh-in-mobile-safari-with-native-scrolling/)
* [Demo](http://damien.antipa.at/demo/pull-to-refresh/example)
* [My blog](http://damien.antipa.at)