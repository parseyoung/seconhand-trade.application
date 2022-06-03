package com.cookandroid.mobile;

import android.content.Intent;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

import java.util.HashMap;

public class signup extends AppCompatActivity {
    private FirebaseAuth firebaseAuth;
    private EditText name, id, pw, pw2;
    private Button pwcheck, signup;
    TextView back;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.signup);

        firebaseAuth = FirebaseAuth.getInstance();

        name = (EditText) findViewById(R.id.signName);
        id = (EditText) findViewById(R.id.signEmail);
        pw = (EditText) findViewById(R.id.signPW);
        pw2 = (EditText) findViewById(R.id.signPW2);

        pwcheck = (Button) findViewById(R.id.pwcheckbutton);
        signup = (Button) findViewById(R.id.signupbutton);

        //뒤로 가기 버튼
        back = findViewById(R.id.back);
        back.setOnClickListener(v -> onBackPressed());

        //비밀번호 확인 버튼
        pwcheck = findViewById(R.id.pwcheckbutton);
        pwcheck.setOnClickListener(v -> {
            if (pw.getText().toString().equals
                    (pw2.getText().toString())) {
                pwcheck.setText("일치");
            } else {
                Toast.makeText(signup.this,
                        "비밀번호가 다릅니다.", Toast.LENGTH_LONG).show();
            }
        });

        signup.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //에딧 텍스트 값을 문자열로 바꾸어 함수에 넣어줍니다
                String email = id.getText().toString().trim();
                String pwd = pw.getText().toString().trim();

                firebaseAuth.createUserWithEmailAndPassword(email, pwd)
                        .addOnCompleteListener(signup.this, new OnCompleteListener<AuthResult>() {
                            @Override
                            public void onComplete(@NonNull Task<AuthResult> task) {
                                if (task.isSuccessful()) {
                                    // 회원가입 성공시
                                    FirebaseUser user = firebaseAuth.getCurrentUser();
                                    String email = user.getEmail();
                                    String uid = user.getUid();
                                    String uname = name.getText().toString().trim();

                                    //해쉬맵 테이블을 파이어베이스 데이터베이스에 저장
                                    HashMap<Object, String> hashMap = new HashMap<>();

                                    hashMap.put("uid", uid);
                                    hashMap.put("email", email);
                                    hashMap.put("name", uname);

                                    FirebaseDatabase database = FirebaseDatabase.getInstance();
                                    DatabaseReference reference = database.getReference("Users");
                                    reference.child(uid).setValue(hashMap);

                                    //가입이 이루어져을시 가입 화면을 빠져나감.
                                    Intent intent = new Intent(signup.this, login.class);
                                    startActivity(intent);

                                    Toast.makeText(signup.this, "회원가입 완료!", Toast.LENGTH_SHORT).show();
                                    finish();
                                } else {
                                    // 계정이 중복된 경우
                                    Toast.makeText(signup.this, "이미 존재하는 계정입니다.", Toast.LENGTH_SHORT).show();
                                }
                            }
                        });
            }
        });
    }
}
