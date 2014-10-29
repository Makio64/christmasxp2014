# 
# Abstract Scene
# 
# @author David Ronai / Makiopolis.com / @Makio64 
# 

class Scene

	constructor:()->
		super()
		return

	update:(dt)->
		return

	resize:()->
		return

	transitionIn:()->
		return

	transitionOut:()->
		return

	onTransitionInComplete:()->
		return

	onTransitionOutComplete:()->
		SceneTraveler.onTransitionOutComplete()
		return

	dispose:()->
		return