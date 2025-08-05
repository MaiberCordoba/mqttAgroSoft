#include <WiFiManager.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <Preferences.h>

// Definición de pines
#define DHTPIN 4          // DHT22 en pin digital 4
#define DHTTYPE DHT22
#define PIN_HUMEDAD_SUELO A1  // YL-69 en pin analógico A1
#define LDR_PIN A0        // Fotoresistor en pin analógico A0
#define PIN_SONIDO A2     // Sensor de sonido en pin analógico A2
#define PIN_RELAY 5       
#define UMBRAL_HUMEDAD_MOTOR 30 

DHT dht(DHTPIN, DHTTYPE);

int valorSeco = 4095;    // Valor ALTO cuando está SECO
int valorHumedo = 1000;  // Valor BAJO cuando está HÚMEDO

// Configuración MQTT
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const char* mqtt_topic_temp = "karensensors/dht22/temperature";
const char* mqtt_topic_hum = "karensensors/dht22/humidity";
const char* mqtt_topic_ldr = "karensensors/dht22/luminosity";
const char* mqtt_topic_suelo = "karensensors/suelo/humedad";
const char* mqtt_topic_sonido = "karensensors/sonido";
const char* mqtt_topic_calib = "karensensors/suelo/calibracion";
const char* mqtt_topic_relay = "karensensors/relay/estado";

WiFiClient espClient;
PubSubClient client(espClient);

const long interval = 10000; // Intervalo de 10 segundos
unsigned long previousMillis = 0;
bool modoCalibracion = false;
bool mqttConnected = false;

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
  String clientId = "ESP32Client-" + WiFi.macAddress();
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
  // Leer sensores analógicos primero
  int ldrValue = analogRead(LDR_PIN);
  int lecturaSuelo = analogRead(PIN_HUMEDAD_SUELO);
  // int sonido = analogRead(PIN_SONIDO); // Comentado: sensor desconectado

  // Control del relé (antes de leer DHT22 para evitar interferencias)
  int humedadSuelo = map(lecturaSuelo, valorSeco, valorHumedo, 0, 100);
  humedadSuelo = constrain(humedadSuelo, 0, 100);

  static bool relayState = false;
  bool newState = humedadSuelo < UMBRAL_HUMEDAD_MOTOR; // Suelo seco → Relé ON
  if (newState != relayState) {
    if (newState) {
      digitalWrite(PIN_RELAY, LOW); // Encender motor (suelo seco)
      Serial.println("Motor ENCENDIDO (Suelo seco, necesita riego)");
      client.publish(mqtt_topic_relay, "ON");
    } else {
      digitalWrite(PIN_RELAY, HIGH); // Apagar motor (suelo húmedo)
      Serial.println("Motor APAGADO (Suelo húmedo, no necesita riego)");
      client.publish(mqtt_topic_relay, "OFF");
    }
    relayState = newState;
    delay(2000); // Retardo para estabilizar tras cambio del relé
  }

  // Leer DHT22 después del relé
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  // Preparar cadenas para publicación
  char tempStr[8], humStr[8], ldrStr[8], sueloStr[8], sonidoStr[8];
  
  // Validar DHT22
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("ADVERTENCIA: Error leyendo DHT22 - Enviando N/A");
    strcpy(tempStr, "N/A");
    strcpy(humStr, "N/A");
  } else {
    dtostrf(temperature, 4, 1, tempStr);
    dtostrf(humidity, 4, 1, humStr);
  }

  // Validar LDR (tratar 4095 como válido)
  if (ldrValue <= 10) {
    Serial.println("ALERTA: Fotoresistor en 0 - Posible cortocircuito! Enviando N/A");
    strcpy(ldrStr, "N/A");
  } else {
    itoa(ldrValue, ldrStr, 10); // Enviar valor incluso si es 4095
    if (ldrValue >= 4090) {
      Serial.println("NOTA: Fotoresistor en 4095 - Luz intensa detectada");
    }
  }

  // Validar YL-69
  if (lecturaSuelo <= 10) {
    Serial.println("ALERTA: Sensor de suelo en 0 - Posible cortocircuito! Enviando N/A");
    strcpy(sueloStr, "N/A");
  } else {
    itoa(humedadSuelo, sueloStr, 10);
    if (lecturaSuelo >= 4090) {
      Serial.println("NOTA: Sensor de suelo en 4095 - Suelo seco o desconectado");
    }
  }

  strcpy(sonidoStr, "0"); // Valor dummy para sonido

  // Publicar datos al broker
  Serial.println("Publicando datos al broker...");
  client.publish(mqtt_topic_temp, tempStr);
  client.publish(mqtt_topic_hum, humStr);
  client.publish(mqtt_topic_ldr, ldrStr);
  client.publish(mqtt_topic_suelo, sueloStr);
  client.publish(mqtt_topic_sonido, sonidoStr);

  // Imprimir diagnóstico
  Serial.println("===== DIAGNÓSTICO COMPLETO =====");
  Serial.print("Temperatura: "); Serial.print(tempStr); Serial.println("°C");
  Serial.print("Humedad amb: "); Serial.print(humStr); Serial.println("%");
  Serial.print("Luminosidad: "); Serial.println(ldrStr);
  Serial.print("Humedad suelo: ");
  Serial.print(sueloStr);
  Serial.print("% (RAW: ");
  Serial.print(lecturaSuelo);
  Serial.print(") [Seco: ");
  Serial.print(valorSeco);
  Serial.print(" | Húmedo: ");
  Serial.print(valorHumedo);
  Serial.println("]");
  Serial.print("Sonido: "); Serial.println("Desconectado");
  Serial.print("Relé: "); Serial.println(newState ? "ON (Suelo seco)" : "OFF (Suelo húmedo)");
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
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    int ldrValue = analogRead(LDR_PIN);
    int lecturaSuelo = analogRead(PIN_HUMEDAD_SUELO);
    int humedadSuelo = map(lecturaSuelo, valorSeco, valorHumedo, 0, 100);
    humedadSuelo = constrain(humedadSuelo, 0, 100);

    if (humedadSuelo < UMBRAL_HUMEDAD_MOTOR) {
      digitalWrite(PIN_RELAY, LOW); // Encender motor (suelo seco)
      Serial.println("Motor ENCENDIDO (Suelo seco, modo offline)");
    } else {
      digitalWrite(PIN_RELAY, HIGH); // Apagar motor (suelo húmedo)
      Serial.println("Motor APAGADO (Suelo húmedo, modo offline)");
    }
  }
}