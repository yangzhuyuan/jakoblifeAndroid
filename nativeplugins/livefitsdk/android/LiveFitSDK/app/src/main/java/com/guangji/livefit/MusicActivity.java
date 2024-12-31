package com.guangji.livefit;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.MenuItem;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListView;
import android.widget.Toast;

import com.guangji.liblivefit.jieli.WatchManagerDemo;
import com.guangji.liblivefit.util.ThreadPoolUtil;
import com.jieli.jl_filebrowse.FileBrowseManager;
import com.jieli.jl_filebrowse.bean.FileStruct;
import com.jieli.jl_filebrowse.bean.Folder;
import com.jieli.jl_filebrowse.bean.SDCardBean;
import com.jieli.jl_filebrowse.interfaces.DeleteCallback;
import com.jieli.jl_filebrowse.interfaces.FileObserver;
import com.jieli.jl_filebrowse.util.DeviceChoseUtil;
import com.jieli.jl_rcsp.task.ITask;
import com.jieli.jl_rcsp.task.TaskListener;
import com.jieli.jl_rcsp.task.TransferTask;

import java.util.ArrayList;
import java.util.List;

public class MusicActivity extends AppCompatActivity {

    private ActionBar actionBar;

    private ListView listview;
    private String[] data = new String[1];

    private String dirName;
    private String dirName2;
    private SDCardBean sdCardBean2;
    private List<FileStruct> fileStructs2 = new ArrayList<>();
    private FileStruct fileStruct3;
    private  ArrayAdapter<String> adapter;

    private Button mBtnAddMusic;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_music);
        listview = findViewById(R.id.listview);
        mBtnAddMusic = findViewById(R.id.btn_add_music);

        actionBar = getSupportActionBar();
        if(actionBar != null){
            actionBar.setHomeButtonEnabled(true);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setTitle("音乐");
        }

        FileObserver fileObserver = new FileObserver() {
            @Override
            public void onFileReceiver(List<FileStruct> fileStructs) {
                // 读取到文件列表，仅仅回调本次读取的文件列表
                int len = fileStructs.size();
                Log.d("", "触发FileObserver: ");
                int i = 0;
                if (len > 0){
                    data = new String[len];
                    for (FileStruct fileStruct : fileStructs) {
                        if (fileStruct.getName().endsWith(".mp3") || fileStruct.getName().endsWith(".MP3")) {
                            data[i] = fileStruct.getName();
                            Log.d("", "name: "+fileStruct.getName());
                            fileStructs2.add(fileStruct);
                            i++;
                        }
                    }
                    if (i > 0){
                        adapter = new ArrayAdapter<String>(MusicActivity.this,
                                android.R.layout.simple_list_item_1,data);
                        listview.setAdapter(adapter);
                    }
                }
            }

            @Override
            public void onFileReadStop(boolean isEnd) {
                // 文件列表读取结束
                System.out.println("onFileReadStop");
            }

            @Override
            public void onFileReadStart() {
                // 开始文件列表读取
                System.out.println("onFileReadStart");
            }

            @Override
            public void onFileReadFailed(int reason) {
                // 文件列表读取失败
                System.out.println("onFileReadFailed");
            }

            @Override
            public void onSdCardStatusChange(List<SDCardBean> onLineCards) {
                //在线设备有变化
                for (SDCardBean sdCardBean : onLineCards) {
                    System.out.println("onLineCards====" + sdCardBean.getName());
                }
            }

            @Override
            public void OnFlayCallback(boolean success) {
                //歌曲点播回调
            }
        };

        FileBrowseManager.getInstance().addFileObserver(fileObserver);
        ThreadPoolUtil.initThreadPool();
        ThreadPoolUtil.threadPoolExecutor.execute(new Runnable() {
            @Override
            public void run() {
                System.out.println("执行异步中");
                while (true) {
                    System.out.println("数据读取中");
                    List<SDCardBean> list = FileBrowseManager.getInstance().getOnlineDev();
                    if (list.size() < 1) {
                        try {
                            Thread.sleep(3000);
                        } catch (InterruptedException e) {
                            throw new RuntimeException(e);
                        }
                        continue;
                    }
                    for (SDCardBean sdCardBean : list) {
                        System.out.println("sdcardbean=====" + sdCardBean.getName());
                        if (sdCardBean.getName().equals("SD Card 0")) {
                            dirName2 = "SD Card 0";
                            sdCardBean2 = sdCardBean;
                            try {
                                Folder currentFolder = FileBrowseManager.getInstance().getCurrentReadFile(sdCardBean);
                                FileBrowseManager.getInstance().setPageSize(200);
                                int i2 = FileBrowseManager.getInstance().loadMore(sdCardBean);
                                while (true) {
                                    System.out.println("sizie====" + currentFolder.isLoadFinished(true) + "size======" + currentFolder.getChildFileStructs().size());
                                    if ((currentFolder.getChildFileStructs().size() > 0 && currentFolder.isLoadFinished(true)) || currentFolder.isLoadFinished(false)) {
                                        break;
                                    } else {
                                        currentFolder = FileBrowseManager.getInstance().getCurrentReadFile(sdCardBean);
                                        int i = FileBrowseManager.getInstance().loadMore(sdCardBean);
                                        if (i != 16386) {
                                            System.out.println("加载文件夹" + i);
                                            Thread.sleep(1000);
                                        }
                                    }
                                }

                                List<FileStruct> fileStructs = currentFolder.getChildFileStructs();
                                System.out.println("fileStructs====" + fileStructs.size());
                                if (fileStructs.size() > 0) {
                                    for (FileStruct fileStruct : fileStructs) {
                                        System.out.println("data====" + fileStruct.getName());
                                        if (fileStruct.getName().equals("DOWNLOAD")) {
                                            dirName = "DOWNLOAD";
                                            fileStruct3 = fileStruct;
                                            while (true) {
                                                if (!currentFolder.isLoadFinished(false)) {
                                                    System.out.println("加载完成======");
                                                    break;
                                                } else {
                                                    currentFolder = FileBrowseManager.getInstance().getCurrentReadFile(sdCardBean);
                                                    FileBrowseManager.getInstance().loadMore(sdCardBean);
                                                    FileBrowseManager.getInstance().appenBrowse(fileStruct, sdCardBean);
                                                    System.out.println("在加载");
                                                }
                                            }
                                        //进入下一级目录
                                        } else {
                                            runOnUiThread(new Runnable() {
                                                @Override
                                                public void run() {
                                                    data = new String[fileStructs.size()];
                                                    int i = 0;
                                                    for (FileStruct fileStruct : fileStructs) {
                                                        if (fileStruct.getName().endsWith(".mp3") || fileStruct.getName().endsWith(".MP3")) {
                                                            data[i] = fileStruct.getName();
                                                            i++;
                                                            Log.d("", "run: "+fileStruct.getName());
                                                        }
                                                    }
//                                                    mMiniLoadingDialog.dismiss();
                                                    if (i > 0){
                                                        adapter = new ArrayAdapter<String>(MusicActivity.this,
                                                                android.R.layout.simple_list_item_1,data);
                                                        listview.setAdapter(adapter);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                    if (TextUtils.isEmpty(dirName)) {
                                        System.out.println("找不到download");
                                        runOnUiThread(new Runnable() {
                                            @Override
                                            public void run() {
//                                                mMiniLoadingDialog.dismiss();
                                            }
                                        });
                                    }
                                } else {
                                    runOnUiThread(new Runnable() {
                                        @Override
                                        public void run() {
//                                            mMiniLoadingDialog.dismiss();
                                        }
                                    });
                                }
                            } catch (Exception e) {
                                e.printStackTrace();
                                System.out.println("发生了错误");
                            }
                            break;
                        }
                    }
                    if (TextUtils.isEmpty(dirName2)) {
                        System.out.println("找不到Sdcardo0");
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
//                                mMiniLoadingDialog.dismiss();
                            }
                        });
                    }
                    break;
                }
            }
        });

        listview.setOnItemClickListener((adapterView, view, i, l) -> {
            if (fileStructs2.size() >= i){
                deleteFile(i);
            }
        });

        mBtnAddMusic.setOnClickListener(view -> {
            WatchManagerDemo watchManager = AppApplication.getInstance().watchManagerTest.watchManager;
            SDCardBean sdCardBean = DeviceChoseUtil.getTargetDev();//获取设备目标设备，这里需要判断设备是否为空
            if(sdCardBean == null){
                Log.d("", "目标设备为空 ");
                return;
            }

            TransferTask.Param param = new TransferTask.Param();
            param.devHandler = sdCardBean.getDevHandler();//设置设备句柄，可以理解为选择文件存储的设备：如sd，usb等，
            String path = getExternalFilesDir(null).getPath()+"/AC690000.MP3";
            ITask task2= new TransferTask(watchManager,path,param);
            task2.setListener(new TaskListener() {
                @Override
                public void onBegin() {
                    //文件传输开始
                    mBtnAddMusic.setText("开始传输");
                    mBtnAddMusic.setClickable(false);
                }

                @Override
                public void onProgress(int progress) {
                    //进度回调
                    System.out.println("progress===="+progress);
                    mBtnAddMusic.setText("进度："+progress+"%");
                }

                @Override
                public void onFinish() {
                    //传输结束
                    Log.d("", "onFinish: ");
                    mBtnAddMusic.setText(getString(R.string.complete));
                    mBtnAddMusic.setClickable(true);
                }

                @Override
                public void onError(int code, String msg) {
                    //传输异常
                    runOnUiThread(()->{
                        System.out.println("传输失败==="+msg);
                        Toast.makeText(MusicActivity.this,"传输失败=="+msg,Toast.LENGTH_SHORT).show();
                        mBtnAddMusic.setClickable(true);
                    });
                }

                @Override
                public void onCancel(int reason) {
                    //传输已取消
                    mBtnAddMusic.setClickable(true);
                }
            });
            //开始传输文件
            if(!task2.isRun()){
                task2.start();
            }else {
                //文件正在传输
            }
        });
    }

    private void deleteFile(int i){
        List<FileStruct> fileStructs = new ArrayList<>();
        fileStructs.add(fileStructs2.get(i));
        Log.d("", "onCreate: "+fileStructs.size());
        FileBrowseManager.getInstance().deleteFile(sdCardBean2, fileStructs, false, new DeleteCallback() {
            @Override
            public void onSuccess(FileStruct fileStruct) {
                //成功
                System.out.println(i+"删除成功" + fileStruct.getName());
                Toast.makeText(MusicActivity.this, "删除成功",Toast.LENGTH_SHORT).show();
                fileStructs2.remove(i);

                data = new String[fileStructs2.size()];
                for (int i1 = 0;i1 < fileStructs2.size();i1++){
                    data[i1] = fileStructs2.get(i1).getName();
                }

                adapter = new ArrayAdapter<String>(MusicActivity.this,
                        android.R.layout.simple_list_item_1,data);
                listview.setAdapter(adapter);
            }

            @Override
            public void onError(int code, FileStruct fileStruct) {
                //fileStruct 删除失败
                System.out.println("删除失败" + code);
                System.out.println("原因====" + fileStruct.getName());
                Toast.makeText(MusicActivity.this, "删除失败",Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onFinish() {
                //删除结束，通过onError判断是否有删除失败的文件
                System.out.println("删除完成");
            }
        });
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
        super.onDestroy();
        FileBrowseManager.getInstance().cleanCache();
    }
}