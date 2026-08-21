const permissions = [
	// 'android.permission.ACCESS_FINE_LOCATION',
	// 'android.permission.ACCESS_COARSE_LOCATION',
	'android.permission.BLUETOOTH_ADVERTISE',
	'android.permission.BLUETOOTH',
	'android.permission.BLUETOOTH_ADMIN',
	'android.permission.BLUETOOTH_CONNECT'
]

const API31_PERMISSIONS = [
	'android.permission.BLUETOOTH_CONNECT',
	'android.permission.BLUETOOTH_ADVERTISE',
	// 'android.permission.BLUETOOTH_SCAN' // 如果以后要用，也一起加进来
];

/** 定位开关标记：绑定页写字符串 '1'，App 启动写数字 1 */
export function isDingweiEnabled() {
	const v = uni.getStorageSync("dingwei");
	return v === 1 || v === '1' || v === true;
}

function getRequestPermissions() {
	try {
		const Build = plus.android.importClass('android.os.Build');
		return permissions.filter(p =>
			!API31_PERMISSIONS.includes(p) || Build.VERSION.SDK_INT >= 31
		);
	} catch (e) {
		return permissions.filter(p => !API31_PERMISSIONS.includes(p));
	}
}

export function checkNotificationPermissions() {
	const appQX = uni.getStorageSync("appQX");
	if (appQX === "0") {
		checkNotificationAgain()
		return;
	}
	try {
		const main = plus.android.runtimeMainActivity();
		const filteredPermissions = getRequestPermissions();
		if (!filteredPermissions.length) {
			uni.setStorageSync("appQX", "1");
			return;
		}
		plus.android.requestPermissions(filteredPermissions, (e) => {
			const deniedAlways = (e && e.deniedAlways) || [];
			const deniedPresent = (e && e.deniedPresent) || [];
			const granted = (e && e.granted) || [];
			if (deniedAlways.length > 0) {
				uni.setStorageSync("appQX", "0");
				gotoAppSettings(main)
			} else if (deniedPresent.length > 0) {
				uni.setStorageSync("appQX", "0");
			} else if (granted.length > 0) {
				uni.setStorageSync("appQX", "1");
			} else {
				checkNotificationAgain()
			}
		}, (e) => {
			console.error("权限请求失败", e);
			checkNotificationAgain()
		});
	} catch (e) {
		console.error("权限请求异常", e);
	}
}

function gotoAppSettings(main) {
	const Intent = plus.android.importClass('android.content.Intent');
	const uri = plus.android.net.Uri.fromParts('package', main.getPackageName(), null);
	const intent = new Intent('android.settings.APPLICATION_DETAILS_SETTINGS', uri);
	main.startActivity(intent);
}

function gotoNotificationSettings(main) {
	const Intent = plus.android.importClass('android.content.Intent');
	const Build = plus.android.importClass('android.os.Build');
	const packageName = main.getPackageName();

	let intent;
	if (Build.VERSION.SDK_INT >= 33) {
		intent = new Intent('android.settings.ACTION_APP_NOTIFICATION_SETTINGS');
		intent.putExtra('android.provider.extra.APP_PACKAGE', packageName);
	} else if (Build.VERSION.SDK_INT >= 26) {
		intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
		intent.putExtra('android.provider.extra.APP_PACKAGE', packageName);
	} else if (Build.VERSION.SDK_INT >= 21) {
		intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
		intent.putExtra('app_package', packageName);
		intent.putExtra('app_uid', main.getApplicationInfo().uid);
	} else {
		intent = new Intent('android.settings.APPLICATION_DETAILS_SETTINGS');
		intent.setData(plus.android.net.Uri.fromParts('package', packageName, null));
	}

	main.startActivity(intent);
}

export function checkNotificationAgain() {
	try {
		const main = plus.android.runtimeMainActivity();
		const PackageManager = plus.android.importClass('android.content.pm.PackageManager');
		const checkList = getRequestPermissions();
		let allGranted = checkList.length > 0;
		for (let permission of checkList) {
			const result = main.checkSelfPermission(permission);
			if (result !== PackageManager.PERMISSION_GRANTED) {
				allGranted = false;
				break;
			}
		}
		if (allGranted) {
			uni.setStorageSync("appQX", "1");
		}
	} catch (e) {
		console.error("权限复查失败", e);
	}
}