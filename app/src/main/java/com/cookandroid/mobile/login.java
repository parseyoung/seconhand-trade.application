package com.cookandroid.mobile;

import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.AppCompatButton;

import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

public class login extends AppCompatActivity {
    private FirebaseAuth firebaseAuth;
    TextView sign;
    EditText id, pw;
    AppCompatButton loginbutton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.login);

        firebaseAuth = FirebaseAuth.getInstance();
        //아이디 비밀번호 로그인 모듈 변수

        //회원가입 버튼
        sign = findViewById(R.id.signin);

        id = findViewById(R.id.signID);
        pw = findViewById(R.id.signPW);
        loginbutton = findViewById(R.id.loginbutton);

        //회원가입 버튼 클릭시, 회원가입 페이지로 이동
        sign.setOnClickListener(v -> {
            Intent intent = new Intent(login.this, signup.class);
            startActivity(intent);
        });

        loginbutton.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v) {
                String email = id.getText().toString().trim();
                String pwd = pw.getText().toString().trim();
                firebaseAuth.signInWithEmailAndPassword(email,pwd)
                        .addOnCompleteListener(login.this, new OnCompleteListener<AuthResult>() {
                            @Override
                            public void onComplete(@NonNull Task<AuthResult> task) {
                                if(task.isSuccessful()){
                                    Intent intent = new Intent(login.this, user_fragment.class);
                                    startActivity(intent);

                                    Toast.makeText(login.this,"환영합니다~!",Toast.LENGTH_SHORT).show();
                                }else{
                                    Toast.makeText(login.this,"로그인 오류",Toast.LENGTH_SHORT).show();
                                }
                            }
                        });
            }
        });
    }
}