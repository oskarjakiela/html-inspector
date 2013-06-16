;(function() {
  var ignored = {
    defaults: [
      /^js\-/,
      /^supports\-/,
      /^language\-/,
      /^lang\-/
    ],

    modernizr: [
      /^no\-/,
      "js",
      "flexbox",
      "flexboxlegacy",
      "canvas",
      "canvastext",
      "webgl",
      "touch",
      "geolocation",
      "postmessage",
      "websqldatabase",
      "indexeddb",
      "hashchange",
      "history",
      "draganddrop",
      "websockets",
      "rgba",
      "hsla",
      "multiplebgs",
      "backgroundsize",
      "borderimage",
      "borderradius",
      "boxshadow",
      "textshadow",
      "opacity",
      "cssanimations",
      "csscolumns",
      "cssgradients",
      "cssreflections",
      "csstransforms",
      "csstransforms3d",
      "csstransitions",
      "fontface",
      "generatedcontent",
      "video",
      "audio",
      "localstorage",
      "sessionstorage",
      "webworkers",
      "applicationcache",
      "svg",
      "inlinesvg",
      "smil",
      "svgclippaths"
    ]
  }

  HTMLInspector.rules.add(
    "unused-classes",
    {
      whitelist: ignored.defaults,
      modernizr: false
    },
    function(listener, reporter, config) {

      var css = HTMLInspector.modules.css
        , classes = css.getClassSelectors()

      listener.on("class", function(name) {
        var whitelist = config.whitelist

        if (config.modernizr && this.tagName === "HTML") {
          whitelist = isRegExp(whitelist) ? [whitelist] : whitelist
          whitelist = whitelist.concat(ignored.modernizr)
        }

        if (!foundIn(name, whitelist) && classes.indexOf(name) < 0) {
          reporter.warn(
            "unused-classes",
            "The class '"
            + name
            + "' is used in the HTML but not found in any stylesheet.",
            this
          )
        }
      }
    )
  })
}())