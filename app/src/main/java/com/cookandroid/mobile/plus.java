package com.cookandroid.mobile;

import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import com.google.android.gms.tasks.OnSuccessListener;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.storage.FirebaseStorage;

import com.google.firebase.storage.StorageReference;
import com.google.firebase.storage.UploadTask;
import com.squareup.picasso.Picasso;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;

public class plus extends AppCompatActivity {
    public static final int GALLERY_LOAD_CODE=1111; //갤러리앱으로 이동할때 사용할 임의의 코드
    EditText product_name, product_price, product_exp;
    private ImageView imageView; //가져온 프로필 사진을 보여줄 이미지뷰
    private FirebaseAuth firebaseAuth;

    Uri proImgUri; //선택한 이미지 경로 uri

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.plus);

        firebaseAuth = FirebaseAuth.getInstance();

        product_name=findViewById(R.id.product_name);
        product_price=findViewById(R.id.product_price);
        product_exp=findViewById(R.id.product_exp);
        imageView = findViewById(R.id.image_view);
        Button upload_btn = findViewById(R.id.upload_btn);

        // 상품 업로드
        upload_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //파이어베이스에 파일 업로드와 데이터 베이스 저장
                updateInfo();
            }
        });
        //이미지 업로드
        imageView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //로컬 사진첩으로 넘어간다.
                Intent intent = new Intent(Intent.ACTION_PICK);
                intent.setType(MediaStore.Images.Media.CONTENT_TYPE);
                startActivityForResult(intent,GALLERY_LOAD_CODE);
            }
        });
        loadData();
    }

    //갤러리 이미지 터치시 돌아와 이미지뷰 등록
    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if(requestCode==GALLERY_LOAD_CODE){
            if(resultCode== RESULT_OK){
                proImgUri = data.getData();

                //이 액티비티(this)에 핸드폰에 저장된 그 이미지의 절대경로(productPath)를 중앙으로 정렬하여 productImage뷰에 넣어라.
                Picasso.get().load(proImgUri).into(imageView);
            }
        }
    }

    public void updateInfo() {
        String pro_name = product_name.getText().toString();
        String price = product_price.getText().toString();
        String exp = product_exp.getText().toString();
        String productImageUrl = proImgUri.toString();

        final String uid = firebaseAuth.getCurrentUser().getUid();

        //Firebase storage에 이미지 저장하기 위해 파일명 만들기(날짜를 기반으로)
        SimpleDateFormat sdf = new SimpleDateFormat("yyyMMddhhmmss"); //20191024111224
        String fileName = sdf.format(new Date()) + ".png";

        //Firebase storage에 저장하기
        FirebaseStorage firebaseStorage = FirebaseStorage.getInstance();
        final StorageReference imgRef = firebaseStorage.getReference("productImages/" + fileName);

        //파일 업로드
        UploadTask uploadTask = imgRef.putFile(proImgUri);
        uploadTask.addOnSuccessListener(new OnSuccessListener<UploadTask.TaskSnapshot>() {
            @Override
            public void onSuccess(UploadTask.TaskSnapshot taskSnapshot) {
                //이미지 업로드가 성공되었으므로...
                //곧바로 firebase storage의 이미지 파일 다운로드 URL을 얻어오기
                imgRef.getDownloadUrl().addOnSuccessListener(new OnSuccessListener<Uri>() {
                    @Override
                    public void onSuccess(Uri uri) {
                        //파라미터로 firebase의 저장소에 저장되어 있는
                        //이미지에 대한 다운로드 주소(URL)을 문자열로 얻어오기
                        G.productImageUrl  = uri.toString();
                        Toast.makeText(plus.this, "상품 등록 완료", Toast.LENGTH_SHORT).show();

                        //1. Firebase Database에 제품이름,가격,설명 proImgUri을 저장
                        //firebase DB관리자 객체 소환
                        FirebaseDatabase firebaseDatabase = FirebaseDatabase.getInstance();
                        //'profiles'라는 이름의 자식 노드 참조 객체 얻어오기
                        DatabaseReference productRef = firebaseDatabase.getReference();

                        product_item product_item = new product_item();
                        product_item.pro_name = product_name.getText().toString();
                        product_item.price = product_price.getText().toString();
                        product_item.exp = product_exp.getText().toString();
                        product_item.productImageUrl = uri.toString();

                        productRef.child("products").child(uid).push().setValue(product_item);

                        Intent intent = new Intent(plus.this, MainActivity.class);
                        startActivity(intent);
                        finish();

                    }
                });
            }
        });
    }
    //내 phone에 저장되어 있는 프로필정보 읽어오기
    void loadData(){
        SharedPreferences preferences=getSharedPreferences("account",MODE_PRIVATE);
        G.pro_name=preferences.getString("product_name", null);
        G.pro_price=preferences.getString("product_price", null);
        G.pro_exp=preferences.getString("product_exp", null);
        G.productImageUrl=preferences.getString("productImageUrl", null);
    }
}