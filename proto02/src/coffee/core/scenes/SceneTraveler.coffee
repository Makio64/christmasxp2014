# 
# Manage transition betweenScene
# 
# @usage SceneTraveler.to( new Scene() )
# @author David Ronai / Makiopolis.com / @Makio64 
# 

class SceneTraveler

	@currentScene 	= null
	@nextScene		= null

	@init = ()->
		return


	@to = (scene)->
		@nextScene = scene
		if @currentScene != null
			@currentScene.transitionOut()
		else
			@onTransitionOutComplete()
		return

	@update = (dt)->
		if @currentScene != null
			@currentScene.update(dt)


	@onTransitionOutComplete = ()->		
		@currentScene = @nextScene
		@currentScene.transitionIn()
		return


	@resize = ()->
		if @currentScene != null
			@currentScene.resize()
		if @nextScene != null
			@nextScene.resize()
		return