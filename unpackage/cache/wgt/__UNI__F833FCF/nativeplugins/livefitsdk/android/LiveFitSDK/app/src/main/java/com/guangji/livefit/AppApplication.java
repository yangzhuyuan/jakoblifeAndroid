package com.guangji.livefit;

import android.app.Application;
import android.content.Context;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.multidex.MultiDex;

import com.guangji.liblivefit.Utils.TimeUtils;
import com.guangji.liblivefit.jieli.WatchManagerTest;
import com.guangji.liblivefit.manager.CommandManager;
import com.guangji.liblivefit.service.BleService;
import com.guangji.liblivefit.util.BLEConfig;
import com.guangji.liblivefit.util.DialInfoUtil;
import com.jieli.jl_filebrowse.bean.FileStruct;
import com.jieli.jl_filebrowse.bean.Folder;
import com.jieli.jl_filebrowse.bean.SDCardBean;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.Date;
import java.util.Map;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;


public class AppApplication  extends Application {

    private BleService mBleService;

    private static AppApplication mInstance = null;
    public WatchManagerTest watchManagerTest;
    public CommandManager mCommandManager;

    public SDCardBean sdCardBean;
    public Folder currentFolder;

    public FileStruct fileStruct;

    private static String url = "http://www.m-livefit.com/tp_livefit/public/index.php/";
    public FirmwareInfo firmwareInfo = null;

    public int width = 0;
    public int height = 0;

    @Override
    public void onCreate() {
        super.onCreate();
        mInstance = this;
        mCommandManager = CommandManager.getInstance(this);
        watchManagerTest = mCommandManager.getWatchManagerTest();

        MultiDex.install(this);

        BLEConfig.getInstance().mPath = getExternalCacheDir().getPath();
        BLEConfig.getInstance().fileName = "/ble_log"+ TimeUtils.getYYYYMMddHHmmss(new Date().getTime())+".txt";
    }

    public static AppApplication getInstance() {
        return mInstance;
    }


    public BleService getBleService() {
        return mBleService;
    }

    public void setBleService(BleService bleService) {
        this.mBleService = bleService;
    }

    public static int dip2px(Context context, float dpValue) {
        // 获取当前手机的像素密度（1个dp对应几个px）
        float scale = context.getResources().getDisplayMetrics().density;
        return (int) (dpValue * scale + 0.5f); // 四舍五入取整
    }

    /**
     * 获取服务器上的固件信息包含（升级包链接）
     */
    public void getHttpDevFirmwareInfo(){
        Log.d("", "version: "+BLEConfig.getInstance().firmwareVersion2);
        Log.d("", "productId: "+BLEConfig.getInstance().productId);
        try {
            StringBuilder builder = new StringBuilder("?version="+BLEConfig.getInstance().firmwareVersion2);
            builder.append("&productId="+BLEConfig.getInstance().productId);
            String url2 = url+"api/firmware/getInfo"+builder.toString();
           OkHttpClient client = OkHttpUtils.getInstance();
            Request request = new Request.Builder()
                    .url(url2)
                    .build();
            client.newCall(request).enqueue(new Callback() {
                @Override
                public void onFailure(@NonNull Call call, @NonNull IOException e) {
                    Log.e("", "onFailure: "+e.toString());
                }

                @Override
                public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                    try {
                        ResponseBody body = response.body();
                        JSONObject jsonObject = new JSONObject(body.string());
                        int code = jsonObject.getInt("code");
                        if (code == 200){
                            JSONObject jsonObject1 = jsonObject.getJSONObject("data");
                            if (jsonObject1.length() > 0){
                                int  version = jsonObject1.getInt("version");
                                String url =  jsonObject1.getString("url");
                                String upContent =  jsonObject1.getString("upContent");
                                firmwareInfo = new FirmwareInfo(version,url,upContent);
                                Log.d("", "onResponse: "+firmwareInfo.toString());
                            }else {
                                firmwareInfo = null;
                                Log.d("", "onResponse: 没有该设备升级包");
                            }
                        }
                    } catch (JSONException e) {
                        throw new RuntimeException(e);
                    }
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
