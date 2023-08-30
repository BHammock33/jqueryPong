$(document).ready(function () {
    var arena = $('#arena');
    var playerDom = $('#player');
    var compDom = $('#comp');
    var ballDom = $('#ball');
    var userScore = $('#user-score');
    var compScore = $('#comp-score');
    var gameOver = $('#gameover');

    var Ball = function (e) {
        this.x = arena.innerWidth() / 2 - ballDom.innerWidth();
        this.y = arena.innerHeight() / 2 - ballDom.innerHeight();
        this.velX = 5;
        this.velY = 5;
        this.speed = 5;
        this.radius = 25;
        this.update = function () {
            this.x = this.x + this.velX;
            this.y = this.y + this.velY;
        }
        this.reset = function () {
            this.speed = 5;
            this.x = arena.innerWidth() / 2 - ballDom.innerWidth();
            this.y = arena.innerHeight() / 2 - ballDom.innerHeight();
            this.velX = -this.velX;
        }
        this.edges = function () {
            if (this.y < 0 || this.y > arena.innerHeight() - this.radius) {
                this.velY *= -1;
            }
        }
        this.draw = function () {
            e.css({
                width: this.radius,
                height: this.radius,
                borderRadius: this.radius,
                backgroundColor: "#fd1d1d",
                zIndex: 5,
                left: this.x,
                top: this.y
            });
        }
    }

    var Comp = function (e) {
        this.x = arena.innerWidth() - e.innerWidth();
        this.y = (arena.innerHeight() / 2) - (e.innerHeight() / 2);
        this.score = 0;
        this.draw = function () {
            e.css({
                top: this.y,
                left: this.x,
            });
        }
    }

    var Player = function (e) {
        this.x = 0;
        this.y = (arena.innerHeight() / 2) - (e.innerHeight() / 2);
        this.score = 0;
        this.edges = function () {
            if (this.y <= 0) {
                this.y = 1;
            }
            if(this.y >= 300){
                this.y = 300;
            }
        }
        this.draw = function () {
            e.css({
                top: this.y,
                left: this.x
            });
        }
    }

    var Collision = function (ball, player) {
        this.check = function () {
            this.ball = ball;
            this.player = player;
            this.player.top = this.player.y;
            this.player.bottom = this.player.y + 100;
            this.player.left = this.player.x;
            this.player.right = this.player.x + 15;

            this.ball.top = this.ball.y - this.ball.radius;
            this.ball.bottom = this.ball.y + this.ball.radius;
            this.ball.left = this.ball.x - this.ball.radius;
            this.ball.right = this.ball.x + this.ball.radius;
            return this.ball.right > this.player.left && this.ball.top < this.player.bottom && this.ball.left < this.player.right && this.ball.bottom > this.player.top;
        }
    }

    var isGameOver = function (player, comp) {
        var winner = "";
        if (player.score === 3 || comp.score === 3) {
            if (player.score === 3) {
                winner = "player";
            } else {
                winner = "computer"
            }
            clearInterval(gameLoop);
            $(document).off();
            playerDom.hide();
            compDom.hide();
            gameOver.css({
                display: "flex"
            });
            gameOver.html("the winner is " + winner);
        }
    }

    var player = new Player(playerDom);
    var comp = new Comp(compDom);
    var ball = new Ball(ballDom);

    comp.draw();
    player.draw();
    ball.draw();

    var gameLoop = setInterval(function () {
        isGameOver(player, comp);
        comp.y += (ball.y - (comp.y + (compDom.innerHeight() / 2))) * 0.2;
        comp.draw();
        let user = (ball.x < arena.innerWidth() / 2) ? player : comp;
        var col = new Collision(ball, user);
        if (col.check()) {
            let collidePoint = (ball.y - (player.y + (playerDom.innerHeight() / 2)));
            collidePoint = collidePoint / (playerDom.innerHeight() / 2);
            let angleRad = (Math.PI / 4) * collidePoint;
            let direction = (ball.x < arena.innerWidth() / 2) ? 1 : -1;
            ball.velX = direction * ball.speed * Math.cos(angleRad);
            ball.velY = ball.speed * Math.sin(angleRad);
            ball.speed += 1;
        }
        ball.update();
        ball.edges();
        ball.draw();
        if (ball.x - ball.radius < 0) {
            comp.score++;
            compScore.html(comp.score);
            ball.reset();
        }
        if (ball.x + ball.radius > arena.innerWidth()) {
            player.score++;
            userScore.html(player.score);
            ball.reset();
        }
    }, 25);

    $(document).on('mousemove', function (e) {
        player.y = e.clientY - arena.innerHeight() + playerDom.innerHeight();
        player.draw();
    });

});