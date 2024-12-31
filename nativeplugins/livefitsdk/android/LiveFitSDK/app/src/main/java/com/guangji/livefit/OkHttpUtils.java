package com.guangji.livefit;

import java.util.concurrent.TimeUnit;

import okhttp3.ConnectionPool;
import okhttp3.OkHttpClient;

public class OkHttpUtils {
    private final static int READ_TIMEOUT = 6;

    private final static int CONNECT_TIMEOUT = 6;

    private final static int WRITE_TIMEOUT = 6;

    private static volatile OkHttpClient okHttpClient;

    private OkHttpUtils(){

        OkHttpClient.Builder clientBuilder = new OkHttpClient.Builder();
        clientBuilder.readTimeout(READ_TIMEOUT, TimeUnit.SECONDS);
        clientBuilder.connectTimeout(CONNECT_TIMEOUT, TimeUnit.SECONDS);
        clientBuilder.writeTimeout(WRITE_TIMEOUT, TimeUnit.SECONDS);
        clientBuilder.connectionPool(new ConnectionPool(32,5, TimeUnit.MINUTES));

        okHttpClient = clientBuilder.build();
    }

    public static OkHttpClient getInstance(){
        if (null == okHttpClient){
            synchronized (OkHttpUtils.class){
                if (okHttpClient == null){
                    new OkHttpUtils();
                    return okHttpClient;
                }
            }
        }
        return okHttpClient;
    }
}
