package com.guangji.livefit;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;

import android.bluetooth.BluetoothDevice;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.IBinder;
import android.text.TextUtils;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.CompoundButton;
import android.widget.Switch;
import android.widget.Toast;


import com.guangji.liblivefit.Utils.TimeUtils;
import com.guangji.liblivefit.callback.BatteryCallback;
import com.guangji.liblivefit.callback.BrightnessCallback;
import com.guangji.liblivefit.callback.ContactsCallback;
import com.guangji.liblivefit.callback.DeviceConnectStatusCallback;
import com.guangji.liblivefit.callback.DeviceInfoCallback;
import com.guangji.liblivefit.callback.HeartRateEtcCallback;
import com.guangji.liblivefit.callback.HistoricalRealTimeCallback;
import com.guangji.liblivefit.callback.HistoryDetailedDataCallback;
import com.guangji.liblivefit.callback.LanguageCallback;
import com.guangji.liblivefit.callback.PhoneCallback;
import com.guangji.liblivefit.callback.SportsDataCallback;
import com.guangji.liblivefit.manager.CommandManager;
import com.guangji.liblivefit.mvp.entity.ClockEntry;
import com.guangji.liblivefit.mvp.entity.ContactEntry;
import com.guangji.liblivefit.mvp.entity.DeviceContactsInfo;
import com.guangji.liblivefit.mvp.entity.HistoryDetail;
import com.guangji.liblivefit.mvp.entity.UserEntry;
import com.guangji.liblivefit.mvp.entity.WeatherEntry;
import com.guangji.liblivefit.service.BleService;
import com.guangji.liblivefit.util.BLEConfig;
import com.guangji.liblivefit.util.LanguageUtil;
import com.guangji.liblivefit.util.MessageUtil;
import com.guangji.liblivefit.util.QRCodeUtil;
import com.jieli.jl_rcsp.impl.RcspOpImpl;
import com.jieli.jl_rcsp.task.SimpleTaskListener;
import com.jieli.jl_rcsp.task.contacts.DeviceContacts;
import com.jieli.jl_rcsp.task.contacts.ReadContactsTask;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;


public class MainActivity extends AppCompatActivity implements DeviceConnectStatusCallback, BatteryCallback, DeviceInfoCallback, HistoricalRealTimeCallback
, HistoryDetailedDataCallback, HeartRateEtcCallback, SportsDataCallback, LanguageCallback, PhoneCallback, BrightnessCallback, ContactsCallback {


    private ActionBar actionBar;

    private boolean isConnect = false;
    private static final int REQUEST_CODE = 1;

    private AppApplication appApplication;
    private BluetoothDevice bluetoothDevice;
    private CommandManager commandManager;

    private int Language = 0;
    private Timer timer = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        actionBar = getSupportActionBar();
        appApplication = AppApplication.getInstance();
        commandManager = appApplication.mCommandManager;
        startServices();

        findViewById(R.id.btn_save).setOnClickListener(v-> {
            if (BLEConfig.getInstance().isSave){
                Toast.makeText(this,"已开启保存",Toast.LENGTH_SHORT).show();
            }else {
                BLEConfig.getInstance().isSave = true;
                Toast.makeText(this,"开启保存",Toast.LENGTH_SHORT).show();
            }
        });
        findViewById(R.id.btn_save2).setOnClickListener(v-> {
            if (BLEConfig.getInstance().isSave){
                Toast.makeText(this,"已开启保存",Toast.LENGTH_SHORT).show();
            }else {
                BLEConfig.getInstance().isSave = true;
                BLEConfig.getInstance().isASCII = true;
                Toast.makeText(this,"开启保存",Toast.LENGTH_SHORT).show();
            }
        });

        findViewById(R.id.sync_time).setOnClickListener(v-> commandManager.sendSyncTime());
        findViewById(R.id.btn_set_time_format).setOnClickListener(v-> commandManager.sendTimeSystem(0));
        findViewById(R.id.btn_set_user).setOnClickListener(v-> {
            UserEntry userEntry = new UserEntry("moDou",0,26,165,59);
            commandManager.setUserInfo(userEntry,true,true,10000);
        });
        findViewById(R.id.sync_weather).setOnClickListener(v-> {
            List<WeatherEntry> weatherEntries = new ArrayList<>();
            WeatherEntry weatherEntry = new WeatherEntry();
            weatherEntry.setCity("深圳");
            weatherEntry.setWeatherCode(5);
            weatherEntry.setAirQuality(3);
            weatherEntry.setDate(TimeUtils.getYYYYMMdd(System.currentTimeMillis()));
            weatherEntry.setHumidity(90);
            weatherEntry.setLiveTemp(25);
            weatherEntry.setMaxTemp(30);
            weatherEntry.setMinTemp(20);
            weatherEntries.add(weatherEntry);
            commandManager.sendWeather(weatherEntries);
        });
        findViewById(R.id.btn_get_battery).setOnClickListener(v-> commandManager.getBattery());
        findViewById(R.id.btn_get_dev_information).setOnClickListener(v->  commandManager.getDeviceInfo());
        findViewById(R.id.btn_dev_real_time_data).setOnClickListener(v->  commandManager.sendSyncCurrentData());
        findViewById(R.id.btn_dev_detail_data).setOnClickListener(v->  commandManager.syncDetailDataByDay(0));
        findViewById(R.id.btn_dev_heart_rate_etc).setOnClickListener(v->  commandManager.sendHrBpBoMeasure());
        findViewById(R.id.btn_dev_sport_data).setOnClickListener(v->   commandManager.syncSportData(TimeUtils.getStartTimeStampOfDay(new Date())));
        findViewById(R.id.btn_dev_language).setOnClickListener(v-> {
            Language = LanguageUtil.EN;
            commandManager.sendLanguage(Language);
        });
        findViewById(R.id.btn_dev_news).setOnClickListener(v->  commandManager.sendMsgReminder(MessageUtil.MESSAGE_QQ_ID,"SDK","早上好！"));
        findViewById(R.id.btn_dev_clock_alert).setOnClickListener(v->{
            //闹钟只能设置5个
            ArrayList<ClockEntry> list = new ArrayList<>();
            ClockEntry clockEntry = new ClockEntry();
            clockEntry.setStatus(true);
            clockEntry.setHour(TimeUtils.getCurrentHour());
            clockEntry.setMinute(TimeUtils.getCurrentMinute() + 1);
            clockEntry.setWeek(0x7F);
            list.add(clockEntry);
            commandManager.sendClockReminder(list);

            //读取闹钟
//            WatchManagerDemo watchManager = appApplication.watchManagerTest.watchManager;
//            RTCOpImpl rtcOp = new RTCOpImpl(watchManager);
//            //注册Rcsp事件监听器
//            rtcOp.getRcspOp().registerOnRcspEventListener(new OnRcspEventListener() {
//                @Override
//                public void onAlarmListChange(BluetoothDevice device, AlarmListInfo alarmListInfo) {
//                    //此处将会回调闹钟列表信息
//                    Log.d("", "onAlarmListChange: "+alarmListInfo.getAlarmBeans().size());  //闹钟列表
//                    List<AlarmBean> alarmBeans = alarmListInfo.getAlarmBeans();
//                    ArrayList<ClockEntry> clockEntries = new ArrayList<>();
//                     for (int i = 0; i < alarmBeans.size();i++){
//                         AlarmBean alarmBean = alarmBeans.get(i);
//                         ClockEntry clockEntry = new ClockEntry();
//                         clockEntry.setStatus(alarmBean.isOpen());
//                         clockEntry.setHour(alarmBean.getHour());
//                         clockEntry.setMinute(alarmBean.getMin());
//                         int week = 0;
//                         if ((alarmBean.getRepeatMode()  & 0XFF) == 1){ //处理一下，会出现负数的情况
//                             week = 0x7F; //代表每天
//                         }else {
//                             week = (alarmBean.getRepeatMode()  & 0XFF) >> 1;
//                         }
//                         clockEntry.setWeek(week); //week (bit0~bit6 周日~周六，bit 7是clockEntry.getStatus()代表闹钟开关)
//                         clockEntries.add(clockEntry);
//                         Log.d("", "Hour: "+alarmBean.getHour()+"\tMin:"+alarmBean.getMin()+"\tOpen"+alarmBean.isOpen()+
//                                 "\tWeek"+(alarmBean.getRepeatMode() & 0xff));
//                     }
//                }
//            });

            //执行读取闹钟列表功能并等待结果回调
//            rtcOp.readAlarmList(rtcOp.getConnectedDevice(), new OnOperationCallback<Boolean>() {
//                @Override
//                public void onSuccess(Boolean result) {
//                    //成功回调
//                    //结果将会在OnRcspEventListener#onAlarmListChange处回调
//                }
//
//                @Override
//                public void onFailed(BaseError error) {
//                    //失败回调
//                    //error -- 错误信息
//                    Log.d("", "onFailed: "+error);
//                }
//            });
        });
        findViewById(R.id.btn_dev_sedentary_reminder).setOnClickListener(v->  commandManager.sendSedentaryReminder(true,14,
                30,16,30,15));
        findViewById(R.id.btn_dev_disturb_mode).setOnClickListener(v->  commandManager.sendDisturbModeCommand(true,23,
                0,8,50));
        findViewById(R.id.btn_dev_screen).setOnClickListener(v->   commandManager.sendScreenSettings(3,10,true));
        findViewById(R.id.btn_dev_vibrate).setOnClickListener(v->   commandManager.sendVibrateCount(3));
        findViewById(R.id.btn_dev_add_contact).setOnClickListener(v->{
            List<ContactEntry> contactEntries = new ArrayList<>();
            contactEntries.add(new ContactEntry("moDou","12345678911",1));
            commandManager.addContacts(contactEntries);
        });
        findViewById(R.id.btn_dev_get_contact).setOnClickListener(view -> {
            commandManager.getContactsInfo();
//            RcspOpImpl rcspOp = appApplication.watchManagerTest.watchManager;
//            ReadContactsTask task = new ReadContactsTask(rcspOp,this);
//            task.setListener(new SimpleTaskListener(){
//                @Override
//                public void onBegin() {
//                    Log.d("", "onBegin: ");
//                }
//
//                @Override
//                public void onError(int code, String msg) {
//                    Log.d("", "onError: "+msg);
//                }
//
//                @Override
//                public void onFinish() {
//                    List<DeviceContacts> contacts = task.getContacts();
//                    Log.d("", "onFinish: "+contacts.size());
//                }
//            });
//            task.start();
        });
        findViewById(R.id.btn_dev_dial_custom).setOnClickListener(v->   startActivity(new Intent(MainActivity.this,DialCustomActivity.class)));
//        findViewById(R.id.btn_dev_dial_recommend).setOnClickListener(v->   startActivity(new Intent(MainActivity.this,DialRecommendActivity.class)));
        findViewById(R.id.btn_dev_ota).setOnClickListener(v->   startActivity(new Intent(MainActivity.this,UpdateActivity.class)));
        findViewById(R.id.btn_dev_take_photo).setOnClickListener(v->   commandManager.sendTakePhoto(true));
        findViewById(R.id.btn_find_device).setOnClickListener(v->   commandManager.sendFindDevice());
        Switch sw_sync =  findViewById(R.id.sw_sync);
        sw_sync.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                commandManager.sendAutoSyncData(b);
            }
        });
        findViewById(R.id.btn_dev_restart).setOnClickListener(v->   commandManager.sendReboot(1));
        findViewById(R.id.btn_dev_factory_settings).setOnClickListener(v->   commandManager.sendReboot(2));
        findViewById(R.id.btn_dev_music).setOnClickListener(v->   startActivity(new Intent(MainActivity.this, MusicActivity.class)));
        findViewById(R.id.btn_dev_book).setOnClickListener(v->   startActivity(new Intent(MainActivity.this, BookActivity.class)));
        findViewById(R.id.btn_dev_audio).setOnClickListener(v->   startActivity(new Intent(MainActivity.this, AudioActivity.class)));
        findViewById(R.id.btn_dev_qr_code).setOnClickListener(v->   {
            String qq = "https://qm.qq.com/q/FEJRG53Aac";  //获取的QQ名片二维码地址
            byte[] bytes = qq.getBytes(StandardCharsets.UTF_8);
            commandManager.sendQRCode(bytes, QRCodeUtil.QQBusinessCard,bytes.length);
        });
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main, menu);
        menu.findItem(R.id.disconnect).setVisible(BLEConfig.getInstance().isConnected);
        if (AppApplication.getInstance().getBleService() == null)return super.onCreateOptionsMenu(menu);
        menu.findItem(R.id.connect).setVisible(
              AppApplication.getInstance().getBleService().getConnState() ==  AppApplication.getInstance().getBleService().CONN_STATE_DISCONNECTED);
        if  (AppApplication.getInstance().getBleService().getConnState() ==  AppApplication.getInstance().getBleService().CONN_STATE_CONNECTING) {
            menu.findItem(R.id.menu_refresh).setActionView(R.layout.actionbar_indeterminate_progress);
        } else {
            menu.findItem(R.id.menu_refresh).setActionView(null);
        }
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.search:
                // 搜索蓝牙
                startActivityForResult(new Intent(this, DeviceScanActivity.class), REQUEST_CODE);
                break;
            case R.id.disconnect:
                // 断开蓝牙连接
                commandManager.removeBond();
                timer = new Timer();
                timer.schedule(new TimerTask() {
                    @Override
                    public void run() {
                        timer.cancel();
                        timer = null;
                        appApplication.getBleService().disconnect();
                    }
                },2000L);
                break;
            case R.id.connect:
                // 连接蓝牙
                appApplication.getBleService().connect(bluetoothDevice);
//                invalidateOptionsMenu();
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    private void startServices() {
        Intent intent = new Intent(this, BleService.class);
        bindService(intent, mServiceConnection, Context.BIND_AUTO_CREATE);
    }

    private final ServiceConnection mServiceConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName componentName, IBinder service) {
            AppApplication.getInstance().setBleService(((BleService.LocalBinder) service).getService());
            onCallback();
        }

        @Override
        public void onServiceDisconnected(ComponentName componentName) {
            AppApplication.getInstance().setBleService(null);
        }
    };

    private void stopServices() {
        unbindService(mServiceConnection);
       if (AppApplication.getInstance().getBleService() != null)AppApplication.getInstance().getBleService().addDeviceConnectStatusCallback(this);
    }

    private void onCallback(){
        AppApplication.getInstance().getBleService().isPairDevice(true);
        AppApplication.getInstance().getBleService().addDeviceConnectStatusCallback(MainActivity.this::onConnectStatusCallback);
        AppApplication.getInstance().getBleService().addBatteryCallback(this);
        AppApplication.getInstance().getBleService().addDeviceInfoCallback(this);
        AppApplication.getInstance().getBleService().addHistoricalRealTimeCallback(this);
        AppApplication.getInstance().getBleService().addHistoryDetailedDataCallback(this);
        AppApplication.getInstance().getBleService().addHeartRateEtcCallback(this);
        AppApplication.getInstance().getBleService().addSportsDataCallback(this);
        AppApplication.getInstance().getBleService().addLanguageCallback(this);
        AppApplication.getInstance().getBleService().addPhoneCallback(this);
        AppApplication.getInstance().getBleService().addBrightnessCallback(this);
        AppApplication.getInstance().getBleService().addContactsCallback(this);
        invalidateOptionsMenu();
    }

    @Override
    public void onConnectStatusCallback(int mStatus) {
        Log.d("", "onConnectStatusCallback: "+mStatus);
         invalidateMenu();
         if (mStatus == 0){
             appApplication.firmwareInfo = null;
         }
    }

    @Override
    public void onBatteryCallback(int battery, boolean mBatteryStatusBool) {
        runOnUiThread(()->{
           String statusStr  = "";
           if (mBatteryStatusBool){
              statusStr = "充电中";
           }else {
              statusStr = "未充电";
           }
           String content = "battery："+battery+"\t\t状态："+statusStr;
           Toast.makeText(this,content,Toast.LENGTH_LONG).show();
           Log.d("", "onBatteryCallback: "+content);
        });
    }

    @Override
    public void onDeviceInfoCallback(@NonNull String productId, int deviceFuncs, @NonNull String firmwareVersion, int screenType, int localmusic) {
       runOnUiThread(()->{
           String localmusicStr = "";
           if (localmusic == 0){
               localmusicStr = "播放";
           }else if (localmusic == 8){
               localmusicStr = "未播";
           }
           String content = "产品id："+productId+"\t\t设备功能："+deviceFuncs+"\t\t固件版本："+firmwareVersion+"\n屏幕类型："+screenType+"\t\t本地音乐："+localmusicStr;
           Toast.makeText(this,content,Toast.LENGTH_LONG).show();
           Log.d("", "onDeviceInfoCallback: "+content);

           AppApplication.getInstance().getHttpDevFirmwareInfo();
       });
    }

    @Override
    public void onHistoricalRealTime(long timeInMillis, int step, int distance, int cal, int totalSleepTime, int deepSleepTime) {
        runOnUiThread(()->{
            String measureDate = TimeUtils.getYYYYMMdd(timeInMillis);
            String content = "时间："+measureDate+"\t\t步数："+step+"\t\t距离："+distance+"(m)\t\t卡路里："+cal+"\t\t(Kcal)总睡眠时间："+totalSleepTime+"(分)\n深睡时间："+deepSleepTime+"(分)";
            Toast.makeText(this,content,Toast.LENGTH_LONG).show();
            Log.d("", "onHistoricalRealTime: "+content);
        });
    }

    @Override
    public void onHistoryDetailedDataCallback(HistoryDetail historyDetail) {
        runOnUiThread(()->{
            String measureDate = TimeUtils.getYYYYMMdd(historyDetail.getTimeInMillis());
            String content = "时间："+measureDate+"\t\t步数："+historyDetail.getStep()+"\t\t距离："+historyDetail.getDistance()+"(m)\t\t卡路里："+historyDetail.getCal()
                    +"\t\t(Kcal)睡眠："+historyDetail.getSleepQualitys() +"\n(Kcal)心率："+historyDetail.getHeartRate()+
                    "bpm\t\t收缩压："+historyDetail.getSystolic()+"\t\t舒张压："+historyDetail.getDiastolic()+"\t\t血氧："+historyDetail.getBloodOxygen();
            Toast.makeText(this,content,Toast.LENGTH_LONG).show();
            Log.d("", "onHistoryDetailedDataCallback: "+content);
        });
    }

    @Override
    public void onHeartRateEtcCallback(long timeInMillis, int heartRate, int systolic, int diastolic, int bloodOxygen) {
        runOnUiThread(()->{
            String measureDate = TimeUtils.getYYYYMMdd(timeInMillis);
            String content = "时间："+measureDate+"\t\t心率："+heartRate+ "bpm\t\t收缩压："+systolic+"\t\t舒张压："+diastolic+"\t\t血氧："+bloodOxygen;
            Toast.makeText(this,content,Toast.LENGTH_LONG).show();
            Log.d("", "onHeartRateEtcCallback: "+content);
        });
    }

    //运动类型 （0室外步行，1室内步行，2室外跑步，3室内跑步，4 爬山，5 跳神，6 羽毛球，7 足球，8 篮球，9 户外骑行，10 滑冰，11 健身房，12 瑜伽，13 网球，14 乒乓球，15 游泳，16 性爱，
    // 17 健身单车，18 自由训练，19 远足， 20 平板支撑，21 划船机，22 排球，23 棒球，24 跑步机，25 椭圆机，26 举重，27，滑雪，
    // 28.室内骑行，29.泳池游泳，30，仰卧起坐，31.俯卧撑，32.有氧运动，33.健身操，34.舞蹈，35. 力量训练，36.自由活动，37.健走，38.跑步，39.骑行，40.登山，41.跳舞，42.潜游，
    // 43.跳水，44.漂流，45.冲浪，46.滑水，47.滑雪，48.高尔夫，49.速度滑冰 ）
    @Override
    public void onSportsDataCallback(long timeInMillis, int sportType, int step, int distance, int cal, int duration, boolean hasGps) {
        runOnUiThread(()->{
            String measureDate = TimeUtils.getYYYYMMdd(timeInMillis);
            String content = "无数据";
            if (duration > 0){
                content = "时间："+measureDate+ "\t\t运动类型："+sportType+ "\t\t步数："+step+"\t\t距离："+distance+"\t\t卡路里："+cal+
                        "\t\t运动时间："+duration+"\t\tGPS是否有："+hasGps;
            }
            Toast.makeText(this,content,Toast.LENGTH_LONG).show();
            Log.d("", "onSportsDataCallback: "+content);
        });
    }

    @Override
    public void onLanguageCallback(int language2) {
        runOnUiThread(()->{
            String content = "设置语言成功";
            if (Language != language2){
                content = "设置语言失败或设备不支持此语言";
            }
            Toast.makeText(this,content,Toast.LENGTH_LONG).show();
            Log.d("", "onLanguageCallback: "+content);
        });
    }

    @Override
    public void onPhoneCallback(int val) {
        runOnUiThread(()->{
            String content = "";
            if (val == 1){
                content = "找手机";
            }else if (val == 2){
                content = "拍照";
            }
            Toast.makeText(this,content,Toast.LENGTH_LONG).show();
            Log.d("", "onPhoneCallback: "+content);
        });
    }


    @Override
    public void onBeginReceived() { //开始获取联系人
        Log.d("", "开始获取联系人 ");
    }

    @Override
    public void onErrorReceived(int code, String msg) { //获取联系人异常状态
        Log.d("", "联系人异常： "+msg);
    }

    @Override
    public void onFinishReceived(List<DeviceContactsInfo> infos) { //返回联系人信息
        runOnUiThread(()->{
            Log.d("", "获取到的联系人数量： "+infos.size());
        });
    }

    @Override
    public void onBrightnessCallback(int grade, int duration, boolean mScreenSwitch) {
        runOnUiThread(()->{
            String content = "亮度等级："+grade+"\t\t亮屏时间："+duration+"抬手亮屏："+mScreenSwitch;
            Toast.makeText(this,content,Toast.LENGTH_LONG).show();
            Log.d("", "onBrightnessCallback: "+content);
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        if (requestCode == REQUEST_CODE && resultCode == RESULT_OK){
            if (data != null) {
                Bundle bundle = data.getBundleExtra("bundle");
                if (bundle != null) {
                    bluetoothDevice = (BluetoothDevice) bundle.getParcelable("device");
                    if (bluetoothDevice != null) {
                        if (!TextUtils.isEmpty(bluetoothDevice.getAddress())) {
                            actionBar.setSubtitle(bluetoothDevice.getAddress());
                            appApplication.getBleService().connect(bluetoothDevice);
//                            invalidateOptionsMenu();
                        }
                    }
                }
            }
        }
        super.onActivityResult(requestCode, resultCode, data);
    }
	
	

    @Override
    protected void onDestroy() {
        super.onDestroy();
        stopServices();
        appApplication.getBleService().disconnect();
    }
}