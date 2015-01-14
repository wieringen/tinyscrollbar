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
            axis         : 'y'    // Vertical or horizontal scrollbar? ( x || y ).
        ,   wheel        : true   // Enable or disable the mousewheel;
        ,   wheelSpeed   : 40     // How many pixels must the mouswheel scroll at a time.
        ,   wheelLock    : true   // Lock default window wheel scrolling when there is no more content to scroll.
        ,   touchLock    : true   // Lock default window touch scrolling when there is no more content to scroll.
        ,   trackSize    : false  // Set the size of the scrollbar to auto(false) or a fixed number.
        ,   thumbSize    : false  // Set the size of the thumb to auto(false) or a fixed number
        ,   thumbSizeMin : 20     // Minimum thumb size.
        }
    ;

    function Plugin($container, options)
    {
        this.options   = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name     = pluginName;

        var self        = this
        ,   $viewport   = $container.find(".viewport")
        ,   $overview   = $container.find(".overview")
        ,   $scrollbar  = $container.find(".scrollbar")
        ,   $track      = $scrollbar.find(".track")
        ,   $thumb      = $scrollbar.find(".thumb")

        ,   hasTouchEvents = ("ontouchstart" in document.documentElement)
        ,   wheelEvent     = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
                             document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
                             "DOMMouseScroll" // let's assume that remaining browsers are older Firefox
        ,   isHorizontal = this.options.axis === 'x'
        ,   sizeLabel    = isHorizontal ? "width" : "height"
        ,   posiLabel    = isHorizontal ? "left" : "top"

        ,   mousePosition = 0
        ;

        this.contentPosition   = 0;
        this.viewportSize      = 0;
        this.contentSize       = 0;
        this.contentRatio      = 0;
        this.trackSize         = 0;
        this.trackRatio        = 0;
        this.thumbSize         = 0;
        this.thumbPosition     = 0;
        this.hasContentToSroll = 0;

        function initialize()
        {
            self.update();
            setEvents();

            return self;
        }

        this.update = function(scrollTo)
        {
            var sizeLabelCap       = sizeLabel.charAt(0).toUpperCase() + sizeLabel.slice(1).toLowerCase();
            this.viewportSize      = $viewport[0]['offset'+ sizeLabelCap];
            this.contentSize       = $overview[0]['scroll'+ sizeLabelCap];
            this.contentRatio      = this.viewportSize / this.contentSize;
            this.trackSize         = this.options.trackSize || this.viewportSize;
            this.thumbSize         = Math.min(this.trackSize, Math.max(this.options.thumbSizeMin, (this.options.thumbSize || (this.trackSize * this.contentRatio))));
            this.trackRatio        = (this.contentSize - this.viewportSize) / (this.trackSize - this.thumbSize);
            this.hasContentToSroll = this.contentRatio < 1;

            $scrollbar.toggleClass("disable", !this.hasContentToSroll);

            switch (scrollTo)
            {
                case "bottom":
                    this.contentPosition = Math.max(this.contentSize - this.viewportSize, 0);
                    break;

                case "relative":
                    this.contentPosition = Math.min(Math.max(this.contentSize - this.viewportSize, 0), Math.max(0, this.contentPosition));
                    break;

                default:
                    this.contentPosition = parseInt(scrollTo, 10) || 0;
            }

            this.thumbPosition = this.contentPosition / this.trackRatio;

            setCss();

            return self;
        };

        function setCss()
        {
            $thumb.css(posiLabel, self.thumbPosition);
            $overview.css(posiLabel, -self.contentPosition);
            $scrollbar.css(sizeLabel, self.trackSize);
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

                        start(event.touches[0]);
                    }
                };
            }
            else
            {
                $thumb.bind("mousedown", function(event){
                    event.stopPropagation();
                    start(event);
                });
                $track.bind("mousedown", function(event){
                    start(event, true);
                });
            }

            $(window).resize(function()
            {
                self.update("relative");
            });

            if(self.options.wheel && window.addEventListener)
            {
                $container[0].addEventListener(wheelEvent, wheel, false);
            }
            else if(self.options.wheel)
            {
                $container[0].onmousewheel = wheel;
            }
        }

        function isAtBegin()
        {
            return self.contentPosition > 0;
        }

        function isAtEnd()
        {
            return self.contentPosition <= (self.contentSize - self.viewportSize) - 5;
        }

        function start(event, gotoMouse)
        {
            if(self.hasContentToSroll)
            {
                $("body").addClass("noSelect");

                mousePosition = gotoMouse ? $thumb.offset()[posiLabel] : (isHorizontal ? event.pageX : event.pageY);

                if(hasTouchEvents)
                {
                    document.ontouchmove = function(event)
                    {
                        if(self.options.touchLock || isAtBegin() && isAtEnd())
                        {
                            event.preventDefault();
                        }
                        drag(event.touches[0]);
                    };
                    document.ontouchend = end;
                }
                else
                {
                    $(document).bind("mousemove", drag);
                    $(document).bind("mouseup", end);
                    $thumb.bind("mouseup", end);
                    $track.bind("mouseup", end);
                }

                drag(event);
            }
        }

        function wheel(event)
        {
            if(self.hasContentToSroll)
            {
                // Trying to make sense of all the different wheel event implementations..
                //
                var evntObj         = event || window.event;
                
                //Get the wheelDelta
                var wheelDelta = 0;
                var deltaAxis = 'delta'+self.options.axis.toUpperCase();
                if(typeof(evntObj[deltaAxis]) !== 'undefined')
                {
                    //If the current deltaAxis is equal to 0, prioritize the deltaY (for mouse without X axis wheel)
                    wheelDelta = !evntObj[deltaAxis] ? evntObj.deltaY:evntObj[deltaAxis];
                }
                else if(typeof(evntObj.detail) !== 'undefined')
                {
                    wheelDelta = evntObj.detail;
                }
                else if(typeof(evntObj.wheelDelta) !== 'undefined')
                {
                    wheelDelta = (-1 / 3 * evntObj.wheelDelta);
                }
                
                var wheelSpeedDelta = -wheelDelta / 40
                ,   multiply        = (evntObj.deltaMode === 1) ? self.options.wheelSpeed : 1
                ;

                self.contentPosition -= wheelDelta * multiply * self.options.wheelSpeed;
                self.contentPosition = Math.min((self.contentSize - self.viewportSize), Math.max(0, self.contentPosition));
                self.thumbPosition   = self.contentPosition / self.trackRatio;

                $container.trigger("move");

                $thumb.css(posiLabel, self.thumbPosition);
                $overview.css(posiLabel, -self.contentPosition);

                if(self.options.wheelLock || isAtBegin() && isAtEnd())
                {
                    evntObj = $.event.fix(evntObj);
                    evntObj.preventDefault();
                }
            }
        }

        function drag(event)
        {
            if(self.hasContentToSroll)
            {
                var mousePositionNew   = isHorizontal ? event.pageX : event.pageY
                ,   thumbPositionDelta = hasTouchEvents ? (mousePosition - mousePositionNew) : (mousePositionNew - mousePosition)
                ,   thumbPositionNew   = Math.min((self.trackSize - self.thumbSize), Math.max(0, self.thumbPosition + thumbPositionDelta))
                ;

                self.contentPosition = thumbPositionNew * self.trackRatio;

                $container.trigger("move");

                $thumb.css(posiLabel, thumbPositionNew);
                $overview.css(posiLabel, -self.contentPosition);
            }
        }

        function end()
        {
            self.thumbPosition = parseInt($thumb.css(posiLabel), 10) || 0;

            $("body").removeClass("noSelect");
            $(document).unbind("mousemove", drag);
            $(document).unbind("mouseup", end);
            $thumb.unbind("mouseup", end);
            $track.unbind("mouseup", end);
            document.ontouchmove = document.ontouchend = null;
        }

        return initialize();
    }

    $.fn[pluginName] = function(options)
    {
        return this.each(function()
        {
            if(!$.data(this, "plugin_" + pluginName))
            {
                $.data(this, "plugin_" + pluginName, new Plugin($(this), options));
            }
        });
    };
}));
