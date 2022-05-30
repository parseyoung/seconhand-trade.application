package com.cookandroid.mobile;

import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;

import java.util.ArrayList;


public class digital extends android.app.Activity {

    private RecyclerView recyclerView;
    private product_Adapter product_adapter;
    private ArrayList<product_item> productItems;
    private LinearLayoutManager linearLayoutManager;
    // 리사이클러뷰 내부에서 아이템 뷰들 배치 관리를 위해 Manager생성

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.digital);

        recyclerView = (RecyclerView) findViewById(R.id.recyclerView);

        /* initiate adapter */
        product_adapter = new product_Adapter();

        /* initiate recyclerview */
        recyclerView.setAdapter(product_adapter);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        recyclerView.setLayoutManager(new LinearLayoutManager(this, RecyclerView.HORIZONTAL,false));

        /* adapt data */
        productItems = new ArrayList<>();
        for(int i=1;i<=10;i++){
            if(i%2==0)
                productItems.add(new product_item(R.drawable.beauty,i+"번째 제품 이름",i+"번째 가격"));
            else
                productItems.add(new product_item(R.drawable.digital,i+"번째 제품 이름",i+"번째 가격"));

        }
        product_adapter.setProductList(productItems);;
    }
}
