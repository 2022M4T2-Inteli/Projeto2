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

//defini as portas de entrada 
#define RFID_SS_SDA   21
#define RFID_RST      14
#define Buzzer        1
#define led1          5
#define led2          7
#define LED_BUILTIN 2 //configura o pino do LED embutido

char codigoRFIDLido[100] = "";

float IPAdress;
//configura o nome da rede sem fio que será criada:
const char *ssid = "mufasaorei";
//configura a senha da rede sem fio
//qtd minima de 8 caracteres
const char *password = "12345678";
const char *ssidinteli = "Inteli-COLLEGE";
const char *passwordinteli ="QazWsx@123";

WebServer server(80);


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
        }
      }else{
        cartaoDetectado = 0;
      }
    };
    char *cartaoLido(){
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

  // Serial.print("MOSI: "); Serial.println(MOSI);
  // Serial.print("MISO: "); Serial.println(MISO);
  // Serial.print("SCK: "); Serial.println(SCK);
  // Serial.print("SS: "); Serial.println(SS);

  pinMode(LED_BUILTIN, OUTPUT);
//configura o baud rate da comunicação serial
Serial.begin(115200);
WiFi.begin(ssidinteli, passwordinteli);
while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
      }
Serial.println(WiFi.localIP());


WiFi.softAP(ssid, password);
// IPAdress myIP = WiFi.softAPIP();
IPAdress = WiFi.softAPIP();
Serial.print("SSID: ");
Serial.println(ssid);
Serial.print("AP IP adress: ");
Serial.println(IPAdress);
server.begin();
Serial.println("Servidor iniciado");
  if (MDNS.begin("esp32")){
    Serial.println("MDNS responder started");
    Serial.println(WiFi.localIP());
  }
server.on("/", handleRoot);
server.on("/on", handleOn);
server.on("/off", HandleOff);
/*server.on ("inline", [] () {
  server.send(200, "text/plain", "this works as well");
}); */
server.onNotFound(handleNotFound);
server.begin();
Serial.println("HTTP server started");

}

void handleRoot(){
String html = "";
// html+=  "<head><meta charset=\"UTF-8\">";
// html+=  "<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">";
html+=  "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">";
html+=  "<title>Relatorio</title>";
html+=  "<style>html { font-family: Helvetica; display: inline-block; margin: 0px auto; text-align: center;}";
html+=  "@media screen and (max-width: 480px){";
html+=  ".content{width: 94%;}";
html+=  ".rTable thead{display: none;}";
html+=  ".rTable tbody td{";
html+=  "    display: flex;";
html+=  "    flex-direction: column;";
html+=  "}";
html+=  " .rTable tbody td{";
html+=  "    display: flex;";
html+=  "    flex-direction: column;";
html+=  "}";
html+=  "}";
html+=  "@media screen and (min-width: 1200px){";
html+=  "    .content{width: 100%;}";
html+=  "    .rTable th , rTable td{padding: 7px 0;}";
html+=  "    .rTable tbody tr td:nth-child(1){width:10%}";
html+=  "    .rTable tbody tr td:nth-child(2){width:10%}";
html+=  "    .rTable tbody tr td:nth-child(3){width:10%}";
html+=  "    .rTable tbody tr td:nth-child(4){width:10%}";
html+=  "}";
html+=   "*{";
html+=   "margin: 0;";    
html+=   "padding: 0;";    
html+=   "box-sizing: border-box;";    
html+=   "align-items: center;";    
html+=   "}";
html+=   ".content{";
html+=   "    display: flex;";
html+=   "    margin: auto;";
html+=   "}";
html+=   ".rTable{";
html+=   "    width: 100%;";
html+=   "    text-align: center;";
html+=   "    font-size: 20px;";
html+=   "}";
html+=   "h1{";
html+=   "    font-size: 30px;";
html+=   "    padding-bottom: 20px;";
html+=   "    text-align: center;";
html+=   "    font-weight: bold;";
html+=   "}";
html+=   "#oi{";
html+=   "    font-weight: bold;";
html+=   "}";
html+=   "</style>";
html+=   "</head>";

html+=   "<body>";
html+=   "<div class=\"container\">";
// html+=   "  <h1>EQUIPAMENTOS CADASTRADOS</h1>";             
html+=   "  <table class=\"table\">";
html+=   " <thead>";
html+=   "   <tr>";
html+=   "     <th id=\"main\">ID</th>";
html+=   "      </tr>";
html+=   "    </tbody>";
html+=   "  </table>";
html+=   "</div>";
html+=   "</body>";

html += "<h1>Equipamentos</h1>";
html += "</br>";
html += "<h3>sensores</h3>";
html += "</br>";
html += "<h3>Codigo do RFID: "+String(codigoRFIDLido)+" </h3> ";
html += "</div>";
server.send(200, "text/html", html);
}

void handleOn() {
digitalWrite(LED_BUILTIN, 1);
handleRoot();
}
void HandleOff(){
digitalWrite(LED_BUILTIN, 0);
handleRoot();
}
void handleNotFound() {
digitalWrite(LED_BUILTIN, 1);
String message = "File not found\n\n";
message += "URI: ";
message += server.uri();
message += "\nMethod: ";
message += (server.method() == HTTP_GET) ? "GET" : "POST";
message += "\nArguments: ";
message += server.args();
message += "\n";
for (uint8_t i=0; i<server.args(); i++){
  message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
}
server.send(404, "text/plain", message);
digitalWrite(LED_BUILTIN, 0);
}

void loop() {
  // Serial.println("Lendo Cartao:"); //aparece no serial monitor enquanto está pronto para ler um cartão.
  // delay(6000);
  leitor->leCartao();
  if(leitor->cartaoFoiLido()){
    Serial.println(leitor->tipoCartao());
    Serial.println(leitor->cartaoLido());
    leitor->resetarLeitura();
    delay(2000); //delay para reiniciar a ler o cartão após uma leitura 
  }
  server.handleClient();
  delay(2); //allow the cpu to switch to other tasks
}








