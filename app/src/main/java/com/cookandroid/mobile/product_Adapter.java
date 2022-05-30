package com.cookandroid.mobile;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

public class product_Adapter extends RecyclerView.Adapter<product_Adapter.ViewHolder> {

    private ArrayList<product_item> productList;

    @NonNull
    @Override
    public product_Adapter.ViewHolder onCreateViewHolder
            (@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_recycler, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder
            (@NonNull product_Adapter.ViewHolder holder, int pos11ition) {
        holder.onBind(productList.get(pos11ition));
    }

    public void setProductList(ArrayList<product_item> list){
        this.productList = list;
        notifyDataSetChanged();
    }

    @Override
    public int getItemCount() {
        return productList.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        ImageView profile;
        TextView name;
        TextView price;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);

            profile = (ImageView) itemView.findViewById(R.id.profile);
            name = (TextView) itemView.findViewById(R.id.name);
            price = (TextView) itemView.findViewById(R.id.price);
        }

        void onBind(product_item item){
            profile.setImageResource(item.getResourceId());
            name.setText(item.getName());
            price.setText(item.getPrice());
        }
    }
}