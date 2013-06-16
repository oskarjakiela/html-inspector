describe("unused-classes", function() {

  var log
    , modernizrClasses = [
        "js", "no-js",
        "flexbox", "no-flexbox",
        "flexboxlegacy", "no-flexboxlegacy",
        "canvas", "no-canvas",
        "canvastext", "no-canvastext",
        "webgl", "no-webgl",
        "touch", "no-touch",
        "geolocation", "no-geolocation",
        "postmessage", "no-postmessage",
        "websqldatabase", "no-websqldatabase",
        "indexeddb", "no-indexeddb",
        "hashchange", "no-hashchange",
        "history", "no-history",
        "draganddrop", "no-draganddrop",
        "websockets", "no-websockets",
        "rgba", "no-rgba",
        "hsla", "no-hsla",
        "multiplebgs", "no-multiplebgs",
        "backgroundsize", "no-backgroundsize",
        "borderimage", "no-borderimage",
        "borderradius", "no-borderradius",
        "boxshadow", "no-boxshadow",
        "textshadow", "no-textshadow",
        "opacity", "no-opacity",
        "cssanimations", "no-cssanimations",
        "csscolumns", "no-csscolumns",
        "cssgradients", "no-cssgradients",
        "cssreflections", "no-cssreflections",
        "csstransforms", "no-csstransforms",
        "csstransforms3d", "no-csstransforms3d",
        "csstransitions", "no-csstransitions",
        "fontface", "no-fontface",
        "generatedcontent", "no-generatedcontent",
        "video", "no-video",
        "audio", "no-audio",
        "localstorage", "no-localstorage",
        "sessionstorage", "no-sessionstorage",
        "webworkers", "no-webworkers",
        "applicationcache", "no-applicationcache",
        "svg", "no-svg",
        "inlinesvg", "no-inlinesvg",
        "smil", "no-smil",
        "svgclippaths", "no-svgclippaths"
      ]

  function onComplete(reports) {
    log = []
    reports.forEach(function(report) {
      log.push(report)
    })
  }

  it("warns when non-whitelisted classes appear in the HTML but not in any stylesheet", function() {
    var $html = $(''
          + '<div class="fizz buzz">'
          + '  <p class="foo bar baz">This is just a test</p>'
          + '</div>'
        )

    HTMLInspector.inspect({
      useRules: ["unused-classes"],
      domRoot: $html,
      onComplete: onComplete
    })

    expect(log[0].message).toBe("The class 'fizz' is used in the HTML but not found in any stylesheet.")
    expect(log[1].message).toBe("The class 'buzz' is used in the HTML but not found in any stylesheet.")
    expect(log[2].message).toBe("The class 'baz' is used in the HTML but not found in any stylesheet.")
    expect(log[0].context).toBe($html[0])
    expect(log[1].context).toBe($html[0])
    expect(log[2].context).toBe($html.find("p")[0])

  })

  it("doesn't warn when whitelisted classes appear in the HTML", function() {
    var $html = $(''
          + '<div class="supports-flexbox">'
          + '  <p class="js-alert">This is just a test</p>'
          + '</div>'
        )

    HTMLInspector.inspect({
      useRules: ["unused-classes"],
      domRoot: $html,
      onComplete: onComplete
    })

    expect(log.length).toBe(0)

  })

  it("allows for customization by altering the config object", function() {

    var $html = $(''
          + '<div class="fizz supports-flexbox">'
          + '  <p class="js-alert buzz">This is just a test</p>'
          + '</div>'
      )


    // the whitelist can be a single RegExp
    HTMLInspector.rules.extend("unused-classes", {whitelist: /fizz|buzz/})

    HTMLInspector.inspect({
      useRules: ["unused-classes"],
      domRoot: $html,
      onComplete: onComplete
    })

    expect(log.length).toBe(2)
    expect(log[0].message).toBe("The class 'supports-flexbox' is used in the HTML but not found in any stylesheet.")
    expect(log[1].message).toBe("The class 'js-alert' is used in the HTML but not found in any stylesheet.")

    log = []
    // It can also be a list of strings or RegExps
    HTMLInspector.rules.extend("unused-classes", {whitelist: ["fizz", /buz\w/]})

    HTMLInspector.inspect({
      useRules: ["unused-classes"],
      domRoot: $html,
      onComplete: onComplete
    })

    expect(log.length).toBe(2)
    expect(log[0].message).toBe("The class 'supports-flexbox' is used in the HTML but not found in any stylesheet.")
    expect(log[1].message).toBe("The class 'js-alert' is used in the HTML but not found in any stylesheet.")

    log = []
    $html = $('<html></html>', {
      "class": "js no-js",
      html: $html
    })
    // the whitelist can be a single RegExp with modernizr enabled
    HTMLInspector.rules.extend("unused-classes", {whitelist: /fizz|buzz/, modernizr: true})

    HTMLInspector.inspect({
      useRules: ["unused-classes"],
      domRoot: $html,
      onComplete: onComplete
    })

    expect(log.length).toBe(2)
    expect(log[0].message).toBe("The class 'supports-flexbox' is used in the HTML but not found in any stylesheet.")
    expect(log[1].message).toBe("The class 'js-alert' is used in the HTML but not found in any stylesheet.")

    log = []
    // It can also be a list of strings or RegExps with modernizr enabled
    HTMLInspector.rules.extend("unused-classes", {whitelist: ["fizz", /buz\w/], modernizr: true})

    HTMLInspector.inspect({
      useRules: ["unused-classes"],
      domRoot: $html,
      onComplete: onComplete
    })

    expect(log.length).toBe(2)
    expect(log[0].message).toBe("The class 'supports-flexbox' is used in the HTML but not found in any stylesheet.")
    expect(log[1].message).toBe("The class 'js-alert' is used in the HTML but not found in any stylesheet.")

  })

  it("warns when modernizr isn't non-whitelisted and its classes appear in the HTML tag but not in any stylesheet", function() {

    var $html = $('<html></html>', {
      "class": modernizrClasses.join(" ")
    })

    HTMLInspector.rules.extend("unused-classes", {modernizr: false})

    HTMLInspector.inspect({
      useRules: ["unused-classes"],
      domRoot: $html,
      onComplete: onComplete
    })

    expect(log.length).toBe(modernizrClasses.length)
    expect(log[0].message).toBe("The class 'js' is used in the HTML but not found in any stylesheet.")
    expect(log[1].message).toBe("The class 'no-js' is used in the HTML but not found in any stylesheet.")

  })

  it("warns when modernizr is non-whitelisted but its classes don't appear in HTML tag", function() {

    var $html = $('<div></div>', {
      "class": modernizrClasses.join(" ")
    })


    HTMLInspector.rules.extend("unused-classes", {modernizr: true})

    HTMLInspector.inspect({
      useRules: ["unused-classes"],
      domRoot: $html,
      onComplete: onComplete
    })

    expect(log.length).toBe(modernizrClasses.length)
    expect(log[0].message).toBe("The class 'js' is used in the HTML but not found in any stylesheet.")
    expect(log[1].message).toBe("The class 'no-js' is used in the HTML but not found in any stylesheet.")
  })

  it("doesn't warn when modernizr classes appear in the HTML tag", function() {

    var $html = $('<html></html>', {
      "class": modernizrClasses.join(" ")
    })

    HTMLInspector.rules.extend("unused-classes", {modernizr: true})

    HTMLInspector.inspect({
      useRules: ["unused-classes"],
      domRoot: $html,
      onComplete: onComplete
    })

    expect(log.length).toBe(0)

  })

})
