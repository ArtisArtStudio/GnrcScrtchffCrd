/**
 * This file controls the page logic
 *
 * depends on jQuery>=1.7
 */
/*import {startParticles, stopParticles, startConfetti, stopConfetti} from './particles.js';*/
/*import {confetti} from 'https://cdn.jsdelivr.net/npm/@tsparticles/confetti@3.0.3/umd/confetti.js';*/
import {Pane} from './tweakpane-4.0.5.min.js';
import * as TextareaPlugin from './tweakpane-textarea-plugin.min.js';
var wholelink='';
var params;
(function() {
    /**
     * Returns true if this browser supports canvas
     *
     * From http://diveintohtml5.info/
     */

    var color1 = '#ff95c8';
    var colortxt1 = '#ff0b9a';
    //Select the background color
    var color =color1;
    //Select the text color
    var colortxt = colortxt1;
    var gendertext1 = "It is a Girl!";
    //Select the gender text
    var gendertext = gendertext1;
    var soundHandle = new Audio();
    var triggered=false;
    var nosound=true;
    //var params = new URLSearchParams(window.location.search.slice(1));
    var pct1=0;

    function supportsCanvas() {
        return !!document.createElement('canvas').getContext;
    };
    
    
    /**
     * Handle scratch event on a scratcher
     */
    function checkpct() {
        if (!triggered) {
            if (pct1 > 23) {
                $('#surprise').text(gendertext);
                $('#surprise').css('color', colortxt);

                document.getElementsByTagName("body")[0].style.backgroundColor = color;
                document.getElementsByTagName("body")[0].style.backgroundImage = 'none';
                
                //document.getElementsByTagName("body")[0].style.backgroundImage.animation = 'gradient 15s ease infinite';
                $('#H3').hide();
                confetti_effect();
            }
        }
    };
    function scratcher1Changed(ev) {
        pct[0] = (this.fullAmount(40) * 100)|0;
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
             confetti({...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#FFFFFF']}
             );
             // and launch a few from the right edge
             confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },colors: ['#FFFFFF']}
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
        pct = [];
        //$("#scratcher3Pct").hide();
        $("#resetbutton").hide();
        for (i = 0; i < scratchers.length; i++) {
            scratchers[i].reset();
        }
        
        $('#tboy').hide();
        $('#boy').show();
        $('#or').show();
        $('#girl').show();
        $('.images').show();

        document.getElementsByTagName("body")[0].style.backgroundColor = "#ffffff";
        document.getElementsByTagName("body")[0].style.backgroundImage = 'url(images/background.jpg)';
        // document.getElementById('testtext').remove();

        $('#H3').show();
        triggered = false;
        soundHandle.pause();
        soundHandle.currentTime = 0;    
        return false;
    };
    
    
    function initPage() {
        var scratcherLoadedCount = 0;
        var scratchers = [];
        var pct = [];
        var i, i1;    
        
        

        //surname = params.get('surname');
        

        //document.getElementById('id01').style.display='block';
        $('.nosoundbtn').on("click", function (e) {
            wholelink='https://artisartstudio.github.io/GnrcScrtchffCrd/index.html' + "?" + params.toString();
            window.open(
                wholelink,'_blank' 
              );             
        });
        $('.withsoundbtn').on("click", function (e) {
            if (navigator.share) {
                navigator.share({
                  //title: 'Love Coupon',
                  text : wholelink
                }).then(() => {

                })
                .catch(console.error);
              } else {
                alert("Unfortunately sharing is not supported by your browser/platform. Please take a screenshot instead");
            }
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
   
        
        document.getElementById("resetbutton").style.backgroundColor = colortxt;

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
        const cmessage = {
            message: 'This is a very long message. It wraps the text inside the heart. This is a test to see how the text wraps'
          };
        const title = {
            prop: 'To my lovely wife!'
        };
        const text = {
            prop: 'I have a special gift. Scratch to see it! Jamie'
        };
        for (i = 0; i < scratchers.length; i++) {
            i1 = i + 1;
            scratchers[i] = new Scratcher('scratcher' + i1);
    
            // set up this listener before calling setImages():
            scratchers[i].addEventListener('imagesloaded', onScratcherLoaded);
    
            scratchers[i].setImages('images/empty.png','images/foreground0.jpg');
            scratchers[i].setText(cmessage.message);
            scratchers[i].setShape('heart');

        }
       
        // get notifications of this scratcher changing
        // (These aren't "real" event listeners; they're implemented on top
        // of Scratcher.)
        //scratchers[3].addEventListener('reset', scratchersChanged);
        scratchers[0].addEventListener('scratchesended', scratcher1Changed);
        
        
        const pane = new Pane({
            title: 'Customization Parameters',
            expanded: true,
        });
        pane.registerPlugin(TextareaPlugin);
        const backgrnd = pane.addBlade({
            view: 'list',
            label: 'Background',
            options: [
              {text: 'Blue Floral', value: '0'},
              {text: 'Green Watercolor', value: '1'},
              {text: 'Pink-Blue1', value: '2'},
              {text: 'Pink-Blue2', value: '3'},
              {text: 'Christmas1', value: '4'},
            ],
            value: '0',
            }).on('change', (ev) => {
                document.getElementsByTagName("body")[0].style.backgroundImage = 'url(images/background' + ev.value + '.jpg)';
          });

        const ctitle= pane.addBinding(title, 'prop', {
            view: 'textarea',
            label: 'Title',
            rows:2,
            limit:22,
            }).on('change', (ev) => {
                var st = ctitle.element.querySelector('textarea').value;
                var char = 22 - st.length;
                tlimit.value=char + " characters left";
                $('#surprise').text(ev.value);

            });
            //alert(ctitle.element);
        const tlimit = pane.addBlade({
            view: 'text',
            label: '',
            parse: (v) => String(v),
            value: '22 characters left',
            disabled: true
        });
        
        var st = ctitle.element.querySelector('textarea').value;
        tlimit.value=22-st.length + " characters left";

        const tfont = pane.addBlade({
            view: 'list',
            label: 'Title Font',
            options: [
              {text: 'Font1', value: 'Birthstone'},
              {text: 'Font2', value: 'Mea Culpa'},
              {text: 'Font3', value: 'Oooh Baby'},
              {text: 'Font4', value: 'Girassol'},
              {text: 'Font5', value: 'Playball'},
              {text: 'Font6', value: 'Engagement'},

            ],
            value: 'Birthstone',
            }).on('change', (ev) => {
                $('#surprise').css('font-family',ev.value);

          });
          const ctext= pane.addBinding(text, 'prop', {
            view: 'textarea',
            label: 'Text under Title',
            rows:3,
            limit:50,
            }).on('change', (ev) => {
                var st = ctext.element.querySelector('textarea').value;
                var char = 50 - st.length;
                ttext.value=char + " characters left";
                $('#H3').text(ev.value);

            });

        const ttext = pane.addBlade({
            view: 'text',
            label: '',
            parse: (v) => String(v),
            value: '50 characters left',
            disabled: true
        });
        
        var st = ctext.element.querySelector('textarea').value;
        ttext.value=50-st.length + " characters left";
        
        const cmes= pane.addBinding(cmessage, 'message', {
            view: 'textarea',
            label: 'Message Under Scratch Area',
            rows:6,
            limit:110,
            }).on('change', (ev) => {
                scratchers[0].setText(ev.value)
                var st = cmes.element.querySelector('textarea').value;
                var char = 110 - st.length;
                climit.value=char + " characters left";
                scratchers[0].reset();
            });
        
          
        const climit = pane.addBlade({
            view: 'text',
            label: '',
            parse: (v) => String(v),
            value: '110 Characters remaining',
            disabled: true
        });
        var st = cmes.element.querySelector('textarea').value;
        climit.value=110-st.length + " characters left";
        
        const inputs = document.querySelectorAll('textarea');
        inputs.forEach(input => {
        input.setAttribute('autocomplete', 'off')
	    input.setAttribute('autocorrect', 'off')
	    input.setAttribute('spellcheck', false)
        }); 

        cmes.element.querySelector('textarea').setAttribute('maxlength', 110)
        ctitle.element.querySelector('textarea').setAttribute('maxlength', 22)
        ctext.element.querySelector('textarea').setAttribute('maxlength', 50)

        const foregrnd = pane.addBlade({
            view: 'list',
            label: 'Foreground',
            options: [
              {text: 'Golden Glitter', value: '0'},
              {text: 'Red Glitter', value: '1'},
              {text: 'Silver Glitter', value: '2'},
    
            ],
            value: '0',
            }).on('change', (ev) => {
                scratchers[0].setImages('images/empty.png','images/foreground' + ev.value +'.jpg');
            });
            const shape = pane.addBlade({
                view: 'list',
                label: 'Shape',
                options: [
                  {text: 'Heart', value: 'heart'},
                  {text: 'Circle', value: 'circle'},        
                ],
                value: 'heart',
                }).on('change', (ev) => {
                    scratchers[0].setShape(ev.value);
                    scratchers[0].reset();
                });
            const btn = pane.addButton({
                title: 'Create the Link',
            });
                       
            btn.on('click', () => {
                document.getElementById('id01').style.display='block';
                params = new URLSearchParams();
                //var end = window.btoa( rb ); 
                //end = window.atob( rb );
                //var esg = window.atob( mrb );
                params.append("bck1",backgrnd.value);
                params.append("fr1",foregrnd.value);
                params.append("ttl1",window.btoa(ctitle.element.querySelector('textarea').value));
                params.append("tfnt1",tfont.value);
                params.append("ttl2",window.btoa(ctext.element.querySelector('textarea').value));
                params.append("cmes",window.btoa(cmes.element.querySelector('textarea').value));


            });
            'https://artisartstudio.github.io/GnrcScrtchffCrd/index.html?t=This is a gender reveal&t1=This is a gender reveal scratch off for family. It&t3=This is a gender reveal scratch off for family. It contains high level sound. Do you want to continue with sou&b=1&f=2&s=1&sc=1'
            var prev = btn.element.querySelector('button').getAttribute("style");
        
            var added = '  background: #3b88d8;  background: -moz-linear-gradient(0% 100% 90deg, #377ad0, #52a8e8);  background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#52a8e8), to(#377ad0)); background: linear-gradient(top, #52a8e8 0%, #377ad0 100%);  border-top: 1px solid #4081af;   border-right: 1px solid #2e69a3; border-bottom: 1px solid #20559a;  border-left: 1px solid #2e69a3;  -moz-box-shadow: inset 0 1px 0 0 #72b9eb, 0 1px 2px 0 rgba(0, 0, 0, .3);  -webkit-box-shadow: inset 0 1px 0 0 #72b9eb, 0 1px 2px 0 rgba(0, 0, 0, .3);  text-shadow: 0 -1px 1px #3275bc;  -webkit-background-clip: padding-box;'

            btn.element.querySelector('button').setAttribute('style', prev+added);

            
            
            const btn2 = pane.addButton({
                title: 'Help',
            });
                       
            btn2.on('click', () => {

            });
            
            const btn1 = pane.addButton({
                title: 'Hide the Panel',
            });
                       
            btn1.on('click', () => {
                pane.expanded= false;
            });
            

        
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
   