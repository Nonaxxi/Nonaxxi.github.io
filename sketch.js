let Auswahl = 1;
let RasterZeigen = true;
let PPNeueMachina, HELVETICASCHOOL;
let barColors = [];
let Buttons;

// Noten
let noteImages = [];
let letters = "ABCDE";
//Test
// Animation
let noten = [];
let xPos = [],
  yPos = [],
  vx = [],
  vy = [];
let imgW = 100,
  imgH = 100;

// Außenbox
let boxX, boxY, boxW, boxH;
// Mittlere Box (Hindernis)
let midX, midY, midW, midH;

let fragen = [
  "Abo Preis",
  "Bezahlung an \nKünstler*innen",
  "Größe des \nMusikangebots",
  "Klangqualität",
  "Keine Unter-\nstützung von KI",
];

let antworten = [0, 0, 0, 0, 0];
let maxPunkte = 13;
let aktuellePunkte = 0;
let showWeiter = false;

// V1 Startwerte
let spotify = 10,
  applemusic = 10,
  amazonmusic = 10,
  tidal = 10;
let qobuz = 10,
  youtubemusic = 10,
  deezer = 10,
  soundcloud = 10;

let labels = [
  "Spotify",
  "Apple Music",
  "Amazon Music",
  "TIDAL",
  "Qobuz",
  "YouTube Music",
  "Deezer",
  "SoundCloud",
];
let values = [];

// ---------------------------------------------------------------------------
// PRELOAD
// ---------------------------------------------------------------------------
function preload() {
  PPNeueMachina = loadFont("data/PPNeueMachina_PlainUltrabold.otf");
  HELVETICASCHOOL = loadFont("data/HELVETICASCHOOL.TTF");

  for (let i = 0; i < 8; i++) {
    noten[i] = loadImage("data/NoteBunt (" + (i + 1) + ").png");
  }

  for (let row = 0; row < 5; row++) {
    noteImages[row] = [];
    for (let col = 0; col < 4; col++) {
      let letter = letters.charAt(row);
      noteImages[row][col] = loadImage(
        "data/Note" + letter + (col + 1) + ".png",
      );
    }
  }
}

// ---------------------------------------------------------------------------
// SETUP
// ---------------------------------------------------------------------------
function setup() {
  createCanvas(1732, 2850);
  colorMode(HSB, 360, 100, 100, 100);

  Buttons = color(270, 0, 100);

  barColors = [
    color(154, 100, 64), // Spotify
    color(354, 63, 92), // Apple Music
    color(190, 66, 84), // Amazon Music
    color(0, 0, 80), // Tidal
    color(0, 0, 100), // Qobuz
    color(5, 92, 89), // YouTube Music
    color(272, 52, 59), // Deezer
    color(25, 97, 93), // SoundCloud
  ];

  values = [
    spotify,
    applemusic,
    amazonmusic,
    tidal,
    qobuz,
    youtubemusic,
    deezer,
    soundcloud,
  ];

  boxX = width * 0.5;
  boxY = height * 0.35;
  boxW = width * 0.8;
  boxH = height * 0.45;
  midX = width * 0.5;
  midY = height * 0.35;
  midW = width * 0.5;
  midH = height * 0.1;

  for (let i = 0; i < 8; i++) {
    let valid = false;
    while (!valid) {
      let margin = imgW * 0.7;
      let left = boxX - boxW / 2 + margin;
      let right = boxX + boxW / 2 - margin;
      let top = boxY - boxH / 2 + margin;
      let bottom = boxY + boxH / 2 - margin;

      xPos[i] = random(left, right);
      yPos[i] = random(top, bottom);

      let insideMiddle =
        xPos[i] > midX - midW / 2 - imgW / 2 &&
        xPos[i] < midX + midW / 2 + imgW / 2 &&
        yPos[i] > midY - midH / 2 - imgH / 2 &&
        yPos[i] < midY + midH / 2 + imgH / 2;

      let overlap = false;
      for (let j = 0; j < i; j++) {
        if (dist(xPos[i], yPos[i], xPos[j], yPos[j]) < imgW * 1.1) {
          overlap = true;
          break;
        }
      }
      if (!insideMiddle && !overlap) valid = true;
    }
    vx[i] = random(-2, 2);
    vy[i] = random(-2, 2);
    if (abs(vx[i]) < 0.8) vx[i] = vx[i] < 0 ? -0.8 : 0.8;
    if (abs(vy[i]) < 0.8) vy[i] = vy[i] < 0 ? -0.8 : 0.8;
  }
}

// ---------------------------------------------------------------------------
// DRAW
// ---------------------------------------------------------------------------
function draw() {
  background(0, 0, 0);

  switch (Auswahl) {
    case 1:
      Balkendiagramm();
      Animation();
      break;
    case 2:
      V2();
      break;
    case 3:
      V3();
      break;
    case 4:
      V4();
      break;
    case 5:
      Note();
      break;
  }

  Navigation();

  noCursor();

}

// ---------------------------------------------------------------------------
// ANIMATION
// ---------------------------------------------------------------------------
function Animation() {
  imageMode(CENTER);
  let left = boxX - boxW / 2 + imgW / 2;
  let right = boxX + boxW / 2 - imgW / 2;
  let top = boxY - boxH / 2 + imgH / 2;
  let bottom = boxY + boxH / 2 - imgH / 2;

  for (let i = 0; i < 8; i++) {
    xPos[i] += vx[i];
    yPos[i] += vy[i];

    if (xPos[i] < left) {
      xPos[i] = left;
      vx[i] *= -1;
    } else if (xPos[i] > right) {
      xPos[i] = right;
      vx[i] *= -1;
    }
    if (yPos[i] < top) {
      yPos[i] = top;
      vy[i] *= -1;
    } else if (yPos[i] > bottom) {
      yPos[i] = bottom;
      vy[i] *= -1;
    }

    let closestX = constrain(xPos[i], midX - midW / 2, midX + midW / 2);
    let closestY = constrain(yPos[i], midY - midH / 2, midY + midH / 2);
    let overlapX = abs(xPos[i] - closestX) < imgW / 2;
    let overlapY = abs(yPos[i] - closestY) < imgH / 2;
    if (overlapX && overlapY) {
      let overlapWidth = imgW / 2 - abs(xPos[i] - closestX);
      let overlapHeight = imgH / 2 - abs(yPos[i] - closestY);
      if (overlapWidth < overlapHeight) {
        vx[i] *= -1;
        xPos[i] += vx[i];
      } else {
        vy[i] *= -1;
        yPos[i] += vy[i];
      }
    }

    for (let j = i + 1; j < 8; j++) {
      let dx = xPos[j] - xPos[i];
      let dy = yPos[j] - yPos[i];
      let distance = dist(xPos[i], yPos[i], xPos[j], yPos[j]);
      let minDistance = imgW * 0.95;
      if (distance > 0 && distance < minDistance) {
        let overlap = (minDistance - distance) / 2;
        let nx = dx / distance;
        let ny = dy / distance;
        xPos[i] -= nx * overlap;
        yPos[i] -= ny * overlap;
        xPos[j] += nx * overlap;
        yPos[j] += ny * overlap;

        let tx = vx[i];
        let ty = vy[i];
        vx[i] = vx[j];
        vy[i] = vy[j];
        vx[j] = tx;
        vy[j] = ty;
      }
    }

    image(noten[i], xPos[i], yPos[i], imgW, imgH);
  }
}


// ---------------------------------------------------------------------------
// NAVIGATION
// ---------------------------------------------------------------------------
function Navigation() {
  if (Auswahl >= 2) {
    noStroke();
    fill(Buttons);
    circle(width * 0.07, height * 0.07, width * 0.05);

    stroke(360, 0, 0);
    strokeWeight(3);
    let r = width * 0.05 * 0.15;
    let cx = width * 0.07;
    let cy = height * 0.07;
    line(cx - r, cy - r, cx + r, cy + r);
    line(cx - r, cy + r, cx + r, cy - r);
  }
}

// ---------------------------------------------------------------------------
// V1 – Balkendiagramm
// ---------------------------------------------------------------------------
function Balkendiagramm() {
  let chartBottom = height * 0.85;
  let chartHeight = chartBottom - height * 0.5;

  stroke(360);
  strokeWeight(2);
  line(width * 0.1, chartBottom, width * 0.9, chartBottom);

  let barWidth = (width * 0.8) / values.length;

  for (let i = 0; i < values.length; i++) {
    let bx = width * 0.1 + i * barWidth;
    let h = map(values[i], 0, 100, 0, chartHeight);

    rectMode(CORNER);
    noStroke();
    fill(barColors[i]);
    rect(bx + barWidth * 0.1, chartBottom - h, barWidth * 0.8, h);

    fill(360);
    textAlign(CENTER, BOTTOM);
    textFont(HELVETICASCHOOL);
    textSize(35);
    let valueY = chartBottom - h - 20;
    if (valueY < 20) valueY = 20;
    text(values[i], bx + barWidth * 0.5, valueY);

    push();
    translate(bx + barWidth * 0.5, chartBottom + 10);
    rotate(radians(-45));
    fill(360);
    textAlign(RIGHT, TOP);
    textFont(HELVETICASCHOOL);
    textSize(35);
    text(labels[i], 0, 0);
    pop();
  }

  textAlign(CENTER, TOP);
  textFont(PPNeueMachina);
  fill(360);
  textSize(40);
  text("Anzahl HTW Hörer*innen pro Musikdienst", width / 2, height * 0.96);

  // START-Button
  rectMode(CENTER);
  fill(Buttons);
  noStroke();
  rect(width * 0.5, height * 0.35, width * 0.8, height * 0.5, 30);

  textAlign(CENTER, CENTER);
  fill(360, 0, 0);
  textFont(PPNeueMachina);
  textSize(120);
  text("Mach den Test!", width * 0.5, height * 0.35);
  rectMode(CORNER);
}

// ---------------------------------------------------------------------------
// V2 – Streaming-Dienst wählen
// ---------------------------------------------------------------------------
function V2() {
  imageMode(CORNER);
  textAlign(CENTER, CENTER);
  fill(360);
  textFont(PPNeueMachina);
  textSize(80);
  text(
    "Welchen Streamingdienst \nnutzt du zur Zeit?",
    width * 0.5,
    height * 0.12,
  );
textSize(60);
  drawStreamButton(
    width * 0.15,
    height * 0.2,
    width * 0.35,
    height * 0.165,
    "Spotify",
    0,
  );
  drawStreamButton(
    width * 0.55,
    height * 0.2,
    width * 0.35,
    height * 0.165,
    "Apple Music",
    1,
  );
  drawStreamButton(
    width * 0.15,
    height * 0.4,
    width * 0.35,
    height * 0.165,
    "Amazon Music",
    2,
  );
  drawStreamButton(
    width * 0.55,
    height * 0.4,
    width * 0.35,
    height * 0.165,
    "Tidal",
    3,
  );
  drawStreamButton(
    width * 0.15,
    height * 0.6,
    width * 0.35,
    height * 0.165,
    "Qobuz",
    4,
  );
  drawStreamButton(
    width * 0.55,
    height * 0.6,
    width * 0.35,
    height * 0.165,
    "YouTube Music",
    5,
  );
  drawStreamButton(
    width * 0.15,
    height * 0.8,
    width * 0.35,
    height * 0.165,
    "Deezer",
    6,
  );
  drawStreamButton(
    width * 0.55,
    height * 0.8,
    width * 0.35,
    height * 0.165,
    "SoundCloud",
    7,
  );
}

function drawStreamButton(x, y, w, h, label, colorIndex) {
  noStroke();
  fill(barColors[colorIndex]);
  rect(x, y, w, h, 30);
  fill(360, 0, 0);
  textAlign(CENTER, CENTER);
  text(label, x + w / 2, y + h / 2);
}

// ---------------------------------------------------------------------------
// V3 – Erklärungsseite
// ---------------------------------------------------------------------------
function V3() {
  textAlign(CENTER, TOP);
  textFont(PPNeueMachina);
  fill(Buttons);
  textSize(80);
  text("Was ist dir beim \nMusik-Streaming wichtig?", width / 2, height * 0.15);

  textAlign(LEFT, TOP);
  textFont(HELVETICASCHOOL);
  fill(360);
  textSize(30);
  text(
    " In diesem Fragebogen entscheidest du,\n" +
      " welche Eigenschaften ein Musik‑Streamingdienst\n" +
      " für dich wirklich erfüllen sollte.\n" +
      " Dafür stehen dir 13 Punkte zur Verfügung,\n" +
      " die du auf fünf Kategorien verteilst.\n" +
      " Jede Kategorie kannst du mit 1 bis 4 Punkten\n" +
      " bewerten – von weniger wichtig bis sehr wichtig.\n" +
      " Wähle so, dass die Summe am Ende\n" +
      " genau 13 Punkte ergibt.",
    width * 0.36,
    height * 0.27,
  );

  rectMode(CENTER);
  fill(Buttons);
  noStroke();
  rect(width * 0.5, height * 0.6, width * 0.2, height * 0.04, 10);

  textAlign(CENTER, CENTER);
  fill(270, 0, 0);
  textFont(PPNeueMachina);
  textSize(40);
  text("Verstanden", width * 0.5, height * 0.6);
}

// ---------------------------------------------------------------------------
// V4 – Fragebogen
// ---------------------------------------------------------------------------
function V4() {
  let count = fragen.length;

  for (let i = 0; i < count; i++) {
    let fy = map(i, 0, count - 1, height * 0.2, height * 0.7);

    textAlign(LEFT, CENTER);
    textFont(PPNeueMachina);
    fill(360);
    noStroke();
    textSize(40);
    text(fragen[i], width * 0.14, fy);

    let startX = width * 0.5;
    let spacing = (width * 0.8 - startX) / 3.0;

    for (let c = 0; c < 4; c++) {
      let cx = startX + c * spacing;
      stroke(360);
      strokeWeight(3);
      if (antworten[i] === c + 1) fill(360);
      else noFill();
      circle(cx, fy, 50);
    }
  }

  noStroke();
  fill(360);
  textFont(HELVETICASCHOOL);
  textAlign(CENTER, CENTER);
  textSize(40);
  text(
    aktuellePunkte + "  von 13 Punkten vergeben",
    width * 0.45,
    height * 0.8,
  );

  if (showWeiter) {
    fill(Buttons);
    noStroke();
    rectMode(CENTER);
    rect(width * 0.5, height * 0.9, width * 0.2, height * 0.06, 10);
    fill(360, 0, 0);
    textFont(PPNeueMachina);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("Weiter", width * 0.5, height * 0.9);
    rectMode(CORNER);
  }
}

// ---------------------------------------------------------------------------
// V5 – Note anzeigen
// ---------------------------------------------------------------------------
function Note() {
  rectMode(CORNER);
  fill(360);
  noStroke();
  rect(0, 0, width, height);

  imageMode(CENTER);
  let imgSize = width * 0.8;

  for (let i = 0; i < 5; i++) {
    image(
      noteImages[i][antworten[i] - 1],
      width * 0.5,
      height * 0.5,
      imgSize,
      imgSize,
    );
  }
  fill(0, 0, 0);
  textSize(40);
  text("Mach ein Foto und vergleiche!", width / 2, height * 0.75);
}

// ---------------------------------------------------------------------------
// HILFSFUNKTIONEN
// ---------------------------------------------------------------------------
function hitBox(x, y, w, h) {
  return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
}

function hitX() {
  return dist(mouseX, mouseY, width * 0.05, height * 0.05) < width * 0.025;
}

// START-Button: rectMode(CENTER) bei (0.5, 0.35), Größe (0.8 × 0.5)
function hitStart() {
  return hitBox(width * 0.1, height * 0.1, width * 0.8, height * 0.5);
}

function hitVerstanden(x, y, w, h) {
  return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
}

function alleBeantwortet() {
  return antworten.every((a) => a !== 0);
}

// ---------------------------------------------------------------------------
// MOUSE PRESSED
// ---------------------------------------------------------------------------
function mousePressed() {
  // X-Button → zurück zu Start
  if (hitX() && Auswahl !== 1) {
    Auswahl = 1;
    resetApp();
    return;
  }

  // START
  if (Auswahl === 1 && hitStart()) {
    Auswahl = 2;
    return;
  }

  // V2: Streaming-Dienst wählen
  if (Auswahl === 2) {
    let buttons = [
      [width * 0.15, height * 0.2, width * 0.35, height * 0.165, "spotify"],
      [width * 0.55, height * 0.2, width * 0.35, height * 0.165, "applemusic"],
      [width * 0.15, height * 0.4, width * 0.35, height * 0.165, "amazonmusic"],
      [width * 0.55, height * 0.4, width * 0.35, height * 0.165, "tidal"],
      [width * 0.15, height * 0.6, width * 0.35, height * 0.165, "qobuz"],
      [
        width * 0.55,
        height * 0.6,
        width * 0.35,
        height * 0.165,
        "youtubemusic",
      ],
      [width * 0.15, height * 0.8, width * 0.35, height * 0.165, "deezer"],
      [width * 0.55, height * 0.8, width * 0.35, height * 0.165, "soundcloud"],
    ];

    for (let b of buttons) {
      if (hitBox(b[0], b[1], b[2], b[3])) {
        if (b[4] === "spotify") spotify++;
        else if (b[4] === "applemusic") applemusic++;
        else if (b[4] === "amazonmusic") amazonmusic++;
        else if (b[4] === "tidal") tidal++;
        else if (b[4] === "qobuz") qobuz++;
        else if (b[4] === "youtubemusic") youtubemusic++;
        else if (b[4] === "deezer") deezer++;
        else if (b[4] === "soundcloud") soundcloud++;

        values = [
          spotify,
          applemusic,
          amazonmusic,
          tidal,
          qobuz,
          youtubemusic,
          deezer,
          soundcloud,
        ];
        Auswahl = 3;
        return;
      }
    }
    return;
  }

  // V3: Verstanden-Button
  if (Auswahl === 3) {
    if (
      hitVerstanden(width * 0.33, height * 0.55, width * 0.4, height * 0.06)
    ) {
      Auswahl = 4;
    }
    return;
  }

  // V4: Kreisauswahl + Weiter-Button
  if (Auswahl === 4) {
    let count = fragen.length;
    for (let i = 0; i < count; i++) {
      let fy = map(i, 0, count - 1, height * 0.2, height * 0.7);
      let startX = width * 0.45;
      let spacing = (width * 0.8 - startX) / 3.0;

      for (let c = 0; c < 4; c++) {
        let cx = startX + c * spacing;
        let r = 70;

        if (
          mouseX > cx - r &&
          mouseX < cx + r &&
          mouseY > fy - r &&
          mouseY < fy + r
        ) {
          let neuerWert = c + 1;
          let differenz = neuerWert - antworten[i];

          if (aktuellePunkte + differenz <= maxPunkte) {
            antworten[i] = neuerWert;
            aktuellePunkte = antworten.reduce((s, v) => s + v, 0);
            showWeiter = aktuellePunkte === maxPunkte && alleBeantwortet();
          }
          return;
        }
      }
    }

    if (
      showWeiter &&
      hitBox(width * 0.4, height * 0.87, width * 0.2, height * 0.06)
    ) {
      Auswahl = 5;
    }
    return;
  }
}

// ---------------------------------------------------------------------------
// KEY PRESSED
// ---------------------------------------------------------------------------
function keyPressed() {
  if (key === "g") RasterZeigen = !RasterZeigen;
  if (key === "1") Auswahl = 1;
  if (key === "2") Auswahl = 2;
  if (key === "3") Auswahl = 3;
  if (key === "4") Auswahl = 4;
  if (key === "5") Auswahl = 5;
  if (key === "r") resetApp();
}

function resetApp() {
  for (let i = 0; i < antworten.length; i++) antworten[i] = 0;
  aktuellePunkte = 0;
  showWeiter = false;
}
