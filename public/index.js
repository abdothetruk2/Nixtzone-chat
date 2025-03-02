$(document).ready(function(){

var x2,z2
var x3,z3,x4,z4

 $(document).scroll(function(){



var x = $(".tsc").offset().top
var z= $(this).scrollTop()

if(z>=x-700){



    $(".tsc").css({


        opacity:1,
        transition:"0.5s"
    })







}




 x2 = $(".box").offset().top
 z2= $(this).scrollTop()


 if(z2>=x2-500){ $(".box").css({right:0,    transition:"1s" })}




 x3 = $(".side").offset().top
 z3= $(this).scrollTop()


 if(z3>=x3-500){

    $("#left").css({

        right:0,
        transition:"1s"
    })



    $("#right").css({
        right:0,
        left:0,
        transition:"1s"
    })

 }

 x4 = $("#aside").offset().top
 z4= $(this).scrollTop()


 if(z4>=x4){

        $(".ico").fadeIn(1500)

 }











 })




    var socket = io();


var counter=0

 setInterval(() => {

    counter-=5


  $(".bike").css("transform",`rotateZ(${counter}deg)`)

 }, 20);




})



$(window).scrollTop(0)
