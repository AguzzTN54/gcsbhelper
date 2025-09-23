import img from '$img/star.png';

export default (value: number = 15) => ({
	particles: {
		number: {
			value: value,
			density: {
				enable: false,
				value_area: 800
			}
		},
		color: {
			value: '#ffffff'
		},
		shape: {
			type: 'image',
			stroke: {
				width: 0,
				color: '#000000'
			},
			polygon: {
				nb_sides: 5
			},
			image: {
				src: img,
				width: 100,
				height: 100
			}
		},
		opacity: {
			value: 1,
			random: true,
			anim: {
				enable: true,
				speed: 3,
				opacity_min: 0.1,
				sync: false
			}
		},
		size: {
			value: 20,
			random: true,
			anim: {
				enable: true,
				speed: 10,
				size_min: 1.5,
				sync: false
			}
		},
		line_linked: {
			enable: false,
			distance: 150,
			color: '#ffffff',
			opacity: 0.4,
			width: 1
		},
		move: {
			enable: true,
			speed: 1,
			direction: 'none',
			random: true,
			straight: false,
			out_mode: 'out',
			bounce: false,
			attract: {
				enable: false,
				rotateX: 600,
				rotateY: 1200
			}
		}
	},
	interactivity: {
		detect_on: 'canvas',
		events: {
			onhover: {
				enable: false,
				mode: 'repulse'
			},
			onclick: {
				enable: false,
				mode: 'push'
			},
			resize: true
		},
		modes: {
			grab: {
				distance: 400,
				line_linked: {
					opacity: 1
				}
			},
			bubble: {
				distance: 400,
				size: 40,
				duration: 2,
				opacity: 8,
				speed: 3
			},
			repulse: {
				distance: 200,
				duration: 0.4
			},
			push: {
				particles_nb: 4
			},
			remove: {
				particles_nb: 2
			}
		}
	},
	retina_detect: true
});
