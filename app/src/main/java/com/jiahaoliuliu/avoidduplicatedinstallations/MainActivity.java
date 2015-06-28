package com.jiahaoliuliu.avoidduplicatedinstallations;

import android.content.Context;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;

import com.parse.ParseException;
import com.parse.ParseInstallation;
import com.parse.ParsePush;
import com.parse.SaveCallback;

import java.util.Random;
import java.util.UUID;

public class MainActivity extends AppCompatActivity {

    private static final String TAG = "MainActivity";

    private Context mContext;
    private Preferences mPreferences;
    private volatile UUID mUuid;

    // Views
    private TextView mUuidTextView;

    // Others
    private Random mRandom;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mContext = this;
        mPreferences = new Preferences(mContext);

        // link the views
        mUuidTextView = (TextView) findViewById(R.id.uuid_text_view);

        // Set the values
        mUuidTextView.setText(getUuid().toString());
        Log.v(TAG, "The uuid is " + getUuid().toString());

        // Testing the installation
        Log.v(TAG, "Parse installation id " + ParseInstallation.getCurrentInstallation().getInstallationId());

        // Subscribe to random channels
        mRandom = new Random();
        String randomChannelId = "A" + String.valueOf(mRandom.nextInt(10000));

        ParsePush.subscribeInBackground(randomChannelId, new SaveCallback() {
            @Override
            public void done(ParseException e) {
                if (e == null) {
                    Log.v(TAG, "Device correctly subscribed to the channel");
                } else {
                    Log.v(TAG, "Error subscribing the device", e);
                }
            }
        });
    }

    private UUID getUuid() {
        if (mUuid == null) {
            mUuid = UUID.fromString(mPreferences.get(Preferences.StringId.UUID));
        }

        return mUuid;
    }
}
