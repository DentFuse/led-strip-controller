#define RED_LED 11
#define BLUE_LED 10
#define GREEN_LED 9
#define STATUS 13
int brightness = 255;
float gBright = 0;
float rBright = 0;
float bBright = 0;
int fadeSpeed = 10;
int mode = 0;
int maxMode = 2;
bool interruptCalled = false;

void setup() {
  //Setup outputs for LEDs
  pinMode(GREEN_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(BLUE_LED, OUTPUT);
  pinMode(STATUS, OUTPUT);

  // Run the blink all leds once
  startup();

  // Setup button and setup interrupt to detect button press
  pinMode(2, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(2), button, FALLING);
//  Serial.begin(9600);
}

void startup() {
  setColor(0, 0, 0);
  setColor(255, 0, 0);
  delay(250);
  setColor(0, 255, 0);
  delay(250);
  setColor(0, 0, 255);
  delay(250);
  setColor(255, 255, 255);
  delay(250);
  setColor(0, 0, 0);
  delay(500);
}

void button() {
  static unsigned long int last_interrupt_time = 0;
  unsigned long int interrupt_time = millis();
  // If interrupts come faster than 200ms, assume it's a bounce and ignore
  if (interrupt_time - last_interrupt_time > 200) {
    interruptCalled = true;
    mode++;
    if(mode > maxMode) mode = 0;
    last_interrupt_time = interrupt_time;
  }
}

void loop() {
  blinkInternal(100);
//  Serial.println("Running mode " + String(mode));
  switch(mode) {
    case 0:
    contoller1();
    break;
    case 1:
    contoller2();
    break;
    case 2:
    contoller3();
    break;
    case 3:
    contoller4();
    break;
    case 4:
    contoller5();
    break;
    case 5:
    contoller6();
    break;
  }
  // fadeColor(255, 0, 255);
  // delay(1000);
  // fadeColor(127, 0, 0);
  // delay(1000);
  // fadeColor(0, 255, 255);
  // delay(1000);
  // fadeColor(0, 0, 0);
  // digitalWrite(STATUS, HIGH);
  // delay(500);
  // digitalWrite(STATUS, LOW);
}

void blinkInternal(int x) {
  digitalWrite(STATUS, HIGH);
  delay(x);
  digitalWrite(STATUS, LOW);
}

void contoller1() {
  fadeColor(205, 91, 151);
  delay(1000);
  fadeColor(11, 6, 40);
  delay(1000);
  fadeColor(241, 219, 195);
  delay(1000);
}

void contoller2() {
  fadeColor(100, 35, 123);
  delay(1000);
  fadeColor(79, 191, 212);
  delay(1000);
  fadeColor(95, 21, 73);
  delay(1000);
}

void contoller3() {
  fadeColor(76, 90, 171);
  delay(1000);
  fadeColor(24, 81, 76);
  delay(1000);
}

void contoller4() {
  
}

void contoller5() {
  
}

void contoller6() {
  
}

void fadeColor(int r, int g, int b) {
  int rDiff = r - rBright;
  int gDiff = g - gBright;
  int bDiff = b - bBright;
  int totalDiff = max(max(abs(rDiff), abs(bDiff)), abs(gDiff));
  float rScale = (float)rDiff / totalDiff;
  float gScale = (float)gDiff / totalDiff;
  float bScale = (float)bDiff / totalDiff;
  //  Serial.print(String(rDiff) + ' ' + String(bDiff) + ' ' + String(gDiff) + ' ' + String(totalDiff) + '\n');
  for (int i = 0; i < totalDiff; i++) {
    if(interruptCalled) {
      interruptCalled = false;
      setColor(0, 0, 0);
      return;
    };
    // Serial.print(String(rDiff) + ' ' + String(gDiff) + ' ' + String(bDiff) + ' ' + String(totalDiff) + ' ' + String(rScale) + ' ' + String(gScale) + ' ' + String(bScale) + ' ' + String(rBright) + ' ' + String(gBright) + ' ' + String(bBright) + '\n');
    rBright += rScale;
    gBright += gScale;
    bBright += bScale;
    pushColor();
    delay(fadeSpeed);
  }
  rBright = r;
  gBright = g;
  bBright = b;
  pushColor();
}

void setColor(int r, int g, int b) {
  rBright = r;
  gBright = g;
  bBright = b;
  pushColor();
}

void pushColor() {
  analogWrite(RED_LED, (int)rBright);
  analogWrite(BLUE_LED, (int)bBright);
  analogWrite(GREEN_LED, (int)gBright);
}
