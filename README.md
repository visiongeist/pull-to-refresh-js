# pull-to-refresh.js

This plugin enables a pull-to-refresh functionality in all touch browsers for scrollable block elements

Just create this markup

```html
<div class="ptr-wrapper">
    <div class="ptr-scrollable">
        <div class="ptr-wrap">
        	<!-- Your content here -->
        </div>
    </div>
</div>
```

and enable the plugin through passing a callback which returns a promise e.g.

```javascript
$('.scrollable').pullToRefresh({
    callback: function() {
        var def = $.Deferred();
        
        // do stuff here (ajax request etc.), or fake it with a timeout ...
        setTimeout(function() {
            def.resolve();
        }, 3000); 

        return def.promise();
    }
});
```

Don't forget to include `jquery.plugin.pullToRefresh.js` and `pull-to-refresh.css`  
and `requestAnimationFrame.js` if you don't already have anything that ensures there's a `window.requestAnimationFrame`

