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
    var nosound=true;
    var pct1=0;
    var tfs;
    var scratchLimit=30;

    function supportsCanvas() {
        return !!document.createElement('canvas').getContext;
    };
    
    
    /**
     * Handle scratch event on a scratcher
     */
    function checkpct() {
            if (pct1 > 0 && pct1 < scratchLimit) {
                if (CrispyToast.toasts.length===0) {
                    CrispyToast.success('Scratch MORE!', { position: 'top-center', timeout: 2000});
                }
            }
            if (pct1 > scratchLimit) {
                if(CrispyToast.toasts.length!=0){
                    CrispyToast.clearall();
                }
                scratchers[0].clear();
                scratchers[0].removeEventListener('scratchesended', scratcher1Changed);

                confetti_effect();
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
    function confetti_effect() {
        //defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        
        
        if(triggered==true) {
            return;
        }
        if (!nosound) {
            soundHandle.volume=0.5;
            soundHandle.play();
        }
        triggered=true;
       
            var duration = 5 * 1000;
             var end = Date.now() + duration;
             var defaults = { startVelocity: 10, spread: 360, ticks: 70, zIndex: 0 };
             var particleCount = 2 ;
             (function frame() {
             // launch a few confetti from the left edge
             confetti({...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }}
             );
             // and launch a few from the right edge
             confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }}
             );
          
             // keep going until we are out of time
             if (Date.now() < end) {
                 requestAnimationFrame(frame);
                 
                 return;
             }
            }());
          
        setTimeout(function(){
            $("#resetbutton").show();
        }, duration);
              
     };
    
    /**
     * Reset all scratchers
     */
    function onResetClicked() {
        var i;
        pct1 = 0;
        CrispyToast.toasts=[];
        $("#resetbutton").hide();
        for (i = 0; i < scratchers.length; i++) {
            scratchers[i].setImages('images/empty.jpg','images/fore/' + foregrnd +'.jpg');
            scratchers[0].addEventListener('scratchesended', scratcher1Changed);
            scratchers[i].reset();
        }
        
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
        if (iwidth < iheight) {
            var rect2 =document.getElementById('scratcher-box').getBoundingClientRect();
            if (rect.bottom >rect2.top ||rect.bottom >rect2.bottom ) {
                overlapwithscratcher = true;
            }
        }
        return (
            (rect.x + rect.width) < 0 
              || (rect.y + rect.height) < 0
              || (rect.x > iwidth || rect.y > iheight-10
               || rect.bottom > iheight -10|| rect.top > iheight-10 || overlapwithscratcher )
          );
 };
    

      function manageResizeOrientation(etype) {
        iwidth = window.innerWidth;
        iheight = window.innerHeight;
        if (checkinprogress) {
            return;
        }
        checkinprogress=true;

        setTimeout(function () {
            fitCanvastoDiv();
            modifyFontSize();
        
            checkinprogress=false;

        },500);

    }

    function modifyFontSize() {
        var fontSize=$('#surprise').css('font-size').toUpperCase().split("PX");
        var v = parseFloat(fontSize[0]);
        //$('#surprise').css('line-height',(v +"PX")); 
        if ($('#H3').is(':offscreen')) {
            
            var counter =0;
            while ($('#H3').is(':offscreen')) {
                v=v-1;
                $('#surprise').css('font-size',(v+"PX")); 
                counter++;  
                if (counter >50) {
                    //display_dialog("The font you chose doesnt fit to the screen. So please either choose different font or smaller font size.");
                    $('#surprise').css('font-size',(parseFloat(fontSize[0])-parseFloat(tfs)+"PX")); 
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
        console.log(iwidth + " "+iheight);
        $( window ).on({
            orientationchange: function(e) {
                manageResizeOrientation('orientation');
            },resize: function(e) {
                manageResizeOrientation('resize');
            }
        });        
        fitCanvastoDiv();

        $('.nosoundbtn').on("click", function (e) {
            
        });
        $('.withsoundbtn').on("click", function (e) {
            
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
        tfs = params.get("tfs");
        document.getElementsByTagName("body")[0].style.backgroundImage = 'url(images/back/'+backgrnd+ '.jpg)';
        $('#surprise').text(ctitle);
        $('#surprise').css('font-family',tfont);
        $('#H3').text(ctext);
        var fontSize=$('#surprise').css('font-size').toUpperCase().split("PX");
        $('#surprise').css('font-size',((parseFloat(fontSize[0])+parseFloat(tfs)+"PX"))); 

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
   