Loading = require "home/Loading"
Home = require "home/Home"
Main3d = require "3d/Main3d"
MobileMenu = require "home/MobileMenu"

loading = new Loading
loading.on "complete", ->
    if window.innerWidth <= 640 then mobileMenu = new MobileMenu()
    main = new Main3d()
    home = new Home(main.scene)
    loading.hide().then ->
        loading.dispose()
        home.show()
loading.start()