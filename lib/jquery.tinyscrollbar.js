;(function (factory)
{
    if (typeof define === 'function' && define.amd)
    {
        define(['jquery'], factory);
    }
    else if (typeof exports === 'object')
    {
        factory(require('jquery'));
    }
    else
    {
        factory(jQuery);
    }
}
(function ($)
{
    "use strict";

    var pluginName = "tinyscrollbar"
    ,   defaults   =
        {
            axis: 'y'            // Vertical or horizontal scrollbar? ( x || y ).
        ,   wheel: true          // Enable or disable the mousewheel;
        ,   wheelSpeed: 40       // How many pixels must the mouswheel scroll at a time.
        ,   wheelLock: true      // Lock default scrolling window when there is no more content.
        ,   scrollInvert: false  // Enable invert style scrolling
        ,   trackSize: false     // Set the size of the scrollbar to auto or a fixed number.
        ,   thumbSize: false     // Set the size of the thumb to auto or a fixed number.

        ,   prefix: ''           // wrapper CSS class prefix.
        ,   resizeUpdate: false  // Update scrollbar on window resize.
        ,   scrollCallback: null // Callback after each time it was scrolled.
        ,   scrollTo: 'relative' // Default type of scrolling when updated. If "false" disabled.
        ,   thumbSizeMin: 20     // Set the min size of thumb.
        };

    function Plugin($container, options)
    {
        this.options   = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name     = pluginName;
        this._className= this.options.prefix + 'scrollbar';

        // Wrappers & Blocks
        if (!$container.hasClass(this._className)) {
            $container.addClass(this._className);
        }

        var self = this
        ,   $viewport
        ,   $overview
        ,   $scrollbar
        ,   $track
        ,   $thumb

        ,   mousePosition = 0

        ,   isHorizontal   = this.options.axis === 'x'
        ,   hasTouchEvents = ("ontouchstart" in document.documentElement)
        ,   wheelEvent     = ("onwheel" in document || document.documentMode >= 9) ? "wheel" :
                             (document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll")

        ,   sizeLabel = isHorizontal ? "width" : "height"
        ,   posiLabel = isHorizontal ? "left" : "top"
        ;

        this.contentPosition = 0;
        this.viewportSize    = 0;
        this.contentSize     = 0;
        this.contentRatio    = 0;
        this.trackSize       = 0;
        this.trackRatio      = 0;
        this.thumbSize       = 0;
        this.thumbPosition   = 0;

        function initialize()
        {
            return self.update();
        }

        this.render = function()
        {
            if (!$container.children(".scroll").length) {
                var height = $container.height() || $container.parent().height();

                // Scroll is disabled by default, for cases when can't determine size of hidden, etc.
                $container
                    .wrapInner('<div class="overview">')
                    .wrapInner('<div class="viewport" style="height:' + height + 'px;">')
                    .prepend('<div class="scroll disable"><div class="track"><div class="thumb"><div class="end"></div></div></div></div>');
            }

            $viewport  = $container.children(".viewport");
            $overview  = $viewport.children(".overview");
            $scrollbar = $container.children(".scroll");
            $track     = $scrollbar.children(".track");
            $thumb     = $track.children(".thumb");

            return this;
        };

        this.update = function(scrollTo)
        {
            this.render();

            var sizeLabelCap  = sizeLabel.charAt(0).toUpperCase() + sizeLabel.slice(1).toLowerCase(),
                contentSize   = $overview.prop('scroll' + sizeLabelCap);

            // For the case when can't determine the size of content (e.g. when hidden)
            // - just don't change anything in this case
            if (!contentSize) {
                return self;
            }

            this.contentSize  = contentSize;
            this.viewportSize = $container[sizeLabel]();
            this.contentRatio = this.viewportSize / this.contentSize;
            this.trackSize    = this.options.trackSize || this.viewportSize;
            this.thumbSize    = Math.min(this.trackSize, Math.max(this.options.thumbSizeMin, (this.options.thumbSize || (this.trackSize * this.contentRatio))));
            this.trackRatio   = this.options.thumbSize ? (this.contentSize - this.viewportSize) / (this.trackSize - this.thumbSize) : (this.contentSize / this.trackSize);

            $scrollbar.toggleClass("disable", (this.contentRatio >= 1) || !this.contentSize);

            if (typeof scrollTo === "undefined") {
                scrollTo = this.options.scrollTo;
            }

            switch (scrollTo)
            {
                case "top":
                    this.contentPosition = 0;
                    break;

                case "bottom":
                    this.contentPosition = this.contentSize - this.viewportSize;
                    break;

                case "relative":
                    this.contentPosition = Math.min(this.contentSize - this.viewportSize, Math.max(0, this.contentPosition));
                    break;

                default:
                    this.contentPosition = (this.contentRatio >= 1 ? 0 : (parseInt(scrollTo, 10) || 0));
            }

            setSize();
            setEvents();

            return self;
        };

        function setSize()
        {
            $thumb.css(posiLabel, self.contentPosition / self.trackRatio);
            $overview.css(posiLabel, -self.contentPosition);
            $scrollbar.css(sizeLabel, self.trackSize);
            $viewport.css(sizeLabel, self.trackSize);
            $track.css(sizeLabel, self.trackSize);
            $thumb.css(sizeLabel, self.thumbSize);
        }

        function setEvents()
        {
            if(hasTouchEvents)
            {
                $viewport[0].ontouchstart = function(event)
                {
                    if(1 === event.touches.length)
                    {
                        event.stopPropagation();
                        start(event.touches[0], true);
                    }
                };
            }
            else
            {
                $thumb.on("mousedown", start);
                $track.on("mousedown", drag);
            }

            // Window resize event update() call
            if(self.options.resizeUpdate) {
                $(window).resize(function()
                {
                    self.update(self.options.scrollTo);
                });
            }

            if(self.options.wheel && window.addEventListener)
            {
                $container[0].addEventListener(wheelEvent, wheel, false);
            }
            else if(self.options.wheel)
            {
                $container[0].onmousewheel = wheel;
            }
        }

        function start(event, isTouch)
        {
            // For nested scrollbars
            if(!isTouch) {
                event.stopPropagation();
            }

            $("body").addClass("noSelect");

            mousePosition      = isHorizontal ? event.pageX : event.pageY;
            self.thumbPosition = parseInt($thumb.css(posiLabel), 10) || 0;

            if(hasTouchEvents)
            {
                document.ontouchmove = function(event)
                {
                    event.preventDefault();
                    event.stopPropagation();
                    drag(event.touches[0]);
                };
                document.ontouchend = end;
            }
            else
            {
                $(document).on("mousemove", drag);
                $(document).on("mouseup", end);
                $thumb.on("mouseup", end);
            }
        }

        function wheel(event)
        {
            // For nested scrollbars
            if(!isTouch) {
                event.stopPropagation();
            }

            if(self.contentRatio < 1)
            {
                var evntObj         = event || window.event
                ,   deltaDir        = "delta" + self.options.axis.toUpperCase()
                ,   wheelSpeedDelta = -(evntObj[deltaDir] || evntObj.detail || (-1 / 3 * evntObj.wheelDelta)) / 40
                ;

                self.contentPosition -= wheelSpeedDelta * self.options.wheelSpeed;
                self.contentPosition = Math.min((self.contentSize - self.viewportSize), Math.max(0, self.contentPosition));

                $container.trigger("move");

                $thumb.css(posiLabel, self.contentPosition / self.trackRatio);
                $overview.css(posiLabel, -self.contentPosition);

                if(self.options.wheelLock || (self.contentPosition !== (self.contentSize - self.viewportSize) && self.contentPosition !== 0))
                {
                    evntObj = $.event.fix(evntObj);
                    evntObj.preventDefault();
                }

                // Wheel callback
                if (typeof self.options.scrollCallback === 'function')
                {
                    self.options.scrollCallback(self.contentPosition);
                }
            }
        }

        function drag(event)
        {
            if(self.contentRatio < 1)
            {
                var mousePositionNew   = isHorizontal ? event.pageX : event.pageY
                ,   thumbPositionDelta = mousePositionNew - mousePosition
                ;

                if(self.options.scrollInvert && hasTouchEvents)
                {
                    thumbPositionDelta = mousePosition - mousePositionNew;
                }

                var thumbPositionNew = Math.min((self.trackSize - self.thumbSize), Math.max(0, self.thumbPosition + thumbPositionDelta));
                self.contentPosition = thumbPositionNew * self.trackRatio;

                $container.trigger("move");

                $thumb.css(posiLabel, thumbPositionNew);
                $overview.css(posiLabel, -self.contentPosition);
            }
        }

        function end()
        {
            $("body").removeClass("noSelect");
            $(document).unbind("mousemove", drag);
            $(document).unbind("mouseup", end);
            $thumb.unbind("mouseup", end);
            document.ontouchmove = document.ontouchend = null;

            // End scroll callback
            if (typeof self.options.scrollCallback === 'function')
            {
                self.options.scrollCallback(self.contentPosition);
            }
        }

        return initialize();
    }

    $.fn[pluginName] = function(options)
    {
        return this.each(function()
        {
            var $plugin = $.data(this, "plugin_" + pluginName);

            if($plugin) {
                $plugin.update();
            } else {
                $.data(this, "plugin_" + pluginName, new Plugin($(this), options));
            }
        });
    };

    $.fn[pluginName + 'Update'] = function(scrollTo)
    {
        var $wrapper = $(this),
            $plugin = $wrapper.data("plugin_" + pluginName);

        return $plugin ? $plugin.update(scrollTo) : $wrapper[pluginName]();
    };
}));
