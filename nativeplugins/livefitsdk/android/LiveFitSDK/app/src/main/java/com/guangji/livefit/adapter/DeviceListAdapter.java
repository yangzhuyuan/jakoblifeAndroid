package com.guangji.livefit.adapter;

import android.bluetooth.BluetoothDevice;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;


import com.guangji.liblivefit.util.BleAdvertisedData;
import com.guangji.liblivefit.util.BleUtil;
import com.guangji.livefit.R;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DeviceListAdapter extends RecyclerView.Adapter<DeviceListAdapter.MyViewHolder> {

    private List<BluetoothDevice> mLeDevices = new ArrayList<>();

    private Map<String, Integer> mDevRssiValues = new HashMap<>();
    public static Map<String, byte[]> mDevRssiValues2 = new HashMap<>();
    private boolean isClick;


    private View.OnClickListener onClickListener = new View.OnClickListener(){
        @Override
        public void onClick(View v) {
            if (onItemClickListener != null) {
                onItemClickListener.onAdapterViewClick((int) v.getTag());
            }
        }
    };

    private Map<String,String>addressName=new HashMap<>();

    public void addDevices(BluetoothDevice device, int rssi,byte[]bytes){
        final BleAdvertisedData badata = BleUtil.parseAdertisedData(bytes);
        String deviceName = device.getName();
        if (TextUtils.isEmpty(deviceName)){
            deviceName=badata.getName();
            System.out.println("devicename===="+deviceName);
        }
        addressName.put(device.getAddress(),deviceName);
        if (!mLeDevices.contains(device)) {

            mLeDevices.add(device);
            mDevRssiValues.put(device.getAddress(), rssi);
            mDevRssiValues2.put(device.getAddress(), bytes);
            if (!isClick) {
                notifyDataSetChanged();
            }
        } else {
            if (mDevRssiValues.get(device.getAddress()) != rssi) {
                mDevRssiValues.put(device.getAddress(), rssi);
                mDevRssiValues2.put(device.getAddress(), bytes);
                if (!isClick) {
                    notifyDataSetChanged();
                }
            }
        }
    }

    public void clearDevices(){
        mLeDevices.clear();
        mDevRssiValues.clear();
        notifyDataSetChanged();
    }

    public BluetoothDevice getItemAtPosition(int position) {
        return mLeDevices.get(position);
    }

    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemVeiw = LayoutInflater.from(parent.getContext()).inflate(
                R.layout.recy_item_device_list, parent, false);
        itemVeiw.setOnClickListener(onClickListener);
        itemVeiw.setOnTouchListener(onTouchListener);
        return new MyViewHolder(itemVeiw);
    }

    @Override
    public void onBindViewHolder(MyViewHolder holder, int position) {
        holder.itemView.setTag(position);
        BluetoothDevice bluetoothDevice = mLeDevices.get(position);
        String name = bluetoothDevice.getName();
        String address = bluetoothDevice.getAddress();
        holder.tv_name.setText(TextUtils.isEmpty(name) ? "无设备名" : name);
        holder.tv_address.setText(address);
        holder.tv_rssi.setText(String.valueOf(mDevRssiValues.get(address)));
    }

    @Override
    public int getItemCount() {
        return mLeDevices == null ? 0 : mLeDevices.size();
    }

    private View.OnTouchListener onTouchListener = new View.OnTouchListener() {
        @Override
        public boolean onTouch(View v, MotionEvent event) {
            switch (event.getAction()) {
                case MotionEvent.ACTION_DOWN:
                    isClick = true;
                    break;
                case MotionEvent.ACTION_MOVE:
                    break;
                case MotionEvent.ACTION_UP:
                case MotionEvent.ACTION_CANCEL:
                    isClick= false;
                    break;
            }
            return false;
        }
    };

    class MyViewHolder extends RecyclerView.ViewHolder{

        TextView tv_name;
        TextView tv_address;
        TextView tv_rssi;

        public MyViewHolder(View itemView) {
            super(itemView);
            tv_name = (TextView) itemView.findViewById(R.id.tv_name);
            tv_address = (TextView) itemView.findViewById(R.id.tv_address);
            tv_rssi = (TextView) itemView.findViewById(R.id.tv_riss);
        }
    }

    public interface OnItemClickListener {
        void onAdapterViewClick(int position);
    }

    private OnItemClickListener onItemClickListener;

    public void setOnItemClickListener(OnItemClickListener onItemClickListener) {
        this.onItemClickListener = onItemClickListener;
    }

}
