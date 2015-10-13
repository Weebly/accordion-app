/**
 * This is required for element rendering to be possible
 * @type {PlatformElement}
 */
(function() {
    var Accordion = PlatformElement.extend({
        initialize: function() {
            this.activeIndex = this.settings.get('active_index');

            this.fixStyles();
            this.setupAccordion();
            this.setOpen();
            this.listenToContentChanges();
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

            this.fixBoxStyleBorders();
        },

        /**
         * Listens to subtree modifications in the content areas
         * and resizes them as needed
         */
        listenToContentChanges: function() {
            /**
             * Setup a mutation observer to listen to dom manipulation events
             */
            var view = this;
            var mutationObserver = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    var $closest = $(mutation.target).closest('.accordion__content');
                    view.resizeContentContainer($closest[0]);
                });
            });

            /**
             * Assign the mutationObserver to each content area
             */
            this.getContent().each(function() {
                mutationObserver.observe($(this)[0], {
                    childList: true,
                    subtree: true
                });
            });
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
            var view = this;
            if (this.activeIndex != '-1') {
                this.getAccordion()
                    .children()
                    .filter(function() {
                        return $(this).data('data-item') == view.activeIndex;
                    })
                    .children()
                    .filter('.accordion__title')
                    .trigger('click');
            }
        },

        /**
         * Simplistic jQuery usage to animate and control which
         * accordion item is currently open
         */
        setupAccordion: function() {
            var view = this;

            this.getTitles().on('touchstart click', function(e) {
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

                    $next.parents('.accordion__content').each(function(index, value) {
                        view.resizeContentContainer(value, null, $next[0].scrollHeight + 20);
                    }.bind(this));
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

        resizeContentContainer: function(contentContainer, e, delta) {
            if (e) {
                e.stopPropagation();
            }
            var max = contentContainer.scrollHeight + 20 + delta;
            $(contentContainer).css({
                'max-height': max + 'px'
            });
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