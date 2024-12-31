package com.guangji.livefit;

import android.media.MediaPlayer;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.SeekBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;

import com.arthenica.ffmpegkit.FFmpegKit;
import com.arthenica.ffmpegkit.FFmpegSession;
import com.guangji.liblivefit.jieli.WatchManagerDemo;
import com.jieli.jl_filebrowse.FileBrowseManager;
import com.jieli.jl_filebrowse.bean.FileStruct;
import com.jieli.jl_rcsp.task.GetFileByClusterTask;
import com.jieli.jl_rcsp.task.TaskListener;

import java.io.File;
import java.io.IOException;
import java.util.Timer;
import java.util.TimerTask;

public class PlayAudioActivity extends AppCompatActivity {


    private ActionBar actionBar;
    private    MediaPlayer mp;
    private boolean play;
    private boolean replay;

    private TimerTask task2;

    private boolean isDrag;
     private SeekBar progressBar;
     private ImageView imageView2;
     private TextView tvTitle;

     private TextView tvDownload;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.fragment_audio);

        actionBar = getSupportActionBar();
        if(actionBar != null){
            actionBar.setHomeButtonEnabled(true);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setTitle("播放录音");
        }


        String name = getIntent().getStringExtra("name");

        progressBar=findViewById(R.id.tcv_select5);
        tvTitle = findViewById(R.id.tv_title);
        tvTitle.setText(name);

        imageView2 = findViewById(R.id.image_view2);
        tvDownload = findViewById(R.id.tv_download);

        play=false;
        replay=false;
        File externalFilesDir = getExternalFilesDir("Download");
        String path = externalFilesDir.getAbsolutePath()+"/"+name;
        System.out.println("path===="+path);
        progressBar.setMax(100);

        File file=new File(path);
        String path2 = externalFilesDir.getAbsolutePath()+"/test1.wav";
        File file1=new File(path2);
        if (file.exists()){
            file.delete();
        }
        if (file1.exists()){
            file1.delete();
        }


        task2 = new TimerTask() {
            @Override
            public void run() {

                int currentPosition = mp.getCurrentPosition();
                if (0!=currentPosition){
                    System.out.println("Current position: " + currentPosition);
                    progressBar.setProgress(currentPosition * 100 / mp.getDuration());
                    int musicTime =currentPosition/ 1000;
                    String  show = musicTime / 60 + ":" + musicTime % 60;
                    Log.d("", "getDuration: "+mp.getDuration());

                }
            }
        };

        imageView2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                runOnUiThread(()->{
                    //如果不是在播放变成播放状态
                    if (!file.exists()){
                        WatchManagerDemo watchManager = AppApplication.getInstance().watchManagerTest.watchManager;
                        System.out.println("点击发送");
                        FileStruct fileStruct = AppApplication.getInstance().fileStruct;//注意fileStructs一定要是在sdCardBean中


                        int devHandle = AppApplication.getInstance().sdCardBean.getDevHandler();
                        int cluster = fileStruct.getCluster();
                        int offset = 0;
                        GetFileByClusterTask.Param param = new GetFileByClusterTask.Param(devHandle, 0, cluster, path);
                        GetFileByClusterTask task = new GetFileByClusterTask(watchManager, param);
                        task.setListener(new TaskListener() {
                            @Override
                            public void onBegin() {
                                //开始
                                System.out.println("开始");
                                tvDownload.setText("开始存储本地");
                                tvDownload.setVisibility(View.VISIBLE);
                            }

                            @Override
                            public void onProgress(int progress) {
                                //进度回调
                                System.out.println("下载："+progress+"%");
                                tvDownload.setText("下载："+progress+"%");

                            }
                            @Override
                            public void onFinish() {
                                runOnUiThread(()->{
                                    System.out.println("成功");
                                    Toast.makeText(PlayAudioActivity.this,"本地保存成功",Toast.LENGTH_SHORT).show();
                                    tvDownload.setVisibility(View.GONE);
                                    FFmpegSession session = FFmpegKit.execute("-i "+path+" -c:v mpeg4 "+file1.getPath());  //下载的录音进行处理
                                    imageView2.callOnClick();
                                });
                                //成功
                            }

                            @Override
                            public void onError(int code, String msg) {
                                //失败
                                File file=new File(path);
                                if (file.exists()){
                                    file.delete();
                                }
                            }

                            @Override
                            public void onCancel(int reason) {
                                //取消
                            }
                        });
                        task.start();

                    }else {
                        if (!play){
                            if (!replay){
                                imageView2.setImageResource(R.drawable.icon_bofang);
                                try {
                                    play=true;
                                    mp = new MediaPlayer();
                                    Log.d("", "onClick: "+path2);
                                    mp.setDataSource(path2);
                                    mp.prepare();
                                    //设置监听到100%音乐进度结束
                                    mp.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
                                        @Override
                                        public void onPrepared(MediaPlayer mp) {
                                            int musicTime = mp.getDuration() / 1000;
                                            String  show = musicTime / 60 + ":" + musicTime % 60;
                                            System.out.println("show===="+show);
                                            new Timer().scheduleAtFixedRate(task2, 0, 1000);
                                            // 每秒更新一次播放进度
                                            mp.start();
                                        }
                                    });
                                    mp.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                                        @Override
                                        public void onCompletion(MediaPlayer mp) {
                                            System.out.println("结束播放===");
                                            play=false;
                                            imageView2.setImageResource(R.drawable.icon_zanting);
                                            progressBar.setProgress(0);
                                            mp.seekTo(0);
//                                        textView3.setText("0:00");
                                            mp.pause();
                                            replay=true;
                                        }
                                    });


                                } catch (IOException e) {
                                    throw new RuntimeException(e);
                                }
                            }else {
                                play=true;
                                mp.start();
                                imageView2.setImageResource(R.drawable.icon_bofang);
                            }

                        }else {
                            mp.pause();
                            play=false;
                            imageView2.setImageResource(R.drawable.icon_zanting);
                            replay=true;
                        }
                    }
                });
            }
        });

    }


    public static String getTimeFromInt(int time) {
        if (time <= 0) {
            return "0:00";
        }

        int secondnd = (time / 1000) / 60;

        int million = (time / 1000) % 60;

        String f = String.valueOf(secondnd);

        String m = million >= 10 ? String.valueOf(million) : "0"

                + String.valueOf(million);

        return f + ":" + m;
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


    @Override
    protected void onDestroy() {
        System.out.println("销毁mp");
        if (null!=task2){
            task2.cancel();
        }

        super.onDestroy();
        FileBrowseManager.getInstance().cleanCache();
        if (mp!=null){
            mp.stop();
            mp.reset();
            mp.release();
            mp = null;
        }

    }
}
