package com.cookandroid.mobile;

public class product_item {
    String name;
    String price;
    int resourceId;

    public product_item(int resourceId, String name, String price) {
        this.name = name;
        this.price = price;
        this.resourceId = resourceId;
    }

    // 변수에 접근 (getter,setter)
    public int getResourceId() {
        return resourceId;
    }

    public String getPrice() {
        return price;
    }

    public  String getName() {
        return name;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setResourceId(int resourceId) {
        this.resourceId = resourceId;
    }
}
