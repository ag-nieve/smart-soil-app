

#include <AM2302-Sensor.h>
#include <ESP32Firebase.h>
#include <WiFi.h>

// Wifi Name....
#define _SSID "GlobeAtHome_5f2d0"

// Wifi password ....
#define _PASSWORD "G5gqQDks"  

// Firebase Link ....
#define REFERENCE_URL "https://soil-moisture-database-eea02-default-rtdb.asia-southeast1.firebasedatabase.app/"

#define RELAY_PIN 16
#define MAX_UID 12

// setup firebase reference url..
Firebase firebase(REFERENCE_URL);

constexpr unsigned int SENSOR_PIN {13U};

AM2302::AM2302_Sensor am2302{SENSOR_PIN};

int _moisture,sensor_analog;
const int sensor_pin = A0;  /* Soil moisture sensor O/P pin */

char uid[MAX_UID + 1];

const char *generateUID() {
    const char possible[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (int p = 0; p < MAX_UID; p++) {
        int r = random(0, strlen(possible));
        uid[p] = possible[r];
    }
    uid[MAX_UID] = '\0';
    return uid;
}

void setup() {
   Serial.begin(115200);
   while (!Serial) {
      yield();
   }
   Serial.print(F("\n >>> AM2302-sensor Health Check <<<\n\n"));

   // put your setup code here, to run once:
   // set pin and check for sensor

  //  if (am2302.begin()) {
  //     delay(3000);
  //  }
  //  else {
  //     while (true) {
  //     Serial.println("Error: sensor check. => Please check sensor connection!");
  //     delay(10000);
  //     }
  //  }

   pinMode(RELAY_PIN, OUTPUT);

   // WiFi Connection
    WiFi.mode(WIFI_STA);
    WiFi.disconnect();
    delay(1000);

    // Connect to WiFi
    Serial.println();
    Serial.println("Connecting to: " + String(_SSID));
    WiFi.begin(_SSID, _PASSWORD);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println("");
    Serial.println("WiFi Connected");

}

void loop() {

  

  static int checksum_err{0}, timeout_err {0}, read_freq_err {0};

  auto status = am2302.read();
  sensor_analog = analogRead(sensor_pin);
  _moisture = ( 100 - ( (sensor_analog/4095.00) * 100 ) );

  String test = String(generateUID());
  Serial.print("UID: ");
  Serial.println(test);
  
  String data3 = firebase.getString("dateTime");

  String url = "arduino_sensors/" + data3;
  Serial.println("Firebase URL: " + url);

  String myTemp = String(am2302.get_Temperature());
  String myHumid = String(am2302.get_Humidity());
  String mySoilMoisture = String( _moisture);

  firebase.setString(url + "/temperature", myTemp);
  firebase.setString(url + "/humidity", myHumid);
  firebase.setString(url + "/soilMoisture",mySoilMoisture);

  firebase.json(true);

  Serial.print("Temperature: ");
  Serial.println(am2302.get_Temperature());

  Serial.print("Humidity:    ");
  Serial.println(am2302.get_Humidity());

  Serial.print("Moisture: ");
  Serial.print(_moisture); 
  Serial.println("%");

  String data2 = firebase.getString("switch");
  Serial.print("Received Int:\t\t");
  Serial.println(data2);


  if(am2302.get_Temperature() >= 35 || am2302.get_Humidity() <= 70 || _moisture <= 50 || data2 == "true"){
    digitalWrite(RELAY_PIN, LOW);
  }else{
    digitalWrite(RELAY_PIN, HIGH);
  }

  delay(500);
}
