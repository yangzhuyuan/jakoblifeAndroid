package com.guangji.livefit;

import android.Manifest;
import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.MenuItem;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;


import com.guangji.liblivefit.callback.ScanDeviceCallback;
import com.guangji.liblivefit.mvp.presenter.ScanDevicePresenter;
import com.guangji.liblivefit.service.BleService;
import com.guangji.liblivefit.util.BLEConfig;
import com.guangji.liblivefit.util.ParsedAd;
import com.guangji.liblivefit.util.PermissionUtils;
import com.guangji.livefit.adapter.DeviceListAdapter;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class DeviceScanActivity extends AppCompatActivity  implements ScanDeviceCallback {

    private ActionBar actionBar;

    private static final  String TAG = "DeviceScanActivity";

    private static final int REQUEST_ENABLE_BT = 1;
    private static final int REQUEST_PERMISSION_CODE = 2;

    private static final int STOP_SCAN = 1;

    private String[] permissions = new String[]{
            Manifest.permission.ACCESS_COARSE_LOCATION,
            Manifest.permission.ACCESS_FINE_LOCATION
    };

    private SwipeRefreshLayout swipeRefreshLayout;

    private RecyclerView recyclerView;
    private DeviceListAdapter adapter;

    private boolean isScanning;
    private static final int REQUEST_CODE = 1;

    private ScanDevicePresenter mScanDevicePresenter;
    public static Map<String, byte[]> mDevRssiValues2 = new HashMap<>();

    @SuppressLint("HandlerLeak")
    private Handler handler = new Handler() {
        @Override
        public void handleMessage(@NonNull Message msg) {
            switch (msg.what) {
                case STOP_SCAN:
                    if (swipeRefreshLayout.isRefreshing())swipeRefreshLayout.setRefreshing(false);
                    scanLeDevice(false);
                    break;
            }
        }
    };

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_device_scan);
        swipeRefreshLayout = findViewById(R.id.refresh);
        mScanDevicePresenter = ScanDevicePresenter.getInstance(this);
        mScanDevicePresenter.addScanDeviceCallback(this);
        permissions = initPermissions2();
        init();

        actionBar = getSupportActionBar();
        if(actionBar != null){
            actionBar.setHomeButtonEnabled(true);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setTitle("扫描");
        }
    }

    private void init() {
        getSupportActionBar().setTitle("设备列表");
        initAdapter();
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                //重搜
                adapter.clearDevices();
                enableBle();
            }
        });
        enableBle();
    }

    private void initAdapter() {
        recyclerView = findViewById(R.id.recyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(
                this, LinearLayoutManager.VERTICAL, false));
        adapter = new DeviceListAdapter();
        adapter.setOnItemClickListener(new DeviceListAdapter.OnItemClickListener() {
            @Override
            public void onAdapterViewClick(int position) {
                BluetoothDevice bluetoothDevice = adapter.getItemAtPosition(position);
                Intent intent = new Intent();
                Bundle bundle = new Bundle();
                bundle.putParcelable("device", bluetoothDevice);
                intent.putExtra("bundle", bundle);
                setResult(RESULT_OK, intent);


                byte[] bytes = adapter.mDevRssiValues2.get(bluetoothDevice.getAddress());
                ParsedAd parsedAd = parseData(bytes);
                Log.i(TAG, "getManufacturer===" + parsedAd.getManufacturer());
                BLEConfig.getInstance().setNum(DeviceScanActivity.this,parsedAd.getManufacturer());

                if (parsedAd.getManufacturer() == 1494) {
                    BLEConfig.getInstance().productionType = 1;
                    System.out.println("type========" + parsedAd.type);
                    //0开启设备认证,1是关闭了设备认证
                    if (parsedAd.type == 1) {
                        BleService.USE_JL_DEVICE_AUTH = false;
                        BLEConfig.getInstance().putUSE_JL_DEVICE_AUTH(DeviceScanActivity.this,false);
                    } else {
//                          BleService.USE_JL_DEVICE_AUTH=true;
                        BLEConfig.getInstance().putUSE_JL_DEVICE_AUTH(DeviceScanActivity.this,true);
                    }
                } else {
                    BLEConfig.getInstance().putUSE_JL_DEVICE_AUTH(DeviceScanActivity.this,false);
                    BLEConfig.getInstance().productionType = 2;
                }

                finish();
            }
        });
        recyclerView.setAdapter(adapter);
    }

    /**
     * 检查蓝牙是否打开
     */
    private void enableBle() {
        if (mScanDevicePresenter.checkSupportBle()){
            if (!mScanDevicePresenter.enableBle()) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                    initPermissions();
                }else {
                    // 开启蓝牙
                    Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
                    if (getPackageManager().resolveActivity(enableBtIntent, PackageManager.MATCH_DEFAULT_ONLY) != null) {
                        try {
                            startActivityForResult(enableBtIntent, REQUEST_CODE);
                        } catch (ActivityNotFoundException e) {
                            e.printStackTrace();
                        }
                    }
                }
            } else {
                initPermissions();
            }
        }else {
            Log.e(TAG, "改手机不支持蓝牙" );
        }
    }


    /**
     * android6.0动态加权限
     */
    private void initPermissions() {
        PermissionUtils.requestPermissions(this, REQUEST_PERMISSION_CODE, permissions,
                new PermissionUtils.OnPermissionListener() {
                    @Override
                    public void onPermissionGranted() {
                        if (!mScanDevicePresenter.enableBle()) {
                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                                // 开启蓝牙
                                Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
                                if (getPackageManager().resolveActivity(enableBtIntent, PackageManager.MATCH_DEFAULT_ONLY) != null) {
                                    try {
                                        startActivityForResult(enableBtIntent, REQUEST_CODE);
                                    } catch (ActivityNotFoundException e) {
                                        e.printStackTrace();
                                    }
                                }
                            }
                        }else {
                            scanLeDevice(true);
                            handler.sendEmptyMessageDelayed(STOP_SCAN, 10000);
                        }
                    }

                    @Override
                    public void onPermissionDenied(String[] deniedPermissions) {
                        Toast.makeText(DeviceScanActivity.this, "拒绝定位服务权限", Toast.LENGTH_LONG).show();
                    }
                });
    }

    /**
     * 扫描或停止扫描蓝牙设备
     */
    private void scanLeDevice(final boolean enable) {
        isScanning = enable;
        if (enable) {
            mScanDevicePresenter.startScan();
            handler.sendEmptyMessageDelayed(STOP_SCAN, 10_000);
        } else {
            mScanDevicePresenter.stopScan();
        }
        invalidateOptionsMenu();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQUEST_ENABLE_BT) {
            if (resultCode == RESULT_CANCELED) {
                Toast.makeText(this, "拒绝打开蓝牙", Toast.LENGTH_LONG).show();
            } else {
                initPermissions();
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        PermissionUtils.onRequestPermissionsResult(this, requestCode, permissions, grantResults);
    }

    @Override
    public void onScanCallback(BluetoothDevice device, int rssi, byte[] bytes) {
        adapter.addDevices(device, rssi,bytes);
    }

    public static ParsedAd parseData(byte[] adv_data) {
        ParsedAd parsedAd = new ParsedAd();
        ByteBuffer buffer = ByteBuffer.wrap(adv_data).order(ByteOrder.LITTLE_ENDIAN);
        while (buffer.remaining() > 2) {
            byte length = buffer.get();
            if (length == 0)
                break;
            byte type = buffer.get();
            length -= 1;
            switch (type) {
                case (byte) 0xFF: // Manufacturer Specific Data
                    if (buffer.remaining() > 0) {
                        try {
                            parsedAd.manufacturer = buffer.getShort();
                        } catch (Exception e) {
                            Log.e(TAG, "广播数据解析失败" + e.getMessage());
                        }
                    }

                    for (int i = 0; i < 12; i++) {
                        if (buffer.remaining() > 0) {
                            byte b = buffer.get();
                        }
                    }
                    if (buffer.remaining() > 0) {
                        byte b = buffer.get();
                        int bit = getBit(b, 7);

                        parsedAd.type = bit;
                    }

                    // 1是关闭了设备认证  开了是0
                    //  parsedAd.manufacturer = buffer.getShort();
                    if (buffer.remaining() > 0) {
                        byte b1 = buffer.get();
                        char c = (char) (b1);
                        if (buffer.remaining() > 0) {
                            byte b2 = buffer.get();
                            char c2 = (char) (b2);
                            parsedAd.com = String.valueOf(c) + String.valueOf(c2);
                            length -= 18;
                        }
                    }
                    break;
                default:
                    break;
            }
        }
        return parsedAd;
    }

    public static int getBit(byte b, int i) {
        int bit = (int) ((b >> i) & 0x1);
        return bit;
    }

    @Override
    protected void onStop() {
        super.onStop();
        if (isScanning) {
            scanLeDevice(false);
            adapter.clearDevices();
        }
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        switch (item.getItemId()){
            case android.R.id.home:
                finish();
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    private String[] initPermissions2(){
        List<String> list=new ArrayList<>();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            list.add(Manifest.permission.BLUETOOTH_SCAN)  ;
            list.add(Manifest.permission.BLUETOOTH_CONNECT)  ;
            list.add(Manifest.permission.ACCESS_COARSE_LOCATION)  ;
            list.add(Manifest.permission.ACCESS_FINE_LOCATION)  ;
        }else {
            list.add(Manifest.permission.READ_EXTERNAL_STORAGE);
            list.add(Manifest.permission.ACCESS_COARSE_LOCATION) ;
            list.add(Manifest.permission.ACCESS_FINE_LOCATION)  ;
        }
        return list.toArray(new String[list.size()]);
    }
}
