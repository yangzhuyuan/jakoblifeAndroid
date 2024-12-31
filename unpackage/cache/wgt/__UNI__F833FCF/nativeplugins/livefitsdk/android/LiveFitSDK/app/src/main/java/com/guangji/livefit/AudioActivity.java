package com.guangji.livefit;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
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

public class AudioActivity extends AppCompatActivity {

    private ActionBar actionBar;

    private ListView listview;
    private String[] data = new String[1];

    private String dirName;
    private String dirName2;
    private SDCardBean sdCardBean2;
    private List<FileStruct> fileStructs2 = new ArrayList<>();
    private FileStruct fileStruct3;
    private  ArrayAdapter<String> adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_audio);

        actionBar = getSupportActionBar();
        if(actionBar != null){
            actionBar.setHomeButtonEnabled(true);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setTitle("录音");
        }

        listview = findViewById(R.id.listview3);

        FileObserver fileObserver = new FileObserver() {
            @Override
            public void onFileReceiver(List<FileStruct> fileStructs) {
                // 读取到文件列表，仅仅回调本次读取的文件列表
                int len = fileStructs.size();
                Log.d("", "触发FileObserver: "+len);
                int i = 0;
                if (len > 0){
                    data = new String[len];
                    for (FileStruct fileStruct : fileStructs) {
                        Log.d("", "fileStruct: "+fileStruct.getName());
                        if (fileStruct.getName().endsWith(".WAV") || fileStruct.getName().endsWith(".wav")) {
                            data[i] = fileStruct.getName();
                            Log.d("", "getName: "+fileStruct.getName());
                            i++;
                            fileStructs2.add(fileStruct);
                        }
                    }
                    if (i > 0){
                        adapter = new ArrayAdapter<String>(AudioActivity.this,
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
                // 歌曲点播回调
            }
        };

        //第一步：注册观察者
        // 第2步：获取在线设备列表，可以通过fileObserver处理设备状态变化
        // 第3步：读取当前设备正在读的当前目录
        FileBrowseManager.getInstance().addFileObserver(fileObserver);
        ThreadPoolUtil.initThreadPool();
        int poolSize = ThreadPoolUtil.threadPoolExecutor.getPoolSize();
        // 获取正在执行任务的线程数量
        int activeCount = ThreadPoolUtil.threadPoolExecutor.getActiveCount();
        // 获取等待执行的任务数量
        int queueSize = ThreadPoolUtil.threadPoolExecutor.getQueue().size();

        ThreadPoolUtil.threadPoolExecutor.execute(new Runnable() {
            @Override
            public void run() {
                  System.out.println("执行异步函数");
                while (true) {
                      System.out.println("数据读取中");
                    List<SDCardBean> list = FileBrowseManager.getInstance().getOnlineDev();
                    if (list.size() < 1) {
                        try {
                              System.out.println("还未初始化");
                            Thread.sleep(3000);
                        } catch (InterruptedException e) {
                            throw new RuntimeException(e);
                        }
                        continue;
                    }
                      System.out.println("初始化设备成功");
                    for (SDCardBean sdCardBean : list) {
                          System.out.println("sdcardbean=====" + sdCardBean.getName());
                        if (sdCardBean.getName().equals("SD Card 0")) {
                            AppApplication.getInstance().sdCardBean = sdCardBean;
                            dirName2 = "SD Card 0";
                            sdCardBean2 = sdCardBean;
                            try {
                                Folder currentFolder = FileBrowseManager.getInstance().getCurrentReadFile(sdCardBean);
                                FileBrowseManager.getInstance().setPageSize(200);
                                int i = FileBrowseManager.getInstance().loadMore(sdCardBean);
                                  System.out.println("i====" + i);
                                while (true) {
                                      System.out.println("sizie====" + currentFolder.isLoadFinished(true) + "size======" + currentFolder.getChildFileStructs().size());
                                    if ((currentFolder.getChildFileStructs().size() > 0 && currentFolder.isLoadFinished(true)) || currentFolder.isLoadFinished(false)) {
                                        AppApplication.getInstance().currentFolder = currentFolder;
                                        break;
                                    } else {
                                        currentFolder = FileBrowseManager.getInstance().getCurrentReadFile(sdCardBean);
                                          System.out.println("加载文件夹" + currentFolder.getName());
                                        FileBrowseManager.getInstance().loadMore(sdCardBean);
                                        Thread.sleep(1000);
                                    }
                                }
                                List<FileStruct> fileStructs = currentFolder.getChildFileStructs();
                                  System.out.println("fileStructs====" + fileStructs.size());
                                if (fileStructs.size() > 0) {
                                    for (FileStruct fileStruct : fileStructs) {
                                          System.out.println("data====" + fileStruct.getName());
                                        if (fileStruct.getName().equals("JL_REC")) {
                                            dirName = "JL_REC";
                                            currentFolder = FileBrowseManager.getInstance().getCurrentReadFile(sdCardBean);
                                            FileBrowseManager.getInstance().loadMore(sdCardBean);
                                            FileBrowseManager.getInstance().appenBrowse(fileStruct, sdCardBean);
                                              System.out.println("在加载");
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
                                        } else {
                                            runOnUiThread(new Runnable() {
                                                @Override
                                                public void run() {
                                                    int i = 0;
                                                    for (FileStruct fileStruct : fileStructs) {
                                                        if (fileStruct.getName().endsWith(".WAV") || fileStruct.getName().endsWith(".wav")) {
                                                            data[i] = fileStruct.getName();
                                                            i++;
                                                            Log.d("", "run: "+fileStruct.getName());
                                                        }
                                                    }
                                                    if (i > 0){
                                                        adapter= new ArrayAdapter<String>(AudioActivity.this,
                                                                android.R.layout.simple_list_item_1,data);
                                                        listview.setAdapter(adapter);
                                                    }

//                                                    mMiniLoadingDialog.dismiss();
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
                AppApplication.getInstance().fileStruct = fileStructs2.get(i);
                Intent intent = new Intent(AudioActivity.this,PlayAudioActivity.class);
                intent.putExtra("name",fileStructs2.get(i).getName());
                startActivity(intent);
//                deleteFile(i);
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
                Toast.makeText(AudioActivity.this, "删除成功",Toast.LENGTH_SHORT).show();
                fileStructs2.remove(i);

                data = new String[fileStructs2.size()];
                for (int i1 = 0;i1 < fileStructs2.size();i1++){
                    data[i1] = fileStructs2.get(i1).getName();
                }

                adapter = new ArrayAdapter<String>(AudioActivity.this,
                        android.R.layout.simple_list_item_1,data);
                listview.setAdapter(adapter);
            }

            @Override
            public void onError(int code, FileStruct fileStruct) {
                //fileStruct 删除失败
                System.out.println("删除失败" + code);
                System.out.println("原因====" + fileStruct.getName());
                Toast.makeText(AudioActivity.this, "删除失败",Toast.LENGTH_SHORT).show();
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