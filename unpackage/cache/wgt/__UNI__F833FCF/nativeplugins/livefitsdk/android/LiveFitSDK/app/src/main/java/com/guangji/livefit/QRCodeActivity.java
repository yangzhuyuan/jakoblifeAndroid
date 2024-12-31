package com.guangji.livefit;

import static com.yalantis.ucrop.view.OverlayView.FREESTYLE_CROP_MODE_DISABLE;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;

import com.guangji.liblivefit.Utils.PcmToWavUtil;
import com.luck.picture.lib.PictureSelector;
import com.luck.picture.lib.config.PictureConfig;
import com.luck.picture.lib.config.PictureMimeType;
import com.luck.picture.lib.entity.LocalMedia;
import com.luck.picture.lib.listener.OnResultCallbackListener;

import java.util.List;

public class QRCodeActivity extends AppCompatActivity {

    private ActionBar actionBar;

    private ImageView mImage;
    private Button mBtnBind;

    private String cutPath;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_qrcode);

        actionBar = getSupportActionBar();
        if(actionBar != null){
            actionBar.setHomeButtonEnabled(true);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setTitle("二维码");
        }

        mImage = findViewById(R.id.image_view3);
        mImage.setOnClickListener(view -> {
            pictureSelector();
        });

        mBtnBind = findViewById(R.id.btn_bind);
        mBtnBind.setOnClickListener(view -> {

        });
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
                .isEnableCrop(false)
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
                .isOpenClickSound(false)
                .isCompress(true)
                .isDragFrame(false)
                .minimumCompressSize(100)
                .forResult(callbackListener);
    }

    private OnResultCallbackListener callbackListener = new OnResultCallbackListener<LocalMedia>() {
        @Override
        public void onResult(List<LocalMedia> result) {
            runOnUiThread(()->{
                if (result != null && !result.isEmpty()) {
                    LocalMedia localMedia = result.get(0);
                    cutPath = localMedia.getPath();
                    Bitmap bitmap = BitmapFactory.decodeFile(cutPath);
                    mImage.setImageBitmap(bitmap);
                    mBtnBind.setText("发送二维码");
                    mBtnBind.setVisibility(View.VISIBLE);
                }
            });
        }

        @Override
        public void onCancel() {
            Log.d("","onCancel");
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
}