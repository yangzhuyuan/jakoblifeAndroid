package com.guangji.livefit;

public class DialInfo {

    private int id;
    private String productId;
    private int type;
    private int width;
    private int height;
    private int size;
    private String imageUrl;
    private String dialUrl;
    private String upContent;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getDialUrl() {
        return dialUrl;
    }

    public void setDialUrl(String dialUrl) {
        this.dialUrl = dialUrl;
    }

    public String getUpContent() {
        return upContent;
    }

    public void setUpContent(String upContent) {
        this.upContent = upContent;
    }

    public DialInfo() {
    }

    public DialInfo(int id, String productId, int type, int width, int height, int size, String imageUrl, String dialUrl, String upContent) {
        this.id = id;
        this.productId = productId;
        this.type = type;
        this.width = width;
        this.height = height;
        this.size = size;
        this.imageUrl = imageUrl;
        this.dialUrl = dialUrl;
        this.upContent = upContent;
    }

    @Override
    public String toString() {
        return "DialEntry{" +
                "id=" + id +
                ", productId='" + productId + '\'' +
                ", type=" + type +
                ", width=" + width +
                ", height=" + height +
                ", size=" + size +
                ", imageUrl='" + imageUrl + '\'' +
                ", dialUrl='" + dialUrl + '\'' +
                ", upContent='" + upContent + '\'' +
                '}';
    }
}
