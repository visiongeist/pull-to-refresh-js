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
            html = '<div class="ptr-pull-to-refresh">' +
                '<div class="ptr-icon"></div>' +
                '<div class="ptr-message">' +
                    '<i class="ptr-arrow"></i>' +
                    '<i class="ptr-spinner large"></i>' +
                    '<span class="ptr-pull">' + cfg.message.pull + '</span>' +
                    '<span class="ptr-release">' + cfg.message.release + '</span>' +
                    '<span class="ptr-loading">' + cfg.message.loading + '</span>' +
                  '</div>' +
                '</div>';



        return this.each(function() {
            if (!isTouch) {
                return;
            }

            var e = $(this).prepend(html),
                s = e.find('.ptr-scrollable'),
                content = e.find('.ptr-wrap'),
                ptr = e.find('.ptr-pull-to-refresh'),
                arrow = e.find('.ptr-arrow'),
                spinner = e.find('.ptr-spinner'),
                pull = e.find('.ptr-pull'),
                release = e.find('.ptr-release'),
                loading = e.find('.ptr-loading'),
                ptrHeight = ptr.outerHeight(),
                arrowDelay = ptrHeight / 3 * 2,
                isActivated = false,
                isScrolling = false,
                isPulling = false,
                isLoading = false;

            var sy = null,
                y  = null,
                dy = null,
                py = 0,
                yy = 0,
                top = null,
                deg = null;
            var ptop = -ptrHeight,
                ctop = 0;

            var draw = function() {
                if (y !== null) {
                    requestAnimationFrame(draw);
                }

                var ty = Math.max(yy, 0);
                ptr.css('-webkit-transform', 'translateY(' + (ty) + 'px)');
                s.css('-webkit-transform', 'translateY(' + (ty) + 'px)');
                arrow.css('-webkit-transform', 'rotate('+ deg + 'deg)');
            };

            s.on('touchstart', function (ev) {
                var touch = ev.originalEvent.touches[0] || ev.originalEvent.changedTouches[0];

                sy = touch.screenY;
                y  = sy;
                dy = 0;

                draw();

            }).on('touchmove', function (ev) {
                var touch = ev.originalEvent.touches[0] || ev.originalEvent.changedTouches[0];

                if (s.scrollTop() > 0) {
                    isScrolling = true;
                    return;
                }

                if (isScrolling) {
                    isScrolling = false;
                    sy = touch.screenY;
                    y  = sy;
                    dy = 0;
                }

                y  = touch.screenY;
                dy = y - sy;
                yy = py + dy;

                if (!isPulling) {
                    isPulling = true;

                    release.hide();
                    loading.hide();
                    pull.show();
                    arrow.show();
                    spinner.hide();
                }

                if (yy <= 0) {
                    return;
                }

                ev.preventDefault();

                if (!isLoading) {
                    top = yy * -1;
                    if (top < -ptrHeight) {
                        deg = 0;
                    } else {
                        if (top < -arrowDelay) {
                            deg = 180 - Math.round(180 / (ptrHeight - arrowDelay) * (-top - arrowDelay));
                        } else {
                            deg = 180;
                        }
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
                }
            }).on('touchend', function(ev) {

                var touch = ev.originalEvent.touches[0] || ev.originalEvent.changedTouches[0];

                y  = touch.screenY;
                dy = y - sy;
                yy = py + dy;

                if (isActivated || isLoading) {
                    y = null, sy = null;
                    yy = Math.min(yy, ptrHeight);
                    yy = yy > 0 ? ptrHeight : 0;
                    py = yy;

                    if (isLoading) {
                        return;
                    }

                    isLoading = true;
                    isActivated = false;

                    release.hide();
                    loading.show();
                    pull.hide();
                    arrow.hide();
                    spinner.show();

                    cfg.callback().done(function() {
                        isPulling = false;
                        isLoading = false;
                        ptr.css('-webkit-transform', 'translateY(' + (0) + 'px)');
                        s.css('-webkit-transform', 'translateY(' + (0) + 'px)');
                        dy = null, py = null, yy = null;
                    });
                } else {
                    y = null, sy = null, dy = null, py = null, yy = null;

                    ptr.css('-webkit-transform', 'translateY(' + (0) + 'px)');
                    s.css('-webkit-transform', 'translateY(' + (0) + 'px)');
                }
            });
        });

    };
})( jQuery );
