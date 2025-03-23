/**
 * This file controls the page logic
 *
 * depends on jQuery>=1.7
 */
/*import {startParticles, stopParticles, startConfetti, stopConfetti} from './particles.js';*/
/*import {confetti} from 'https://cdn.jsdelivr.net/npm/@tsparticles/confetti@3.0.3/umd/confetti.js';*/
var params;
var checkinprogress=false;
var canvas;
var scratchers = [];
var foregrnd;
var iwidth,iheight;
(function() {
    /**
     * Returns true if this browser supports canvas
     *
     * From http://diveintohtml5.info/
     */

    var soundHandle = new Audio();
    var triggered=false;
    var soundeffect, confettieffect;
    var nosound=true;
    var pct1=0;
    var initialFontSize;
    var scratchLimit=30;

    function supportsCanvas() {
        return !!document.createElement('canvas').getContext;
    };
    
    
    /**
     * Handle scratch event on a scratcher
     */
    function checkpct() {
            if (pct1 > 20 && pct1 < scratchLimit) {
                if (CrispyToast.toasts.length===0) {
                    CrispyToast.success('Scratch MORE!', { position: 'top-center', timeout: 2000});
                }
            }
            if (pct1 > scratchLimit) {
                if(CrispyToast.toasts.length!=0){
                    CrispyToast.clearall();
                }
                scratchers[0].clear();
                var duration = 5 * 1000;
                if (confettieffect==1) {
                    confetti_effect(duration);
                }
                if (soundeffect==1&&!nosound) {
                    soundHandle.volume=0.5;
                    soundHandle.play();
                }
                triggered=true;
                setTimeout(function(){
                    $("#resetbutton").show();
                }, duration);
            }
    };
    function scratcher1Changed(ev) {
        if (!triggered){
            pct1 = (this.fullAmount(40) * 100)|0;
            checkpct();
        }
    };
   
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    };
    function randomInRangeint(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };
    function confetti_effect(duration) {
        
        
        if(triggered==true) {
            return;
        }
 
        var animationEnd = Date.now() + duration;
             var defaults = { startVelocity: 10, spread: 360, ticks: 70, zIndex: 0 };
        
        var interval = setInterval(function() {
            var timeLeft = animationEnd - Date.now();
          
            if (timeLeft <= 0) {
              return clearInterval(interval);
            }
          
            var particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }});
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
          }, 250);
              
     };
    
    /**
     * Reset all scratchers
     */
    function onResetClicked() {
        var i;
        pct1 = 0;
        CrispyToast.toasts=[];
        $("#resetbutton").hide();
        scratchers[0].setImages('images/empty.jpg','images/fore/' + foregrnd +'.jpg');
        scratchers[0].reset();
        
        triggered = false;
        soundHandle.pause();
        soundHandle.currentTime = 0;    
        return false;
    };
    
    function fitCanvastoDiv() {
        var ttd = $(canvas).parent();
        // var ttd = document.getElementById('scratcher-box');
        canvas.width = ttd.width();
        canvas.height = canvas.width;
        if(scratchers[0]){ 
            if (triggered) {
            scratchers[0].resetnoclear(true);
        } else {
            scratchers[0].resetnoclear(false);
        }
        }
    }

    jQuery.expr.filters.offscreen = function(el) {
        var rect = el.getBoundingClientRect();
        var overlapwithscratcher=false;
        if (window.matchMedia('(orientation:portrait)').matches) {
            var rect2 =document.getElementById('scratcher-box').getBoundingClientRect();
            if (rect.bottom >rect2.top ||rect.bottom >rect2.bottom ) {
                overlapwithscratcher = true;
            }
        }
        if (el.id == "surprise" && el.scrollWidth + rect.x >iwidth-2) {
            overlapwithscratcher = true;
        }
        var a = (rect.x > iwidth || rect.y > iheight-10
               || rect.bottom > iheight -10|| rect.top > iheight-10 || overlapwithscratcher )

            return a;
            };
    

      function manageResizeOrientation(etype) {
        if (checkinprogress) {
            return;
        }
        checkinprogress=true;

        setTimeout(function () {
            if (iwidth==window.innerWidth && window.innerHeight<=iheight){
                return;
            }
            //console.log(iheight + " "+beforeheight);
            iwidth = window.innerWidth;
            iheight = window.innerHeight;
            fitCanvastoDiv();
            modifyFontSize();
        
            checkinprogress=false;

        },1000);
    }

    function modifyFontSize() {
        var fontSize=$('#surprise').css('font-size').toUpperCase().split("PX");
        var v = parseFloat(fontSize[0]);
        //$('#surprise').css('line-height',(v +"PX")); 
        var big = false;
        if ($('#surprise').is(':offscreen')) {
            big = true;
        }
        if ($('#H3').is(':offscreen') || $('#surprise').is(':offscreen')) {
            
            var counter =0;
            while ($('#H3').is(':offscreen')||$('#surprise').is(':offscreen')) {
                v = v-1;
                if (v<50 && !big) {
                    v=50;
                }
                $('#surprise').css('font-size',(v+"PX")); 
                counter++;  
                if (counter >50) {
                    //display_dialog("The font you chose doesnt fit to the screen. So please either choose different font or smaller font size.");
                    $('#surprise').css('font-size',(parseFloat(fontSize[0])-parseFloat(initialFontSize)+"PX")); 
                    if ($('#H3').is(':offscreen')) {
                        alert("Possibly some text might be out of screen. Please contact the sender and ask to choose a smaller font/font size.");
                    };
                    break;
                };
            }
        }
    }

    function initPage() {
        var i, i1;    
        canvas = document.getElementById("scratcher1");
        iwidth = window.innerWidth;
        iheight = window.innerHeight;
        //console.log(iwidth + " "+iheight);
        $( window ).on({
            orientationchange: function(e) {
                manageResizeOrientation('orientation');
            },resize: function(e) {
                manageResizeOrientation('resize');
            }
        });        
        fitCanvastoDiv();

        $('.nosoundbtn').on("click", function (e) {
            document.getElementById('id01').style.display='none';
            nosound=true;
        });
        $('.withsoundbtn').on("click", function (e) {
            document.getElementById('id01').style.display='none';
            nosound=false;
            if (soundHandle.currentTime!=0) {return;}
                soundHandle = document.getElementById('soundHandle');  
                soundHandle.autoplay = true;
                soundHandle.muted=false;
                soundHandle.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
                soundHandle.src = 'audio/celebrate.mp3';
                soundHandle.play();
                soundHandle.pause();
        });
        document.addEventListener(
            "visibilitychange",
             function(evt) {
              if (document.visibilityState != "visible") {
                soundHandle.pause();
                soundHandle.currentTime=0;              }
            },
            false,
          );
   
        
        $('#resetbutton').on('click', function() {
            onResetClicked();
        });
        scratchers = new Array(1);
        
        //var end = window.btoa( rb ); 
        //end = window.atob( rb );
        //var esg = window.atob( mrb );
        params = new URLSearchParams(window.location.search.slice(1));

        var backgrnd = params.get("bck1");
        foregrnd = window.atob(params.get("fr1"));
        var ctitle = decodeURIComponent(window.atob(params.get("ttl1")));
        var tfont = window.atob(params.get("tfnt1"));
        var ctext = decodeURIComponent(window.atob(params.get("ttl2")));
        var cmes = decodeURIComponent(window.atob(params.get("cmes")));
        var shp1 = params.get("shp1");
        soundeffect = params.get("snd1");
        confettieffect = params.get("conf1");
        if (soundeffect==1){
            //document.getElementById('id01').style.display='block';
        };
        initialFontSize = params.get("tfs");
        document.getElementsByTagName("body")[0].style.backgroundImage = 'url(images/back/'+backgrnd+ '.jpg)';
        $('#surprise').text(ctitle);
        $('#surprise').css('font-family',tfont);
        $('#H3').text(ctext);
        var fontSize=$('#surprise').css('font-size').toUpperCase().split("PX");
        $('#surprise').css('font-size',((parseFloat(fontSize[0])+parseFloat(initialFontSize)+"PX"))); 

        manageResizeOrientation();

        for (i = 0; i < scratchers.length; i++) {
            i1 = i + 1;
            scratchers[i] = new Scratcher('scratcher' + i1);
    
            // set up this listener before calling setImages():
            //scratchers[i].addEventListener('imagesloaded', onScratcherLoaded);
    
            scratchers[i].setImages('images/empty.jpg','images/fore/' +foregrnd+ '.jpg');
            scratchers[i].setText(cmes);
            scratchers[i].setShape(shp1);

        }
        scratchers[0].addEventListener('scratchesended', scratcher1Changed);

    };

    
    /**
     * Handle page load
     */
    $(function() {
        if (supportsCanvas()) {
            initPage();
        } else {
            $('#scratcher-box').hide();
            $('#lamebrowser').show();
        }
    });
    
    })();
   