#include <WiFiManager.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <Preferences.h> 

// Definición de pines adaptados al segundo código
#define DHTPIN 4          // DHT22 en pin digital 4
#define DHTTYPE DHT22
#define PIN_HUMEDAD_SUELO A1  // YL-69 en pin analógico A1
#define LDR_PIN A0        // Fotoresistor en pin analógico A0
#define PIN_SONIDO A2     // Sensor de sonido en pin analógico A2
#define PIN_RELAY 5       // Relé en pin digital 5
#define UMBRAL_HUMEDAD_MOTOR 30 

DHT dht(DHTPIN, DHTTYPE);

int valorSeco = 4095;    // Valor ALTO cuando está SECO (ajustar)
int valorHumedo = 1000;  // Valor BAJO cuando está HÚMEDO (ajustar)

// Configuración MQTT
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const char* mqtt_topic_temp = "karensensors/dht22/temperature";
const char* mqtt_topic_hum = "karensensors/dht22/humidity";
const char* mqtt_topic_ldr = "karensensors/dht22/luminosity";
const char* mqtt_topic_suelo = "karensensors/suelo/humedad";
const char* mqtt_topic_sonido = "karensensors/sonido";
const char* mqtt_topic_calib = "karensensors/suelo/calibracion";
const char* mqtt_topic_relay = "karensensors/relay/estado"; // Nuevo tópico para estado del relé

WiFiClient espClient;
PubSubClient client(espClient);

const long interval = 10000; // Intervalo de 10 segundos
unsigned long previousMillis = 0;
bool modoCalibracion = false;
bool mqttConnected = false; // Estado de conexión MQTT

void setup() {
  Serial.begin(115200);
  
  Preferences prefs;
  prefs.begin("reset_counter", false);
  
  unsigned int resetCount = prefs.getUInt("reset_count", 0);
  unsigned long lastResetTime = prefs.getULong("last_reset", 0);
  unsigned long currentTime = millis();

  if (currentTime - lastResetTime < 5000) {
    resetCount++;
  } else {
    resetCount = 1;
  }

  prefs.putUInt("reset_count", resetCount);
  prefs.putULong("last_reset", currentTime);

  WiFiManager wm;
  wm.setDebugOutput(true);

  if (resetCount >= 3) {
    Serial.println("Tres resets consecutivos detectados - Borrando configuración WiFi");
    wm.resetSettings();
    prefs.putUInt("reset_count", 0);
    Serial.println("Configuración WiFi borrada. Reiniciando...");
    delay(1000);
    ESP.restart();
  }

  prefs.end();

  wm.setConfigPortalTimeout(180);
  
  bool res = wm.autoConnect("GRUPO1", "12345678");
  if (!res) {
    Serial.println("Fallo en conexión. Reiniciando...");
    delay(3000);
    ESP.restart();
  } else {
    Serial.println("✅ WiFi conectado!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
  }

  dht.begin();
  pinMode(LDR_PIN, INPUT);
  pinMode(PIN_HUMEDAD_SUELO, INPUT);
  pinMode(PIN_SONIDO, INPUT);
  pinMode(PIN_RELAY, OUTPUT);
  digitalWrite(PIN_RELAY, HIGH); // Relé apagado (HIGH = apagado para SRD-05VDC-SL-C)

  client.setServer(mqtt_server, mqtt_port);
  client.setBufferSize(512);
  client.setCallback(mqttCallback);
  
  connectToMQTT();
}

void loop() {
  if (!client.connected() && !mqttConnected) {
    reconnect();
  }
  client.loop();

  if (millis() - previousMillis >= interval) {
    previousMillis = millis();
    
    if (modoCalibracion) {
      ejecutarCalibracion();
    } else {
      publishSensorData();
    }
  }
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Mensaje MQTT recibido [");
  Serial.print(topic);
  Serial.print("]: ");
  
  String mensaje = "";
  for (int i = 0; i < length; i++) {
    mensaje += (char)payload[i];
  }
  Serial.println(mensaje);

  if (String(topic) == mqtt_topic_calib) {
    if (mensaje == "iniciar") {
      modoCalibracion = true;
      Serial.println("Modo calibración ACTIVADO");
    } else if (mensaje == "detener") {
      modoCalibracion = false;
      Serial.println("Modo calibración DESACTIVADO");
    } else if (mensaje == "seco") {
      valorSeco = analogRead(PIN_HUMEDAD_SUELO);
      Serial.print("Valor SECO establecido: ");
      Serial.println(valorSeco);
    } else if (mensaje == "humedo") {
      valorHumedo = analogRead(PIN_HUMEDAD_SUELO);
      Serial.print("Valor HÚMEDO establecido: ");
      Serial.println(valorHumedo);
    } else if (mensaje == "reset_wifi") {
      Serial.println("Comando recibido - Borrando configuración WiFi");
      WiFiManager wm;
      wm.resetSettings();
      Serial.println("Configuración WiFi borrada. Reiniciando...");
      delay(1000);
      ESP.restart();
    }
  }
}

void ejecutarCalibracion() {
  int lecturaSuelo = analogRead(PIN_HUMEDAD_SUELO);
  
  Serial.println("====== MODO CALIBRACIÓN ======");
  Serial.print("Valor RAW: ");
  Serial.println(lecturaSuelo);
  Serial.print("Valor seco actual: ");
  Serial.println(valorSeco);
  Serial.print("Valor húmedo actual: ");
  Serial.println(valorHumedo);
  Serial.println("Envíe comandos por MQTT para calibrar:");
  Serial.println("  - 'seco' para establecer valor actual como SECO");
  Serial.println("  - 'humedo' para establecer valor actual como HÚMEDO");
  Serial.println("==============================");
  
  char rawStr[8];
  itoa(lecturaSuelo, rawStr, 10);
  client.publish(mqtt_topic_calib, rawStr);
}

void connectToMQTT() {
  String clientId = "ESP32Client-" + WiFi.macAddress(); // ID basado en MAC
  if (client.connect(clientId.c_str())) {
    Serial.println("✅ MQTT conectado");
    client.subscribe(mqtt_topic_calib);
    mqttConnected = true;
  } else {
    Serial.print("❌ Error MQTT: ");
    Serial.println(client.state());
    mqttConnected = false;
  }
}

void publishSensorData() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int ldrValue = analogRead(LDR_PIN);
  int lecturaSuelo = analogRead(PIN_HUMEDAD_SUELO);
  int sonido = analogRead(PIN_SONIDO);
  
  // Validar DHT22
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("ALERTA: Error leyendo DHT22 - Verificar conexión!");
    return; // No publicar datos inválidos
  }

  // Validar sensores analógicos
  if (ldrValue >= 4090) {
    Serial.println("ALERTA: Fotoresistor en 4095 - Verificar conexión!");
    return;
  } else if (ldrValue <= 10) {
    Serial.println("ALERTA: Fotoresistor en 0 - Posible cortocircuito!");
    return;
  }
  if (sonido >= 4090) {
    Serial.println("ALERTA: Sensor de sonido en 4095 - Verificar conexión!");
    return;
  } else if (sonido <= 10) {
    Serial.println("ALERTA: Sensor de sonido en 0 - Posible cortocircuito!");
    return;
  }
  if (lecturaSuelo >= 4090) {
    Serial.println("ALERTA: Sensor de suelo en 4095 - Verificar conexión!");
    return;
  } else if (lecturaSuelo <= 10) {
    Serial.println("ALERTA: Sensor de suelo en 0 - Posible cortocircuito!");
    return;
  }

  int humedadSuelo = map(lecturaSuelo, valorSeco, valorHumedo, 0, 100);
  humedadSuelo = constrain(humedadSuelo, 0, 100);

  // Control del relé (activo en LOW para SRD-05VDC-SL-C)
  if (humedadSuelo < UMBRAL_HUMEDAD_MOTOR) {
    digitalWrite(PIN_RELAY, LOW); // Encender motor
    Serial.println("Motor ENCENDIDO (Humedad baja)");
    client.publish(mqtt_topic_relay, "ON");
  } else {
    digitalWrite(PIN_RELAY, HIGH); // Apagar motor
    Serial.println("Motor APAGADO (Humedad adecuada)");
    client.publish(mqtt_topic_relay, "OFF");
  }

  char tempStr[8], humStr[8], ldrStr[8], sueloStr[8], sonidoStr[8];
  
  dtostrf(temperature, 4, 1, tempStr);
  dtostrf(humidity, 4, 1, humStr);
  itoa(ldrValue, ldrStr, 10);
  itoa(humedadSuelo, sueloStr, 10);
  itoa(sonido, sonidoStr, 10);

  client.publish(mqtt_topic_temp, tempStr);
  client.publish(mqtt_topic_hum, humStr);
  client.publish(mqtt_topic_ldr, ldrStr);
  client.publish(mqtt_topic_suelo, sueloStr);
  client.publish(mqtt_topic_sonido, sonidoStr);

  Serial.println("===== DIAGNÓSTICO COMPLETO =====");
  Serial.print("Temperatura: "); Serial.print(tempStr); Serial.println("°C");
  Serial.print("Humedad amb: "); Serial.print(humStr); Serial.println("%");
  Serial.print("Luminosidad: "); Serial.println(ldrValue);
  
  Serial.print("Humedad suelo: ");
  Serial.print(humedadSuelo);
  Serial.print("% (RAW: ");
  Serial.print(lecturaSuelo);
  Serial.print(") [Seco: ");
  Serial.print(valorSeco);
  Serial.print(" | Húmedo: ");
  Serial.print(valorHumedo);
  Serial.println("]");
  
  Serial.print("Sonido: "); Serial.println(sonido);
  Serial.println("================================");
}

void reconnect() {
  Serial.println("🔄 Reconectando a MQTT...");
  
  int intentos = 0;
  while (!client.connected() && intentos < 5) {
    intentos++;
    connectToMQTT();
    
    if (!client.connected()) {
      Serial.print("Intento ");
      Serial.print(intentos);
      Serial.println("/5 fallido");
      delay(5000);
    }
  }
  
  if (!client.connected()) {
    Serial.println("No se pudo conectar a MQTT. Continuando en modo offline...");
    mqttConnected = false;
    // Continuar funcionando localmente (control del relé y lecturas)
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    int ldrValue = analogRead(LDR_PIN);
    int lecturaSuelo = analogRead(PIN_HUMEDAD_SUELO);
    int sonido = analogRead(PIN_SONIDO);
    
    int humedadSuelo = map(lecturaSuelo, valorSeco, valorHumedo, 0, 100);
    humedadSuelo = constrain(humedadSuelo, 0, 100);

    if (humedadSuelo < UMBRAL_HUMEDAD_MOTOR) {
      digitalWrite(PIN_RELAY, LOW); // Encender motor
      Serial.println("Motor ENCENDIDO (Humedad baja, modo offline)");
    } else {
      digitalWrite(PIN_RELAY, HIGH); // Apagar motor
      Serial.println("Motor APAGADO (Humedad adecuada, modo offline)");
    }
  }
}