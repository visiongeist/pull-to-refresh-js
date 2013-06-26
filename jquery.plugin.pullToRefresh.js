/**
 * pull to refresh
 *
* based off jquery.plugin.pullToRefresh.js (iOS only) by Damien Antipa
*/
(function( $ ){

	$.fn.pullToRefresh = function( options ) {

		var isTouch = !!('ontouchstart' in window),
			cfg = $.extend(true, {
			  message: {
				pull: 'Pull to refresh',
				release: 'Release to refresh',
				loading: 'Loading'
				}
			}, options),
			html = '<div class="pull-to-refresh">' +
				'<div class="icon"></div>' +
				'<div class="message">' +
					'<i class="arrow"></i>' +
					'<i class="spinner large"></i>' +
					'<span class="pull">' + cfg.message.pull + '</span>' +
					'<span class="release">' + cfg.message.release + '</span>' +
					'<span class="loading">' + cfg.message.loading + '</span>' +
				  '</div>' +
				'</div>';



		return this.each(function() {
			if (!isTouch) {
				return;
			}

			var e = $(this).prepend(html),
				content = e.find('.wrap'),
				ptr = e.find('.pull-to-refresh'),
				arrow = e.find('.arrow'),
				spinner = e.find('.spinner'),
				pull = e.find('.pull'),
				release = e.find('.release'),
				loading = e.find('.loading'),
				ptrHeight = ptr.outerHeight(),
				arrowDelay = ptrHeight / 3 * 2,
				isActivated = false,
				isLoading = false;

			var sy = null,
			    y  = null,
			    dy = null,
			    top = null,
			    deg = null;
			var ptop = -ptrHeight,
			    ctop = 0;

			var draw = function() {
                if (y !== null) {
                    requestAnimationFrame(draw);
                }

                var ty = Math.max(dy, 0);
                ptr.css('-webkit-transform', 'translateY(' + (ty) + 'px)');
                content.css('-webkit-transform', 'translateY(' + (ty) + 'px)');
                arrow.css('-webkit-transform', 'rotate('+ deg + 'deg)');
			};

			content.on('touchstart', function (ev) {
	            var touch = ev.originalEvent.touches[0] || ev.originalEvent.changedTouches[0];

	            sy = touch.screenY;
	            y  = sy;
	            dy = 0;

                release.hide();
                loading.hide();
                pull.show();
                arrow.show();
                spinner.hide();

	            draw();

			}).on('touchmove', function (ev) {
                var touch = ev.originalEvent.touches[0] || ev.originalEvent.changedTouches[0];

                if (content.scrollTop() > 0) {
			        return;
			    }

                y  = touch.screenY;
                dy = y - sy;
                dy = Math.min(dy, ptrHeight);
				top = dy * -1;

                if (dy <= 0) {
                    return;
                }

                ev.preventDefault();

				if (top < -ptrHeight) {
				    deg = 0;
				} else {
				    if (top < -arrowDelay) {
				        deg = 180 - Math.round(180 / (ptrHeight - arrowDelay) * (-top - arrowDelay));
				    } else {
				        deg = 180;
				    }
				}

				if (isLoading) { // if is already loading -> do nothing
					return true;
				}

				if (-top >= ptrHeight && !isActivated) { // release state
	                release.show();
	                loading.hide();
	                pull.hide();

					isActivated = true;
				} else if (top > -ptrHeight && isActivated) { // pull state
                    release.hide();
                    loading.hide();
                    pull.show();

					isActivated = false;
				}
			}).on('touchend', function(ev) {

                var touch = ev.originalEvent.touches[0] || ev.originalEvent.changedTouches[0];

                y  = touch.screenY;
                dy = y - sy;
                dy = Math.min(dy, ptrHeight * 2);

				if (isActivated) { // loading state
				    y = null, sy = null, dy = ptrHeight;

					isLoading = true;
					isActivated = false;

                    release.hide();
                    loading.show();
                    pull.hide();
					arrow.hide();
					spinner.show();

					cfg.callback().done(function() {
					    isLoading = false;
	                    ptr.css('-webkit-transform', 'translateY(' + (0) + 'px)');
	                    content.css('-webkit-transform', 'translateY(' + (0) + 'px)');
	                    dy = null;
					});
				} else {
                    y = null, sy = null, dy = null;

                    ptr.css('-webkit-transform', 'translateY(' + (0) + 'px)');
                    content.css('-webkit-transform', 'translateY(' + (0) + 'px)');
				}
			});
		});

	};
})( jQuery );
