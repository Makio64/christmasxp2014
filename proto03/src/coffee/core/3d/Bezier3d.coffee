# 
# Bezier3d formula
# @author David Ronai / Makiopolis.com / @Makio64 
# 
class Bezier3d

	# p0 the starting point
	# p1 the anchor
	# p2 the ending point
	@calc = (p0,p1,p2,t)->
		x = Math.pow(1 - t, 2) * p0.x + 2 * t * (1 - t) * p1.x + Math.pow(t, 2) * p2.x
		y = Math.pow(1 - t, 2) * p0.y + 2 * t * (1 - t) * p1.y + Math.pow(t, 2) * p2.y
		z = Math.pow(1 - t, 2) * p0.z + 2 * t * (1 - t) * p1.z + Math.pow(t, 2) * p2.z
		return new THREE.Vector3(x,y,z)