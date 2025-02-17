/**
 * This file controls the page logic
 *
 * depends on jQuery>=1.7
 */
/*import {startParticles, stopParticles, startConfetti, stopConfetti} from './particles.js';*/
/*import {confetti} from 'https://cdn.jsdelivr.net/npm/@tsparticles/confetti@3.0.3/umd/confetti.js';*/
var wholelink='';
var params;
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
    var scratchers = [];
    var scratchLimit=25;
    function supportsCanvas() {
        return !!document.createElement('canvas').getContext;
    };
    
    
    /**
     * Handle scratch event on a scratcher
     */
    function checkpct() {
        if (!triggered) {
            if (pct1 > 0 && pct1 < scratchLimit) {
                if (CrispyToast.toasts.length===0) {
                    CrispyToast.success('Scratch MORE!', { position: 'top-center', timeout: 2000});
                }
            }
            if (pct1 > scratchLimit) {
                if(CrispyToast.toasts.length!=0){
                    CrispyToast.clearall();
                }
                confetti_effect();
            }
        }
    };
    function scratcher1Changed(ev) {
        pct1 = (this.fullAmount(40) * 100)|0;
        checkpct();
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
       
            var duration = 10 * 1000;
             var end = Date.now() + duration;
             var defaults = { startVelocity: 10, spread: 360, ticks: 70, zIndex: 0 };
             var particleCount = 5 ;
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
        }, 10000);
              
     };
    
    /**
     * Reset all scratchers
     */
    function onResetClicked(scratchers) {
        var i;
        pct1 = 0;
        CrispyToast.toasts=[];
        $("#resetbutton").hide();
        for (i = 0; i < scratchers.length; i++) {
            scratchers[i].reset();
        }
        
        triggered = false;
        soundHandle.pause();
        soundHandle.currentTime = 0;    
        return false;
    };
    
    function fitCanvastoDiv() {
        var canvas = document.getElementById("scratcher1");
        var $td = $('canvas').parent();
        canvas.width = $td.width();
        canvas.height = $td.height();
    }
   
    function initPage() {
        var scratcherLoadedCount = 0;
        var pct = [];
        var i, i1;    
        
        
        fitCanvastoDiv();

        //document.getElementById('id01').style.display='block';
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
   
        
        //document.getElementById("resetbutton").style.backgroundColor = colortxt;

        // called each time a scratcher loads
        function onScratcherLoaded(ev) {
            
            scratcherLoadedCount++;
            $("table1").width($(window).width());
            if (scratcherLoadedCount == scratchers.length) {
                // all scratchers loaded!
    
                // bind the reset button to reset all scratchers
                $('#resetbutton').on('click', function() {
                        onResetClicked(scratchers);
                    });
    
            }
        };
    
        // create new scratchers
        var scratchers = new Array(1);
        
        //var end = window.btoa( rb ); 
        //end = window.atob( rb );
        //var esg = window.atob( mrb );
        params = new URLSearchParams(window.location.search.slice(1));

        var backgrnd = params.get("bck1");
        var foregrnd = window.atob(params.get("fr1"));
        var ctitle = decodeURIComponent(window.atob(params.get("ttl1")));
        var tfont = window.atob(params.get("tfnt1"));
        var ctext = decodeURIComponent(window.atob(params.get("ttl2")));
        var cmes = decodeURIComponent(window.atob(params.get("cmes")));
        var shp1 = params.get("shp1");
        var tfs = params.get("tfs");
        document.getElementsByTagName("body")[0].style.backgroundImage = 'url(images/back/'+backgrnd+ '.jpg)';
        $('#surprise').text(ctitle);
        $('#surprise').css('font-family',tfont);
        $('#H3').text(ctext);
        var arrCurSize=$('#surprise').css('font-size').toUpperCase().split("PX");
        $('#surprise').css('font-size',((parseInt(arrCurSize[0])+parseInt(tfs)+"PX"))); 

        for (i = 0; i < scratchers.length; i++) {
            i1 = i + 1;
            scratchers[i] = new Scratcher('scratcher' + i1);
    
            // set up this listener before calling setImages():
            scratchers[i].addEventListener('imagesloaded', onScratcherLoaded);
    
            scratchers[i].setImages('images/empty.jpg','images/fore/' +foregrnd+ '.jpg');
            scratchers[i].setText(cmes);
            scratchers[i].setShape(shp1);

        }
        
            /* const elem = cmes.element.querySelector('input');
        elem.addEventListener('keyup', () => {
            scratchers[0].setText(elem.value);
        }); */
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
   