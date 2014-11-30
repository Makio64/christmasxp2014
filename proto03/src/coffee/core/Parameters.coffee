# 
# Parameters
# Stock parameters of the app
# @author David Ronai / Makiopolis.com / @Makio64 
# 

class Parameters

	@gui = null

	@initGUI:()->
		@gui = new datGUI()
		# your parameters here, for example :
		# @gui.add(Parameters,'intensity', 0, 1).steps(0.01).listen().name('Intensity').onChange(@onChange)
		return

	