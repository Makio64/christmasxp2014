Loading = require "home/Loading"
Home = require "home/Home"

loading = new Loading
loading.on "complete", ->
    home = new Home()
    loading.hide().then ->
        loading.dispose()
        home.show()
loading.start()
