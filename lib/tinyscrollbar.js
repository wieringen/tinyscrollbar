;(function(window, undefined)
{
    "use strict";

    function extend()
    {
        for(var i=1; i < arguments.length; i++)
        {
            for(var key in arguments[i])
            {
                if(arguments[i].hasOwnProperty(key))
                {
                    arguments[0][key] = arguments[i][key];
                }
            }
        }
        return arguments[0];
    }

    var pluginName = "tinyscrollbar"
    ,   defaults   =
        {
            axis         : 'y'    // Vertical or horizontal scrollbar? ( x || y ).
        ,   wheel        : true   // Enable or disable the mousewheel;
        ,   wheelSpeed   : 40     // How many pixels must the mouswheel scroll at a time.
        ,   wheelLock    : true   // Lock default window wheel scrolling when there is no more content to scroll.
        ,   touchLock    : true   // Lock default window touch scrolling when there is no more content to scroll.        ,   scrollInvert : false  // Enable invert style scrolling
        ,   trackSize    : false  // Set the size of the scrollbar to auto(false) or a fixed number.
        ,   thumbSize    : false  // Set the size of the thumb to auto(false) or a fixed number.
        ,   thumbSizeMin : 20     // Minimum thumb size.
        }
    ;

    function Plugin($container, options)
    {
        this.options   = extend({}, defaults, options);
        this._defaults = defaults;
        this._name     = pluginName;

        var self        = this
        ,   $body       = document.querySelectorAll("body")[0]
        ,   $viewport   = $container.querySelectorAll(".viewport")[0]
        ,   $overview   = $container.querySelectorAll(".overview")[0]
        ,   $scrollbar  = $container.querySelectorAll(".scrollbar")[0]
        ,   $track      = $scrollbar.querySelectorAll(".track")[0]
        ,   $thumb      = $scrollbar.querySelectorAll(".thumb")[0]

        ,   mousePosition  = 0
        ,   isHorizontal   = this.options.axis === 'x'
        ,   hasTouchEvents = ("ontouchstart" in document.documentElement)
        ,   wheelEvent     = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
                             document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
                             "DOMMouseScroll" // let's assume that remaining browsers are older Firefox

        ,   sizeLabel = isHorizontal ? "width" : "height"
        ,   posiLabel = isHorizontal ? "left" : "top"
        ,   moveEvent = document.createEvent("HTMLEvents")
        ;

        moveEvent.initEvent("move", true, true);

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
            self.update();
            setEvents();

            return self;
        }

        this.update = function(scrollTo)
        {
            var sizeLabelCap   = sizeLabel.charAt(0).toUpperCase() + sizeLabel.slice(1).toLowerCase();
            this.viewportSize  = $viewport['offset'+ sizeLabelCap];
            this.contentSize   = $overview['scroll'+ sizeLabelCap];
            this.contentRatio  = this.viewportSize / this.contentSize;
            this.trackSize     = this.options.trackSize || this.viewportSize;
            this.thumbSize     = Math.min(this.trackSize, Math.max(this.options.thumbSizeMin, (this.options.thumbSize || (this.trackSize * this.contentRatio))));
            this.trackRatio    = (this.contentSize - this.viewportSize) / (this.trackSize - this.thumbSize);

            var scrcls = $scrollbar.className;
            if(this.contentRatio >= 1)
            {
                if($scrollbar.className.indexOf('disable') == -1)
                {
                    $scrollbar.className = scrcls + " disable";
                }
            }
            else
            {
                $scrollbar.className = scrcls.replace(/disable/g, "");
            }
            switch (scrollTo)
            {
                case "bottom":
                    this.contentPosition = Math.max(this.contentSize - this.viewportSize, 0);
                    break;

                case "relative":
                    this.contentPosition = Math.min(this.contentSize - this.viewportSize, Math.max(0, this.contentPosition));
                    break;

                default:
                    this.contentPosition = parseInt(scrollTo, 10) || 0;
            }

            this.thumbPosition = self.contentPosition / self.trackRatio;

            setCss();
        };

        function setCss()
        {
            $thumb.style[posiLabel] = self.thumbPosition + "px";
            $overview.style[posiLabel] = -self.contentPosition + "px";
            $scrollbar.style[sizeLabel] = self.trackSize + "px";
            $track.style[sizeLabel] = self.trackSize + "px";
            $thumb.style[sizeLabel] = self.thumbSize + "px";
        }

        function setEvents()
        {
            if(hasTouchEvents)
            {
                $viewport.ontouchstart = function(event)
                {
                    if(1 === event.touches.length)
                    {
                        start(event.touches[0]);
                        event.stopPropagation();
                    }
                };
            }
            else
            {
                $thumb.onmousedown = function(event)
                {
                    event.stopPropagation();
                    start(event);
                };

                $track.onmousedown = function(event)
                {
                    start(event, true);
                };
            }

            window.addEventListener("resize", function()
            {
               self.update("relative");
            }, true);

            if(self.options.wheel && window.addEventListener)
            {
                $container.addEventListener(wheelEvent, wheel, false );
            }
            else if(self.options.wheel)
            {
                $container.onmousewheel = wheel;
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
            var posiLabelCap = posiLabel.charAt(0).toUpperCase() + posiLabel.slice(1).toLowerCase();
            mousePosition    = gotoMouse ? $thumb.getBoundingClientRect()[posiLabel] : (isHorizontal ? event.clientX : event.clientY);

            $body.className += " noSelect";

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
                document.onmousemove = drag;
                document.onmouseup = $thumb.onmouseup = end;
            }

            drag(event);
        }

        function wheel(event)
        {
            if(self.contentRatio < 1)
            {
                var evntObj         = event || window.event
                ,   wheelSpeedDelta = -(evntObj.deltaY || evntObj.detail || (-1 / 3 * evntObj.wheelDelta)) / 40
                ,   multiply        = (evntObj.deltaMode === 1) ? self.options.wheelSpeed : 1
                ;

                self.contentPosition -= wheelSpeedDelta * self.options.wheelSpeed;
                self.contentPosition = Math.min((self.contentSize - self.viewportSize), Math.max(0, self.contentPosition));
                self.thumbPosition   = self.contentPosition / self.trackRatio;

                $container.dispatchEvent(moveEvent);

                $thumb.style[posiLabel]    = self.thumbPosition + "px";
                $overview.style[posiLabel] = -self.contentPosition + "px";

                if(self.options.wheelLock || isAtBegin() && isAtEnd())
                {
                    evntObj.preventDefault();
                }
            }
        }

        function drag(event)
        {
            if(self.contentRatio < 1)
            {
                var mousePositionNew   = isHorizontal ? event.clientX : event.clientY
                ,   thumbPositionDelta = mousePositionNew - mousePosition
                ;

                if(hasTouchEvents)
                {
                    thumbPositionDelta = mousePosition - mousePositionNew;
                }

                var thumbPositionNew = Math.min((self.trackSize - self.thumbSize), Math.max(0, self.thumbPosition + thumbPositionDelta));
                self.contentPosition = thumbPositionNew * self.trackRatio;

                $container.dispatchEvent(moveEvent);

                $thumb.style[posiLabel] = thumbPositionNew + "px";
                $overview.style[posiLabel] = -self.contentPosition + "px";
            }
        }

        function end()
        {
            self.thumbPosition = parseInt($thumb.style[posiLabel], 10) || 0;

            $body.className = $body.className.replace(" noSelect", "");
            document.onmousemove = document.onmouseup = null;
            $thumb.onmouseup = null;
            $track.onmouseup = null;
            document.ontouchmove = document.ontouchend = null;
        }

        return initialize();
    }

    var tinyscrollbar = function($container, options)
    {
        return new Plugin($container, options);
    };

    if(typeof define == 'function' && define.amd)
    {
        define(function(){ return tinyscrollbar; });
    }
    else if(typeof module === 'object' && module.exports)
    {
        module.exports = tinyscrollbar;
    }
    else
    {
        window.tinyscrollbar = tinyscrollbar;
    }
})(window);
