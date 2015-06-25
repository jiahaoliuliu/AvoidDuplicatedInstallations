package com.jiahaoliuliu.avoidduplicatedinstallations;

import android.content.Context;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;

import java.util.UUID;

import com.parse.ParseException;
import com.parse.ParsePush;
import com.parse.SendCallback;

import org.json.JSONObject;

public class MainActivity extends AppCompatActivity {

    private static final String TAG = "MainActivity";

    private Context mContext;
    private Preferences mPreferences;
    private volatile UUID mUuid;

    // Views
    private TextView mUuidTextView;

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
    }

    private UUID getUuid() {
        if (mUuid == null) {
            mUuid = UUID.fromString(mPreferences.get(Preferences.StringId.UUID));
        }

        return mUuid;
    }
}
