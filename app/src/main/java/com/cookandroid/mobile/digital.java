package com.cookandroid.mobile;

import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;

import java.util.ArrayList;


public class digital extends android.app.Activity {

    private RecyclerView recyclerView;
    private ArrayList<product_item> productItems;
    private LinearLayoutManager linearLayoutManager;
    // 리사이클러뷰 내부에서 아이템 뷰들 배치 관리를 위해 Manager생성

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.digital);

        recyclerView = (RecyclerView) findViewById(R.id.recyclerView);


        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        recyclerView.setLayoutManager(new LinearLayoutManager(this, RecyclerView.HORIZONTAL, false));
    }
}