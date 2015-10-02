/**
 * This is required for element rendering to be possible
 * @type {PlatformElement}
 */
(function() {
    var Accordion = PlatformElement.extend({
        initialize: function() {
            this.fixStyles();
            this.setupAccordion();
            this.fixBoxStyleBorders();
        },

        /**
         * Styles are applied by default to editable areas of
         * the editor. To make the element looks how you want, some styles
         * need to be overwritten.
         *
         * Classes that are used are:
         *      - .editable-text
         *      - .paragraph
         *      - .ui-wrapper
         *      - .wsite-image
         *      - .wsite-*
         *      - (etc...)
         */
        fixStyles: function() {
            this.$el.find('.editable-text').each(function(index) {
                $(this).attr('style', '');
            });

            this.$el.find('.element').each(function(index) {
                $(this).attr('style', '');
            });
        },

        /**
         * Simplistic jquery usage to animate and control which
         * accordion item is currently open.
         */
        setupAccordion: function() {
            var view = this;

            this.$el.find('.accordion__title').on('touchstart click', function(e) {
                // remove "hover" state on touch events
                if(e.type == "touchstart") {
                    view.$el.find('.accordion').removeClass('no-touch');
                }

                e.stopPropagation();
                e.preventDefault();
                
                var isActive = $(this).parent().hasClass('active');

                // handles closing
                view.$el.find('.accordion__title').each(function() {
                    var $this = $(this);
                    var $next = $(this).next();
                    var eachIsActive = $(this).parent().hasClass('active');

                    $next.css({
                        'max-height': 0 + 'px'
                    });
                    if(eachIsActive) {
                        setTimeout(function() {
                            $this.parent().removeClass('active');
                        }, 250);
                    }
                });

                // handles opening
                if (!isActive) {
                    $(this).parent().addClass('active');
                    var $next = $(this).next();

                    $next.css({
                        'max-height': $next[0].scrollHeight + 20 + 'px' // 20 to compensate for padding
                    });
                }
            });

            this.$el.find('.accordion__title').on('touchend', function() {
                view.$el.find('.accordion').addClass('no-touch');
            });
        },

        /**
         * When using the 'Box' style, to avoid
         * thick borders on the top and bottom of
         * elements, we just shift all the elements up
         * 'i' pixels. Preferable over doing it through css
         * becuse all the items need all 4 borders on hover.
         */
        fixBoxStyleBorders: function() {
            var view = this;

            // only do it if the style is 'box'
            if (this.settings.get('style') == 'box') {
                this.$el.find('.accordion--box .accordion__item').each(function(i) {
                    $(this).css({
                        'top': -i
                    });
                });
            }
        }
    });

    return Accordion;
})();