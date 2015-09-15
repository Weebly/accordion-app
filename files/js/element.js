/**
 * This is required for element rendering to be possible
 * @type {PlatformElement}
 */
(function(){
	// Based on:
	// https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_CSS_animations/Detecting_CSS_animation_support
	function supportsTransitions() {
		var element = document.createElement('div');
		var prefixes = ['Webkit', 'Moz', 'O'];
		if (element.style.animationName !== undefined) {
			return true;
		}
		for (var i = 0; i < prefixes.length; ++i) {
			if (element.style[prefixes[i] + 'AnimationName'] !== undefined) {
				return true;
			}
		}
		return false;
	}

	var MyElement = PlatformElement.extend({
		activeItem: null,
		fixedHeight: true,
		cssTransitions: false,
		fixedItemHeight: '240px',

		events: {
			"click .accordion-item-title": "titleClick"
		},

		initialize: function() {
			this.fixedHeight = this.settings.get('fixed_height');
			this.cssTransitions = supportsTransitions();
		},


		/**
		 * Decide to expand or collapse when user click on a title.
		 *
		 * @param event Used to retrive clicked target.
		 */
		titleClick: function(event) {
			var clickedItem = $(event.currentTarget);
			if (this.activeItem == null) {
				this.expand(clickedItem);
				this.activeItem = clickedItem;
			} else if (this.activeItem && clickedItem[0] != this.activeItem[0]) {
				this.expand(clickedItem);
				this.collapse(this.activeItem);	
				this.activeItem = clickedItem;
			} else {
				this.collapse(clickedItem);
				this.activeItem = null;
			}
		},

		/**
		 * Expand an item.
		 *
		 * @param item
		 */
		expand: function(item) {
			var itemContent = item.next();
			if (this.cssTransitions) {
				item.parent().toggleClass('active');
				if (!this.fixedHeight) {
					itemContent.css('overflow', 'hidden'); // prevent scroll bar from appearing during animation
					itemContent.css('height', itemContent[0].scrollHeight);
					itemContent.css('max-height', itemContent[0].scrollHeight);
				}
			} else {
				if (this.fixedHeight) {
					itemContent.css('max-height', this.fixedItemHeight);
					itemContent.animate({height: this.fixedItemHeight}, 200);
				} else {
					itemContent.css('overflow', 'hidden');
					itemContent.css('max-height', itemContent[0].scrollHeight);
					itemContent.animate({height: itemContent[0].scrollHeight}, 200);
				}
				item.parent().toggleClass('active');
			}
		},

		/**
		 * Collapse an item.
		 *
		 * @param item
		 */
		collapse: function(item) {
			var itemContent = item.next();
			if (this.cssTransitions) {
				item.parent().toggleClass('active');
				if (!this.fixedHeight) {
					itemContent.css('height', 0);
					itemContent.css('max-height', 0);
				}
			} else if (!this.cssTransitions) {
				itemContent.animate({height: '0'}, 200);
				item.parent().toggleClass('active');
			}
		}
	});
	return MyElement;
})();
