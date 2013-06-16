HTMLInspector.rules.add("inline-event-handlers", function(listener, reporter) {

  listener.on('attribute', function(name, value) {
    if (name.indexOf("on") === 0) {
      reporter.warn(
        "inline-event-handlers",
        "An '" + name + "' attribute was found in the HTML. Use external scripts for event binding instead.",
        this
      )
    }
  })

})

HTMLInspector.rules.add(
  "script-placement",
  {
    whitelist: []
  },
  function(listener, reporter) {

    var elements = []
      , whitelist = this.whitelist

    function isWhitelisted(el) {
      if (!whitelist) return false
      if (typeof whitelist == "string") return $(el).is(whitelist)
      if (Array.isArray(whitelist)) {
        return whitelist.length && whitelist.some(function(item) {
          return $(el).is(item)
        })
      }
      return false
    }

    listener.on("element", function(name) {
      elements.push(this)
    })

    listener.on("afterInspect", function() {
      var el
      // scripts at the end of the elements are safe
      while (el = elements.pop()) {
        if (el.nodeName.toLowerCase() != "script") break
      }
      elements.forEach(function(el) {
        if (el.nodeName.toLowerCase() == "script") {
          // scripts with the async or defer attributes are safe
          if (el.async === true || el.defer === true) return
          // at this point, if the script isn't whitelisted, throw an error
          if (!isWhitelisted(el)) {
            reporter.warn(
              "script-placement",
              "<script> elements should appear right before "
              + "the closing </body> tag for optimal performance.",
              el
            )
          }
        }
      })
    })
  }
)

HTMLInspector.rules.add(
  "unnecessary-elements",
  {
    isUnnecessary: function(element) {
      var name = element.nodeName.toLowerCase()
        , isUnsemantic = name == "div" || name == "span"
        , isAttributed = element.attributes.length === 0
      return isUnsemantic && isAttributed
    }
  },
  function(listener, reporter, config) {
    listener.on('element', function(name) {
      if (config.isUnnecessary(this)) {
        reporter.warn(
          "unnecessary-elements",
          "Do not use <div> or <span> elements without any attributes.",
          this
        )
      }
    }
  )
})

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