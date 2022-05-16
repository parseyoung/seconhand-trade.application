package com.cookandroid.mobile;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.AppCompatButton;

import android.view.View;
import android.widget.TextView;
import android.widget.Toast;


public class login extends AppCompatActivity {
    TextView sign;
    AppCompatButton loginbutton;

    @Override
    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);
        setContentView(R.layout.login);

        //회원가입 버튼
        sign = findViewById(R.id.signin);

        loginbutton = findViewById(R.id.loginbutton);

        loginbutton.setOnClickListener(new View.OnClickListener() {


            @Override
            public void onClick(View v) {
                Toast.makeText(login.this, "환영합니다~!", Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(login.this, user_fragment.class);
                startActivity(intent);
            }
        });

        //회원가입 버튼 클릭시, 회원가입 페이지로 이동
        sign.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(login.this, "회원가입 완료!", Toast.LENGTH_SHORT).show();
            Intent intent = new Intent(login.this, signup.class);
            startActivity(intent);
        }
    });
    }
}