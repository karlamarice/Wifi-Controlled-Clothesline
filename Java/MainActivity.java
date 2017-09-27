package com.pup.unbounded.myapplication;

import android.app.ProgressDialog;
import android.net.ConnectivityManager;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.app.NotificationCompat;
import android.text.method.KeyListener;
import android.widget.Button;
import android.widget.TextView;
import android.app.AlertDialog;
import android.content.Context;
import android.os.AsyncTask;
import android.view.View;

import android.widget.Switch;

import android.widget.EditText;
import android.net.wifi.WifiManager;


import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpParams;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.URISyntaxException;
import java.text.DateFormat;
import java.util.Date;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    Button btn_manIn, btn_manOut, btn_checkStat, btn_auto, btn_autoTP;
    TextView txtv_mode, txtv_status, txtv_process;
    Switch swi_scope;
    EditText edit_pubIP;
   // WifiManager wifi;
    ConnectivityManager cm_checkNet;

    String str_ipAdd = "", str_paramVal = "", str_pubIpAdd = "";
    String str_checker = "go", str_curDateTime;
    int flag, flag2 = 0;

    NotificationCompat.Builder builder;

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // assign buttons
        btn_manIn = (Button) findViewById(R.id.manin);
        btn_manOut = (Button) findViewById(R.id.manout);
        btn_auto = (Button) findViewById(R.id.auto);
        btn_autoTP = (Button) findViewById(R.id.autoTP);
        btn_checkStat = (Button) findViewById(R.id.checkstat);


        swi_scope = (Switch) findViewById(R.id.scope);

        edit_pubIP = (EditText) findViewById(R.id.pubIP);
        txtv_mode = (TextView) findViewById(R.id.mode);
        txtv_process = (TextView) findViewById(R.id.process);

        // set button listener (this class)
        swi_scope.setOnClickListener(this);
        btn_manIn.setOnClickListener(this);
        btn_manOut.setOnClickListener(this);
        btn_auto.setOnClickListener(this);
        btn_autoTP.setOnClickListener(this);
        btn_checkStat.setOnClickListener(this);

        edit_pubIP.setEnabled(false);

        cm_checkNet = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);

        //start
        if(cm_checkNet.getActiveNetworkInfo() != null)
        {
            txtv_process.setText("Please make sure you are connected to the system.");
        }
        else if(cm_checkNet.getActiveNetworkInfo() == null)
        {
            txtv_process.setText("Turn on network connection: Wi-Fi (offline & online) or mobile data (online). If connection exists, restart the app.");
        }

    }

    @Override
    public void onClick(View view) {

            if(cm_checkNet.getActiveNetworkInfo() != null) {
                // get the control string from the button that was clicked
                if (view.getId() == btn_manIn.getId()) {
                    str_paramVal = "on";
                    flag = 1;
                } else if (view.getId() == btn_manOut.getId()) {
                    str_paramVal = "off";
                    flag = 2;
                } else if (view.getId() == btn_auto.getId()) {
                    str_paramVal = "auto";
                    flag = 3;
                } else if (view.getId() == btn_autoTP.getId()) {
                    str_paramVal = "phase";
                    flag = 4;
                } else if (view.getId() == btn_checkStat.getId()) {
                    str_paramVal = "info";
                    flag = 5;
                }

                // execute HTTP request
                if (view.getId() == btn_manIn.getId() || view.getId() == btn_manOut.getId() || view.getId() == btn_auto.getId() || view.getId() == btn_autoTP.getId() || view.getId() == btn_checkStat.getId()) {
                    Boolean switchState = swi_scope.isChecked();

                    if (switchState == false) {
                        str_ipAdd = "192.168.1.15";

                        new HttpRequestAsyncTask(view.getContext(), str_paramVal, str_ipAdd).execute();
                    } else if (switchState == true) {
                        str_ipAdd = edit_pubIP.getText().toString();

                        if(str_ipAdd.length()>0) {
                            new HttpRequestAsyncTask(view.getContext(), str_paramVal, str_ipAdd).execute();
                        }
                    }
                }
                if (swi_scope.isChecked()) {
                    edit_pubIP.setEnabled(true);
                }
                if (!swi_scope.isChecked()) {
                    edit_pubIP.setEnabled(false);
                }
            }
    }

    /**
     * Description: Send an HTTP Get request to a specified ip address and port.
     * Also send a parameter "parameterName" with the value of "parameterValue".
     * @param str_paramVal the pin number to toggle
     * @param str_ipAdd the ip address to send the request to
    // * @param portNumber the port number of the ip address
     * @return The ip address' reply text, or an ERROR message is it fails to receive one
     */

    public String sendRequest(String str_paramVal, String str_ipAdd) {
        String serverResponse = "ERROR";
        try {
            HttpClient httpclient = new DefaultHttpClient(); // create an HTTP client
            HttpParams httpParameters = new BasicHttpParams();

            DefaultHttpClient httpClient = new DefaultHttpClient(httpParameters);
            // define the URL e.g. http://myIpaddress/?cmd=on (to toggle button on for example)

            URI website = new URI("http://"+str_ipAdd+"/?cmd="+str_paramVal);
           // URI website = new URI("http://checkip.dyndns.org/");
            HttpGet getRequest = new HttpGet(); // create an HTTP GET object
            getRequest.setURI(website); // set the URL of the GET request
            HttpResponse response = httpclient.execute(getRequest); // execute the request
            // get the ip address server's reply
            InputStream content = null;
            content = response.getEntity().getContent();
            BufferedReader in = new BufferedReader(new InputStreamReader(
                    content

            ));
            serverResponse = in.readLine();
            // Close the connection
            content.close();
        } catch (ClientProtocolException e) {
            // HTTP error
            serverResponse = e.getMessage();
            e.printStackTrace();
        } catch (IOException e) {
            // IO error
            serverResponse = e.getMessage();
            e.printStackTrace();
        } catch (URISyntaxException e) {
            // URL syntax error
            serverResponse = e.getMessage();
            e.printStackTrace();
        }
        // return the server's reply/response text
        return serverResponse;
    }

    /**
     * An AsyncTask is needed to execute HTTP requests in the background so that they do not
     * block the user interface.
     */
    private class HttpRequestAsyncTask extends AsyncTask<Void, Void, Void> {

        // declare variables needed
        private String requestReply, str_ipAdd;
        private Context context;
        private AlertDialog alertDialog;
        private String str_paramVal;
        private ProgressDialog progress;

        /**
         * Description: The asyncTask class constructor. Assigns the values used in its other methods.
         *
         * @param context        the application context, needed to create the dialog
         * @param str_paramVal the pin number to toggle
         * @param str_ipAdd      the ip address to send the request to
         *                       //   * @param portNumber the port number of the ip address
         */
        public HttpRequestAsyncTask(Context context, String str_paramVal, String str_ipAdd) {
            this.context = context;

            alertDialog = new AlertDialog.Builder(this.context)
                    .setCancelable(true)
                    .create();

            this.str_ipAdd = str_ipAdd;
            this.str_paramVal = str_paramVal;

        }

        /**
         * Name: doInBackground
         * Description: Sends the request to the ip address
         *
         * @param voids
         * @return
         */
        @Override

        protected Void doInBackground(Void... voids) {
            requestReply = sendRequest(str_paramVal, str_ipAdd);
            return null;
        }

        /**
         * Name: onPostExecute
         * Description: This function is executed after the HTTP request returns from the ip address.
         * The function sets the dialog's message with the reply text from the server and display the dialog
         * if it's not displayed already (in case it was closed by accident);
         * //  * @param aVoid void parameter
         */
        @Override
        protected void onPostExecute(Void avoid) {

            progress.dismiss();
           // alertDialog.setIcon(android.R.drawable.alert_light_frame);

            if(requestReply.length()>227)
            //if(str_getMode.length()>227)
            {
                str_curDateTime = DateFormat.getDateTimeInstance().format(new Date());
                String str_getMode = requestReply;

                int int_modeLen = str_getMode.indexOf(',') + 1;
                // start sa 228 hanggang sa index ng comma
                // yung 228 ay fixed length ng http code button kaya ang susunod na index ay yung first character ng status
                txtv_process.setText(str_getMode.substring(228,int_modeLen-1)); //nag
                txtv_mode.setText(str_getMode.substring(int_modeLen));

                    if(flag == 5) {
                        txtv_process.setText(str_getMode.substring(228,int_modeLen-1));
                        txtv_mode.setText(str_getMode.substring(int_modeLen));
                    }
                    else if(flag == 1)
                    {
                        alertDialog.setTitle("Manual Mode");
                        alertDialog.setMessage("IN: Retrieves-in the clothesline from outside.");
                        alertDialog.show();
                    }
                    else if(flag == 2)
                    {
                        alertDialog.setTitle("Manual Mode");
                        alertDialog.setMessage("OUT: Retrieved-out the clothesline from inside.");
                        alertDialog.show();
                    }
                    else if(flag == 3)
                    {
                        alertDialog.setTitle("Automatic Mode");
                        alertDialog.setMessage("Retrieves-in if Wet, otherwise retrieves-out.");
                        alertDialog.show();
                    }
                    else if(flag == 4)
                    {
                        alertDialog.setTitle("Automatic with Time Phase Mode");
                        alertDialog.setMessage("Retrieves-in if Wet or Dark. Otherwise, retrieves-out.");
                        alertDialog.show();
                    }
            }
            else
            {
                txtv_mode.setText("...");
                txtv_process.setText("Connection to system not found.");
                alertDialog.setTitle("Network Error");
                alertDialog.setMessage("Unable to access the system.");
                alertDialog.show();

            }





        }

        /**
         * Name: onPreExecute
         * Description: This function is executed before the HTTP request is sent to ip address.
         * The function will set the dialog's message and display the dialog.
         */

        @Override
        protected void onPreExecute()
        {
            txtv_mode.setText("...");
            txtv_process.setText("Connecting to server..");
            progress = ProgressDialog.show(context, "Please Wait..", "Sending request to the sever...");

        }


    }
}