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
   
    var soundHandle = new Audio();
    var triggered=false;
    var nosound=true;
    var pct1=0;
    var mycanvas;
    var tfs;
    var scratchers = [];
    function supportsCanvas() {
        return !!document.createElement('canvas').getContext;
    };
    
    
    /**
     * Handle scratch event on a scratcher
     */
    function checkpct() {
        if (!triggered) {
            alert(pct1);
            if (pct1 > 23) {
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
        pct1 = 0;
        //$("#scratcher3Pct").hide();
        $("#resetbutton").hide();
        for (i = 0; i < scratchers.length; i++) {
            scratchers[i].reset();
        }
        
        // document.getElementById('testtext').remove();

        //$('#H3').show();
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
        const root = document.documentElement;
        $( "#dialog-message" ).hide();
        document.getElementsByTagName("body")[0].style.backgroundImage = 'url(images/Blue-Floral.jpg)';
        tfs = $('#surprise').css('font-size');
        var iw = Math.min(window.innerWidth,screen.availWidth)/2;
            if (iw<300) {
                iw=300;
            }
        root.style.setProperty('--pane-width',iw.toString() + "px" );
        iw = 2*(iw/3);
            if (iw<200) {
                iw=200;
            }
        root.style.setProperty('--tp-blade-value-width',iw.toString() + "px" );
        iw = Math.min(window.innerHeight,screen.availHeight)/30;
        if (iw<20) {
            iw=20;
        }
        root.style.setProperty('--tp-container-unit-size',iw.toString() + "px" );
        iw=iw/5;
        root.style.setProperty('--tp-container-unit-spacing',iw.toString() + "px" );
        iw = Math.min(window.innerHeight,screen.availHeight)/50;
        if (iw<15) {
            iw=15;
        }
        root.style.setProperty('--f-size',iw.toString() + "px" );
        iw=iw-3;
        root.style.setProperty('--fl-size',iw.toString() + "px" );

        //console.log(iw.toString() + "px");
        fitCanvastoDiv();
        //surname = params.get('surname');
        //document.getElementById('id01').style.display='block';
        $('.nosoundbtn').on("click", function (e) {
            //wholelink='./index.html' + "?" + params.toString(); // Test page

            window.open(
                wholelink,'_blank' 
              );             
        });
        $('.withsoundbtn').on("click", function (e) {
            if (navigator.share) {
                navigator.share({
                  title: 'Something Special',
                  text : "Here is something for you",
                  url: wholelink
                }).then(() => {

                })
                .catch(console.error);
              } else {
                display_dialog("Unfortunately sharing is not supported by your browser/platform. Please go to the link and use your browser's address bar to copy the link instead");
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
        
        const btn2 = pane.addButton({
            title: 'Help',
        });
                   
        btn2.on('click', () => {
            window.open(
                './help.html','_blank' 
              );   
        });
        
        const btn1 = pane.addButton({
            title: 'Hide the Panel',
        });
                   
        btn1.on('click', () => {
            pane.expanded= false;
        });
        pane.registerPlugin(TextareaPlugin);
        const tab = pane.addTab({
            pages: [
              {title: 'Step 1'},
              {title: 'Step 2'},
              {title: 'Finish'},
            ],
          });
        const backgrnd = tab.pages[0].addBlade({
            view: 'list',
            label: 'Background',
            options: [
              {text: 'Blue-Floral', value: 'Blue-Floral'},
              {text: 'Christmas1', value: 'Christmas1'},
              {text: 'Cream_waves', value: 'Cream_waves'},
              {text: 'Green1', value: 'Green1'},
              {text: 'Halloween1', value: 'Halloween1'},
              {text: 'Halloween2', value: 'Halloween2'},
              {text: 'Halloween3', value: 'Halloween3'},
              {text: 'Pink1', value: 'Pink1'},
              {text: 'Pink-Blue1', value: 'Pink-Blue1'},
              {text: 'Pink-Blue2', value: 'Pink-Blue2'},
              {text: 'Pink-Floral', value: 'Pink-Floral'},
              {text: 'StPatricks1', value: 'StPatricks1'},
              {text: 'StPatricks2', value: 'StPatricks2'},
              {text: 'Turquoise1', value: 'Turquoise1'},
              {text: 'Valentines1', value: 'Valentines1'},
            ],
            value: 'Blue-Floral',
            }).on('change', (ev) => {
                document.getElementsByTagName("body")[0].style.backgroundImage = 'url(images/' + ev.value + '.jpg)';
          });

        const ctitle= tab.pages[0].addBinding(title, 'prop', {
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
        const tlimit = tab.pages[0].addBlade({
            view: 'text',
            label: '',
            parse: (v) => String(v),
            value: '22 characters left',
            disabled: true
        });
        
        var st = ctitle.element.querySelector('textarea').value;
        tlimit.value=22-st.length + " characters left";

        const tfont = tab.pages[0].addBlade({
            view: 'list',
            label: 'Title Font',
            options: [
              {text: 'Font1', value: 'Birthstone'},
              {text: 'Font2', value: 'Mea Culpa'},
              {text: 'Font3', value: 'Oooh Baby'},
              {text: 'Font4', value: 'Girassol'},
              {text: 'Font5', value: 'Playball'},
              {text: 'Font6', value: 'Engagement'},
              {text: 'Halloween Font1', value: 'Creepster'},


            ],
            value: 'Birthstone',
            }).on('change', (ev) => {
                $('#surprise').css('font-family',ev.value);
          });
          const tfontsize = tab.pages[0].addBlade({
            view: 'list',
            label: 'Title Font Size',
            options: [
              {text: 'Smaller', value: '-20'},
              {text: 'Normal', value: '0'},
              {text: 'Bigger', value: '20'},
            ],
            value: '0',
            }).on('change', (ev) => {
                var arrCurSize=tfs.toUpperCase().split("PX");
                $('#surprise').css('font-size',((parseInt(arrCurSize[0])+parseInt(ev.value)+"PX"))); 
          });
          const ctext= tab.pages[0].addBinding(text, 'prop', {
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

        const ttext = tab.pages[0].addBlade({
            view: 'text',
            label: '',
            parse: (v) => String(v),
            value: '50 characters left',
            disabled: true
        });
        
        var st = ctext.element.querySelector('textarea').value;
        ttext.value=50-st.length + " characters left";
        mycanvas =scratchers[0].mainCanvas();

        const cmes= tab.pages[0].addBinding(cmessage, 'message', {
            view: 'textarea',
            label: 'Message Under Scratch Area',
            rows:6,
            limit:110,
            }).on('change', (ev) => {
                scratchers[0].setText(ev.value);
                var st = cmes.element.querySelector('textarea').value;
                var char = 110 - st.length;
                climit.value=char + " characters left";
                scratchers[0].reset();
            });
        
          
        const climit = tab.pages[0].addBlade({
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

        const foregrnd = tab.pages[0].addBlade({
            view: 'list',
            label: 'Foreground',
            options: [
              {text: 'Golden Glitter', value: '0'},
              {text: 'Red Glitter', value: '1'},
              {text: 'Silver Glitter', value: '2'},
              {text: 'Green Glitter', value: '3'},
              {text: 'Pink Glitter', value: '4'},
              {text: 'Pink Metallic1', value: '5'},
              {text: 'Gold Metallic1', value: '6'},
              {text: 'Gold Metallic2', value: '7'},
              {text: 'Silver Metallic1', value: '8'},
              {text: 'Silver Metallic2', value: '9'},
              {text: 'Green Metallic', value: '10'},
              {text: 'Halloween1', value: '11'},

            ],
            value: '0',
            }).on('change', (ev) => {
                scratchers[0].setImages('images/empty.png','images/foreground' + ev.value +'.jpg');
            });
            const shape = tab.pages[0].addBlade({
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

            const PARAMS = {
                Shorten: true,
            };
                  
            const shortURL = tab.pages[2].addBinding(PARAMS,"Shorten",{
                label: 'Shorten URL', 
            });
            const btn = tab.pages[2].addButton({
                title: 'Create the Link',
            });
                       
            btn.on('click', async () => {
                if (scratchers[0].getLW()) {
                    display_dialog("Your message under scratch area contains words that are too long to fit in. \nPlease use shorter words or make sure you put space after punctuations. Please correct the error to continue.");   
                    return;
                }
                

                params = new URLSearchParams();
                //var end = window.btoa( rb ); 
                //end = window.atob( rb );
                //var esg = window.atob( mrb );
                //CheckLongWords(cmes.element.querySelector('textarea').value);

                params.append("bck1",backgrnd.value);
                params.append("fr1",foregrnd.value);
                params.append("ttl1",window.btoa(encodeURIComponent(ctitle.element.querySelector('textarea').value)));
                params.append("tfnt1",tfont.value);
                params.append("ttl2",window.btoa(encodeURIComponent(ctext.element.querySelector('textarea').value)));
                params.append("cmes",window.btoa(encodeURIComponent(cmes.element.querySelector('textarea').value)));
                params.append("shp1",shape.value);

                wholelink='https://artisartstudio.github.io/GnrcScrtchffCrd/index.html' + "?" + params.toString();
                if (shortURL.element.querySelector('input').checked){
                    try {
                        const result = await ShortenURL(wholelink);
                        wholelink = result;              
                    } catch(error) {
                        var error_text;
                        switch (error) {
                        case 429:
                            error_text = "Server is busy to handle the URL shortening request. Try again a few minutes later.";
                            break;                    
                        default:
                                error_text = "An error occurred during URL shortening process.Please check your internet connection or uncheck 'Shorten URL' to try without this option.";
                                break;
                        }
                        display_dialog(error_text);
                        return;
                       
                    }
                }
                document.getElementById('id01').style.display='block';
            });
            var prev = btn.element.querySelector('button').getAttribute("style");
        
            var added = '  background: #3b88d8;  background: -moz-linear-gradient(0% 100% 90deg, #377ad0, #52a8e8);  background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#52a8e8), to(#377ad0)); background: linear-gradient(top, #52a8e8 0%, #377ad0 100%);  border-top: 1px solid #4081af;   border-right: 1px solid #2e69a3; border-bottom: 1px solid #20559a;  border-left: 1px solid #2e69a3;  -moz-box-shadow: inset 0 1px 0 0 #72b9eb, 0 1px 2px 0 rgba(0, 0, 0, .3);  -webkit-box-shadow: inset 0 1px 0 0 #72b9eb, 0 1px 2px 0 rgba(0, 0, 0, .3);  text-shadow: 0 -1px 1px #3275bc;  -webkit-background-clip: padding-box;'

            btn.element.querySelector('button').setAttribute('style', prev+added);

            
            
           
        
            /* const elem = cmes.element.querySelector('input');
        elem.addEventListener('keyup', () => {
            scratchers[0].setText(elem.value);
        }); */
    };
    function display_dialog(text) {
        $( "#error" ).text(text);
                    $( function() {
                        $( "#dialog-message" ).dialog({
                            modal: true,
                            width: 'auto',
                            height: 'auto',
                            buttons: {
                                Ok: function() {
                                $( this ).dialog( "close" );
                                }
                            },
                            show: {
                                effect: "highlight",
                                duration: 1000
                              },
                        });
                    });
                    $(".ui-widget-overlay").css({
                        background:"rgb(0, 0, 0)",
                        opacity: ".10 !important",
                        filter: "Alpha(Opacity=10)",
                    });
    }
    async function ShortenURL(link)
    {
        return new Promise(function (resolve, reject) {
        const url = 'https://spoo.me/';
        const data = new URLSearchParams();
        data.append('url', link);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send(data); 
        xhr.onload = function () {
            if (xhr.status == 200 && xhr.readyState == 4) {
                var a = JSON.parse(xhr.responseText);
                resolve(a.short_url);
            } else {
                reject(xhr.status);
            }
        };
        xhr.onerror = function () {
            reject(xhr.status);
        };
        });
    }
    
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
   