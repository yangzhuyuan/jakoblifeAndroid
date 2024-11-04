import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)


const store = new Vuex.Store({
	state: {
		token: '',
		info: {}, //用户信息
		uuid: '', //图形验证码uuid
		tokens: '',
		unername: ''

	},
	mutations: {
		login(state, token) {
			state.token = token
			console.log("login", token)
		},
		register_token(state, tokens) {
			state.tokens = tokens
			console.log("register", tokens)
		},
		register_unername(state, unername) {
			state.unername = unername
			console.log("unername", unername)
		},
		getInfo(state, info) {
			console.log("用户信息", info)
			state.info = info
		},
		getImgID(state, uuid) {
			console.log("uuid", uuid)
			state.uuid = uuid
		}


	}
})


export default store