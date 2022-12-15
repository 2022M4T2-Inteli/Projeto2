//Inclusão de bibliotecas
// #include <LiquidCrystal_I2C.h>
#include <Wire.h>
#include <MFRC522.h>
#include <SPI.h>
#include <LittleFS.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <WiFiAP.h>
#include <WebServer.h>
#include <ESPmDNS.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>

//defini as portas de entrada 
#define rede 0
#define RFID_SS_SDA   21
#define RFID_RST      14
#define Buzzer        1
#define led1          5
#define led2          7
#define LED_BUILTIN 2 //configura o pino do LED embutido

char codigoRFIDLido[100] = "";
const char* host = "http://10.128.64.173:5500";
const char *modelo="cadeira", *numP="83723", *Local="sala3";

//Vetores com ssids e senhas da rede de envio de dados
const char *SSIDEx[10] = {"Inteli-COLLEGE", "Beacon Visitante", "SHARE-RESIDENTE 2"};
const char *PWDEx[10]  = {"QazWsx@123",     "B3visit@2022", "Share@residente"};
WebServer server(80);

//Função que manda os dados para o servidor
void postDataToServer() {
    Serial.println("Posting JSON data to server...");
    HTTPClient http;
    http.begin((String)host+"/RFID");
    http.addHeader("Content-Type", "application/json");
    StaticJsonDocument<200> doc;
    // Add values in the document
    doc["Modelo"] = modelo;
    doc["NumeroP"] = numP;
    doc["Localizacao"] = Local;
    // // Add an array.
    // JsonArray data = doc.createNestedArray("data");
    // data.add(Xpos);
    // data.add(Ypos);
    String requestBody;
    serializeJson(doc, requestBody);
    int httpResponseCode = http.POST(requestBody);
    if(httpResponseCode>0){
      String response = http.getString();
      Serial.println(httpResponseCode);
      Serial.println(response);
    }
    else {
       Serial.printf("Error occurred while sending HTTP POST: %s\n", http.errorToString(httpResponseCode).c_str());
    }
}
//Função de conexão com a rede de envio de dados
void ConectarEnviarRede(){
  Serial.printf("Conectando na rede: %s\n", SSIDEx[rede]);
  WiFi.begin(SSIDEx[rede], PWDEx[rede]);
  int tent = 0;
  while (WiFi.status() != WL_CONNECTED && tent < 8) {
    Serial.print(".");
    delay(500);
    tent++;
  }
  if (tent >= 8){
    WiFi.disconnect();
    Serial.println("WiFi Conection Failed!");
    return;
  }
  Serial.println("WiFi Connected!");
  postDataToServer();
  WiFi.disconnect();
  Serial.println("WiFi Disconnected!");
}

MFRC522 rfidBase = MFRC522(RFID_SS_SDA, RFID_RST);
class LeitorRFID{
  private:
    char codigoRFIDEsperado[100] = "";
    MFRC522 *rfid = NULL;
    int cartaoDetectado = 0;  
    int cartaoJaLido = 0;
    void processaCodigoLido(){
      char codigo[3*rfid->uid.size+1];
      codigo[0] = 0;
      char temp[10];  
      for(int i=0; i < rfid->uid.size; i++){
        sprintf(temp,"%X",rfid->uid.uidByte[i]);
        strcat(codigo,temp);
      }
      codigo[3*rfid->uid.size+1] = 0;    
      strcpy(codigoRFIDLido,codigo);
      Serial.println(codigoRFIDLido);
    }
  public:
    LeitorRFID(MFRC522 *leitor){
      rfid = leitor;
      rfid->PCD_Init(); 
      Serial.printf("MOSI: %i MISO: %i SCK: %i SS: %i\n",MOSI,MISO,SCK,SS);
    };
    char *tipoCartao(){
      MFRC522::PICC_Type piccType = rfid->PICC_GetType(rfid->uid.sak);
      Serial.println(rfid->PICC_GetTypeName(piccType));
      return((char *)rfid->PICC_GetTypeName(piccType));
    };
    int cartaoPresente(){
      return(cartaoDetectado); 
    };
    int cartaoFoiLido(){
      return(cartaoJaLido); 
    };
    void leCartao(){
      if (rfid->PICC_IsNewCardPresent()) { // new tag is available
        Serial.println("Cartao presente"); //retorna no serial monitor quando um cartão é detectado 
        cartaoDetectado = 1;
        if (rfid->PICC_ReadCardSerial()) { // NUID has been readed      
          Serial.println("Cartao lido");  //retorna no serial monitor após a leitura do cartão 
          cartaoJaLido = 1;
          processaCodigoLido();
          rfid->PICC_HaltA(); // halt PICC
          rfid->PCD_StopCrypto1(); // stop encryption on PCD
          tone(Buzzer, 2000, 1000);
          digitalWrite(led2, HIGH); // acendo o segundo led quando lê o cartão ou o tag
          delay(1000);
          ConectarEnviarRede();
        }
      }else{
        cartaoDetectado = 0;
      }
    };
    char *cartaoLido(){
       if ((WiFi.status() == WL_CONNECTED))
          {
          long rnd = random (1,10);
          HTTPClient client;
          client.begin("http://10.254.17.186:5500/RFIDjs");
          int httpCode = client.GET();
          }
      return(codigoRFIDLido);
    };
    void resetarLeitura(){
      cartaoDetectado = 0;
      cartaoJaLido = 0;
      digitalWrite(led2, LOW); // depois de ler o cartão o segundo led se apaga 
    }
    void listI2CPorts(){
      Serial.println("\nI2C Scanner");
      byte error, address;
      int nDevices;
      Serial.println("Scanning...");
      nDevices = 0;
      for(address = 1; address < 127; address++ ) {
        Wire.beginTransmission(address);
        error = Wire.endTransmission();
        if (error == 0) {
          Serial.print("I2C device found at address 0x");
          if (address<16) {
            Serial.print("0");
          }
          Serial.println(address,HEX);
          nDevices++;
        }
        else if (error==4) {
          Serial.print("Unknow error at address 0x");
          if (address<16) {
            Serial.print("0");
          }
          Serial.println(address,HEX);
        }    
      }
      if (nDevices == 0) {
        Serial.println("No I2C devices found\n");
      }
      else {
        Serial.println("done\n");
      }
    };
};
LeitorRFID *leitor = NULL;
//////////////////////////////
void setup() {
  Serial.begin(115200);
  SPI.begin();
  pinMode(Buzzer,OUTPUT);
  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);

  digitalWrite(led1, HIGH); //mantêm o primeiro led acesso quando o sensor rfid estiver funcionando 

  //------------------------//
  leitor = new LeitorRFID(&rfidBase);
  //------------------------//  
}

void loop(){
  // Serial.println("Lendo Cartao:"); //aparece no serial monitor enquanto está pronto para ler um cartão.
  // delay(6000);
  leitor->leCartao();
  if(leitor->cartaoFoiLido()){
    Serial.println(leitor->tipoCartao());
    Serial.println(leitor->cartaoLido());
    leitor->resetarLeitura();
    delay(2000); //delay para reiniciar a ler o cartão após uma leitura 
  }
  // server.handleClient();
  // delay(2); //allow the cpu to switch to other tasks
}










