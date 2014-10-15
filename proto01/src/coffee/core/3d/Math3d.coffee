# 
# Math3d
# @author David Ronai / Makiopolis.com / @Makio64 
# 
class Math3d

	# The distance optimized formula wihout square, use it for comparaison
	@distance = (v1, v2)->
		dx = (v2.x-v1.x)
		dy = (v2.y-v1.y)
		dz = (v2.z-v1.z)
		return dx*dx + dy*dy + dz*dz
	
	# The real 3d distance
	@distanceSqrt = (v1, v2)->
		dx = (v2.x-v1.x)
		dy = (v2.y-v1.y)
		dz = (v2.z-v1.z)
		return Math.sqrt(dx*dx + dy*dy + dz*dz)