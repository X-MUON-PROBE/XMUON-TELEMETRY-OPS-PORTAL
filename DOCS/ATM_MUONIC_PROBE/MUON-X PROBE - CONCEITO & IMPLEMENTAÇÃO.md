
---
<div style="display: flex; flex-direction: row;">
	<div style="flex: 1; text-align: left;">
		<p><strong>Documento desenvolvido por:</strong> <i>Eduardo Xavier Oliveira Sá - Colégio Internato dos Carvalhos</i></p>
	</div>
	<div style="flex:1; text-align: right;">
		<p>Abril 2025</p>
	</div>
</div>

## Detecção de Muões Cósmicos na superfície terrestre e na atmosfera

Tendo em conta a meta de, após um conjunto de observações à superfície, poder realizar uma missão de medição e detecção de muões cósmicos, a bordo de um balão meteorológico, ao nível da estratosfera, está a ser desenvolvido um protótipo de um dispositivo semelhante a uma sonda, que, albergando um conjunto de sensores de diferentes tipos, obtém dados relativos à contagem de deteções de partículas com origem em raios cósmicos, especialmente os muões, capazes de ionizar um tubo de Geiger-Muller no interior da sonda.


> **Nota:** Embora qualquer tipo de radiação suficientemente energética possa originar um evento de ionização no interior do tubo de Geiger-Müller, os muões representam, de acordo com os dados científicos, a maior percentagem de partículas ionizantes provenientes de radiação cósmica, na superfície terrestre.

---
#### Conceito inicial
<div class="dualColumnLayout">
	<div>
		<p>Partindo do conceito demonstrado na reunião anterior, um detetor de Geiger-Muller (concebido no LIP) e um sensor de temperatura e pressão barométrica (BMP280) foram conectados ao microcontrolador <i>Raspberry Pi Pico W</i>, tendo sido devidamente programado para registar a contagem de muões detetados e monitorizar a temperatura e pressão do ambiente em que estas medições são realizadas.</p>
	</div>
	<img src="BASIC_MUON_COUNTER_CIRCUIT.png" style="width:30%"/>
</div>

O módulo Raspberry Pi é programado através do ambiente integrado de desenvolvimento (IDE) Arduino IDE, na liguagem de baixo nivel C++, permitindo um ótimo controlo de componentes externos ao módulo ligados, entre os quais o contador de Geiger-Muller e o sensor BMP280.

No sentido de testar este conceito básico e preliminar, foi utilizado o seguinte código, fornecido pelo LIP:

##### geiger_exemplo_5.ino (C/C++):

``` cpp
#include <Wire.h>
#include <SPI.h>
#include <Adafruit_BMP280.h>

#define GEIGER_INPUT 7
#define GEIGER_CONV_FACTOR 0.00812  // factor de conversao de CPM para uSv/h

#define GEIGER_GREEN_LED 15 // pin do led verde
#define GEIGER_YELLOW_LED 14 // pin do led amarelo
#define GEIGER_RED_LED 13 // pin do led vermelho
#define BMP280_CS 17 // pin que permite selecionar o sensor no bus de SPI

unsigned long contagens = 0; // variavel que guarda as contagens entre calculos

unsigned long last_read_micros = 0; // numero de microsegundos desde que o programa iniciou. Ao fim de ~70 min faz rollover (volta a zero)
unsigned long last_read_millis = 0; // numero de milissegundos desde que o programa começou.

unsigned long nivel_dose_baixa = 40;
unsigned long nivel_dose_alta  = 150;

Adafruit_BMP280 bmp(BMP280_CS);

bool bmp_conectado = false;

void count_pulse()
{
  if(last_read_micros + 2000 < micros() || last_read_millis + 2 < millis())
  {
    contagens++;

    last_read_micros = micros();
    last_read_millis = millis();
  }
} 

void setup()
{
  pinMode(GEIGER_GREEN_LED, OUTPUT);
  pinMode(GEIGER_YELLOW_LED, OUTPUT);
  pinMode(GEIGER_RED_LED, OUTPUT);
  pinMode(GEIGER_INPUT, INPUT);
  attachInterrupt(digitalPinToInterrupt(GEIGER_INPUT),count_pulse,FALLING);

  while (!Serial && millis() < 2000)
  {
    delay(10); // 10 ms
  }

  Serial.begin(9600);
  pinMode(BMP280_CS, OUTPUT);
  
  bmp_conectado = bmp.begin(0x76, 0x58);

  if (!bmp_conectado) {
    Serial.println("Sensor pressao temperatura não encontrado");
  }

  Serial.println("Serial started...setup done!");

}

void loop()
{
  unsigned long cpm = contagens * 6;

  if (cpm <= nivel_dose_baixa)
  {
    digitalWrite(GEIGER_GREEN_LED,HIGH);
    digitalWrite(GEIGER_YELLOW_LED,LOW);
    digitalWrite(GEIGER_RED_LED,LOW);
  }
  else if (cpm <= nivel_dose_alta)
  {
    digitalWrite(GEIGER_GREEN_LED,LOW);
    digitalWrite(GEIGER_YELLOW_LED,HIGH);
    digitalWrite(GEIGER_RED_LED,LOW);
  }
  else
  {
    digitalWrite(GEIGER_GREEN_LED,LOW);
    digitalWrite(GEIGER_YELLOW_LED,LOW);
    digitalWrite(GEIGER_RED_LED,HIGH);
  }

  contagens = 0;

  float dose = cpm * GEIGER_CONV_FACTOR;

  Serial.printf("Contagens por minuto : %u\n",cpm);
  Serial.printf("Dose num humano      : %f uSv/h\n",dose);

  if(bmp_conectado) {
    float temperatura = bmp.readTemperature();
    float pressao = bmp.readPressure();
    Serial.printf("Temperatura          : %f ºC\n",temperatura);
    Serial.printf("Pressão              : %f Pa\n",pressao);
  }

  delay(5000);
}
```

Este pequeno programa permitiu a obtenção de contagens de partículas detetadas por minuto, valores de dose de radiação ionizante (em $\mu Sv/h$ - microsieverts por hora), temperatura do ar (ºC), e pressão atmosférica (Pa), gerando um output do seguinte tipo:

##### AMOSTRA (TXT):

```
-> Contagens por minuto: 90
-> Dose num humano: 0.730800 uSv/h
-> Temperatura: 23.240000 ºC
-> Pressão: 101148.093750 Pa
```


No fundo, este dispositivo já permite a detecção e contagem de muões cósmicos à superfície, no entanto, prescinde de um sistema mais eficiente de aquisição de dados, visto que as medições são apenas reveladas na consola *serial*. Para além deste fator, a possível **utilização do aparelho num cenário de voo requer um conjunto de outros sistemas de controlo e comunicação**, capazes de não só **enviar informação em tempo real para a equipa científica, como também de calcular e avaliar parâmetros de orientação, altitude, movimento e geolocalização, assegurando maior fiabilidade e resiliência da sonda**.

Neste sentido, foi idealizado um novo conceito de dispositivo de medição, especificamente desenhado tendo em consideração as condições encontradas numa missão de voo num balão meteorológico.

## X-MUON_PROBE - O novo conceito:

Além de efetuar medições de contagem de muões e de temperatura / pressão ambientes, a sonda possui um sistema de geo-orientação composto por um giroscópio/acelerómetro e um magnetómetro (bussola), assim como um módulo de comunicação rádio LoRa (Long Range), permitindo o envio dos dados de medição efetuados e de dados de controlo de voo (orientação, altitude, temperatura no interior do dispositivo, integridade dos sistemas eletrónicos) para um receptor ativo à superfície terrestre, que, por sua vez, armazena os dados recolhidos de forma estruturado numa Base de Dados acessível via *Ethernet*, para posterior análise.


---

Código fonte desenvolvido no âmbito do X-MUON_PROBE disponível em: https://github.com/eduard0sa/ATM_MUON_DETECTION_PROBE.