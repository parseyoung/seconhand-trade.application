package com.cookandroid.mobile;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import android.os.Bundle;
import android.view.MenuItem;

import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationBarView;

public class MainActivity extends AppCompatActivity {
    private Fragment home_fragment;
    // home_fragment를 메인화면으로
    BottomNavigationView bottomNavigationView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // home_fragment를 메인화면으로
        home_fragment = new home_fragment();
        setDefaultFragment();

        bottomNavigationView = findViewById(R.id.btm_nav_menu);
        bottomNavigationView.setOnItemSelectedListener(new TabSelectedListener());
    }

    // home_fragment를 메인화면으로
    public void setDefaultFragment() {
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        transaction.add(R.id.main_layout,home_fragment);
        transaction.commit();
    }

    class TabSelectedListener implements NavigationBarView.OnItemSelectedListener {
        @Override
        public boolean onNavigationItemSelected(@NonNull MenuItem menuItem) {
            switch (menuItem.getItemId()) {
                case R.id.home:
                    getSupportFragmentManager().beginTransaction().replace(R.id.main_layout, new home_fragment()).commit();
                    break;
                case R.id.search:
                    getSupportFragmentManager().beginTransaction().replace(R.id.main_layout, new search_fragment()).commit();
                    break;
                case R.id.plus:
                    getSupportFragmentManager().beginTransaction().replace(R.id.main_layout, new plus_fragment()).commit();
                    break;
                case R.id.chat:
                    getSupportFragmentManager().beginTransaction().replace(R.id.main_layout, new chat_fragment()).commit();
                    break;
                case R.id.mypage:
                    getSupportFragmentManager().beginTransaction().replace(R.id.main_layout, new user_fragment()).commit();
                    break;
            }
            return true;
        }
    }
}