//@ts-check

const para = document.getElementById("count");
let count = 0;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;


function random(min, max) {
    let num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}


class Shape {
    constructor(x, y, velX, velY, exists) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.exists = exists;
    }
}


class Ball extends Shape {
    constructor(x, y, velX, velY, exists, size, color) {
        super(x, y, velX, velY, exists);
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        if(this.x <= this.size) {
            this.velX = -(this.velX);
        }
        if((this.x + this.size) >= width) {
            this.velX = -(this.velX);
        }
        if(this.y < this.size) {
            this.velY = -(this.velY);
        }
        if((this.y + this.size) >= height) {
            this.velY = -(this.velY);
        }

        this.x += this.velX;
        this.y += this.velY; 
    }

    collisionDetect() {
        for(let i = 0 ; i < balls.length ; i++) {
            if(this !== balls[i] && balls[i].exists) {
                let dx = this.x - balls[i].x;
                let dy = this.y - balls[i].y;
                let distance = Math.sqrt(dx ** 2 + dy ** 2);

                if(distance < (this.size + balls[i].size)) {
                    this.color = balls[i].color = `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`; 
                }
            }
        }
    }
}

class EvilCircle extends Shape {
    constructor(x, y, exists) {
        super(x, y, 20, 20, exists);
        this.size = 10;
        this.color = "white";
    }

    draw() {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.stroke();
    }


    checkBound() {
        if((this.x + this.size) >= width) {
            this.x = width - this.size;
        }
        if((this.x - this.size) <= 0) {
            this.x = this.size;
        }
        if((this.y + this.size) >= height) {
            this.y = height - this.size;
        }
        if((this.y - this.size) <= 0) {
            this.y = this.size;
        }
    }

    setControls() {
        /* 
        let _this = this;//! Deklariere this evil in _this damit evilObject im windowObject verarbeitet werden kann, ansonsten wuerde this in windowObject das windowObject ansprechen.

        //! Mit addEventListener() werden die velX und velY Parameter viel hoeher verarbeitet 
        window.addEventListener("keydown", function(e) {
            if(e.key === "a") {
                _this.x -= _this.velX;
            }
            else if(e.key === "d") {
                _this.x += _this.velX;
            }
            else if(e.key === "w") {
                _this.y -= _this.velY;
            }
            else if(e.key === "s") {
                _this.y += _this.velY;
            }
        })
        */
        //let _this = this
        //! Fat arrow function besitzt kein this, folglich gilt keyword -this- in der verschachtelten 
        //! addEventListener function fuer die vom object aufgerufene function(wird nicht ueberschrieben) 
        //! this von window.onekeydown wird durch das Argument e in funktion geliefertt
        //! Jetz koenne wird beide Objecte in der function verarbeiten one neue deklarationen durch zu fuehren
        window.onkeydown = (e) => {
        if(e.key === 'a') {
            this.x -= this.velX;
            console.log(e);
            } else if(e.key === 'd') {
            this.x += this.velX;
            } else if(e.key === 'w') {
            this.y -= this.velY;
            } else if(e.key === 's') {
            this.y += this.velY;
            }
            console.log(e);
        }
    }

    collisionDetect() {
        for(let n = 0 ; n < balls.length ; n++) {
            if(balls[n].exists) {
                let dx = this.x - balls[n].x;
                let dy = this.y - balls[n].y;
                let distance = Math.sqrt(dx ** 2 + dy ** 2);

                if(distance < (this.size + balls[n].size)) {
                    balls[n].exists = false;
                    count--;
                    para.innerHTML = `Balls count: ${count}`;
                }
            }
        }
    }
}

//---------Objects----------//

let balls = [];

while(balls.length < 30) {
    const size = random(10, 20);

    let ball = new Ball(
        random(size, width - size),
        random(size, height - size),
        random(-7, 7),
        random(-7, 7),
        true,
        size,
        `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`
    )

    balls.push(ball);
    count++;
    para.innerHTML = `Ball count: ${count}`;
}


let evil = new EvilCircle(width / 2 , height / 2, true);
evil.setControls();

function loop() {
    ctx.fillStyle = "rgb(0, 0, 0, 0.4)";
    ctx.fillRect(0, 0, width, height);

    for(let j = 0 ; j < balls.length ; j++) {
        if(balls[j].exists) {
            balls[j].draw();
            balls[j].update();
            balls[j].collisionDetect();
        }
    }

    evil.draw();
    evil.checkBound();
    evil.setControls();
    evil.collisionDetect();

    requestAnimationFrame(loop);
}

loop();