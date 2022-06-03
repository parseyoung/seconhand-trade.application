package com.cookandroid.mobile;

public class product_item {

    private String productImageUrl;
    String pro_name;
    String price;
    String exp;

    public product_item(String pro_name, String price, String exp, String productImageUrl) {
        this.pro_name = pro_name;
        this.price = price;
        this.exp = exp;
        this.productImageUrl = productImageUrl;
    }

    //firebase DB에 객체로 값을 읽어올 때..
    public product_item() {
    }

    // 변수에 접근 (getter,setter)
    public  String getPro_name() {
        return pro_name;
    }

    public String getPrice() { return price; }

    public String getExp() {
        return exp;
    }

    public String getProductImageUrl() { return productImageUrl; }

    public void setPrice(String product_price) {
        this.price = price;
    }

    public void setPro_name(String product_name) {
        this.pro_name = pro_name;
    }

    public void setExp(String product_exp) {
        this.exp = product_exp;
    }

    public void setProductImageUrl(String product_img_path) { this.productImageUrl = productImageUrl; }
}