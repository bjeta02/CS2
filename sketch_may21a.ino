#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <NewPing.h>

#define ECHO_PIN D11
#define TRIG_PIN D10
#define BUZZER_PIN D1
#define RED_LED_PIN D8
#define GREEN_LED_PIN D3

const char* ssid = "virus";
const char* password = "1434414344";

NewPing sonar(TRIG_PIN, ECHO_PIN);

void setup() {
  pinMode(BUZZER_PIN, OUTPUT);  // Set buzzer pin as output
  pinMode(RED_LED_PIN, OUTPUT);  // Set red LED pin as output
  pinMode(GREEN_LED_PIN, OUTPUT);  // Set green LED pin as output
  Serial.begin(115200);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    
    int distance = sonar.ping_cm();
    String alertStatus = "alert";
    if (distance <= 20) {
      int buzzerDelay = map(distance, 1, 50, 100, 1000); // Map distance to delay (1-20 cm maps to 1000-100 ms)
      // Produce an alternating sound on the buzzer
      for (int i = 0; i < 10; i++) {
        digitalWrite(BUZZER_PIN, HIGH); // Turn on the buzzer
        delay(buzzerDelay / 2); // Wait for half the buzzer delay
        digitalWrite(BUZZER_PIN, LOW); // Turn off the buzzer
        delay(buzzerDelay / 2); // Wait for half the buzzer delay
      }

      // Turn on the red LED and turn off the green LED
      digitalWrite(RED_LED_PIN, HIGH);
      digitalWrite(GREEN_LED_PIN, LOW);
    
      String url = "http://192.168.102.180:5000/api/distances";

      http.begin(client, url);

      // Add Content-Type header
      http.addHeader("Content-Type", "application/json");
      String json = "{\"distance\": " + String(distance) + ", \"alertStatus\": \"" + alertStatus + "\"}";
      // Send POST request
      int httpResponseCode = http.POST(json);
      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.println("HTTP Response code: " + String(httpResponseCode));
        Serial.println("Response: " + response);
      } else {
        Serial.print("Error Sending data to server. HTTP Response code: ");
        Serial.println(httpResponseCode);
        Serial.println(http.errorToString(httpResponseCode));
      }
      http.end();
    }else{
      digitalWrite(BUZZER_PIN, LOW);
      digitalWrite(RED_LED_PIN, LOW);
      digitalWrite(GREEN_LED_PIN, HIGH);
    }
  } else {
    Serial.println("WiFi not connected. Unable to send data to server");
  }
  delay(100);
}