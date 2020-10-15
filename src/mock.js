// 引入mockjs
const Mock = require('mockjs')

Mock.mock('api/data', (req, res) => {
	return {
		data: ['a', 'b']
	}
})
