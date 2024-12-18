import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)


const store = new Vuex.Store({




	state: {
		token: '',
		info: {}, //用户信息
		uuid: '', //图形验证码uuid
		tokens: '',
		unername: '',
		access_token: '',
		openid: '',
		other_types: '',
		listswipeLista:[]

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
		},
		other_sign_access_token(state, access_token) {
			console.log("access_token", access_token)
			state.access_token = access_token

		},
		other_sign_openid(state, openid) {
			console.log("openid", openid)
			state.openid = openid

		},
		other_sign_other_types(state, other_types) {
			console.log("other_types", other_types)
			state.other_types = other_types
		},
		
		listswipeList(state, listswipeLista) {
			console.log("swipeList", listswipeLista)
			state.listswipeLista = listswipeLista
		},


	}
})


export default store