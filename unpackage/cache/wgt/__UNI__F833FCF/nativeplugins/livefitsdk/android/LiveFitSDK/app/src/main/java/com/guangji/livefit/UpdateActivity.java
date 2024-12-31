package com.guangji.livefit;

import android.bluetooth.BluetoothDevice;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.LifecycleOwner;

import com.guangji.liblivefit.Utils.CloseUtils;
import com.guangji.liblivefit.Utils.SDCardUtils;
import com.guangji.liblivefit.callback.OTAUpdateCallback;
import com.guangji.liblivefit.jieli.ui.upgrade.OtaState;
import com.guangji.liblivefit.jieli.ui.upgrade.UpgradeViewModel2;
import com.guangji.liblivefit.service.BleService;
import com.guangji.liblivefit.util.BLEConfig;
import com.jieli.jl_bt_ota.model.response.TargetInfoResponse;
import com.realsil.sdk.dfu.DfuConstants;
import com.realsil.sdk.dfu.model.DfuProgressInfo;
import com.realsil.sdk.dfu.model.OtaDeviceInfo;
import com.realsil.sdk.dfu.model.Throughput;
import com.realsil.sdk.dfu.support.DfuHelperImpl;
import com.realsil.sdk.dfu.utils.DfuAdapter;
import com.realsil.sdk.dfu.utils.GattDfuAdapter;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Locale;


public class UpdateActivity extends AppCompatActivity implements OTAUpdateCallback,LifecycleOwner {

    private ActionBar actionBar;
    private Button btnUpdate;
    private TextView tvTxt;

    private UpgradeViewModel2 mViewModel;
    private boolean isUpdating;
    private GattDfuAdapter dfuHelper;
    protected OtaDeviceInfo mOtaDeviceInfo;

    private String address = "";
    private String replyAddress = "";
    private File otaFile;
    private String download_firmware_url = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_update);

        actionBar = getSupportActionBar();
        if(actionBar != null){
            actionBar.setHomeButtonEnabled(true);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setTitle("OTA升级");
        }

        btnUpdate = findViewById(R.id.btn_update);
        btnUpdate.setOnClickListener(view -> {
            // 开始升级
            BLEConfig.getInstance().isota = 1;
            if (getString(R.string.ota_complete).equals(btnUpdate.getText().toString())) {
                BLEConfig.getInstance().isota = 0;
                finish();
            } else {
                if (isUpdating) {
                    return;
                }
                isUpdating = true;
                System.out.println("开始固件升级"+mViewModel.isInitOK());
                if (!mViewModel.isInitOK()) {
                    System.out.println("没有初始化isInitOTAOK");
                    Toast.makeText(this,"没有初始化isInitOTAOK",Toast.LENGTH_SHORT).show();
                    isUpdating = false;
                    return;
                }

                TargetInfoResponse deviceInfo = mViewModel.getDeviceInfo();
                if (null == deviceInfo) {
                    System.out.println("没有初始化ota");
                    Toast.makeText(this,"没有初始化ota",Toast.LENGTH_SHORT).show();
                    isUpdating = false;
                    return;
                }
//                address = BleService.myDevice.getAddress();
//                System.out.println("开始下载固件");
//                new DownloadOtaTask().execute();
                startOta();
            }
            BLEConfig.getInstance().isota=0;
        });

        tvTxt = findViewById(R.id.tv_txt);

        mViewModel = new UpgradeViewModel2(this,this);
        dfuHelper = GattDfuAdapter.getInstance(this);
        observeCallback();
        boolean ret = dfuHelper.initialize(mDfuHelperCallback);

//        if (AppApplication.getInstance().firmwareInfo != null){
//            if (AppApplication.getInstance().firmwareInfo.getVersion() > BLEConfig.getInstance().firmwareVersion2){
                btnUpdate.setText("OTA升级");
                btnUpdate.setClickable(true);
//                this.download_firmware_url = AppApplication.getInstance().firmwareInfo.getUrl();
//            }
//        }else if (AppApplication.getInstance().getBleService().getConnState() > 1){
//             btnUpdate.setText("服务器信息获取失败");
//             btnUpdate.setClickable(false);
//        }
    }

    private DfuAdapter.DfuHelperCallback mDfuHelperCallback = new DfuAdapter.DfuHelperCallback() {
        @Override
        public void onStateChanged(int status) {
            super.onStateChanged(status);
            Log.d("", "onStateChanged: "+status);
            if (status == DfuAdapter.STATE_INIT_OK) {

            } else if (status == DfuAdapter.STATE_PREPARED) {
                mOtaDeviceInfo = dfuHelper.getOtaDeviceInfo();
            } else if (status == DfuAdapter.STATE_DISCONNECTED || status == DfuAdapter.STATE_CONNECT_FAILED) {
                if (isUpdating) {
                    otaFailed();
                }
            }
        }

        @Override
        public void onProcessStateChanged(int status, Throughput throughput) {
            super.onProcessStateChanged(status, throughput);
            String message = getString(DfuHelperImpl.getProgressStateResId(status));
            Log.d("", "onProcessStateChanged status:" + status + ", message:" + message);
            if (status == DfuConstants.PROGRESS_IMAGE_ACTIVE_SUCCESS) {
                // OTA升级成功
                runOnUiThread(() -> {
                    isUpdating = false;
                    mOtaDeviceInfo = null;
                    btnUpdate.setText(R.string.ota_complete);
//                    handler.sendEmptyMessageDelayed(CONNECT_DEVICE, 2000L);
                });
            }
        }

        @Override
        public void onProgressChanged(DfuProgressInfo dfuProgressInfo) {
            super.onProgressChanged(dfuProgressInfo);
            Log.d("","onProgressChanged");
            if (dfuProgressInfo != null) {
                Log.d("","dfuProgressInfo"+dfuProgressInfo.toString());
                int progress = dfuProgressInfo.getProgress();
                btnUpdate.setText(String.format(Locale.ROOT, getString(R.string.updating_d), progress));
            }
        }

        @Override
        public void onError(int type, int code) {
            super.onError(type, code);
            Log.e("", "onError type:" + type + ", code:" + code);
            runOnUiThread(() -> {
                otaFailed();
            });
        }
    };


    private void observeCallback() {
        mViewModel.mOtaStateMLD.observe( this, otaState -> runOnUiThread(() -> {
            switch (otaState.getState()) {
                case OtaState.OTA_STATE_PREPARE:
//                    updateOtaBtn(true, true);
                    break;
                case OtaState.OTA_STATE_START: {
                    String text;
                    if (otaState.getOtaType() == OtaState.OTA_TYPE_OTA_UPDATE_RESOURCE) {
                        text = getString(R.string.update_resource_tips, otaState.getOtaIndex(), otaState.getOtaTotal());
                    } else {
                        text = getString(R.string.ota_checking_upgrade_file);
                    }
                    tvTxt.setText(text);
                    break;
                }
                case OtaState.OTA_STATE_WORKING: {
                    int progress = Math.round(otaState.getOtaProgress()) >= 100 ? 100 : Math.round(otaState.getOtaProgress()) % 100;
                    btnUpdate.setText(String.format(Locale.ROOT, getString(R.string.updating_d), progress));
                    break;
                }
                case OtaState.OTA_STATE_STOP: {
                    String result = getString(R.string.ota_upgrade_failed);
                    isUpdating = false;
                    switch (otaState.getStopResult()) {
                        case OtaState.OTA_RES_SUCCESS:
                            BLEConfig.getInstance().isota = 0;
                            result = getString(R.string.ota_complete);
                            btnUpdate.setText(R.string.ota_complete);
                            btnUpdate.setText(result);
                            break;
                        case OtaState.OTA_RES_CANCEL:
                            result = getString(R.string.ota_upgrade_cancel);
                            btnUpdate.setText(result);
                            otaFailed();
                            break;
                        case OtaState.OTA_RES_FAILED:
                            otaFailed();
                            break;
                    }
                    break;
                }
                default:
//                    updateOtaBtn(mViewModel.isInitOK(), true);
                    break;
            }
        }));
    }

    private void otaFailed() {
        /* if (isUpdating) */{
            isUpdating = false;
            mOtaDeviceInfo = null;
            btnUpdate.setText(R.string.update_fail);
        }
    }

    private void startOta() {
        String productId2 = BLEConfig.getInstance().productId;
        if (productId2 != null && productId2.contains("F")) {
            String mPath = getExternalFilesDir("upgrade").getPath()+"/upgrade.zip";  //GW55 upgrade.zip测试包
//            String mPath = otaFile.getPath();
            mViewModel.startOTA(mPath);
        }
    }

    @Override
    public void onProgressReceived(@NonNull OtaState otaState) {  //升级进度
        switch (otaState.getState()) {
            case OtaState.OTA_STATE_PREPARE:
                break;
            case OtaState.OTA_STATE_START: {

                String text;
                if (otaState.getOtaType() == OtaState.OTA_TYPE_OTA_UPDATE_RESOURCE) {
                    text = getString(R.string.update_resource_tips, otaState.getOtaIndex(), otaState.getOtaTotal());
                } else {
                    text = getString(R.string.ota_checking_upgrade_file);
                }
                tvTxt.setText(text);
                break;
            }
            case OtaState.OTA_STATE_WORKING: {

                int progress = Math.round(otaState.getOtaProgress()) >= 100 ? 100 : Math.round(otaState.getOtaProgress()) % 100;
                btnUpdate.setText(String.format(Locale.ROOT, getString(R.string.updating_d), progress));
                break;
            }
            case OtaState.OTA_STATE_STOP: {
                String result = getString(R.string.ota_upgrade_failed);
                isUpdating = false;
                switch (otaState.getStopResult()) {
                    case OtaState.OTA_RES_SUCCESS:
                        BLEConfig.getInstance().isota = 0;
                        result = getString(R.string.ota_complete);
                        btnUpdate.setText(result);
                        break;
                    case OtaState.OTA_RES_CANCEL:
                        result = getString(R.string.ota_upgrade_cancel);
                        btnUpdate.setText(result);
                        otaFailed();
                        break;
                    case OtaState.OTA_RES_FAILED:
                        otaFailed();
                        break;
                }
                break;
            }
            default:
                break;
        }
    }

    @Override
    public void onOTAConnectBluetoothDevice(BluetoothDevice device) {  //OTA变动的mac地址
        Log.d("", "onOTAConnectBluetoothDevice: "+device.getAddress());
        AppApplication.getInstance().getBleService().connect(device.getAddress(),false);
    }

    @Override
    public void onReplyAddressReceived(@NonNull String address) {  //升级后复原的回连地址
        Log.d("", "onReplyAddressReceived: "+address);
        this.replyAddress = address;
    }

    @Override
    public void onStopOTA() { //升级结束
        Log.d("", "onStopOTA: ");
        BluetoothDevice device = AppApplication.getInstance().getBleService().mBluetoothAdapter.getRemoteDevice(address);
        if (device == null){
            AppApplication.getInstance().getBleService().connect(device.getAddress(),true);
        }else {
            //扫描连接
        }
    }

    private class DownloadOtaTask extends AsyncTask<Void, Integer, Void> {

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            btnUpdate.setText(getString(R.string.downloading));
        }

        @Override
        protected Void doInBackground(Void... params) {
            Log.i("", "download_firmware_url:" + download_firmware_url);
            InputStream is = null;
            FileOutputStream fos = null;
            try {
                URL url = new URL(download_firmware_url);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestProperty("Accept-Encoding", "identity");
                conn.setRequestMethod("GET");
                conn.connect();
                int responseCode = conn.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    // 获取文件大小
                    int length = conn.getContentLength();
                    Log.d("", "length:" + length);

                    String download_path = SDCardUtils.getSDCradCacheDir(UpdateActivity.this, "");
                    String productId2 = BLEConfig.getInstance().productId;
                    Log.i("", "productId2 = " + productId2 + ", path = " + download_path);
                    if (productId2.equals("152F00")) {
                        otaFile = new File("/storage/emulated/0/Android/data/com.guangji.livefit_sdk/saveFile/", "ota.dat");
                    } else {
                        if (productId2 != null && productId2.contains("F")) {
                            if (download_firmware_url.toLowerCase().contains(".ufw")) {
                                otaFile = new File(download_path, "ota.ufw");
                            } else if (download_firmware_url.toLowerCase().contains(".buf")) {
                                otaFile = new File(download_path, "ota.buf");
                            } else if (download_firmware_url.toLowerCase().contains(".zip")) {
                                otaFile = new File(download_path, "ota.zip");
                            }
                        } else {
                            otaFile = new File(download_path, "ota.bin");
                        }
                    }

                    // 获取内容
                    is = conn.getInputStream();
                    if (otaFile.exists()) {
                        otaFile.delete();
                    }
                    fos = new FileOutputStream(otaFile);
                    byte[] buffer = new byte[1024];
                    int len = 0;
                    long totalCount = 0;
                    while ((len = is.read(buffer, 0, 1024)) != -1) {
                        fos.write(buffer, 0, len);
                        totalCount += len;
                        // 下载进度
                        int progress = (int) (totalCount * 100 / length);
                        publishProgress(progress);
                    }
                }
                conn.disconnect();
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                CloseUtils.closeIO(is, fos);
            }
            return null;
        }

        @Override
        protected void onProgressUpdate(Integer... values) {
            super.onProgressUpdate(values);
            // 更新下载进度
            if (values.length > 0) {
                int downloadProgress = values[0];
                btnUpdate.setText(getString(R.string.downloading) + downloadProgress + "%");
                if (downloadProgress == 100) {
                    // 下载成功，开始固件升级
                    startOta();
                }
            }
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
}