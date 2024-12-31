package com.guangji.livefit;

import static com.yalantis.ucrop.view.OverlayView.FREESTYLE_CROP_MODE_DISABLE;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.MenuItem;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;


import com.guangji.liblivefit.Utils.PcmToWavUtil;
import com.guangji.liblivefit.callback.DialCustomCallback;
import com.guangji.liblivefit.jieli.test.ITestTask;
import com.guangji.liblivefit.jieli.test.OnTestLogCallback;
import com.guangji.liblivefit.jieli.test.fattask.FatInsertBgTask;
import com.guangji.liblivefit.jieli.test.util.WatchTestConstant;
import com.guangji.liblivefit.manager.CommandManager;
import com.guangji.liblivefit.util.BLEConfig;
import com.guangji.liblivefit.util.DialInfoUtil;
import com.jieli.bmp_convert.BmpConvert;
import com.jieli.bmp_convert.OnConvertListener;
import com.jieli.component.utils.ToastUtil;
import com.jieli.jl_rcsp.model.response.ExternalFlashMsgResponse;
import com.jieli.jl_rcsp.tool.DeviceStatusManager;
import com.luck.picture.lib.PictureSelector;
import com.luck.picture.lib.config.PictureConfig;
import com.luck.picture.lib.config.PictureMimeType;
import com.luck.picture.lib.entity.LocalMedia;
import com.luck.picture.lib.listener.OnResultCallbackListener;

import java.io.File;
import java.util.List;
import java.util.Map;


public class DialCustomActivity extends AppCompatActivity implements DialCustomCallback {

    private ActionBar actionBar;

    private Button btn_send_dial_custom;
    private ImageView mImgDial;

    private boolean isBool = true;
    private int width = 0;
    private int height = 0;

    //图片选择或者拍照的图片路劲
    private String cutPath;
    private String watchName = "bgp_w900";
    private static final int SEND_DIAL_TIMEOUT = 1;

    private byte[] binBytes = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dial_custom);

        actionBar = getSupportActionBar();
        if(actionBar != null){
            actionBar.setHomeButtonEnabled(true);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setTitle("自定义表盘");
        }

        btn_send_dial_custom = findViewById(R.id.btn_send_dial_custom);
        btn_send_dial_custom.setOnClickListener(view -> {
            getWatchSysInfo();

            if (!BLEConfig.getInstance().isConnected){
                Toast.makeText(this,"设备未连接",Toast.LENGTH_SHORT).show();
                return;
            }

            if (width == 0 || height == 0){
                Toast.makeText(this,"设备信息获取失败",Toast.LENGTH_SHORT).show();
                return;
            }
            btn_send_dial_custom.setEnabled(false);

            if (BLEConfig.getInstance().productId != null && BLEConfig.getInstance().productId.contains("F")) {
                //杰里
                String outPath =  getExternalFilesDir(WatchTestConstant.DIR_WATCH_BG).getAbsoluteFile() + "/" + watchName;
                Log.e("表盘文件", outPath);
                File files = new File(outPath);
                if (files.exists()) {
                    files.delete();
                }
                //1.初始化图片转换对象
                BmpConvert bmpConvert = new BmpConvert();
                //判断算法类型
                int flag = BmpConvert.TYPE_BR_28; //AC701N-WATCH-SDK
                //flag = BmpConvert.TYPE_BR_28_ALPHA; //AC701N-WATCH-SDK - ARGB
                //flag = BmpConvert.TYPE_BR_23; //AC695N-WATCH-SDK
                //2.开始图像转换
                bmpConvert.bitmapConvert(flag, cutPath, outPath, new OnConvertListener() {
                    //回调转换开始
                    //path: 输入文件路径
                    @Override
                    public void onStart(String path) {

                    }

                    //回调转换结束
                    //result： 转换结果
                    //output： 输出文件路径
                    @Override
                    public void onStop(boolean result, String output) {
                        File file = new File(output);
                        Log.e("图片转文件", result + "---->" + output + "---->是否存在:" + file.exists());
                        if (result) {
                            //成功
                            showAddDialog11(outPath);
                        } else {
                            //失败
                        }
                    }
                });

            }
        });

        mImgDial = findViewById(R.id.img_dial);
        mImgDial.setOnClickListener(view -> {
            if (width == 0 || height == 0){
                Toast.makeText(this,"设备信息获取失败",Toast.LENGTH_SHORT).show();
                return;
            }
            pictureSelector();
        });
        getWatchSysInfo();
        AppApplication.getInstance().getBleService().addDialCustomCallback(this);
    }

    /**
     * 拍照/选择照片
     */
    private void pictureSelector() {
            // 相册
            PictureSelector.create(this)
                    .openGallery(PictureMimeType.ofImage())
                    .theme(R.style.picture_default_style)
                    .imageEngine(GlideEngine.createGlideEngine())
                    .isPreviewImage(false)
                    .isPreviewVideo(false)
                    .isEnablePreviewAudio(false)
                    .isCamera(false)
                    .isZoomAnim(true)
                    .isEnableCrop(true)
                    .synOrAsy(false)
                    .hideBottomControls(true)
                    .isGif(false)
                    .selectionMode(PictureConfig.SINGLE) // 多选 or 单选
                    .imageSpanCount(4) // 每行显示个数
                    .isSingleDirectReturn(true)
                    .freeStyleCropMode(FREESTYLE_CROP_MODE_DISABLE)
                    .circleDimmedLayer(false)
                    .showCropFrame(true)
                    .showCropGrid(true)
                    .cropImageWideHigh(width, height)
                    .withAspectRatio(width, height)
                    .isOpenClickSound(false)
                    .isCompress(true)
                    .isDragFrame(false)
                    .minimumCompressSize(100)
                    .forResult(callbackListener);
    }

    private OnResultCallbackListener callbackListener = new OnResultCallbackListener<LocalMedia>() {
        @Override
        public void onResult(List<LocalMedia> result) {
            if (result != null && !result.isEmpty()) {
                LocalMedia localMedia = result.get(0);
                cutPath = localMedia.getCutPath();
                Bitmap bitmap = BitmapFactory.decodeFile(cutPath);
                Log.e("图片路劲", cutPath);
                Bitmap newBitmap = PcmToWavUtil.scaleBitmap(bitmap, width, height);
                mImgDial.setImageBitmap(newBitmap);
//                bitmapBytes = ConvertUtils.bitmap2RGB565(newBitmap);
                btn_send_dial_custom.setText("发送自定义表盘");
            }
        }

        @Override
        public void onCancel() {
            Log.d("","onCancel");
        }
    };

    private void showAddDialog11(String path) {
        Log.e("路劲", "path:" + path);
        ITestTask task = new FatInsertBgTask(AppApplication.getInstance().watchManagerTest.getWatchManager(), path);
        task.setOnTestLogCallback(new OnTestLogCallback() {
            @Override
            public void onLog(String log) {
                btn_send_dial_custom.setText(log);
            }
        });
        task.setINextTask(error -> {
            runOnUiThread(()->{
                if (error.code == 0) {
                    if (btn_send_dial_custom != null) {
                        btn_send_dial_custom.setText("插入成功");
                        CommandManager.isDrawableSending =false;
                        btn_send_dial_custom.setEnabled(true);
                    }
                } else {
                    if (btn_send_dial_custom != null) {
                        btn_send_dial_custom.setText("插入失败");
                        CommandManager.isDrawableSending =false;
                        btn_send_dial_custom.setEnabled(true);
                    }
                }
            });
        });
        task.startTest();
    }

    private void getWatchSysInfo(){
        if (isBool){
            //获取缓存的手表系统信息
            ExternalFlashMsgResponse watchSysInfo = DeviceStatusManager.getInstance().getExtFlashMsg(AppApplication.getInstance().getBleService().myDevice);
            if(null == watchSysInfo) return;
//            width = watchSysInfo.getScreenWidth();    //手表屏幕的宽度
//            height = watchSysInfo.getScreenHeight();

//            Log.d("", "getScreenWidth: "+watchSysInfo.getScreenWidth());
//            Log.d("", "getScreenHeight: "+watchSysInfo.getScreenHeight());

            Map<String, Integer> widthAndHeight = DialInfoUtil.getWidthAndHeight();
             width = widthAndHeight.get("width");
             height = widthAndHeight.get("height");
//            Log.d("", "width: "+width);
//            Log.d("", "height: "+height);

            isBool = false;
        }
    }

    @Override
    public void onDialCustomStateCallback(int state) {
        runOnUiThread(()->{
            switch (state){
                case 0:
                    if (CommandManager.isDrawableSending) {
                        CommandManager.isDrawableSending = false;
                        if (btn_send_dial_custom != null) {
                            btn_send_dial_custom.setText("安装失败");
                            btn_send_dial_custom.setEnabled(true);
                        }
                    }
                    break;
                case 65:
                    // flash 擦除成功
                    if (CommandManager.isDrawableSending) {
                        handler.removeMessages(SEND_DIAL_TIMEOUT);
                        CommandManager.getInstance(this).sendMTUCommand(132);
                    }
                    break;
            }
        });
    }

    @SuppressLint("HandlerLeak")
    private Handler handler = new Handler() {
        @Override
        public void handleMessage(@NonNull Message msg) {
            super.handleMessage(msg);
            switch (msg.what) {
                case SEND_DIAL_TIMEOUT:
                    if (btn_send_dial_custom != null) {
                        btn_send_dial_custom.setText("安装失败");
                        btn_send_dial_custom.setEnabled(true);
                    }
                    CommandManager.isDrawableSending = false;
                    break;
            }
        }
    };

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        switch (item.getItemId()){
            case android.R.id.home:
                finish();
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        handler.removeCallbacksAndMessages(null);
    }
}