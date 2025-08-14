import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)


const store = new Vuex.Store({
	state: {
		token: '',
		info: {}, //用户信息
		uuid: '', //图形验证码uuid
		tokens: '0',
		unername: '',
		access_token: '',
		openid: '',
		other_types: '',
		listswipeLista: [],
		getpendinglenth: '0',
		deviceId: '',
		serviceId: '',
		characteristicId: '',
		acktypes: 0,
		bianhuadata: 0,
		TenddeviceSn: '',
		xueyehuilian: true,

	},
	mutations: {
		login(state, token) {
			state.token = token
			console.log("login", token)
		},
		register_token(state, tokens) {
			state.tokens = tokens
		},
		register_unername(state, unername) {
			state.unername = unername
		},
		getInfo(state, info) {
			state.info = info
		},
		getImgID(state, uuid) {
			state.uuid = uuid
		},
		other_sign_access_token(state, access_token) {
			state.access_token = access_token

		},
		other_sign_openid(state, openid) {
			state.openid = openid
		},
		other_sign_other_types(state, other_types) {
			state.other_types = other_types
		},
		listswipeList(state, listswipeLista) {
			state.listswipeLista = listswipeLista
		},

		setpendinglenth(state, getpendinglenth) {
			state.getpendinglenth = getpendinglenth
		},
		setdeviceId(state, getdeviceId) {
			state.deviceId = getdeviceId
		},
		setserviceId(state, getserviceId) {
			state.serviceId = getserviceId
		},
		setcharacteristicId(state, getcharacteristicId) {
			state.characteristicId = getcharacteristicId
		},
		setacktypes(state, acktypes) {
			state.acktypes = acktypes
		},
		setbanhua(state, bianhuadata) {
			state.bianhuadata = bianhuadata
		},
		setTenddeviceSn(state, TenddeviceSn) {
			state.TenddeviceSn = TenddeviceSn
		},
		sethuilian(state, huilian) {
			state.xueyehuilian = huilian
		},
	}
})


export default store