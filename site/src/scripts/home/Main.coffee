Loading = require "home/Loading"
Home = require "home/Home"
MobileMenu = require "home/MobileMenu"

loading = new Loading
loading.on "complete", ->
    if window.innerWidth <= 640 then mobileMenu = new MobileMenu()
    home = new Home()
    loading.hide().then ->
        loading.dispose()
        home.show()
loading.start()
