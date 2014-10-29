# 
# Load and stock the data
#

class DataManager

	
	@loading 	= 0
	@jsons 		= {}


	@load = (objects, @callback)->
		for i in [0...objects.length] by 1
			o = objects[i]
			@loading++
			$.getJSON( o.url, ( data )->
				DataManager.jsons[o.id] = data
				DataManager.onLoadComplete()
				return
			)
		return


	@onLoadComplete = ()=>
		@loading--
		if @loading == 0
			@callback()
		return


	@get = (id)->
		return @jsons[id]