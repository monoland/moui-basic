const route = {
	path: '/backend',
	meta: { requiredAuth: true },
	component: () => import(/* webpackChunkName: "backend" */ '@modules/pages/Base.vue'),
	children: [
		{
			path: '',
			redirect: { name: 'backend-dashboard'}
		},

		{
			path: 'dashboard',
			name: 'backend-dashboard',
			component: () => import(/* webpackChunkName: "backend" */ '@modules/pages/dashboard/index.vue'),
		},
	]
};

export default route;