function makeSVG(tag, attrs) {
    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
        el.setAttribute(k, attrs[k]);
    return el;
}


var szerokosc =parseInt($('#snake').attr('height'));
class Zarcie {
    constructor(snake) {
        this.setNewPosition(snake);
    }
    getX(){
        return this.x;
    }
    getY(){
        return this.y;
    }
    getRealX(){
        return this.x*szerokosc+5;
    }
    getRealY(){
        return this.y*szerokosc+5;
    }
    setNewPosition(snake){
        console.log(snake);
        var newPosition = false;
        var newX,newY;
        var ogon = snake.getOgon();
        do{
            newPosition = false;
            newX = Math.floor(Math.random()*30);
            newY = Math.floor(Math.random()*30);
            console.log("x: "+newX+" y:"+newY);
            $.each(ogon,function (k,v) {
                var pos = v.getPos();
                if(pos[0]==newX && pos[1]==newY){
                    newPosition=true;
                }
            });
        } while(newPosition);

        this.x = newX;
        this.y = newY;
        $('#zarcie').attr('x',this.getRealX());
        $('#zarcie').attr('y',this.getRealY());
    }
}
class Ogon {
    constructor(){
        this.x=-1;
        this.y=-1;
        this.obj = $(makeSVG('rect', {fill:"green", width:"10", height:"10", x:"-30", y:"-30" }));
        $("#plansza").append(this.obj);
        return this;
    }
    getX(){
        return this.x;
    }
    getY(){
        return this.y;
    }
    setNewPosition(pos){
        this.x=pos[0];
        this.y=pos[1];
        this.obj.attr("x",pos[0]*szerokosc+5);
        this.obj.attr("y",pos[1]*szerokosc+5);
    }
    getPos(){
        return [this.x,this.y];
    }
    destroy(){
        this.obj.remove();
    }
}
class Snake {
    constructor(obj) {
        this.obj = obj;
        this.x = 15;
        this.y = 15;
        this.kierunek = "down";
        this.nastKierunek = false;
        this.zakrecono = true;
        this.speed = 300;
        this.zarcie = new Zarcie(this);
        this.punkty = 0;
        this.ogon = [new Ogon()];
        this.end = false;
    }
    goUp(){
        if(this.kierunek!="down" && this.zakrecono){
            this.kierunek="up";
            this.zakrecono = false;
        } else if(this.kierunek!="down" && !this.zakrecono){
            this.nastKierunek="up";
        }
    }
    goDown(){
        if(this.kierunek!="up" && this.zakrecono) {
            this.kierunek="down";
            this.zakrecono = false;
        } else if(this.kierunek!="up" && !this.zakrecono){
            this.nastKierunek="down";
        }
    }
    goLeft(){
        if(this.kierunek!="right" && this.zakrecono) {
            this.kierunek="left";
            this.zakrecono = false;
        } else if(this.kierunek!="right" && !this.zakrecono){
            this.nastKierunek="left";
        }
    }
    goRight(){
        if(this.kierunek!="left" && this.zakrecono) {
            this.kierunek="right";
            this.zakrecono = false;
        } else if(this.kierunek!="left" && !this.zakrecono){
            this.nastKierunek="right";
        }
    }
    ruch() {
        this.zakrecono = true;
        var lastPos = this.getPos();
        if(!this.end){
            switch(this.kierunek){
                case "up":      this.y-=1; break;
                case "down":    this.y+=1; break;
                case "left":    this.x-=1; break;
                case "right":   this.x+=1; break;
            }
            if(this.nastKierunek){
                this.kierunek=this.nastKierunek;
                this.nastKierunek=false;
            }
        }
        this.checkZarcie();
        if(!this.isColision() && !this.end){
            var newPos = lastPos;
            var tempPos;
            $.each(this.ogon,function (k,v) {
                tempPos = v.getPos();
                v.setNewPosition(newPos);
                newPos = tempPos;
            });
            this.obj.attr('x',this.getRealX());
            this.obj.attr('y',this.getRealY());
        } else this.end=true;
    }
    getSpeed(){
        return this.speed;
    }
    boost(){
        this.speed=150;
    }
    slow(){
        this.speed=300;
    }
    getX(){
        if(this.x<0)return 0;
        else if(this.x>30)return 30;
        else return this.x;
    }
    getY(){
        if(this.y<0)return 0;
        else if(this.y>30)return 30;
        else return this.y;
    }
    getPunkty(){
        return this.punkty;
    }
    getEnd(){
        return this.end;
    }
    getKierunek(){
        return this.kierunek;
    }
    getRealX(){
        return this.x*szerokosc+1;
    }
    getRealY(){
        return this.y*szerokosc+1;
    }
    isColision(){
        var isOgon = false;
        var snake = this;
        $.each(this.ogon,function (k,v) {
            if(v.getX()==snake.x && v.getY()==snake.y) {
                isOgon=true;
            }
        });
        return (this.x<0 || this.x>30 || this.y<0 || this.y>30 || isOgon);
    }
    checkZarcie(){
        if (this.x==this.zarcie.x && this.y==this.zarcie.y){
            this.zarcie.setNewPosition(this);
            this.punkty++;
            var obj = new Ogon();
            this.ogon.push(obj);
        }
    }
    getPos(){
        return [this.x,this.y];
    }
    exportOgon(){
        var ogon = this.getX()+":"+this.getY()+",";
        $.each(this.ogon,function (k,v) {
            ogon+=v.getX()+":"+v.getY()+",";
        });
        return ogon.substring(0,ogon.length-1);
    }
    importOgon(response){
        var ogon = response['ogon'].split(",");

        $.each(this.ogon,function (k,v) {
            v.destroy();
        });
        var newOgon = [];
        $.each(ogon,function (k,v) {
            if(k!=0){
                var wspol = v.split(":");
                var newCzlon = new Ogon();
                newCzlon.setNewPosition(wspol);
                newOgon.push(newCzlon);
            }
        });
        this.ogon = newOgon;
        this.kierunek = response['kierunek'];
        this.punkty = response['punkty'];
        this.end = (response['end']=="1");
        this.zakrecono = true;
        this.nastKierunek=false;
        this.x = parseInt(ogon[0].split(":")[0]);
        this.y = parseInt(ogon[0].split(":")[1]);
        this.obj.attr('x',this.getRealX());
        this.obj.attr('y',this.getRealY());
    }
    getOgon(){
        return this.ogon;
    }
}





$(document).ready(function () {
    var snake = new Snake($('#snake'));
    $(document).on('keydown',function (e) {
        e.preventDefault();
        snake.boost();
        switch(e['keyCode']){
            case 37: snake.goLeft();  break;
            case 38: snake.goUp();    break;
            case 39: snake.goRight(); break;
            case 40: snake.goDown();  break;
            case 65: snake.goLeft();  break;
            case 87: snake.goUp();    break;
            case 68: snake.goRight(); break;
            case 83: snake.goDown();  break;
        }
    });

    $(document).on('keyup',function (e) {
        e.preventDefault();
        snake.slow();
    });

    $('#save').on('click',function (e) {
        e.preventDefault();
        $.ajax({
            url: "php/snake.php?a=save",
            method: "POST",
            data: { ogon: snake.exportOgon(), kierunek: snake.getKierunek(),punkty: snake.getPunkty(), end: snake.getEnd() }
        });
    });

    $('#load').on('click',function (e) {
        e.preventDefault();
        $.ajax({
            url: "php/snake.php?a=load",
            method: "POST",
            dataType: 'JSON'
        }).done(function (response) {
            console.log(response);
            snake.importOgon(response);
        });
    });

    function run() {
        snake.ruch();
        $("#ilosc-punktow").html(snake.getPunkty());
        setTimeout( run, snake.getSpeed() );
    }
    setTimeout( run, snake.getSpeed() );
});