package com.cookandroid.mobile;

import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.database.ChildEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;

import java.util.ArrayList;
import java.util.List;

public class database extends AppCompatActivity {

    private EditText pro_name, pro_price, pro_exp;
    public String productImageUrl;

    private FirebaseDatabase mDatabase;
    private DatabaseReference mReference;
    private ChildEventListener mChild;

    private ListView product;
    private ArrayAdapter<String> product_item;
    List<Object> Array = new ArrayList<Object>();

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.digital);

        pro_name = (EditText) findViewById(R.id.product_name);
        pro_price = (EditText) findViewById(R.id.product_price);
        pro_exp= (EditText) findViewById(R.id.product_exp);

        product = (ListView) findViewById(R.id.product);

        initDatabase();

        product_item = new ArrayAdapter<String>(this, android.R.layout.simple_dropdown_item_1line, new ArrayList<String>());
        product.setAdapter(product_item);

        mReference = mDatabase.getReference("products"); // 변경값을 확인할 child 이름
        mReference.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                product_item.clear();

                for (DataSnapshot productsData : dataSnapshot.getChildren()) {
                    String productImageUrl = productsData.getValue().toString();
                    Array.add(productImageUrl);
                    product_item.add(productImageUrl);
                    // child 내에 있는 데이터만큼 반복합니다.

                }
                product_item.notifyDataSetChanged();
                product.setSelection(product_item.getCount() - 1);
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {

            }
        });
    }

    private void initDatabase() {

        mDatabase = FirebaseDatabase.getInstance();

        mReference = mDatabase.getReference("products");

        mChild = new ChildEventListener() {

            @Override
            public void onChildAdded(DataSnapshot dataSnapshot, String s) {

            }

            @Override
            public void onChildChanged(DataSnapshot dataSnapshot, String s) {

            }

            @Override
            public void onChildRemoved(DataSnapshot dataSnapshot) {

            }

            @Override
            public void onChildMoved(DataSnapshot dataSnapshot, String s) {
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {

            }
        };
        mReference.addChildEventListener(mChild);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mReference.removeEventListener(mChild);
    }
}

