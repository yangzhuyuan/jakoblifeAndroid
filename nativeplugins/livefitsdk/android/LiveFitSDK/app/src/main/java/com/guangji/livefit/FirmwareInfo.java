package com.guangji.livefit;

public class FirmwareInfo {

    private int version;
    private String url;
    private String upContent;

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getUpContent() {
        return upContent;
    }

    public void setUpContent(String upContent) {
        this.upContent = upContent;
    }

    public FirmwareInfo(int version, String url, String upContent) {
        this.version = version;
        this.url = url;
        this.upContent = upContent;
    }

    public FirmwareInfo() {
    }

    @Override
    public String toString() {
        return "FirmwareInfo{" +
                "version=" + version +
                ", url='" + url + '\'' +
                ", upContent='" + upContent + '\'' +
                '}';
    }
}
