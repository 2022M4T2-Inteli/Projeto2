//Bibliotecas
#include <ArduinoJson.h>
#include <HTTPClient.h>
#include <WiFi.h>
#include <esp_wifi.h>
#include <math.h>
#include <string.h>

//-------------------------Campo de alteração-----------------------//

#define APNTotal 6 //Número totais de access ponts
#define rede_envio 0 //Número da rede de envio de infos

//Vetores com ssids, senhas, e localização dos beacons respectivamente
const char* SSIDS[APNTotal]= {"ThunderBoltsBrabos0","ThunderBoltsBrabos1","ThunderBoltsBrabos2","ThunderBoltsBrabos3","ThunderBoltsBrabos4","ThunderBoltsBrabos5"};
const int POS[APNTotal][2]=  {{0,0},                 {0,5},                {5,0},                {5,5},                {5,10},               {10,5}};
const char* PWD = "brabissimos";

//Vetores com ssids e senhas da rede de envio de dados
const char *SSIDEx[10] = {"Inteli-COLLEGE", "Beacon Visitante"};
const char *PWDEx[10]  = {"QazWsx@123",     "B3visit@2022"};
//Host que recebera os dados personalizados
const char* host = "http://10.128.64.20:5500";
const char *id="3", *nrPatri="10", *nrSerie="10", *modelo="dell", *cor="vermelho";

//Vetores que armazenarão os processos da comunicação e distâncias
int   hab[APNTotal] = {1,1,1,1,1,1};                                  
int   processingDist[APNTotal] = {1,0,0,0,0,0};
int   finishedProcessingDist[APNTotal] = {0,0,0,0,0,0};

//-----------------------------------------------------------------//

int   statusDist[3] = {0,0,0};
float distancia[3] = {2.5, 2.5, 2.5};

//Declaração da posição dos Beacons e do dispostivo inicialmente
int   xA=POS[0][0], yA=POS[0][1],  xB=POS[1][0], yB=POS[1][1],  xC=POS[2][0], yC=POS[2][1];
float Xpos = 0, Ypos = 0;

//Declaração dos processos para a comunicação e cálculo de distância
int   processingAP = 0; 
int   AP = 0;
int   tries = 0;
const int buzz = 38;

//Função que manda os dados para o servidor
void postDataToServer() {
    Serial.println("Posting JSON data to server...");
    HTTPClient http;
    http.begin((String)host+"/Eletronicos");
    http.addHeader("Content-Type", "application/json");         
    
    StaticJsonDocument<200> doc;
    // Add values in the document
    doc["IDEletronico"] = id;
    doc["NumeroPatrimonio"] = nrPatri;
    doc["NumeroSerie"] = nrSerie;
    doc["Modelo"] = modelo;
    doc["Cor"] = cor;
    doc["LocalizacaoX"] = Xpos;
    doc["LocalizacaoY"] = Ypos;
    
    String requestBody;
    serializeJson(doc, requestBody);

    int httpResponseCode = http.POST(requestBody);

    if(httpResponseCode>0){
      String response = http.getString();                       
      Serial.println(httpResponseCode);
      Serial.println(response);
      http.end();
    }
    else {
       Serial.printf("Error occurred while sending HTTP POST: %s\n", http.errorToString(httpResponseCode).c_str());
    }
     
}

void Buzinar(){
    Serial.println("Checando Buzina...");
    HTTPClient http;
    http.begin((String)host+"/buzina");
    http.addHeader("Content-Type", "text/plain");          

    int httpResponseCode = http.POST("buzina");

    if(httpResponseCode>0){
      Serial.println(httpResponseCode);

      String response = http.getString();

      String buz = response.substring(0, 1);
      
      String idpost = response.substring(1);

      Serial.printf("Buzina: %s ID: %s\n", buz, idpost);

      if(idpost == id){
        Serial.print("Tocar: ");
        if(buz == "1"){
          Serial.println("SIM!");
          digitalWrite(buzz, HIGH);
        }
        else if(buz == "0"){
          Serial.println("NAO!");
          digitalWrite(buzz, LOW);
        }
      }
    } else {
      Serial.printf("Error occurred while HTTP POST: %s\n", http.errorToString(httpResponseCode).c_str());
    }
    http.end();
}

//Função de conexão com a rede de envio de dados
void ConectarEnviarRede(int rede) {
  Serial.printf("Conectando na rede: %s\n", SSIDEx[rede]);
  WiFi.begin(SSIDEx[rede], PWDEx[rede]);
  
  int tent = 0;
  int tentMax = 4;
  if (AP == 3) tentMax = 8;

  while (WiFi.status() != WL_CONNECTED && tent < tentMax) {
    Serial.print(".");
    delay(500);
    tent++;
  }
  if (tent >= tentMax){
    WiFi.disconnect();
    Serial.println("WiFi Conection Failed!");
    return;
  }

  Serial.println("WiFi Connected!");

  if(AP == 3) postDataToServer();
  Buzinar();

  WiFi.disconnect();
  Serial.println("WiFi Disconnected!");
}

//Função que calcula a posição do dispositivo
void CalcPosition(){
  float A = 2*xB - 2*xA;
  float B = 2*yB - 2*yA;
  float C = pow(distancia[0],2) - pow(distancia[1],2) - pow(xA,2) + pow(xB,2) - pow(yA,2) + pow(yB,2);
  float D = 2*xC - 2*xB;
  float E = 2*yC - 2*yB;
  float F = pow(distancia[1],2) - pow(distancia[2],2) - pow(xB,2) + pow(xC,2) - pow(yB,2) + pow(yC,2);
  Xpos = (C*E - F*B) / (E*A - B*D);
  Ypos = (C*D - A*F) / (B*D - A*E);
  Xpos = trunc(Xpos);
  Ypos = trunc(Ypos);
  Serial.printf("\n O dispositivo está em X: %.2f, Y: %.2f \n", Xpos, Ypos);
}

//Função que declara a posição dos beacons conectados
void Trilateracao(int status, int beacon, int ap){
  if (status){
    if (ap == 0){
      xA = POS[beacon][0];
      yA = POS[beacon][1];
      AP++;
    }
    else if (ap == 1){
      xB = POS[beacon][0];
      yB = POS[beacon][1];
      AP++;
    }
    else if (ap == 2){
      xC = POS[beacon][0];
      yC = POS[beacon][1];
      AP++;
    }
  }
}

// Definições para o FTM
// Número de frames FTM requisitados para 4 ou 8 bursts (0(No pref), 16, 24, 32, 64)
const uint8_t FTM_FRAME_COUNT = 32;
// Tempo requisitado entre os burst em 100’s of milliseconds (0(No pref), 2-255)
const uint16_t FTM_BURST_PERIOD = 4;
// Semaphore mostra quando o FTM Report foi recebido
xSemaphoreHandle ftmSemaphore;
// Status do FTM Report recebido
bool ftmSuccess = true;

// FTM report com a distância calculada
void onFtmReport(arduino_event_t *event) {
  const char * status_str[5] = {"SUCCESS", "UNSUPPORTED", "CONF_REJECTED", "NO_RESPONSE", "FAIL"};
  wifi_event_ftm_report_t * report = &event->event_info.wifi_ftm_report;
  ftmSuccess = report->status == FTM_STATUS_SUCCESS;
  if(ftmSuccess) {
    if(!finishedProcessingDist[processingAP]){
      distancia[processingAP] = (float)report->dist_est/100 - 40.00;
      Serial.printf("FTM Estimate: Distance: %.2f m, Return Time: %u ns \n", (float)report->dist_est/100.00 - 40.00, (float)report->rtt_est);
      statusDist[processingAP] = 1;
    }
  } else {
    Serial.print("FTM Error: ");
    Serial.println(status_str[report->status]);
    statusDist[processingAP] = 0;
  }
  // Mostrar que o report foi recebido
  xSemaphoreGive(ftmSemaphore);
  return;
}

// Inicia a sessão FTM e espera o FTM Report
bool getFtmReport(){
  if(!WiFi.initiateFTM(FTM_FRAME_COUNT, FTM_BURST_PERIOD)){
    Serial.println("FTM Error: Initiate Session Failed");
    return false;
  }
  return xSemaphoreTake(ftmSemaphore, portMAX_DELAY) == pdPASS && ftmSuccess;
}

//Função de conexão com os beacons e inicialização do FTM
void MedirDistancia(int rede){
  ftmSemaphore = xSemaphoreCreateBinary();
 
  WiFi.onEvent(onFtmReport, ARDUINO_EVENT_WIFI_FTM_REPORT);  
  
  Serial.println("Connecting to FTM Responder");
  WiFi.begin(SSIDS[rede], PWD);
  
  int tent = 0;
  while (WiFi.status() != WL_CONNECTED && tent < 4){
    delay(500);
    Serial.print(".");
    tent++;
  }
  if (tent >= 4){
    finishedProcessingDist[processingAP] = 1;
    statusDist[processingAP] = 0;
    return;
  }
  Serial.printf("WiFi Connected - FTM: FRAME_COUNT:%i Burst Period: %i ms\n",FTM_FRAME_COUNT,FTM_BURST_PERIOD);
  delay(1000);
  getFtmReport();
  finishedProcessingDist[processingAP] = 1;
}

void setup() {
  Serial.begin(115200);
  
  WiFi.mode(WIFI_STA);

  pinMode(buzz, OUTPUT);

  digitalWrite(buzz, LOW);
}

void loop() {
    Serial.println("Rotação de beacons!");
    if(hab[processingAP]){
      if(processingDist[processingAP]){
        Serial.printf("BEACON: %s\n", SSIDS[processingAP]);
        MedirDistancia(processingAP);
        delay(100);
        if(finishedProcessingDist[processingAP]){
            if(processingAP < APNTotal){
                Trilateracao(statusDist[processingAP], processingAP, AP);
                processingDist[processingAP] = 0;
                finishedProcessingDist[processingAP] = 0;
                processingAP++;
                WiFi.removeEvent(ARDUINO_EVENT_WIFI_FTM_REPORT);
                WiFi.disconnect();    
                esp_wifi_ftm_end_session();
                if(AP == 3){
                  CalcPosition();
                  processingAP = APNTotal;
                }
                ConectarEnviarRede(rede_envio);
            }
            if(processingAP == APNTotal){
              processingAP = 0;
              AP = 0;
              for(int i=0; i<3; i++) statusDist[i] = 0;
              tries++;
              if (tries == 2) ESP.restart();
            }
            processingDist[processingAP] = 1;            
        }
      }
    }
    else processingAP++;
}

















