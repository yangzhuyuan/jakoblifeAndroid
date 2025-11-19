const permissions = [
	'android.permission.ACCESS_FINE_LOCATION',
	'android.permission.ACCESS_COARSE_LOCATION',
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

export function checkNotificationPermissions() {
	const appQX = uni.getStorageSync("appQX");
	if (appQX === "0") {
		// console.log("用户已永久拒绝权限，不再重复请求");
		checkNotificationAgain(permissions)
		return;
	}
	const main = plus.android.runtimeMainActivity();

	// ✅ 过滤掉系统不支持的权限
	const Build = plus.android.importClass('android.os.Build');
	const filteredPermissions = permissions.filter(p =>
		!API31_PERMISSIONS.includes(p) || Build.VERSION.SDK_INT >= 31
	);
	//过滤掉系统不支持的权限将permissions替换成filteredPermissions,否则使用permissions
	plus.android.requestPermissions(filteredPermissions, (e) => {
		// console.log("权限", e)
		if (e.deniedAlways.length > 0) {
			uni.setStorageSync("appQX", "0");
			gotoAppSettings(main)
		} else if (e.deniedPresent.length > 0) {
			uni.setStorageSync("appQX", "0");
		} else if (e.granted.length > 0) {
			uni.setStorageSync("appQX", "1");
		}
	}, (e) => {
		console.error("权限请求失败", e);
	});
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

function checkNotificationAgain(permissions) {
	const main = plus.android.runtimeMainActivity();
	const PackageManager = plus.android.importClass('android.content.pm.PackageManager');
	const Context = plus.android.importClass('android.content.Context');
	const Build = plus.android.importClass('android.os.Build');
	let allGranted = true;
	for (let permission of permissions) {
		const result = main.checkSelfPermission(permission);
		if (result !== PackageManager.PERMISSION_GRANTED) {
			allGranted = false;
			break;
		}
	}
	if (allGranted) {
		uni.setStorageSync("appQX", "1");
		// console.log("用户已手动开启权限，appQX 已更新为 1");
	} else {
		// console.log("用户仍未开启权限，保持 appQX = 0");
	}
}