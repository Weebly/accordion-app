/**
 * This is required for element rendering to be possible
 * @type {PlatformElement}
 */
(function() {
    var Accordion = PlatformElement.extend({
        initialize: function() {
            this.activeIndex = this.settings.get('active_index');

            // if we have any iframes, we get an overlay
            this.$el.children('.platform-element-overlay').hide();

            this.fixBoxStyleBorders();
            this.setupAccordion();
            this.setOpen();
        },

        /**
         * Listens to size modifications in the content areas
         * and resizes them as needed
         */
        listenToContentChanges: function() {
            this.currentContent = this.getAccordion()
                .children('[data-item="' + this.settings.get('active_index') +  '"]')
                .children('.accordion__content');
            if (this.currentContent[0]) {
                this.contentInterval = setInterval(function() {
                    if (this.currentContent[0].scrollHeight + 20 != parseInt(this.currentContent.css('max-height'))) {
                        this.currentContent.css('max-height', this.currentContent[0].scrollHeight + 20 + 'px');
                    }
                }.bind(this), 50);
            }
        },

        /**
         * If an index was active when the page was
         * reloaded or refreshed, open it back up
         */
        setOpen: function() {
            /**
             * "NA" is the identifier that no items
             * were open at page load
             */
            this.getAccordion()
                .children('[data-item="' + this.activeIndex +  '"]')
                .children('.accordion__title')
                .trigger('click');
        },

        /**
         * Simplistic jQuery usage to animate and control which
         * accordion item is currently open
         */
        setupAccordion: function() {
            var view = this;

            this.getTitles().on('touchstart click', function(e) {
                clearInterval(view.contentInterval);
                
                // remove "hover" state on touch events
                if (e.type == "touchstart") {
                    view.getAccordion().removeClass('no-touch');
                }

                e.stopPropagation();
                e.preventDefault();

                var isActive = $(this).parent().hasClass('active');
                view.settings.set('active_index', '-1');

                // handles closing
                view.getTitles().each(function() {
                    var $this = $(this);
                    var $next = $(this).next();
                    var eachIsActive = $(this).parent().hasClass('active');

                    $next.css({
                        'max-height': 0 + 'px'
                    });

                    if (eachIsActive) {
                        setTimeout(function() {
                            $this.parent().removeClass('active');
                        }, 250);
                    }
                });

                // handles opening
                if (!isActive) {
                    $(this).parent().addClass('active');
                    var activeIndex = $(this).parent().attr('data-item');
                    view.settings.set('active_index', activeIndex);

                    var $next = $(this).next();
                    $next.css({ 
                        'max-height': $next[0].scrollHeight + 20 + 'px' // 20 to compensate for padding
                    });

                    setTimeout(function() {
                        $(window).resize();
                    }, 250);

                    view.listenToContentChanges();
                }


                view.settings.save();
            });

            this.getTitles().on('touchend', function() {
                this.getAccordion().addClass('no-touch');
            }.bind(this));
        },

        /**
         * When using the 'Box' style, to avoid
         * thick borders on the top and bottom of
         * elements, we just shift all the elements up
         * 'i' pixels. Preferable over doing it through css
         * because all the items need all 4 borders on hover.
         */
        fixBoxStyleBorders: function() {
            var view = this;

            // only do it if the style is 'box'
            if (this.settings.get('style') == 'box') {
                this.getAccordion().filter('.accordion--box').children().each(function(i) {
                    $(this).css({
                        'top': -i
                    });
                });
            }
        },

        // these functions exist so that if there's nested accordions, we don't accidentally select child accordions.
        getAccordion: function() {
            return this.$el.children();
        },

        getTitles: function() {
            return this.$el.children()
                .children()
                .children('.accordion__title');
        },

        getContent: function() {
            return this.$el.children()
                .children()
                .children('.accordion__content');
        }
    });

    return Accordion;
})();
