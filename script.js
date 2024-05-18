let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

var window_height = window.innerHeight;
var window_width = window.innerWidth;

canvas.width = window_width;
canvas.height = window_height;

canvas.style.background = "#d9dcd6";

class Circle {
    constructor(xpos, ypos, radius, color, speed) {
        this.xpos = xpos;
        this.ypos = ypos;
        this.radius = radius;
        this.color = color;
        this.speed = speed;

        this.dx = 1 * this.speed;
        this.dy = 1 * this.speed;
    }

    draw(context) {
        context.beginPath();
        
        let gradient = context.createRadialGradient(this.xpos - this.radius / 3, this.ypos - this.radius / 3, this.radius / 4, this.xpos, this.ypos, this.radius);
        gradient.addColorStop(0, "#ffffff");
        gradient.addColorStop(1, this.color);

        context.arc(this.xpos, this.ypos, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = gradient;
        context.fill();
        
        // Shadow for 3D effect
        context.shadowColor = "#6c757d";
        context.shadowBlur = 15;
        context.shadowOffsetX = 10;
        context.shadowOffsetY = 10;
        
        context.strokeStyle = this.color;
        context.stroke();
        
        context.closePath();
    }

    changeColor(newColor) {
        this.color = newColor;
        this.draw(context);
    }

    clickCircle(xmouse, ymouse) {
        const distance = Math.sqrt((xmouse - this.xpos) ** 2 + (ymouse - this.ypos) ** 2);
        if (distance < this.radius) {
            this.changeColor("#0096c7");
            return true;
        } else {
            this.changeColor(this.color);
            return false;
        }
    }

    update() {
        context.clearRect(0, 0, window_width, window_height);
        this.draw(context);
        
        let bounced = false;

        if ((this.xpos + this.radius) > window_width || (this.xpos - this.radius) < 0) {
            this.dx = -this.dx;
            bounced = true;
        }
        if ((this.ypos - this.radius) < 0 || (this.ypos + this.radius) > window_height) {
            this.dy = -this.dy;
            bounced = true;
        }

        if (bounced) {
            this.changeColor(this.getRandomColor());
        }

        this.xpos += this.dx;
        this.ypos += this.dy;
    }

    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}

let my_circle = new Circle(100, 100, 50, "#003049", 5);
my_circle.draw(context);

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    my_circle.clickCircle(x, y);
});

let updateCircle = function() {
    requestAnimationFrame(updateCircle);
    my_circle.update();
}
updateCircle();
