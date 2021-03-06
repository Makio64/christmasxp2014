(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Home, Loading, Main3d, MobileMenu, loading;

Loading = require("home/Loading");

Home = require("home/Home");

Main3d = require("3d/Main3d");

MobileMenu = require("home/MobileMenu");

loading = new Loading;

loading.on("complete", function() {
  var home, main, mobileMenu;
  if (window.innerWidth <= 640) {
    mobileMenu = new MobileMenu();
  }
  main = new Main3d();
  home = new Home(main.scene);
  return loading.hide().then(function() {
    loading.dispose();
    return home.show();
  });
});

loading.start();



},{"3d/Main3d":3,"home/Home":13,"home/Loading":14,"home/MobileMenu":16}],2:[function(require,module,exports){
module.exports={
    "idx": 21,
    "experiments": [
        {
            "idx": 1,
            "isAvailable": true,
            "author": "Guillaume Gouessan",
            "bio": "Interactive Developer @hellohikimori",
            "title": "Polar",
            "subtitle": "",
            "desc": "Hop aboard the Polar Express. Travel through windy plains covered in snow, enter the tunnel to switch from Polar to Solar.",
            "site": "https://twitter.com/superguigui",
            "isWebGL": true,
            "isMobile": false,
            "msgTwitter":"Polar a beautiful experiments by @superguigui #christmasxp",
            "msgFacebook":"Polar a beautiful experiments by @superguigui #christmasxp",
            "details": [
                {
                    "title": "controls",
                    "desc": "Click and drag to clear the window"
                },
                {
                    "title": "Github",
                    "desc": "<a href='https://github.com/superguigui/polar' target='_blank'>Check the source here!</a>"
                }
            ]
        },
        {
            "idx": 2,
            "isAvailable": true,
            "author": "Felix Turner",
            "bio": "Developer @ Airtight Interactive",
            "title": "Winter Rush",
            "subtitle": "",
            "desc": "Collect the crystals before the dawn comes! Try it on Mobile.",
            "site": "https://twitter.com/felixturner",
            "isWebGL": true,
            "isMobile": true,
            "msgTwitter":"Discover Winter Rush a #webgl game by @felixturner! #christmasxp",
            "msgFacebook":"Discover Winter Rush a #webgl game by @felixturner! #christmasxp",
            "details": [
                {
                    "title": "controls",
                    "desc": "Use arrow keys or tap to move left and right."
                }
            ]
        },
        {
            "idx": 3,
            "isAvailable": true,
            "author": "Nathan Gordon",
            "bio": "Creative Developer @utlranoir",
            "title": "The Cheeky Orphan",
            "subtitle": "",
            "desc": "It's early christmas morning, and Dion is far too excited to sleep. Direct him quietly so he can be the first to open his presents. Stay out of the light and watch for toys!",
            "site": "https://twitter.com/gordonnl",
            "isWebGL": true,
            "isMobile": false,
            "msgTwitter":"Back to your childhood with the Cheeky Orphan. An interactive piece crafted by @gordonnl #christmasxp #day3",
            "msgFacebook":"Back to your childhood with the Cheeky Orphan. An interactive piece crafted by @gordonnl #christmasxp #day3. We all did it, right ? ;D",
            "details": [
                {
                    "title": "controls",
                    "desc": "Move your mouse to control the speed and direction."
                },
                {
                    "title": "song",
                    "desc": "made by <a href='https://anposttv-lisahannigan.bandcamp.com/', target='_blank'>LISA HANNIGAN</a>"
                }
            ]
        },
        {
            "idx": 4,
            "isAvailable": true,
            "author": "David Rosser",
            "bio": "Programmer and artist @HiReSLondon",
            "title": "Kreepy Krampus",
            "subtitle": "",
            "desc": "A webgl game inspired by <a href='http://en.wikipedia.org/wiki/Krampus' target='_blank'>a christmas fairytale from alpine countries</a>, make it to midnight to save yourself from the clutches of Krampus.",
            "site": "http://twitter.com/davidpaulrosser",
            "isWebGL": true,
            "isMobile": false,
            "msgTwitter":"Discover Kreepy Krampus, a #webgl game based on a christmas fairytale from alpine countries by @davidpaulrosser! #christmasxp #day4",
            "msgFacebook":"Kreepy Krampus an interactive christmas experiment based on a christmas fairytale!",
            "details": [
                {
                    "title": "controls",
                    "desc": "Click on the skulls when they're highlighted."
                },
                {
                    "title": "Source",
                    "desc":"<a href='https://github.com/IVXVIXVIII/kreepy-krampus' target='_blank'>Github source</a>"
                }
            ]
        },
        {
            "idx": 5,
            "isAvailable": true,
            "author": "Bruno Simon",
            "bio": "Developer @AgenceUzik & teacher at @Hetic",
            "title": "Santa Workout",
            "subtitle": "",
            "desc": "Get Santa to the end as fast as possible. Don't lose too many elves to be a good Santa ;)",
            "site": "http://bruno-simon.com",
            "isWebGL": true,
            "isMobile": false,
            "msgTwitter":"Santa Workout, a super funny little #webgl game by @bruno_simon for @christmasxp, enjoy!",
            "msgFacebook":"Santa Workout, a super funny little game for christmasexperiments, enjoy!",
            "details": [
                {
                    "title": "controls",
                    "desc": "Click on the screen to make santa move. The elves will follow."
                },
                {
                    "title": "Source",
                    "desc":"<a href='https://github.com/brunosimon/christmas-experiment-2014' target='_blank'>Github source</a>"
                }

            ]
        },
        {
            "idx": 6,
            "isAvailable": true,
            "author": "Hector Arellano",
            "bio": "-",
            "title": "Christmas Star",
            "subtitle": "",
            "desc": "Simple simulation of a christmas star explosion, rendering using a ray tracer in real time.",
            "site": "https://twitter.com/hector_arellano",
            "isWebGL": true,
            "isMobile": false,
            "msgTwitter":"Simple simulation of a christmas star explosion by @hector_arellano for @christmasxp #raytracer #realtime #webgl",
            "msgFacebook":"Check this simulation of a christmas star explosion by @hector_arellano #raytracer #realtime #webgl #geeks",
            "details": [
                {
                    "title": "controls",
                    "desc": "Play with the parameters & click on the restart button to see the new simulation"
                }
            ]
        },
        {
            "idx": 7,
            "isAvailable": true,
            "author": "Michael Anthony",
            "bio": "Interactive Director at @active_theory",
            "title": "Finding Home",
            "subtitle": "",
            "desc": "An interactive journey through land and sky",
            "site": "http://twitter.com/michaeltheory",
            "isWebGL": true,
            "isMobile": true,
            "msgTwitter":"Finding Home, a beautiful interactive journey through land and sky by @active_theory for @christmas",
            "msgFacebook":"Finding Home, a beautiful interactive journey through land and sky made with love by Active Theory",
            "details": [
                {
                    "title": "controls",
                    "desc": "Move your mouse or touch to interact"
                },{
                    "title":"song",
                    "desc":"Tycho - Awake"
                }
            ]
        },
        {
            "idx": 8,
            "isAvailable": true,
            "author": "Lin Yi-Wen",
            "bio": "Coder. Father.",
            "title": "Blow",
            "subtitle": "",
            "desc": "Blow the gold.",
            "site": "https://twitter.com/yiwen_lin",
            "isWebGL": true,
            "isMobile": false,
            "msgTwitter":"Blow the gold, a beautiful experiments by @yiwen_lin for @christmasxp",
            "msgFacebook":"Blow the gold, a beautiful experiments by the artist Lin Yi-Wen",
            "details": [
                {
                    "title": "controls",
                    "desc": "Activate your microphone or press the space bar"
                },
                {
                    "title": "Source",
                    "desc": "<a href='https://github.com/yiwenl/Christmas_Experiment_2014' target='_blank'>Github source</a>"
                }
                
            ]
        },
        {
            "idx": 9,
            "isAvailable": true,
            "author": "oosmoxiecode",
            "bio": "-",
            "title": "Replicate",
            "subtitle": "",
            "desc": "Well.. this started out as some snowy-forest-using-billboards-test. Then sidetracked to some kinda music visualization for the song \"jaHer\" by \"Skinny Puppy\". ",
            "site": "#",
            "isWebGL": true,
            "isMobile": false,
            "msgTwitter":"Replicate. A trippy music visualization by @oosmoxiecode for @christmasxp",
            "msgFacebook":"Replicate. A trippy music visualization by oosmoxiecode for #christmasxp #day9",
            "details": [
                {
                    "title": "music",
                    "desc": "jaHer by Skinny Puppy"
                }
            ]
        },
        {
            "idx": 10,
            "isAvailable": true,
            "author": "Silvio Paganini",
            "bio": "Brain-fuck @unit9 ",
            "title": "PIXMAS",
            "subtitle": "",
            "desc": "Explode your Xmas heros.",
            "site": "https://twitter.com/silviopaganini",
            "isWebGL": true,
            "isMobile": true,
            "msgTwitter":"Pixmax, explode your xmas heros by @silviopaganini for @christmasxp",
            "msgFacebook":"Pixmax, explode your xmas heros by @silviopaganini for @christmasxp",
            "details": [
                {
                    "title": "controls",
                    "desc": "Move your mouse or use your gyro to control the camera and click/tap to explode"
                },
                {
                    "title": "Source",
                    "desc": "<a href='https://github.com/silviopaganini/xmas' target='_blank'>Github source</a>"
                }
            ]
        },
        {
            "idx": 11,
            "isAvailable": true,
            "author": "Mat Groves",
            "bio": "Co-founder of @goodboydigital and creator of pixi.js",
            "title": "Pixilights",
            "subtitle": "",
            "desc": "Presents are more dangerous than you think! A game made in 2d using pixi.js",
            "site": "https://twitter.com/Doormat23",
            "isWebGL": true,
            "isMobile": true,
            "msgTwitter":"Pixilights, a super cute game by @Doormat23 for @christmasxp #pixijs",
            "msgFacebook":"Pixilights, a super cute game to feel the christmas spirit! #christmasxp #day11",
            "details": [
                {
                    "title": "controls",
                    "desc": "Move your mouse to move and avoid the presents!"
                }
            ]
        },
        {
            "idx": 12,
            "isAvailable": true,
            "author": "Damien Mortini",
            "bio": "Freelance intern",
            "title": "Christmas Quest",
            "subtitle": "",
            "desc": "Follow the light to find all the gifts and discover the real magic of Christmas!",
            "site": "https://twitter.com/dmmn_",
            "isWebGL": true,
            "isMobile": false,
            "msgTwitter":"Christmas Quest, an epileptic santa quest by @dmmn_ for @christmasxp",
            "msgFacebook":"Discover Christmas Quest, an epileptic santa quest by Damien Mortini #day12",
            "details": [
                {
                    "title": "controls",
                    "desc": "Move with your keyboard arrows"
                }
            ]
        },
        {
            "idx": 13,
            "isAvailable": true,
            "author": "William Mapan",
            "bio": "Coding and plopping stuff",
            "title": "Sunset gift",
            "subtitle": "",
            "desc": "An exploration of Santa's gift dimension. Help him to catch those cheeky gifts.",
            "site": "https://twitter.com/williamapan",
            "isWebGL": true,
            "isMobile": false,
            "msgTwitter":"",
            "msgFacebook":"",
            "details": [
                {
                    "title": "controls",
                    "desc": "Hit your space bar / screen to move forward"
                }
            ]
        },
        {
            "idx": 14,
            "isAvailable": true,
            "author": "Matt DesLauriers",
            "bio": "Creative Developer @Jam3",
            "title": "hot cocoa",
            "subtitle": "",
            "desc": "",
            "site": "https://twitter.com/mattdesl",
            "isWebGL": true,
            "isMobile": false,
            "msgTwitter":"Hot cocoa by @mattdesl for @christmasxp ",
            "msgFacebook":"Hot cocoa, a pretty #christmasxp",
            "details": [
                {
                    "title": "controls",
                    "desc": "tap the Earth to find some hot cocoa"
                }
            ]
        },
        {
            "idx": 15,
            "isAvailable": true,
            "author": "FZFS",
            "bio": "-",
            "title": "NorthPole",
            "subtitle": "",
            "desc": "Travel to the North Pole and enjoy a lyric journey through time... Yes, there is seasons now in NorthPole. Damn climat change.",
            "site": "https://twitter.com/florianzumbrunn",
            "isWebGL": true,
            "isMobile": false,
            "msgTwitter":"Yes, there is seasons now in NorthPole.. Damn you climat change...",
            "msgFacebook":"Yes, there is seasons now in NorthPole.. Damn you climat change...",
            "details": [
                {
                    "title": "Drag the screen",
                    "desc": "And travel through time."
                }
            ]
        },
        {
            "idx": 16,
            "isAvailable": true,
            "author": "eiji muroichi",
            "bio": "Visual Designer & Technologist @prty_ny",
            "title": "The Little Match Girl",
            "subtitle": "",
            "desc": "An interactive version of a classic story, The Little Match Girl. <http://en.wikipedia.org/wiki/The_Little_Match_Girl>.",
            "site": "http://eiji.muroichi.info/",
            "isWebGL": true,
            "isMobile": false,
            "msgTwitter":"Discover an interactive version of a classic story, The Little Match Girl by @muroicci for @christmasxp",
            "msgFacebook":"Discover an interactive version of a classic story, The Little Match Girl made by Eiji Muroicci",
            "details": [
                {
                    "title": "controls",
                    "desc": "Click the little match girl to strike a match. Blow to your microphone to blow it out."
                }
            ]
        },
        {
            "idx": 17,
            "isAvailable": true,
            "author": "Nicolas Barradeau",
            "bio": "I do graphics.",
            "title": "Harriet",
            "subtitle": "",
            "desc": "I wanted to create a vintage toy generator which turned into a vintage plane generator. <a href='http://en.wikipedia.org/wiki/Harriet_Quimby' target='_blank'>\"Harriet\"</a> is a tribute to Harriet Quimby, the first US woman pilot. now you can follow her around some famous landmarks of the world.",
            "site": "http://barradeau.com/blog/?page_id=6",
            "isWebGL": true,
            "isMobile": false,
            "msgTwitter":"",
            "msgFacebook":"",
            "details": [
                {
                    "title": "controls",
                    "desc": "spin the plane or use the arrows to regenerate. click / tap the arrow at the bottom of the screen to fly around the world or come back to the plane view. there's no way to control the plane & it's still very buggy, sorry about that..."
                },
                {
                    "title": "links",
                    "desc": "blog post : <a href='http://barradeau.com/blog/?p=428' target='_blank'>http://barradeau.com/blog/?p=428</a><br/>Source: <a href='https://github.com/nicoptere/harriet' target='_blank'>Github source</a>"
                }
            ]
        },
        {
            "idx": 18,
            "isAvailable": true,
            "author": "David Li",
            "bio": "-",
            "title": "Snowdrops",
            "subtitle": "",
            "desc": "A tranquil winter scene.",
            "site": "http://david.li",
            "isWebGL": true,
            "isMobile": false,
            "msgTwitter":"Discover this quiet winter scene by @daviddotli for @christmasxp #webgl",
            "msgFacebook":"Discover this quiet winter scene by David.li",
            "details": [
                {
                    "title": "controls",
                    "desc": "Drag to rotate the camera"
                }
            ]
        },
        {
            "idx": 19,
            "isAvailable": true,
            "author": "David Ronai",
            "bio": "Initiator of the project & digital crafter",
            "title": "Golem",
            "subtitle": "",
            "desc": "I love fantasy, and during the winter i was drawing a lot of Golem in my childhood. Here it's my dynamic ice golem made by code :).< Physics is made with oimojs.",
            "site": "https://twitter.com/Makio64",
            "isWebGL": true,
            "isMobile": true,
            "msgTwitter":"Golem, a poetic experiment by @makio64 for @christmasxp #oimojs #webgl",
            "msgFacebook":"Golem a poetic web experiment whitch invite you to met the golem..",
            "details": [
                {
                    "title": "Music",
                    "desc": "Le jardinier celeste by Hirundo°"
                }
            ]
        },
        {
            "idx": 20,
            "isAvailable": true,
            "author": "Grgrdvrt",
            "bio": "-",
            "title": "(de)generative snowman",
            "subtitle": "",
            "desc": "Building a snowman with the \"Diffusion Limited Aggregation\" algorithm.",
            "site": "https://twitter.com/grgrdvrt",
            "isWebGL": true,
            "isMobile": false,
            "msgTwitter":"(de)generative snowman by @grgrdvrt",
            "msgFacebook":"(de)generative snowman by @grgrdvrt",
            "details": [
                {
                    "title": "controls",
                    "desc": "Click"
                }
            ]
        },
        {
            "idx": 21,
            "isAvailable": true,
            "author": "Is-real / Emil Karlsson",
            "bio": "Creative Technologist & fan of all the artists involved in this project. / Motion designer @ b-reel nyc.",
            "title": "boXmas",
            "subtitle": "",
            "desc": "boXmas is a game where the objective is to throw stuff in to boxes. Don't miss!",
            "site": "https://twitter.com/is__real",
            "isWebGL": true,
            "isMobile": false,
            "msgTwitter":"Prepare your gifts with boXmas by @is__real & @sejnulla for @christmasxp!",
            "msgFacebook":"boXmas, prepare your gifts with this xmas game!",
            "details": [
                {
                    "title": "controls",
                    "desc": "Aim by rotating around the scene with your mouse. Hold down spacebar to throw. The longer you hold the further you throw. Toggle the 'hints' for help. Music: Christmas Holidays by Akashic Records"
                }
            ]
        },
        {
            "idx": 22,
            "isAvailable": false,
            "author": "Edan Kwan",
            "bio": "Author of penis.js and vagina.js. Editor of asshole.io",
            "title": "Polar",
            "subtitle": "",
            "desc": "Hop aboard the Polar Express. Travel through windy plains covered in snow, enter the tunnel to switch from Polar to Solar.",
            "site": "https://twitter.com/edankwan",
            "isWebGL": true,
            "isMobile": false,
            "msgTwitter":"",
            "msgFacebook":"",
            "details": [
                {
                    "title": "controls",
                    "desc": "Click and drag to clear the window"
                }
            ]
        },
        {
            "idx": 23,
            "isAvailable": false,
            "author": "Bartek",
            "bio": "I like to code.",
            "title": "Polar",
            "subtitle": "",
            "desc": "Hop aboard the Polar Express. Travel through windy plains covered in snow, enter the tunnel to switch from Polar to Solar.",
            "site": "https://twitter.com/bartekd",
            "isWebGL": true,
            "isMobile": false,
            "msgTwitter":"",
            "msgFacebook":"",
            "details": [
                {
                    "title": "controls",
                    "desc": "Click and drag to clear the window"
                }
            ]
        },
        {
            "idx": 24,
            "isAvailable": false,
            "author": "Cabibbo / The Spite",
            "bio": "Long Live Synesthesia",
            "title": "Polar",
            "subtitle": "",
            "desc": "Hop aboard the Polar Express. Travel through windy plains covered in snow, enter the tunnel to switch from Polar to Solar.",
            "site": "https://twitter.com/Cabbibo",
            "isWebGL": true,
            "isMobile": false,
            "msgTwitter":"",
            "msgFacebook":"",
            "details": [
                {
                    "title": "controls",
                    "desc": "Click and drag to clear the window"
                }
            ]
        }
    ],
    "artists": [
        {
            "idx": 1,
            "author": "Guillaume Gouessan",
            "bio": "Interactive Developer @hellohikimori",
            "site": "https://twitter.com/superguigui",
            "preview": "1.png"
        },
        {
            "idx": 2,
            "author": "Felix Turner",
            "bio": "Developer @ Airtight Interactive",
            "site": "https://twitter.com/felixturner",
            "preview": "2.png"
        },
        {
            "idx": 3,
            "author": "Nathan Gordon",
            "bio": "Creative Developer @utlranoir",
            "site": "https://twitter.com/gordonnl",
            "preview": "3.png"
        },
        {
            "idx": 4,
            "author": "David Rosser",
            "bio": "Programmer and artist @HiReSLondon",
            "site": "http://twitter.com/davidpaulrosser",
            "preview": "4.png"
        },
        {
            "idx": 5,
            "author": "Bruno Simon",
            "bio": "Developer @AgenceUzik & teacher at @Hetic",
            "site": "http://bruno-simon.com",
            "preview": "5.png"
        },
        {
            "idx": 6,
            "author": "Hector Arellano",
            "bio": "-",
            "site": "https://twitter.com/hector_arellano",
            "preview": "6.png"
        },
        {
            "idx": 7,
            "author": "Michael Anthony",
            "bio": "Interactive Director at @active_theory",
            "site": "http://twitter.com/michaeltheory",
            "preview": "7.png"
        },
        {
            "idx": 8,
            "author": "Lin Yi-Wen",
            "bio": "Coder. Father.",
            "site": "https://twitter.com/yiwen_lin",
            "preview": "8.png"
        },
        {
            "idx": 9,
            "author": "oosmoxiecode",
            "bio": "-",
            "site": "https://twitter.com/oosmoxiecode",
            "preview": "9.png"
        },
        {
            "idx": 10,
            "author": "Silvio Paganini",
            "bio": "Brain-fuck @unit9 ",
            "site": "https://twitter.com/silviopaganini",
            "preview": "16.png"
        },
        {
            "idx": 11,
            "author": "Mat Groves",
            "bio": "Co-founder of @goodboydigital and creator of pixi.js",
            "site": "https://twitter.com/Doormat23",
            "preview": "12.png"
        }, 
        {
            "idx": 12,
            "author": "Damien Mortini",
            "bio": "Freelance intern",
            "site": "https://twitter.com/dmmn_",
            "preview": "11.png"
        },
        {
            "idx": 13,
            "author": "William Mapan",
            "bio": "Coding and plopping stuff",
            "site": "https://twitter.com/williamapan",
            "preview": "13.png"
        },
        {
            "idx": 14,
            "author": "Matt DesLauriers",
            "bio": "Creative Developer @Jam3",
            "site": "https://twitter.com/mattdesl",
            "preview": "14.png"
        },
        {
            "idx": 15,
            "author": "Floz",
            "bio": "-",
            "site": "https://twitter.com/florianzumbrunn",
            "preview": "15a.png"
        },
        {
            "idx": 15,
            "author": "FilsDeGraphiste",
            "bio": "-",
            "site": "https://twitter.com/filsdegraphiste",
            "preview": "15b.png"
        },
        {
            "idx": 16,
            "author": "eiji muroichi",
            "bio": "Visual Designer & Technologist @prty_ny",
            "site": "http://eiji.muroichi.info/",
            "preview": "10.png"
        },
        
        {
            "idx": 17,
            "author": "Nicolas Barradeau",
            "bio": "I code graphics",
            "site": "http://barradeau.com/blog/?page_id=6",
            "preview": "17.png"
        },
        {
            "idx": 18,
            "author": "David Li",
            "bio": "-",
            "site": "http://david.li",
            "preview": "18.png"
        },
        {
            "idx": 19,
            "author": "David Ronai",
            "bio": "Initiator of the project & digital crafter",
            "site": "https://twitter.com/Makio64",
            "preview": "19.png"
        },
        {
            "idx": 20,
            "author": "Grgrdvrt",
            "bio": "-",
            "site": "https://twitter.com/grgrdvrt",
            "preview": "20.png"
        },
        {
            "idx": 21,
            "author": "Is_real",
            "bio": "Creative Technologist & fan of all the artist involved in this project.",
            "site": "https://twitter.com/is__real",
            "preview": "21-a.png"
        },
        {
            "idx": 21,
            "author": "Emil Karlsson",
            "bio": "Motion designer @ b-reel nyc.",
            "site": "https://emilkarlsson.se",
            "preview": "21-b.png"
        },
        {
            "idx": 22,
            "author": "Edan Kwan",
            "bio": "Author of penis.js and vagina.js. Editor of asshole.io",
            "site": "https://twitter.com/edankwan",
            "preview": "22.png"
        },
        {
            "idx": 23,
            "author": "Bartek",
            "bio": "I like to code.",
            "site": "https://twitter.com/bartekd",
            "preview": "23.png"
        },
        {
            "idx": 24,
            "author": "Cabibbo",
            "bio": "Long Live Synesthesia",
            "site": "https://twitter.com/Cabbibo",
            "preview": "24a.png"
        },
        {
            "idx": 24,
            "author": "The Spite",
            "bio": "Working since the last century to bring new ideas to the web",
            "site": "https://twitter.com/thespite",
            "preview": "24b.png"
        }
    ]
}

},{}],3:[function(require,module,exports){
var Main3d, Scene3d, Stage3d,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Stage3d = require("3d/Stage3d");

Scene3d = require("3d/Scene3d");

Main3d = (function() {
  Main3d.prototype.dt = 0;

  Main3d.prototype.lastTime = 0;

  Main3d.prototype.pause = false;

  Main3d.prototype.scene = null;

  function Main3d() {
    this.resize = __bind(this.resize, this);
    this.update = __bind(this.update, this);
    this.pause = false;
    this.lastTime = Date.now();
    window.onblur = (function(_this) {
      return function(e) {
        _this.pause = true;
        cancelAnimationFrame(_this.update);
      };
    })(this);
    window.onfocus = (function(_this) {
      return function() {
        requestAnimationFrame(_this.update);
        _this.lastTime = Date.now();
        _this.pause = false;
      };
    })(this);
    window.onresize = (function(_this) {
      return function() {
        _this.resize();
      };
    })(this);
    Stage3d.init({
      transparent: false,
      antialias: false,
      background: 0xFFFFFF
    });
    this.scene = new Scene3d();
    requestAnimationFrame(this.update);
    return;
  }

  Main3d.prototype.update = function() {
    var dt, t;
    t = Date.now();
    dt = t - this.lastTime;
    this.lastTime = t;
    if (this.pause) {
      return;
    }
    this.scene.update(dt);
    Stage3d.render();
    requestAnimationFrame(this.update);
  };

  Main3d.prototype.resize = function() {
    var height, width;
    width = window.innerWidth;
    height = window.innerHeight;
    Stage3d.resize();
    this.scene.resize();
  };

  return Main3d;

})();

module.exports = Main3d;



},{"3d/Scene3d":4,"3d/Stage3d":5}],4:[function(require,module,exports){
var Scene3d, Stage3d, nav,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Stage3d = require("3d/Stage3d");

nav = require("common/nav");

Scene3d = (function(_super) {
  __extends(Scene3d, _super);

  function Scene3d() {
    this.resize = __bind(this.resize, this);
    this.gotoXP = __bind(this.gotoXP, this);
    this.showXP = __bind(this.showXP, this);
    this.createGUI = __bind(this.createGUI, this);
    this.onFragmentLoaded = __bind(this.onFragmentLoaded, this);
    this.onMirrorLoad = __bind(this.onMirrorLoad, this);
    this.onDiamondLoad = __bind(this.onDiamondLoad, this);
    this.addEvent = __bind(this.addEvent, this);
    this.createMobilePosition = __bind(this.createMobilePosition, this);
    this.createPortraitPosition = __bind(this.createPortraitPosition, this);
    this.createGrids4 = __bind(this.createGrids4, this);
    this.createGrids3 = __bind(this.createGrids3, this);
    this.createGrids2 = __bind(this.createGrids2, this);
    this.createGrids1 = __bind(this.createGrids1, this);
    this.createLight = __bind(this.createLight, this);
    this.createBackground = __bind(this.createBackground, this);
    this.setGrid = __bind(this.setGrid, this);
    this.loadMesh = __bind(this.loadMesh, this);
    this.loadImagesHight = __bind(this.loadImagesHight, this);
    this.parseAtlas = __bind(this.parseAtlas, this);
    this.loadImagesLow = __bind(this.loadImagesLow, this);
    var i, xp, xps, _i, _j, _len;
    Scene3d.__super__.constructor.apply(this, arguments);
    this.isOver = false;
    this.isReady = false;
    this.isImgReady = false;
    this.isActivate = false;
    this.debug = /debug/i.test(window.location);
    this.hitboxVisible = false;
    this.currentIndex = 1;
    this.globalOpacity = 1;
    this.globalAlpha = 0;
    this.cameraMoveY = true;
    this.containerMovY = true;
    this.containerMovYScale = 1;
    this.cameraMoveYScale = 1.5;
    this.backgroundFix = false;
    this.movementScale = 1.3;
    this.speedScale = 0.1;
    this.mouse = new THREE.Vector2(0, 0);
    this.time = 0;
    this.useMap = true;
    this.shading = THREE.FlatShading;
    this.opacity = 1;
    this.fragments = [];
    this.hitboxs = [];
    this.isGrid = false;
    this.maxDate = 0;
    xps = require("data.json").experiments;
    for (_i = 0, _len = xps.length; _i < _len; _i++) {
      xp = xps[_i];
      if (xp.isAvailable) {
        this.maxDate++;
      }
    }
    this.positions = {};
    this.positions.base = {
      fragments: [],
      diamond: new THREE.Vector3(),
      mirror: new THREE.Vector3()
    };
    if (window.innerWidth <= 640) {
      this.offsetX = 0;
      this.offsetY = 10;
    } else {
      this.offsetX = 10;
      this.offsetY = -5;
    }
    this.currentPosition = {
      fragments: [],
      diamond: null,
      mirror: null
    };
    this.images = [];
    for (i = _j = 0; _j < 24; i = _j += 1) {
      this.currentPosition.fragments[i] = new THREE.Vector3();
    }
    this.currentPosition.diamond = new THREE.Vector3();
    this.currentPosition.mirror = new THREE.Vector3();
    this.container = new THREE.Object3D();
    Stage3d.add(this.container, false);
    this.containerFrontcamera = new THREE.Object3D();
    this.container.add(this.containerFrontcamera);
    this.lightContainer = new THREE.Object3D();
    Stage3d.add(this.lightContainer);
    this.createLight();
    this.createBackground();
    this.createCircles();
    this.createParticles();
    this.addEvent();
    this.loadImagesLow();
    return;
  }

  Scene3d.prototype.createCanvas = function() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 64;
    this.canvas.height = 64;
    this.ctx = this.canvas.getContext('2d');
    this.map = new THREE.Texture(this.canvas, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearMipMapLinearFilter, THREE.RGBFormat, THREE.UnsignedByteType, 1);
    this.envMap = new THREE.Texture([this.canvas, this.canvas, this.canvas, this.canvas, this.canvas, this.canvas], THREE.CubeRefractionMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearMipMapLinearFilter, THREE.RGBFormat, THREE.UnsignedByteType, 1);
  };

  Scene3d.prototype.loadImagesLow = function() {
    this.atlas = new Image();
    this.atlas.onload = (function(_this) {
      return function() {
        _this.parseAtlas();
        _this.createCanvas();
        _this.loadMesh();
        if (_this.debug) {
          _this.createGUI();
        }
        return _this.loadImagesHight();
      };
    })(this);
    this.atlas.src = './3d/textures/atlas_low_512.jpg?v=' + this.maxDate;
  };

  Scene3d.prototype.parseAtlas = function() {
    var canvas, ctx, k, size, x, y, _i, _j;
    size = this.atlas.width / 8;
    for (y = _i = 0; _i < 8; y = _i += 1) {
      for (x = _j = 0; _j < 8; x = _j += 1) {
        k = x + y * 8;
        if (k >= 24) {
          this.isImgReady = true;
          if (this.canvas) {
            this.canvas.width = size;
            this.canvas.height = size;
          }
          return;
        }
        canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        ctx = canvas.getContext('2d');
        ctx.drawImage(this.atlas, x * size, y * size, size, size, 0, 0, size, size);
        this.images[k] = canvas;
      }
    }
  };

  Scene3d.prototype.loadImagesHight = function() {
    this.atlas = new Image();
    this.atlas.onload = (function(_this) {
      return function() {
        return _this.parseAtlas();
      };
    })(this);
    if (isMobile.any) {
      this.atlas.src = './3d/textures/atlas_low_1024.jpg?v=' + this.maxDate;
    } else {
      this.atlas.src = './3d/textures/atlas_low_2048.jpg?v=' + this.maxDate;
    }
  };

  Scene3d.prototype.loadMesh = function() {
    var loader;
    loader = new THREE.JSONLoader();
    loader.load('./3d/json/crystal.js', this.onDiamondLoad);
    loader = new THREE.JSONLoader();
    loader.load('./3d/json/mirror.js', this.onMirrorLoad);
    loader = new THREE.SceneLoader();
    loader.load('./3d/json/fragments.js', this.onFragmentLoaded);
  };

  Scene3d.prototype.setGrid = function(value) {
    this.isGrid = value;
    if (value) {
      this.grid2();
    } else {
      this.noGrid();
    }
  };

  Scene3d.prototype.createBackground = function() {
    var geometry, i, material, v, _i, _ref;
    material = new THREE.MeshLambertMaterial({
      wireframe: false,
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0
    });
    material.shading = THREE.FlatShading;
    geometry = new THREE.PlaneGeometry(7000, 7000, 8, 8);
    for (i = _i = 0, _ref = geometry.vertices.length; _i < _ref; i = _i += 1) {
      v = geometry.vertices[i];
      v.x += (1 * Math.random() - .5) * 300;
      v.y += (1 * Math.random() - .5) * 300;
      v.z += (1 * Math.random() - .5) * 300;
    }
    geometry.computeTangents();
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    geometry.computeVertexNormals();
    geometry.computeTangents();
    geometry.verticesNeedUpdate = true;
    geometry.normalsNeedUpdate = true;
    geometry.elementsNeedUpdate = true;
    geometry.tangentsNeedUpdate = true;
    this.backgroundFlat = new THREE.Mesh(geometry, material);
    this.backgroundFlat.position.z = -1000;
    TweenLite.to(material, .4, {
      opacity: 1,
      delay: 0.01
    });
    Stage3d.add(this.backgroundFlat);
    material = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0,
      transparent: true,
      opacity: 0
    });
    material.shading = THREE.FlatShading;
    this.backgroundLine = new THREE.Mesh(geometry, material);
    this.backgroundLine.position.z = -950;
    this.backgroundLine.position.y += 10;
    Stage3d.add(this.backgroundLine);
    TweenLite.to(material, .4, {
      opacity: .1,
      delay: 0.01
    });
    this.backgroundGeometry = geometry;
  };

  Scene3d.prototype.createCircles = function() {
    var image;
    if (isMobile.any) {
      return;
    }
    image = new Image();
    image.onload = (function(_this) {
      return function() {
        var map, material;
        map = THREE.ImageUtils.loadTexture('./3d/textures/circle.png');
        _this.bufferGeometry = new THREE.BufferGeometry();
        _this.bufferGeometry.fromGeometry(_this.backgroundGeometry);
        material = new THREE.PointCloudMaterial({
          light: false,
          lights: false,
          depthTest: false,
          transparent: true,
          map: map,
          color: 0xFFFFFF,
          size: 64,
          sizeAttenuation: true,
          fog: false,
          opacity: 0
        });
        TweenLite.to(material, 1.5, {
          opacity: .1
        });
        _this.pointcloud = new THREE.PointCloud(_this.bufferGeometry, material);
        _this.pointcloud.position.z -= 945.999;
        _this.pointcloud.position.y += 10;
        return Stage3d.add(_this.pointcloud, true);
      };
    })(this);
    image.src = './3d/textures/circle.png';
  };

  Scene3d.prototype.createParticles = function() {
    var geometry, i, material, phi, radius, theta, triangles, vertices, x, y, z, _i, _ref;
    geometry = new THREE.BufferGeometry();
    triangles = 400;
    if (isMobile.any) {
      triangles = 100;
    }
    vertices = new THREE.BufferAttribute(new Float32Array(triangles * 3 * 3), 3);
    for (i = _i = 0, _ref = vertices.length; _i < _ref; i = _i += 1) {
      if (i % 3 === 0) {
        phi = Math.PI * 2 * Math.random();
        theta = Math.PI * 2 * Math.random();
        radius = 60 + Math.random() * 60;
      }
      x = radius * Math.sin(phi) * Math.cos(theta) + Math.random() * 2;
      y = radius * Math.cos(phi) + Math.random() * 2;
      z = radius * 0.8 * Math.sin(phi) * Math.sin(theta) + Math.random() * 2 - 30;
      vertices.setXYZ(i, x, y, z);
    }
    geometry.addAttribute('position', vertices);
    material = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: .1,
      fog: false
    });
    this.particles = new THREE.Mesh(geometry, material);
    Stage3d.add(this.particles);
  };

  Scene3d.prototype.createLight = function() {
    this.ambientLight = new THREE.AmbientLight(0);
    this.ambientLight2 = new THREE.AmbientLight(0xFFFFFF);
    this.cameraLight = new THREE.PointLight(0x1a3a9a, 1.5, 2000);
    this.cameraLight.position.set(0, -1000, 0);
    this.cameraLight2 = new THREE.PointLight(0x2211aa, 1, 2400);
    this.cameraLight2.position.set(-1500, 0, 0);
    this.cameraLight3 = new THREE.PointLight(0x2233aa, 0.4, 2400);
    this.cameraLight3.position.set(1000, 0, 0);
    this.cameraLight4 = new THREE.PointLight(0x222277, 1.7, 2400);
    this.cameraLight4.position.set(0, 1000, 0);
    Stage3d.add(this.ambientLight);
    Stage3d.add(this.cameraLight);
    Stage3d.add(this.cameraLight2);
    Stage3d.add(this.cameraLight3);
    Stage3d.add(this.cameraLight4);
    Stage3d.add(this.ambientLight2, false);
  };

  Scene3d.prototype.createGrids1 = function() {
    var i, p, v, _i;
    p = this.positions.grid1 = {
      fragments: [],
      diamond: this.diamond.position.clone(),
      mirror: this.mirror.position.clone()
    };
    for (i = _i = 0; _i < 24; i = _i += 1) {
      v = new THREE.Vector3();
      v.x = (-7 * ((i + 1) % 5)) + 13;
      v.y = Math.floor((i + 1) / 5) * 7 - 20.5;
      v.z = 0;
      p.fragments.push(v);
    }
    p.diamond.y += 35;
    p.mirror.y += 35;
  };

  Scene3d.prototype.createGrids2 = function() {
    var i, p, v, _i;
    p = this.positions.grid2 = {
      fragments: [],
      diamond: this.diamond.position.clone(),
      mirror: this.mirror.position.clone()
    };
    p.diamond.copy(this.positions.base.diamond);
    p.mirror.copy(this.positions.base.mirror);
    p.diamond.y += 3;
    p.mirror.y += 3;
    for (i = _i = 0; _i < 24; i = _i += 1) {
      v = new THREE.Vector3();
      v.x = (-6 * (i % 12)) + 32;
      v.y = Math.floor(i / 12) * 7 - 17;
      v.z = 5;
      p.fragments.push(v);
    }
  };

  Scene3d.prototype.createGrids3 = function() {
    var i, p, v, _i;
    p = this.positions.grid3 = {
      fragments: [],
      diamond: this.diamond.position.clone(),
      mirror: this.mirror.position.clone()
    };
    for (i = _i = 0; _i < 24; i = _i += 1) {
      v = new THREE.Vector3();
      v.x = (-9 * ((i + 1) % 5)) + 15;
      v.y = Math.floor((i + 1) / 5) * 9 - 16.5;
      v.z = 0;
      p.fragments.push(v);
    }
  };

  Scene3d.prototype.createGrids4 = function() {
    var angle, angleStep, i, p, radius, v, _i;
    p = this.positions.grid4 = {
      fragments: [],
      diamond: this.diamond.position.clone(),
      mirror: this.mirror.position.clone()
    };
    angle = Math.PI / 2;
    angleStep = Math.PI * 2 / 24;
    radius = 22;
    for (i = _i = 0; _i < 24; i = _i += 1) {
      v = new THREE.Vector3();
      v.x = Math.cos(angle) * (radius + Math.sin(angle * 8) * 5);
      v.y = Math.sin(angle) * (radius + Math.sin(angle * 8) * 5);
      v.z = 0;
      angle += angleStep;
      p.fragments.push(v);
    }
  };

  Scene3d.prototype.createPortraitPosition = function() {
    var i, p, v, _i;
    p = this.positions.portrait = {
      fragments: [],
      diamond: this.diamond.position.clone(),
      mirror: this.mirror.position.clone()
    };
    for (i = _i = 0; _i < 24; i = _i += 1) {
      v = this.fragments[i].position.clone();
      v.x *= .75;
      v.y *= 1.3;
      p.fragments.push(v);
    }
  };

  Scene3d.prototype.createMobilePosition = function() {
    var i, p, v, _i;
    p = this.positions.mobile = {
      fragments: [],
      diamond: this.diamond.position.clone(),
      mirror: this.mirror.position.clone()
    };
    for (i = _i = 0; _i < 24; i = _i += 1) {
      v = new THREE.Vector3();
      v.x = (30 * ((i + 1) % 2)) - 15;
      v.y = (12 - Math.floor(i / 2)) * -20 + 10;
      v.z = 0;
      p.fragments.push(v);
    }
    p.diamond.y += 20;
    p.mirror.y += 20;
  };

  Scene3d.prototype.addEvent = function() {
    var map;
    window.addEventListener('mousemove', (function(_this) {
      return function(e) {
        _this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        return _this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      };
    })(this), false);
    window.addEventListener('touchmove', (function(_this) {
      return function(e) {
        if (e.changedTouches && e.changedTouches.length > 0) {
          _this.mouse.x = (e.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
          return _this.mouse.y = -(e.changedTouches[0].clientY / window.innerHeight) * 2 + 1;
        } else if (e.touches && e.touches.length > 0) {
          _this.mouse.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
          return _this.mouse.y = -(e.touches[0].clientX.clientY / window.innerHeight) * 2 + 1;
        }
      };
    })(this), false);
    if (!isMobile.any) {
      window.addEventListener('click', (function(_this) {
        return function(e) {
          var frag, intersects, raycaster, vector;
          if (!_this.isActivate) {
            return;
          }
          _this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
          _this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
          vector = new THREE.Vector3(_this.mouse.x, _this.mouse.y, .5);
          vector.unproject(Stage3d.camera);
          raycaster = new THREE.Raycaster(Stage3d.camera.position, vector.sub(Stage3d.camera.position).normalize());
          if (_this.hitboxs) {
            intersects = raycaster.intersectObjects(_this.hitboxs, false);
            if (intersects.length > 0) {
              frag = intersects[0].object.fragment;
              _this.currentFragment = frag;
              return _this.gotoXP(frag.name);
            } else if (_this.diamond && _this.mirror) {
              intersects = raycaster.intersectObjects([_this.diamond, _this.mirror], false);
              if (intersects.length > 0) {
                if (_this.currentFragment) {
                  return _this.gotoXP(_this.currentFragment.name);
                } else if (_this.lastFragment) {
                  return _this.gotoXP(_this.lastFragment.name);
                }
              }
            }
          }
        };
      })(this), false);
    }
    window.addEventListener('touchend', (function(_this) {
      return function(e) {
        var frag, intersects, raycaster, vector;
        if (!_this.isActivate) {
          return;
        }
        if (e.changedTouches && e.changedTouches.length > 0) {
          _this.mouse.x = (e.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
          _this.mouse.y = -(e.changedTouches[0].clientY / window.innerHeight) * 2 + 1;
        } else if (e.touches && e.touches.length > 0) {
          _this.mouse.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
          _this.mouse.y = -(e.touches[0].clientX.clientY / window.innerHeight) * 2 + 1;
        }
        vector = new THREE.Vector3(_this.mouse.x, _this.mouse.y, .5);
        vector.unproject(Stage3d.camera);
        raycaster = new THREE.Raycaster(Stage3d.camera.position, vector.sub(Stage3d.camera.position).normalize());
        if (_this.hitboxs) {
          intersects = raycaster.intersectObjects(_this.hitboxs, false);
          if (intersects.length > 0) {
            frag = intersects[0].object.fragment;
            _this.currentFragment = frag;
            return _this.showXP(frag.name);
          } else if (_this.diamond && _this.mirror) {
            intersects = raycaster.intersectObjects([_this.diamond, _this.mirror], false);
            if (intersects.length > 0) {
              if (_this.currentFragment) {
                return _this.gotoXP(_this.currentFragment.name);
              } else if (_this.lastFragment) {
                return _this.gotoXP(_this.lastFragment.name);
              }
            }
          }
        }
      };
    })(this), false);
    if (window.DeviceMotionEvent !== void 0) {
      map = (function(_this) {
        return function(num, min1, max1, min2, max2, round) {
          var num1, num2;
          num1 = (num - min1) / (max1 - min1);
          num2 = (num1 * (max2 - min2)) + min2;
          return num2;
        };
      })(this);
      return window.ondevicemotion = (function(_this) {
        return function(evt) {
          var ax, ay, mx, my;
          if (!_this.isActivate) {
            return;
          }
          ax = event.accelerationIncludingGravity.x;
          ay = event.accelerationIncludingGravity.y;
          if (ax >= 5) {
            ax = 5;
          } else if (ax <= -5) {
            ax = -5;
          }
          if (ay >= 6) {
            ay = 6;
          } else if (ay <= -6) {
            ay = -6;
          }
          mx = map(ax, 5, -5, 0, window.innerWidth);
          my = map(ay, 6, -6, 0, window.innerHeight);
          _this.mouse.x = (mx / window.innerWidth) * 2 - 1;
          _this.mouse.y = (my / window.innerHeight) * 2 - 1;
        };
      })(this);
    }
  };

  Scene3d.prototype.onDiamondLoad = function(geometry) {
    var folder, material, matrix;
    this.computeGeometry(geometry);
    material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      transparent: true,
      light: false,
      envMap: this.envMap,
      depthWrite: true,
      depthTest: true
    });
    material.map = this.map;
    if (isMobile.any) {
      material.envMap = null;
    }
    material.shading = this.shading;
    material.opacity = 0.0;
    material.side = THREE.DoubleSide;
    material.combine = THREE.MixOperation;
    material.reflectivity = 0.7;
    matrix = new THREE.Matrix4();
    matrix.makeScale(.23, .23, .23);
    geometry.applyMatrix(matrix);
    this.diamond = new THREE.Mesh(geometry, material);
    this.container.add(this.diamond);
    if (this.debug) {
      folder = this.gui.addFolder('diamond');
      folder.add(material, 'depthWrite');
      folder.add(material, 'depthTest');
      folder.add(material, 'opacity', 0.001, 1.0).step(0.001);
      folder.add(material, 'reflectivity', 0.001, 1.0).step(0.001);
      this.diamondColor = 0xffffff;
      folder.add(this.diamond.material, 'combine', {
        multiply: THREE.Multiply,
        mix: THREE.MixOperation,
        add: THREE.AddOperation
      });
      folder.addColor(this, 'diamondColor').onChange((function(_this) {
        return function() {
          return _this.diamond.material.color.setHex(_this.diamondColor);
        };
      })(this));
    }
    this.diamond.scale.set(0.8, 0.8, 0.8);
    TweenLite.to(this.diamond.material, .8, {
      ease: Quad.easeIn,
      opacity: .4
    });
    TweenLite.to(this.diamond.scale, .8, {
      ease: Quad.easeOut,
      x: 1,
      y: 1,
      z: 1
    });
    this.positions.base.diamond = this.diamond.position.clone();
  };

  Scene3d.prototype.onMirrorLoad = function(geometry) {
    var folder, material, matrix;
    this.computeGeometry(geometry);
    matrix = new THREE.Matrix4();
    matrix.makeScale(.23, .23, .23);
    geometry.applyMatrix(matrix);
    material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      light: false,
      transparent: true,
      envMap: this.envMap,
      depthWrite: true,
      depthTest: true
    });
    if (isMobile.any) {
      material.envMap = null;
    }
    material.map = this.map;
    material.shading = this.shading;
    material.side = THREE.DoubleSide;
    material.combine = THREE.AddOperation;
    material.reflectivity = 0.2;
    material.opacity = 0.0;
    this.mirror = new THREE.Mesh(geometry, material);
    this.container.add(this.mirror);
    if (this.debug) {
      folder = this.gui.addFolder('mirror');
      folder.add(this.mirror.material, 'depthWrite');
      folder.add(this.mirror.material, 'depthTest');
      folder.add(this.mirror.material, 'opacity', 0.01, 1.0).step(0.01);
      folder.add(this.mirror.material, 'reflectivity', 0.01, 1.0).step(0.01);
      this.mirrorColor = 0xffffff;
      folder.add(this.mirror.material, 'combine', {
        multiply: THREE.Multiply,
        mix: THREE.MixOperation,
        add: THREE.AddOperation
      });
      folder.addColor(this, 'mirrorColor').onChange((function(_this) {
        return function() {
          return _this.mirror.material.color.setHex(_this.mirrorColor);
        };
      })(this));
    }
    this.mirror.scale.set(0.8, 0.8, 0.8);
    TweenLite.to(this.mirror.material, .8, {
      ease: Quad.easeIn,
      opacity: .5
    });
    TweenLite.to(this.mirror.scale, .8, {
      ease: Quad.easeOut,
      x: 1,
      y: 1,
      z: 1
    });
    this.positions.base.mirror = this.mirror.position.clone();
  };

  Scene3d.prototype.onFragmentLoaded = function(scene) {
    var d, delay, duration, hitbox, hitboxGeo, hitboxMaterial, i, k, material, matrix, o, v, _i, _ref;
    this.fragments = [];
    this.hitboxs = [];
    hitboxGeo = new THREE.SphereGeometry(4);
    hitboxMaterial = new THREE.MeshBasicMaterial({
      color: 0,
      wireframe: true,
      opacity: .3,
      transparent: true
    });
    this.basePosition = [];
    d = 0;
    _ref = scene.objects;
    for (k in _ref) {
      v = _ref[k];
      d += 0.025;
      o = v;
      o.name = o.name.substring(o.name.length - 2);
      this.computeGeometry(o.geometry);
      material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        transparent: true,
        depthWrite: true,
        depthTest: true
      });
      if (isMobile.any) {
        material.envMap = null;
      }
      material.shading = this.shading;
      material.side = THREE.DoubleSide;
      material.combine = THREE.AddOperation;
      material.reflectivity = .41;
      material.opacity = 0;
      o.material = material;
      matrix = new THREE.Matrix4();
      matrix.makeScale(.2, .2, .2);
      o.geometry.applyMatrix(matrix);
      o.position.multiplyScalar(.21);
      o.position.x *= 1.1;
      o.position.y -= 20;
      o.position.z += 5;
      delay = Math.random() * .6;
      duration = .6 + Math.random() * .6;
      if (parseInt(o.name) > this.maxDate) {
        TweenLite.to(o.material, duration, {
          opacity: .1,
          delay: delay
        });
      } else {
        TweenLite.to(o.material, duration, {
          opacity: .8,
          delay: delay
        });
      }
      o.scale.set(1.4, 1.4, 1.4);
      TweenLite.to(o.scale, duration, {
        x: 1,
        y: 1,
        z: 1,
        delay: delay
      });
      hitbox = new THREE.Mesh(hitboxGeo, hitboxMaterial);
      hitbox.position.copy(o.position);
      hitbox.visible = this.hitboxVisible;
      hitbox.fragment = o;
      this.hitboxs.push(hitbox);
      Stage3d.add(hitbox);
      this.positions.base.fragments.push(o.position.clone());
      this.computeGeometry(o.geometry);
      this.fragments.push(o);
      if (parseInt(o.name) <= this.maxDate && this.lastFragment === void 0) {
        this.lastFragment = this.currentFragment = o;
      }
      Stage3d.add(o, false);
    }
    for (i = _i = 0; _i < 24; i = _i += 1) {
      this.currentPosition.fragments[i].copy(this.hitboxs[i].position);
    }
    this.position = this.basePosition;
    this.createGrids1();
    this.createGrids2();
    this.createGrids3();
    this.createGrids4();
    this.createMobilePosition();
    this.createPortraitPosition();
    this.resize();
  };

  Scene3d.prototype.createGUI = function() {
    var frag, global, lights, positions;
    this.gui = new dat.GUI();
    this.textures = null;
    this.maps = [];
    this.envMaps = [];
    global = this.gui.addFolder('global');
    global.add(this, 'backgroundFix');
    global.add(this, 'cameraMoveY');
    global.add(this, 'cameraMoveYScale', -3, 3).step(0.01);
    global.add(this, 'containerMovY');
    global.add(this, 'containerMovYScale', -2, 2).step(0.01);
    global.add(this, 'offsetX', -30, 30).step(0.1);
    positions = this.gui.addFolder('positions');
    positions.add(this, 'noGrid');
    positions.add(this, 'grid1');
    positions.add(this, 'grid2');
    positions.add(this, 'grid3');
    positions.add(this, 'grid4');
    positions.add(this, 'portrait');
    positions.add(this, 'mobile');
    frag = this.gui.addFolder('fragments');
    frag.add(this, 'movementScale', 0, 2);
    frag.add(this, 'speedScale', 0, 2);
    frag.add(this, 'hitboxVisible').onChange((function(_this) {
      return function(e) {
        var i, _i, _results;
        _results = [];
        for (i = _i = 0; _i < 24; i = _i += 1) {
          _results.push(_this.hitboxs[i].visible = _this.hitboxVisible);
        }
        return _results;
      };
    })(this));
    lights = this.gui.addFolder('lights');
    this.colorAmbient = this.ambientLight.color.getHex();
    lights.addColor(this, 'colorAmbient').onChange((function(_this) {
      return function() {
        return _this.ambientLight.color.setHex(_this.colorAmbient);
      };
    })(this));
    this.light1 = this.cameraLight.color.getHex();
    lights.addColor(this, 'light1').onChange((function(_this) {
      return function() {
        if (_this.light1) {
          return _this.cameraLight.color.setHex(_this.light1);
        } else {
          return _this.light1 = _this.cameraLight.color.getHex();
        }
      };
    })(this));
    lights.add(this.cameraLight, 'intensity', 0, 3).step(0.01).name('intensity 1');
    this.light2 = this.cameraLight2.color.getHex();
    lights.addColor(this, 'light2').onChange((function(_this) {
      return function() {
        if (_this.light2) {
          return _this.cameraLight2.color.setHex(_this.light2);
        } else {
          return _this.light2 = _this.cameraLight2.color.getHex();
        }
      };
    })(this));
    lights.add(this.cameraLight2, 'intensity', 0, 3).step(0.01).name('intensity 2');
    this.light3 = this.cameraLight3.color.getHex();
    lights.addColor(this, 'light3').onChange((function(_this) {
      return function() {
        if (_this.light3) {
          return _this.cameraLight3.color.setHex(_this.light3);
        } else {
          return _this.light3 = _this.cameraLight3.color.getHex();
        }
      };
    })(this));
    lights.add(this.cameraLight3, 'intensity', 0, 3).step(0.01).name('intensity 3');
    this.light4 = this.cameraLight4.color.getHex();
    lights.addColor(this, 'light4').onChange((function(_this) {
      return function() {
        if (_this.light4) {
          return _this.cameraLight4.color.setHex(_this.light4);
        } else {
          return _this.light4 = _this.cameraLight4.color.getHex();
        }
      };
    })(this));
    lights.add(this.cameraLight4, 'intensity', 0, 3).step(0.01).name('intensity 4');
  };

  Scene3d.prototype.tweenTo = function(positions) {
    var i, v, v2, _i;
    for (i = _i = 0; _i < 24; i = _i += 1) {
      v = this.currentPosition.fragments[i];
      v2 = positions.fragments[i];
      TweenLite.to(v, .8 + Math.random() * .3, {
        x: v2.x,
        y: v2.y,
        z: v2.z,
        ease: Back.easeOut
      });
    }
    TweenLite.to(this.currentPosition.diamond, 1.4, {
      x: positions.diamond.x,
      y: positions.diamond.y,
      z: positions.diamond.z,
      ease: Expo.easeOut
    });
    TweenLite.to(this.currentPosition.mirror, 1.4, {
      x: positions.mirror.x,
      y: positions.mirror.y,
      z: positions.mirror.z,
      ease: Expo.easeOut
    });
  };

  Scene3d.prototype.noGrid = function() {
    this.tweenTo(this.positions.base);
  };

  Scene3d.prototype.grid1 = function() {
    this.tweenTo(this.positions.grid1);
  };

  Scene3d.prototype.grid2 = function() {
    this.tweenTo(this.positions.grid2);
  };

  Scene3d.prototype.grid3 = function() {
    this.tweenTo(this.positions.grid3);
  };

  Scene3d.prototype.grid4 = function() {
    this.tweenTo(this.positions.grid4);
  };

  Scene3d.prototype.portrait = function() {
    this.tweenTo(this.positions.portrait);
  };

  Scene3d.prototype.mobile = function() {
    this.tweenTo(this.positions.mobile);
  };

  Scene3d.prototype.addZero = function(number, minLength) {
    number = number + "";
    while (number.length < minLength) {
      number = "0" + number;
    }
    return number;
  };

  Scene3d.prototype.computeGeometry = function(geometry) {
    geometry.computeBoundingSphere();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.computeTangents();
    geometry.computeMorphNormals();
    geometry.verticesNeedUpdate = true;
    geometry.normalsNeedUpdate = true;
  };

  Scene3d.prototype.showXP = function(index) {
    if (parseInt(index) > this.maxDate) {
      return;
    }
    if (index === this.currentIndex) {
      return;
    }
    if (!this.isOver) {
      this.isOver = true;
      this.emit("over", parseInt(index));
    }
    this.currentIndex = index;
    this.globalAlpha = 0.01;
  };

  Scene3d.prototype.gotoXP = function(index) {
    if (parseInt(index) > this.maxDate) {
      return;
    }
    window.location = "./experiments/" + parseInt(index);
  };

  Scene3d.prototype.pause = function() {};

  Scene3d.prototype.resume = function() {};

  Scene3d.prototype.update = function(dt) {
    var distance, dx, dy, dz, f, frag, geometry, i, idx, intersects, raycaster, s, speeds, t, v, vector, _i, _j, _k, _l, _ref, _ref1, _ref2, _ref3;
    if (!this.isActivate) {
      return;
    }
    this.time += dt;
    if (this.isImgReady) {
      this.ctx.globalAlpha = this.globalAlpha;
      this.globalAlpha += .01;
      if (this.globalAlpha < 1.1) {
        idx = parseInt(this.currentIndex) - 1;
        if (idx <= this.maxDate) {
          this.ctx.drawImage(this.images[idx], 0, 0);
          this.map.needsUpdate = true;
          this.envMap.needsUpdate = true;
        }
      }
    }
    t = this.time;
    if (this.diamond && this.currentPosition.diamond) {
      this.diamond.position.copy(this.currentPosition.diamond);
      this.diamond.position.x += this.offsetX;
      this.diamond.position.y -= this.offsetY;
    }
    if (this.particles) {
      this.particles.position.x = 10;
    }
    if (this.mirror && this.currentPosition.mirror) {
      this.mirror.position.copy(this.currentPosition.mirror);
      this.mirror.position.x += this.offsetX;
      this.mirror.position.y -= this.offsetY;
    }
    if (this.mirror && this.diamond) {
      s = 1 + Math.cos(t / 1250) * .02;
      this.diamond.scale.set(s, s, s);
      this.diamond.position.y += Math.sin(t / 1500) * .5;
      this.mirror.scale.set(s, s, s);
      this.mirror.position.y += Math.sin(t / 1500) * .5;
    }
    for (i = _i = 0, _ref = this.hitboxs.length; _i < _ref; i = _i += 1) {
      distance = new THREE.Vector3();
      dx = this.currentPosition.fragments[i].x - this.diamond.position.x;
      dy = this.currentPosition.fragments[i].y - this.diamond.position.y;
      dz = this.currentPosition.fragments[i].z - this.diamond.position.z;
      distance.set(Math.sqrt(dx * dx), Math.sqrt(dy * dy), Math.sqrt(dz * dz));
      this.hitboxs[i].position.copy(this.currentPosition.fragments[i]);
      if (distance.x < 28.5) {
        this.hitboxs[i].position.z = Math.max(this.hitboxs[i].position.z, 15);
      } else if (distance.x < 100) {
        this.hitboxs[i].position.z = Math.max(this.hitboxs[i].position.z, (1 - (distance.x - 10.5) / 10.5) * 15 + 2);
      }
      this.hitboxs[i].position.x += this.offsetX;
      this.hitboxs[i].position.y -= this.offsetY;
    }
    t = this.time;
    for (i = _j = 0, _ref1 = this.fragments.length; _j < _ref1; i = _j += 1) {
      t += 747;
      this.fragments[i].position.y = this.hitboxs[i].position.y + Math.sin(t / 350 * this.speedScale) * 1.1 * this.movementScale;
      this.fragments[i].position.x = this.hitboxs[i].position.x + Math.cos(t / 450 * this.speedScale) * .5 * this.movementScale;
      this.fragments[i].position.z = this.hitboxs[i].position.z;
    }
    vector = new THREE.Vector3(this.mouse.x, this.mouse.y, .5);
    vector.unproject(Stage3d.camera);
    raycaster = new THREE.Raycaster(Stage3d.camera.position, vector.sub(Stage3d.camera.position).normalize());
    if (this.hitboxs) {
      intersects = raycaster.intersectObjects(this.hitboxs, false);
      if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        frag = intersects[0].object.fragment;
        if (parseInt(frag.name) <= this.maxDate) {
          if (frag !== this.lastFragment && this.isOver) {
            this.isOver = false;
            this.emit("out");
          }
          this.lastFragment = this.currentFragment = frag;
          if (!this.isOver || this.lastRollOnDiamand) {
            this.lastRollOnDiamand = false;
            this.showXP(frag.name);
          }
        }
      } else if (this.diamond && this.mirror) {
        intersects = raycaster.intersectObjects([this.diamond, this.mirror], false);
        if (intersects.length > 0) {
          this.lastRollOnDiamand = true;
          if (this.currentFragment) {
            this.showXP(this.currentFragment.name);
          } else if (this.lastFragment) {
            this.showXP(this.lastFragment.name);
          }
          document.body.style.cursor = 'pointer';
        } else {
          if (this.isOver) {
            this.isOver = false;
            this.emit("out");
          }
          document.body.style.cursor = 'auto';
          this.currentFragment = null;
        }
      } else if (this.isOver) {
        this.isOver = false;
        this.emit("out");
        document.body.style.cursor = 'auto';
        this.currentFragment = null;
      }
    }
    if (this.currentFragment && this.isOver) {
      this.currentFragment.scale.x += (1.2 - this.currentFragment.scale.x) * .05;
      this.currentFragment.scale.y = this.currentFragment.scale.x;
      this.currentFragment.scale.z = this.currentFragment.scale.x;
    }
    for (i = _k = 0, _ref2 = this.fragments.length; _k < _ref2; i = _k += 1) {
      f = this.fragments[i];
      if (f !== this.currentFragment) {
        f.scale.x += (1 - f.scale.x) * .09;
        f.scale.y = f.scale.x;
        f.scale.z = f.scale.x;
      }
    }
    if (this.backgroundGeometry) {
      geometry = this.backgroundGeometry;
      if (this.bufferGeometry) {
        this.bufferGeometry.fromGeometry(this.backgroundGeometry);
      }
      speeds = [800, 700, 1200];
      for (i = _l = 0, _ref3 = geometry.vertices.length; _l < _ref3; i = _l += 1) {
        v = geometry.vertices[i];
        v.z += Math.cos(this.time / speeds[i % speeds.length] + Math.PI / 16 * i) * 2;
      }
      geometry.computeTangents();
      geometry.computeVertexNormals();
      geometry.computeFaceNormals();
      geometry.computeVertexNormals();
      geometry.computeTangents();
      geometry.verticesNeedUpdate = true;
      geometry.normalsNeedUpdate = true;
      geometry.elementsNeedUpdate = true;
      geometry.tangentsNeedUpdate = true;
    }
    Stage3d.camera.position.x += (this.mouse.x * 30 - Stage3d.camera.position.x) * .03;
    if (this.cameraMoveY) {
      Stage3d.camera.position.y += (this.mouse.y * this.cameraMoveYScale + 18 - Stage3d.camera.position.y) * .03;
    }
    if (this.containerMovY) {
      this.container.rotation.x += (this.mouse.y * Math.PI / 16 * this.containerMovYScale - this.container.rotation.x) * .09;
    }
    if (this.backgroundFix) {
      if (this.backgroundFlat) {
        vector = new THREE.Vector3(1, 1, -1000);
        vector.applyQuaternion(Stage3d.camera.quaternion);
        this.backgroundFlat.position.copy(vector);
        this.backgroundFlat.lookAt(Stage3d.camera.position);
        vector = new THREE.Vector3(1, 1, -950);
        vector.applyQuaternion(Stage3d.camera.quaternion);
        this.backgroundLine.position.copy(vector);
        this.backgroundLine.position.y += 10;
        this.backgroundLine.lookAt(Stage3d.camera.position);
        vector = new THREE.Vector3(1, 1, 1);
        vector.applyQuaternion(Stage3d.camera.quaternion);
        this.lightContainer.position.copy(vector);
        this.lightContainer.lookAt(Stage3d.camera.position);
      }
      if (this.pointcloud) {
        vector = new THREE.Vector3(1, 1, -945);
        vector.applyQuaternion(Stage3d.camera.quaternion);
        this.pointcloud.position.copy(vector);
        this.pointcloud.lookAt(Stage3d.camera.position);
      }
    }
  };

  Scene3d.prototype.resize = function() {
    if (window.innerWidth <= 640) {
      this.offsetX = 0;
      this.offsetY = 10;
    } else {
      this.offsetX = 10;
      this.offsetY = -5;
    }
    if (window.innerWidth <= 600) {
      return this.grid1();
    } else if (window.innerWidth <= 704) {
      return this.grid4();
    } else {
      return this.setGrid(this.isGrid);
    }
  };

  return Scene3d;

})(Emitter);

module.exports = Scene3d;



},{"3d/Stage3d":5,"common/nav":9,"data.json":2}],5:[function(require,module,exports){
var Scene3d, Stage3d;

Scene3d = require("home/Home");

Stage3d = (function() {
  function Stage3d() {}

  Stage3d.camera = null;

  Stage3d.cameraTarget = null;

  Stage3d.scene = null;

  Stage3d.renderer = null;

  Stage3d.init = function(options) {
    var antialias, h, transparent, w;
    w = window.innerWidth;
    h = window.innerHeight;
    if (isMobile.any) {
      w /= 2;
      h /= 2;
    }
    this.camera = new THREE.PerspectiveCamera(45, w / h, 1, 10000);
    this.camera.position.set(0, 20, 100);
    this.scene = new THREE.Scene();
    this.sceneNoLight = new THREE.Scene();
    transparent = options.transparent || false;
    antialias = options.antialias || false;
    this.bgColor = 0x000000;
    this.sunColor = 0xFF00FF;
    this.godRayIntensity = .15;
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: antialias,
      transparent: false
    });
    this.renderer.setSize(w, h);
    this.renderer.autoClear = false;
    this.renderer.sortObjects = false;
    this.renderer.setClearColor(this.bgColor, 0);
    this.renderer.domElement.className = 'home3d';
    if (isMobile.any) {
      this.renderer.domElement.style.width = Math.ceil(w * 2) + 'px';
      this.renderer.domElement.style.height = Math.ceil(h * 2) + 'px';
    }
    document.body.appendChild(this.renderer.domElement);
  };

  Stage3d.add = function(obj, light) {
    if (light == null) {
      light = true;
    }
    if (light) {
      Stage3d.scene.add(obj);
    } else {
      Stage3d.sceneNoLight.add(obj);
    }
  };

  Stage3d.remove = function(obj) {
    Stage3d.scene.remove(obj);
  };

  Stage3d.render = function() {
    var TAPS_PER_PASS, filterLen, pass, stepLen, sunsqH, sunsqW;
    Stage3d.camera.lookAt(new THREE.Vector3(0, Stage3d.camera.position.y - 20, 0));
    if (Stage3d.postprocessing) {
      Stage3d.renderer.setClearColor(Stage3d.bgColor, 1);
      Stage3d.postprocessing.godraysFakeSunUniforms.bgColor.value.setHex(Stage3d.bgColor);
      Stage3d.postprocessing.godraysFakeSunUniforms.sunColor.value.setHex(Stage3d.sunColor);
      Stage3d.postprocessing.godrayCombineUniforms.fGodRayIntensity.value = Stage3d.godRayIntensity;
      Stage3d.screenSpacePosition.copy(Stage3d.sunPosition).project(Stage3d.camera);
      Stage3d.screenSpacePosition.x = (Stage3d.screenSpacePosition.x + 1) / 2;
      Stage3d.screenSpacePosition.y = (Stage3d.screenSpacePosition.y + 1) / 2;
      Stage3d.postprocessing.godrayGenUniforms["vSunPositionScreenSpace"].value.x = Stage3d.screenSpacePosition.x;
      Stage3d.postprocessing.godrayGenUniforms["vSunPositionScreenSpace"].value.y = Stage3d.screenSpacePosition.y;
      Stage3d.postprocessing.godraysFakeSunUniforms["vSunPositionScreenSpace"].value.x = Stage3d.screenSpacePosition.x;
      Stage3d.postprocessing.godraysFakeSunUniforms["vSunPositionScreenSpace"].value.y = Stage3d.screenSpacePosition.y;
      Stage3d.renderer.clearTarget(Stage3d.postprocessing.rtTextureColors, true, true, false);
      sunsqH = 0.84 * window.innerHeight;
      sunsqW = 0.84 * window.innerHeight;
      Stage3d.screenSpacePosition.x *= window.innerWidth;
      Stage3d.screenSpacePosition.y *= window.innerHeight;
      Stage3d.renderer.setScissor(Stage3d.screenSpacePosition.x - sunsqW / 2, Stage3d.screenSpacePosition.y - sunsqH / 2, sunsqW, sunsqH);
      Stage3d.postprocessing.godraysFakeSunUniforms["fAspect"].value = window.innerWidth / window.innerHeight;
      Stage3d.postprocessing.scene.overrideMaterial = Stage3d.postprocessing.materialGodraysFakeSun;
      Stage3d.renderer.render(Stage3d.postprocessing.scene, Stage3d.postprocessing.camera, Stage3d.postprocessing.rtTextureColors);
      Stage3d.renderer.enableScissorTest(false);
      Stage3d.scene.overrideMaterial = null;
      Stage3d.renderer.render(Stage3d.scene, Stage3d.camera, Stage3d.postprocessing.rtTextureColors);
      Stage3d.scene.overrideMaterial = Stage3d.materialDepth;
      Stage3d.renderer.render(Stage3d.scene, Stage3d.camera, Stage3d.postprocessing.rtTextureDepth, true);
      filterLen = 1.0;
      TAPS_PER_PASS = 6.0;
      pass = 1.0;
      stepLen = filterLen * Math.pow(TAPS_PER_PASS, -pass);
      Stage3d.postprocessing.godrayGenUniforms["fStepSize"].value = stepLen;
      Stage3d.postprocessing.godrayGenUniforms["tInput"].value = Stage3d.postprocessing.rtTextureDepth;
      Stage3d.postprocessing.scene.overrideMaterial = Stage3d.postprocessing.materialGodraysGenerate;
      Stage3d.renderer.render(Stage3d.postprocessing.scene, Stage3d.postprocessing.camera, Stage3d.postprocessing.rtTextureGodRays2);
      pass = 2.0;
      stepLen = filterLen * Math.pow(TAPS_PER_PASS, -pass);
      Stage3d.postprocessing.godrayGenUniforms["fStepSize"].value = stepLen;
      Stage3d.postprocessing.godrayGenUniforms["tInput"].value = Stage3d.postprocessing.rtTextureGodRays2;
      Stage3d.renderer.render(Stage3d.postprocessing.scene, Stage3d.postprocessing.camera, Stage3d.postprocessing.rtTextureGodRays1);
      pass = 3.0;
      stepLen = filterLen * Math.pow(TAPS_PER_PASS, -pass);
      Stage3d.postprocessing.godrayGenUniforms["fStepSize"].value = stepLen;
      Stage3d.postprocessing.godrayGenUniforms["tInput"].value = Stage3d.postprocessing.rtTextureGodRays1;
      Stage3d.renderer.render(Stage3d.postprocessing.scene, Stage3d.postprocessing.camera, Stage3d.postprocessing.rtTextureGodRays2);
      Stage3d.postprocessing.godrayCombineUniforms["tColors"].value = Stage3d.postprocessing.rtTextureColors;
      Stage3d.postprocessing.godrayCombineUniforms["tGodRays"].value = Stage3d.postprocessing.rtTextureGodRays2;
      Stage3d.postprocessing.scene.overrideMaterial = Stage3d.postprocessing.materialGodraysCombine;
      Stage3d.renderer.render(Stage3d.postprocessing.scene, Stage3d.postprocessing.camera);
      Stage3d.postprocessing.scene.overrideMaterial = null;
    } else {
      Stage3d.renderer.clear();
      Stage3d.renderer.render(Stage3d.scene, Stage3d.camera);
      Stage3d.renderer.render(Stage3d.sceneNoLight, Stage3d.camera);
    }
  };

  Stage3d.initPostprocessing = function(gui) {
    var godray, godraysCombineShader, godraysFakeSunShader, godraysGenShader, h, pars, w;
    Stage3d.materialDepth = new THREE.MeshDepthMaterial();
    Stage3d.sunPosition = new THREE.Vector3(0, -10, -100);
    Stage3d.screenSpacePosition = new THREE.Vector3();
    Stage3d.postprocessing = {
      enabled: false
    };
    Stage3d.postprocessing.scene = new THREE.Scene();
    Stage3d.postprocessing.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -10000, 10000);
    Stage3d.postprocessing.camera.position.z = 100;
    Stage3d.postprocessing.scene.add(Stage3d.postprocessing.camera);
    pars = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat
    };
    Stage3d.postprocessing.rtTextureColors = new THREE.WebGLRenderTarget(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, pars);
    Stage3d.postprocessing.rtTextureDepth = new THREE.WebGLRenderTarget(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, pars);
    w = window.innerWidth / 2.0;
    h = window.innerHeight / 2.0;
    Stage3d.postprocessing.rtTextureGodRays1 = new THREE.WebGLRenderTarget(w, h, pars);
    Stage3d.postprocessing.rtTextureGodRays2 = new THREE.WebGLRenderTarget(w, h, pars);
    godraysGenShader = THREE.ShaderGodRays["godrays_generate"];
    Stage3d.postprocessing.godrayGenUniforms = THREE.UniformsUtils.clone(godraysGenShader.uniforms);
    Stage3d.postprocessing.materialGodraysGenerate = new THREE.ShaderMaterial({
      uniforms: Stage3d.postprocessing.godrayGenUniforms,
      vertexShader: godraysGenShader.vertexShader,
      fragmentShader: godraysGenShader.fragmentShader
    });
    godraysCombineShader = THREE.ShaderGodRays["godrays_combine"];
    Stage3d.postprocessing.godrayCombineUniforms = THREE.UniformsUtils.clone(godraysCombineShader.uniforms);
    Stage3d.postprocessing.materialGodraysCombine = new THREE.ShaderMaterial({
      uniforms: Stage3d.postprocessing.godrayCombineUniforms,
      vertexShader: godraysCombineShader.vertexShader,
      fragmentShader: godraysCombineShader.fragmentShader
    });
    godraysFakeSunShader = THREE.ShaderGodRays["godrays_fake_sun"];
    Stage3d.postprocessing.godraysFakeSunUniforms = THREE.UniformsUtils.clone(godraysFakeSunShader.uniforms);
    Stage3d.postprocessing.materialGodraysFakeSun = new THREE.ShaderMaterial({
      uniforms: Stage3d.postprocessing.godraysFakeSunUniforms,
      vertexShader: godraysFakeSunShader.vertexShader,
      fragmentShader: godraysFakeSunShader.fragmentShader
    });
    Stage3d.postprocessing.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight), Stage3d.postprocessing.materialGodraysGenerate);
    Stage3d.postprocessing.quad.position.z = -9900;
    Stage3d.postprocessing.scene.add(Stage3d.postprocessing.quad);
    godray = gui.addFolder('godrays');
    godray.addColor(Stage3d, 'bgColor');
    godray.addColor(Stage3d, 'sunColor');
    godray.add(Stage3d, 'godRayIntensity', 0, 2);
  };

  Stage3d.resize = function() {
    var h, w;
    if (this.renderer) {
      w = window.innerWidth;
      h = window.innerHeight;
      if (isMobile.any) {
        w /= 2;
        h /= 2;
      }
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    }
    if (isMobile.any) {
      this.renderer.domElement.style.width = Math.ceil(w * 2) + 'px';
      this.renderer.domElement.style.height = Math.ceil(h * 2) + 'px';
    }
  };

  return Stage3d;

})();

module.exports = Stage3d;



},{"home/Home":13}],6:[function(require,module,exports){
var IceAnim,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

IceAnim = (function() {
  function IceAnim(_node, _w, _h) {
    this._node = _node;
    this._w = _w;
    this._h = _h;
    this.dispose = __bind(this.dispose, this);
    this._removeIce = __bind(this._removeIce, this);
    this._domContent = this._node.querySelector(".ice-content");
    this._nodeA = this._domContent.cloneNode(true);
    this._nodeB = this._domContent.cloneNode(true);
    this._initNode(this._nodeA, this._w, this._h);
    this._initNode(this._nodeB, this._w, this._h);
    TweenLite.set(this._domContent, {
      css: {
        alpha: 0,
        force3D: true
      }
    });
    this._masks = {};
    this._createMasks();
  }

  IceAnim.prototype._initNode = function(node, w, h) {
    node.style.width = w + "px";
    return node.style.height = h + "px";
  };

  IceAnim.prototype._createMasks = function() {
    var r;
    this._maskA = this._createMaskDiv(this._w, this._h);
    this._maskB = this._createMaskDiv(this._w, this._h);
    this._maskA.appendChild(this._nodeA);
    this._maskB.appendChild(this._nodeB);
    TweenLite.set(this._maskA, {
      css: {
        transformOrigin: "0% 0%"
      }
    });
    TweenLite.set(this._maskB, {
      css: {
        transformOrigin: "100% 100%"
      }
    });
    TweenLite.set(this._nodeB, {
      css: {
        transformOrigin: "100% 100%"
      }
    });
    r = (Math.PI * .25 + (Math.random() * Math.PI * .2) - .1) * 180 / Math.PI;
    TweenLite.set(this._maskA, {
      css: {
        alpha: 0,
        rotation: -r,
        force3D: true
      }
    });
    TweenLite.set(this._nodeA, {
      css: {
        rotation: r,
        force3D: true
      }
    });
    r = (Math.PI * .25 + (Math.random() * Math.PI * .3) - .15) * 180 / Math.PI;
    TweenLite.set(this._maskB, {
      css: {
        alpha: 0,
        rotation: -r,
        force3D: true
      }
    });
    TweenLite.set(this._nodeB, {
      css: {
        rotation: r,
        force3D: true
      }
    });
    this._node.appendChild(this._maskA);
    return this._node.appendChild(this._maskB);
  };

  IceAnim.prototype._createMaskDiv = function(w, h) {
    var div;
    div = document.createElement("div");
    div.style.position = "absolute";
    div.style.top = 0;
    div.style.left = 0;
    div.style.width = w + "px";
    div.style.height = h + "px";
    div.style.overflow = "hidden";
    return div;
  };

  IceAnim.prototype.show = function(delay) {
    if (delay == null) {
      delay = 0;
    }
    TweenLite.set(this._maskA, {
      delay: delay,
      css: {
        alpha: .2,
        rotationY: -20,
        x: -50,
        z: 60,
        force3D: true
      }
    });
    TweenLite.to(this._maskA, .05, {
      delay: delay,
      css: {
        alpha: .45,
        rotationY: -10,
        x: -35,
        z: 45,
        force3D: true
      },
      ease: Quad.easeIn
    });
    TweenLite.to(this._maskA, .15, {
      delay: delay + .05,
      css: {
        alpha: 1,
        rotationY: 0,
        x: 0,
        z: 0,
        force3D: true
      },
      ease: Quart.easeOut
    });
    TweenLite.set(this._maskB, {
      delay: delay,
      css: {
        alpha: .2,
        rotationY: 20,
        x: 50,
        z: 60,
        force3D: true
      }
    });
    TweenLite.to(this._maskB, .05, {
      delay: delay + .05,
      css: {
        alpha: .45,
        rotationY: 10,
        x: 35,
        z: 45,
        force3D: true
      },
      ease: Quad.easeIn
    });
    TweenLite.to(this._maskB, .15, {
      delay: delay + .1,
      css: {
        alpha: 1,
        rotationY: 0,
        x: 0,
        z: 0,
        force3D: true
      },
      ease: Quart.easeOut
    });
    TweenLite.set(this._domContent, {
      delay: delay,
      css: {
        rotationY: -20,
        z: 20,
        force3D: true,
        alpha: 0
      }
    });
    return TweenLite.to(this._domContent, .4, {
      delay: delay + .15,
      css: {
        rotationY: 0,
        z: 0,
        alpha: 1,
        force3D: true
      },
      ease: Expo.easeInOut,
      onComplete: this._removeIce
    });
  };

  IceAnim.prototype._removeIce = function() {
    this._node.removeChild(this._maskA);
    return this._node.removeChild(this._maskB);
  };

  IceAnim.prototype.hide = function(delay) {
    if (delay == null) {
      delay = 0;
    }
    this._node.appendChild(this._maskA);
    this._node.appendChild(this._maskB);
    TweenLite.set(this._maskA, {
      css: {
        alpha: 1,
        rotationY: 0,
        x: 0,
        z: 0,
        force3D: true
      }
    });
    TweenLite.set(this._maskB, {
      css: {
        alpha: 1,
        rotationY: 0,
        x: 0,
        z: 0,
        force3D: true
      }
    });
    TweenLite.set(this._domContent, {
      css: {
        rotationY: 0,
        z: 0,
        alpha: 1,
        force3D: true
      }
    });
    TweenLite.to(this._domContent, .1, {
      delay: delay,
      css: {
        alpha: .85,
        rotationY: -7,
        z: 20,
        force3D: true
      },
      ease: Quad.easeIn
    });
    TweenLite.to(this._domContent, .05, {
      delay: delay + .1,
      css: {
        alpha: 0,
        rotationY: -20,
        z: 60,
        force3D: true
      },
      ease: Cubic.easeOut
    });
    TweenLite.to(this._maskA, .1, {
      delay: delay + .05,
      css: {
        alpha: .85,
        rotationY: -7,
        x: -15,
        force3D: true,
        z: 20
      },
      ease: Quad.easeIn
    });
    TweenLite.to(this._maskA, .1, {
      delay: delay + .05 + .1,
      css: {
        alpha: 0,
        rotationY: -20,
        x: -50,
        z: 60,
        force3D: true
      },
      ease: Cubic.easeOut
    });
    TweenLite.to(this._maskB, .1, {
      delay: delay + .1 + .05,
      css: {
        alpha: .85,
        rotationY: 7,
        x: 15,
        z: 20,
        force3D: true
      },
      ease: Quad.easeIn
    });
    TweenLite.to(this._maskB, .1, {
      delay: delay + .1 + .1,
      css: {
        alpha: 0,
        rotationY: 20,
        x: 50,
        z: 60,
        force3D: true
      },
      ease: Cubic.easeOut
    });
    return .4 + delay;
  };

  IceAnim.prototype.dispose = function() {
    this._removeIce();
    return TweenLite.set(this._domContent, {
      css: {
        rotationY: 0,
        z: 0,
        alpha: 1,
        force3D: true
      }
    });
  };

  return IceAnim;

})();

module.exports = IceAnim;



},{}],7:[function(require,module,exports){
module.exports = function(node) {
  var i;
  i = 1;
  while (node = node.previousElementSibling) {
    if (node.nodeType === 1) {
      i++;
    }
  }
  return i;
};



},{}],8:[function(require,module,exports){
var Interactions;

Interactions = (function() {
  function Interactions() {
    this._downs = {};
    this._moves = {};
    this._ups = {};
    this._clicks = {};
    this._mouseleaves = {};
    this._interactions = [this._downs, this._moves, this._ups, this._clicks];
    this.isTouchDevice = "ontouchstart" in window || "onmsgesturechange" in window;
  }

  Interactions.prototype.on = function(elt, action, cb) {
    var evt, isTouchDevice, obj, proxy;
    evt = this._getEvent(action);
    if (evt === "") {
      return;
    }
    obj = this._getObj(action);
    if (!obj[elt]) {
      obj[elt] = [];
    }
    isTouchDevice = this.isTouchDevice;
    proxy = function(e) {
      var touch;
      if (isTouchDevice) {
        touch = e.touches[0];
        if (touch) {
          e.x = touch.clientX;
          e.y = touch.clientY;
        }
      } else {
        e.x = e.clientX;
        e.y = e.clientY;
      }
      return cb.call(this, e);
    };
    obj[elt].push({
      cb: cb,
      proxy: proxy
    });
    return elt.addEventListener(evt, proxy, false);
  };

  Interactions.prototype.off = function(elt, action, cb) {
    var data, datas, evt, obj, result, _i, _len;
    evt = this._getEvent(action);
    if (evt === "") {
      return;
    }
    obj = this._getObj(action);
    if (!obj[elt]) {
      return;
    }
    datas = obj[elt];
    if (cb) {
      result = this._find(cb, datas);
      if (!result) {
        return;
      }
      elt.removeEventListener(evt, result.data.proxy, false);
      datas.splice(result.idx, 1);
    } else {
      for (_i = 0, _len = datas.length; _i < _len; _i++) {
        data = datas[_i];
        elt.removeEventListener(evt, data.proxy, false);
      }
      obj[elt] = [];
    }
  };

  Interactions.prototype.dispose = function(elt) {
    var interaction, _i, _len, _ref;
    _ref = this._interactions;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      interaction = _ref[_i];
      if (interaction[elt]) {
        interaction[elt] = null;
        delete interaction[elt];
      }
    }
  };

  Interactions.prototype._getEvent = function(action) {
    var evt;
    evt = "";
    if (this.isTouchDevice) {
      switch (action) {
        case "down":
          evt = "touchstart";
          break;
        case "move":
          evt = "touchmove";
          break;
        case "up":
          evt = "touchend";
          break;
        case "click":
          evt = "touchstart";
          break;
        case "mouseleave":
          evt = "mouseleave";
      }
    } else {
      switch (action) {
        case "down":
          evt = "mousedown";
          break;
        case "move":
          evt = "mousemove";
          break;
        case "up":
          evt = "mouseup";
          break;
        case "click":
          evt = "click";
          break;
        case "mouseleave":
          evt = "mouseleave";
      }
    }
    return evt;
  };

  Interactions.prototype._getObj = function(action) {
    var obj;
    return obj = this["_" + action + "s"];
  };

  Interactions.prototype._find = function(cb, datas) {
    var data, idx, _i, _len;
    for (idx = _i = 0, _len = datas.length; _i < _len; idx = ++_i) {
      data = datas[idx];
      if (data.cb === cb) {
        return {
          data: data,
          idx: idx
        };
      }
    }
    return null;
  };

  return Interactions;

})();

module.exports = new Interactions;



},{}],9:[function(require,module,exports){
var Nav,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Nav = (function(_super) {
  __extends(Nav, _super);

  function Nav() {
    Nav.__super__.constructor.apply(this, arguments);
    this.id = "";
  }

  Nav.prototype.set = function(id) {
    if (this.id === id) {
      return;
    }
    this.id = id;
    return this.emit("change", this.id);
  };

  return Nav;

})(Emitter);

module.exports = new Nav;



},{}],10:[function(require,module,exports){
var About, IceAnim, interactions, nav;

interactions = require("common/interactions");

nav = require("common/nav");

IceAnim = require("common/anim/IceAnim");

About = (function() {
  function About() {
    this.dom = document.querySelector(".about");
    this._domBtClose = this.dom.querySelector(".bt-close-holder");
    interactions.on(this._domBtClose, "click", this._onBtClose);
  }

  About.prototype._onBtClose = function(e) {
    e.preventDefault();
    return nav.set("");
  };

  About.prototype.show = function() {
    var d, dom, domInfos, _i, _len, _results;
    this.dom.style.display = "block";
    this._iceAnim = new IceAnim(this.dom, this.dom.offsetWidth, this.dom.offsetHeight);
    this._iceAnim.show(.1);
    domInfos = document.querySelectorAll(".about-infos");
    d = 0;
    _results = [];
    for (_i = 0, _len = domInfos.length; _i < _len; _i++) {
      dom = domInfos[_i];
      TweenLite.set(dom, {
        css: {
          alpha: 0,
          y: 50,
          force3D: true
        }
      });
      TweenLite.to(dom, .1, {
        delay: .15 + d,
        css: {
          alpha: .325,
          y: 35,
          force3D: true
        },
        ease: Quad.easeIn
      });
      TweenLite.to(dom, .25, {
        delay: .15 + .1 + d,
        css: {
          alpha: 1,
          y: 0,
          force3D: true
        },
        ease: Quart.easeOut
      });
      _results.push(d += .05);
    }
    return _results;
  };

  About.prototype._getIndex = function(node) {
    var i;
    i = 1;
    while (node = node.previousElementSibling) {
      if (node.nodeType === 1) {
        i++;
      }
    }
    return i;
  };

  About.prototype.hide = function() {
    return done(this._iceAnim.hide() * 1000, (function(_this) {
      return function() {
        _this.dom.style.display = "none";
        return _this._iceAnim.dispose();
      };
    })(this));
  };

  return About;

})();

module.exports = About;



},{"common/anim/IceAnim":6,"common/interactions":8,"common/nav":9}],11:[function(require,module,exports){
var Artists, IceAnim, interactions, nav,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

interactions = require("common/interactions");

nav = require("common/nav");

IceAnim = require("common/anim/IceAnim");

Artists = (function() {
  function Artists() {
    this._update = __bind(this._update, this);
    this._onResize = __bind(this._onResize, this);
    this._onMouseWheel = __bind(this._onMouseWheel, this);
    this._onDragStop = __bind(this._onDragStop, this);
    this._onDragMove = __bind(this._onDragMove, this);
    this._onDragStart = __bind(this._onDragStart, this);
    this.dom = document.querySelector(".artists");
    this.domNoMobile = this.dom.querySelector(".artists-content.no-mobile");
    this._domEntries = this.domNoMobile.querySelector(".artists-entries");
    this._domEntriesHolder = this.domNoMobile.querySelector(".artists-entries-holder");
    this._domEntriesItems = this.domNoMobile.querySelectorAll(".artists-entry");
    this._domEntriesHolders = this.domNoMobile.querySelectorAll(".artists-entry-holder");
    this._domBtClose = this.domNoMobile.querySelector(".bt-close-holder");
    this._countEntries = this._domEntriesItems.length;
    this.dom.addEventListener("mousewheel", this._onMouseWheel, false);
    if (interactions.isTouchDevice) {
      interactions.on(this._domEntries, "down", this._onDragStart, false);
    }
    this._py = 0;
    this._pyCurrent = 0;
    this._yMaxRelative = Math.ceil(this._countEntries / 6) + 2;
    this._yMax = -this._yMaxRelative * (document.body.offsetHeight * .5) >> 0;
    this._lastY = 0;
    this._idRaf = -1;
    interactions.on(this._domBtClose, "click", this._onBtClose);
    window.addEventListener("resize", this._onResize, false);
  }

  Artists.prototype._onDragStart = function(e) {
    if (window.innerWidth <= 640) {
      return;
    }
    e.preventDefault();
    this._lastY = e.y;
    interactions.on(this._domEntries, "move", this._onDragMove, false);
    return interactions.on(this._domEntries, "up", this._onDragStop, false);
  };

  Artists.prototype._onDragMove = function(e) {
    var dy;
    e.preventDefault();
    dy = e.y - this._lastY;
    this._py += dy;
    this._lastY = e.y;
    return this._onEntriesScroll();
  };

  Artists.prototype._onDragStop = function(e) {
    e.preventDefault();
    interactions.off(this._domEntries, "move", this._onDragMove, false);
    return interactions.off(this._domEntries, "up", this._onDragStop, false);
  };

  Artists.prototype._onMouseWheel = function(e) {
    this._py += e.wheelDeltaY;
    return this._onEntriesScroll();
  };

  Artists.prototype._onEntriesScroll = function() {
    if (this._py > 0) {
      this._py = 0;
    }
    if (this._py < this._yMax) {
      return this._py = this._yMax;
    }
  };

  Artists.prototype._onResize = function(e) {
    var h;
    h = document.body.offsetHeight;
    this._yMax = -this._yMaxRelative * (h * .5) >> 0;
    return this._onEntriesScroll();
  };

  Artists.prototype._onBtClose = function(e) {
    e.preventDefault();
    return nav.set("");
  };

  Artists.prototype.show = function() {
    var d, dAdd, dom, domEntriesHolders, domInfos, idx, _i, _j, _len, _len1;
    this.dom.style.display = "block";
    this._py = 0;
    this._pyCurrent = 0;
    TweenLite.set(this._domEntries, {
      css: {
        y: 0,
        force3D: true
      }
    });
    this._iceAnim = new IceAnim(this.dom, this.dom.offsetWidth, this.dom.offsetHeight);
    this._iceAnim.show(.1);
    domEntriesHolders = document.querySelectorAll(".artists-entry");
    domInfos = document.querySelectorAll(".artists-infos");
    d = 0;
    for (_i = 0, _len = domInfos.length; _i < _len; _i++) {
      dom = domInfos[_i];
      TweenLite.set(dom, {
        css: {
          alpha: 0,
          y: 50
        }
      });
      TweenLite.to(dom, .1, {
        delay: .15 + d,
        css: {
          alpha: .325,
          y: 35
        },
        ease: Quad.easeIn
      });
      TweenLite.to(dom, .25, {
        delay: .15 + .1 + d,
        css: {
          alpha: 1,
          y: 0
        },
        ease: Quart.easeOut
      });
      d += .05;
    }
    d = 0;
    dAdd = .05;
    for (_j = 0, _len1 = domEntriesHolders.length; _j < _len1; _j++) {
      dom = domEntriesHolders[_j];
      idx = this._getIndex(dom);
      if (idx > 6) {
        d = 0;
        dAdd = .05;
        continue;
      }
      TweenLite.set(dom, {
        css: {
          alpha: 0,
          y: 50
        }
      });
      TweenLite.to(dom, .1, {
        delay: .1 + d,
        css: {
          alpha: .325,
          y: 35
        },
        ease: Quad.easeIn
      });
      TweenLite.to(dom, .25, {
        delay: .1 + .1 + d,
        css: {
          alpha: 1,
          y: 0
        },
        ease: Quart.easeOut
      });
      d += dAdd;
      dAdd *= .9;
      if (dAdd < .025) {
        dAdd = .025;
      }
    }
    return this._idTimeout = setTimeout(this._update, 500);
  };

  Artists.prototype._update = function() {
    this._pyCurrent += (this._py - this._pyCurrent) * .1;
    TweenLite.set(this._domEntries, {
      css: {
        y: this._pyCurrent
      }
    });
    return this._idRaf = requestAnimationFrame(this._update);
  };

  Artists.prototype._getIndex = function(node) {
    var i;
    i = 1;
    while (node = node.previousElementSibling) {
      if (node.nodeType === 1) {
        i++;
      }
    }
    return i;
  };

  Artists.prototype.hide = function() {
    clearTimeout(this._idTimeout);
    cancelAnimationFrame(this._idRaf);
    return done(this._iceAnim.hide() * 1000, (function(_this) {
      return function() {
        _this.dom.style.display = "none";
        return _this._iceAnim.dispose();
      };
    })(this));
  };

  return Artists;

})();

module.exports = Artists;



},{"common/anim/IceAnim":6,"common/interactions":8,"common/nav":9}],12:[function(require,module,exports){
var Credits, interactions, nav,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

interactions = require("common/interactions");

nav = require("common/nav");

Credits = (function() {
  function Credits() {
    this._onBtClose = __bind(this._onBtClose, this);
    this.dom = document.querySelector(".credits");
    this._domBtClose = this.dom.querySelector(".bt-close-holder");
    this._domTitle = this.dom.querySelector(".credits-title");
    this._domEntries = this.dom.querySelectorAll(".credits-entry");
    interactions.on(this._domBtClose, "click", this._onBtClose);
    interactions.on(this.dom, "mouseleave", this._onBtClose);
  }

  Credits.prototype._onBtClose = function(e) {
    e.preventDefault();
    return this.hide();
  };

  Credits.prototype.show = function() {
    var d, dAdd, dom, _i, _len, _ref, _results;
    if (window.innerWidth <= 640) {
      this.dom.style.display = 'block';
      if (this._transitionTimer) {
        clearInterval(this._transitionTimer);
      }
      this._transitionTimer = setTimeout((function(_this) {
        return function() {
          return _this.dom.classList.add('transitionIn');
        };
      })(this), 200);
      return;
    }
    TweenLite.to(this.dom, .4, {
      css: {
        x: 198
      },
      ease: Cubic.easeOut
    });
    TweenLite.set(this._domTitle, {
      css: {
        alpha: 0,
        x: -50
      }
    });
    TweenLite.to(this._domTitle, .1, {
      delay: .05,
      css: {
        alpha: .4,
        x: -30
      },
      ease: Sine.easeIn
    });
    TweenLite.to(this._domTitle, .25, {
      delay: .05 + .1,
      css: {
        alpha: 1,
        x: 0
      },
      ease: Back.easeOut,
      easeParams: [1.25]
    });
    d = .05 + .1;
    dAdd = .05 * .9;
    _ref = this._domEntries;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      dom = _ref[_i];
      TweenLite.set(dom, {
        css: {
          alpha: 0,
          x: -50,
          force3D: true
        }
      });
      TweenLite.to(dom, .1, {
        delay: d,
        css: {
          alpha: .4,
          x: -30,
          force3D: true
        },
        ease: Sine.easeIn
      });
      TweenLite.to(dom, .25, {
        delay: d + .1,
        css: {
          alpha: 1,
          x: 0,
          force3D: true
        },
        ease: Back.easeOut,
        easeParams: [1.25]
      });
      d += dAdd;
      dAdd *= .9;
      if (dAdd < .02) {
        _results.push(dAdd = .02);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Credits.prototype.hide = function() {
    var duration;
    if (window.innerWidth <= 640) {
      this.dom.classList.remove('transitionIn');
      if (this._transitionTimer) {
        clearInterval(this._transitionTimer);
      }
      this._transitionTimer = setTimeout((function(_this) {
        return function() {
          return _this.dom.style.display = 'none';
        };
      })(this), 1300);
      return;
    }
    duration = .25;
    TweenLite.to(this.dom, duration, {
      css: {
        x: 0
      },
      ease: Cubic.easeOut
    });
    return done(duration * 1000);
  };

  return Credits;

})();

module.exports = Credits;



},{"common/interactions":8,"common/nav":9}],13:[function(require,module,exports){
var About, Artists, Home, Menu, Share, TitleAnim, getIndex, nav, xps,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

nav = require("common/nav");

getIndex = require("common/getIndex");

Menu = require("home/Menu");

Artists = require("home/Artists");

About = require("home/About");

Share = require("home/Share");

xps = require("home/xps");

TitleAnim = require("home/TitleAnim");

Home = (function() {
  function Home(scene3d) {
    var domHomeDetails;
    this.scene3d = scene3d;
    this.show = __bind(this.show, this);
    this._onXPOut = __bind(this._onXPOut, this);
    this._onXPOver = __bind(this._onXPOver, this);
    this._onNavChange = __bind(this._onNavChange, this);
    this.dom = document.querySelector(".home");
    TweenLite.set(this.dom, {
      css: {
        alpha: 0
      }
    });
    this.dom.style.display = "block";
    domHomeDetails = document.querySelector(".home-details-content");
    this._domHomeDetails = domHomeDetails.cloneNode(true);
    domHomeDetails.parentNode.removeChild(domHomeDetails);
    this._titleAnim = null;
    this._menu = new Menu(this.scene3d);
    this._artists = new Artists;
    this._about = new About;
    this._share = new Share;
    this._currentModule = null;
    this.scene3d.isActivate = true;
    nav.on("change", this._onNavChange);
    scene3d.on("over", this._onXPOver);
    scene3d.on("out", this._onXPOut);
  }

  Home.prototype._onNavChange = function(id) {
    var newModule, _base;
    if (id !== "") {
      this.scene3d.isActivate = false;
      newModule = this["_" + id];
      if (this._currentModule === newModule) {
        return;
      }
      if (this._currentModule) {
        return this._currentModule.hide().then((function(_this) {
          return function() {
            var _base;
            _this._currentModule = newModule;
            return typeof (_base = _this._currentModule).show === "function" ? _base.show() : void 0;
          };
        })(this));
      } else {
        this._currentModule = newModule;
        return typeof (_base = this._currentModule).show === "function" ? _base.show() : void 0;
      }
    } else {
      this.scene3d.isActivate = true;
      this._currentModule.hide();
      return this._currentModule = null;
    }
  };

  Home.prototype._onBtOver = function(e) {
    e.preventDefault();
    return xps.over(getIndex(e.currentTarget));
  };

  Home.prototype._onBtOut = function(e) {
    e.preventDefault();
    return xps.out();
  };

  Home.prototype._onXPOver = function(idx) {
    this._titleAnim = new TitleAnim(this._domHomeDetails.cloneNode(true), idx);
    return this._titleAnim.show();
  };

  Home.prototype._onXPOut = function() {
    if (this._titleAnim) {
      return this._titleAnim.hide();
    }
  };

  Home.prototype.show = function() {
    return TweenLite.to(this.dom, .5, {
      css: {
        alpha: 1
      },
      onComplete: (function(_this) {
        return function() {
          return _this.scene3d.isActivate = true;
        };
      })(this)
    });
  };

  Home.prototype.hide = function() {
    return this.scene3d.isActivate = false;
  };

  return Home;

})();

module.exports = Home;



},{"common/getIndex":7,"common/nav":9,"home/About":10,"home/Artists":11,"home/Menu":15,"home/Share":17,"home/TitleAnim":18,"home/xps":19}],14:[function(require,module,exports){
var IceAnim, Loading,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

IceAnim = require("common/anim/IceAnim");

Loading = (function(_super) {
  __extends(Loading, _super);

  function Loading() {
    this._updatePercent = __bind(this._updatePercent, this);
    Loading.__super__.constructor.apply(this, arguments);
    this.dom = document.querySelector(".loading");
    this._domPercent = document.querySelector(".loading-percent");
    this._percent = 0;
    this.percent = 0;
  }

  Loading.prototype.start = function() {
    return TweenLite.to(this, 1, {
      _percent: 1,
      onUpdate: this._updatePercent,
      ease: Linear.easeNone
    });
  };

  Loading.prototype._updatePercent = function() {
    this.percent = this._percent * 24 >> 0;
    if (this.percent < 10) {
      this._domPercent.innerHTML = "0" + this.percent;
    } else {
      this._domPercent.innerHTML = this.percent;
    }
    if (this._percent === 1) {
      return this._onComplete();
    }
  };

  Loading.prototype._onComplete = function() {
    return this.emit("complete");
  };

  Loading.prototype.hide = function() {
    var duration;
    duration = .5;
    this._iceAnim = new IceAnim(this.dom, document.body.offsetWidth, document.body.offsetHeight);
    this._iceAnim.hide();
    return done(200);
  };

  Loading.prototype.dispose = function() {
    return document.body.removeChild(this.dom);
  };

  return Loading;

})(Emitter);

module.exports = Loading;



},{"common/anim/IceAnim":6}],15:[function(require,module,exports){
var Credits, IceAnim, Menu, interactions, nav,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

interactions = require("common/interactions");

nav = require("common/nav");

IceAnim = require("common/anim/IceAnim");

Credits = require("home/Credits");

Menu = (function() {
  function Menu(scene3d) {
    var domBtAbout, domBtArtists, domBtCredits, domBtLogo, domBtsGrid, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4;
    this.scene3d = scene3d;
    this._onNavChange = __bind(this._onNavChange, this);
    this._onBtLogo = __bind(this._onBtLogo, this);
    this._onBtCredits = __bind(this._onBtCredits, this);
    this._onBtAbout = __bind(this._onBtAbout, this);
    this._onBtArtists = __bind(this._onBtArtists, this);
    this._onBtGrid = __bind(this._onBtGrid, this);
    this.dom = document.querySelector(".menu");
    this._credits = new Credits;
    this._domMenuLight = document.querySelector(".menu--light");
    this._menuLightVisible = false;
    this.gridActivate = false;
    this._domBtsGrid = document.querySelectorAll(".gridButton");
    this._domBtsLogo = document.querySelectorAll(".menu-top");
    this._domBtsArtists = document.querySelectorAll(".menu-entry--artists a");
    this._domBtsAbout = document.querySelectorAll(".menu-entry--about a");
    this._domBtsCredits = document.querySelectorAll(".menu-subentry--credits a");
    _ref = this._domBtsGrid;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      domBtsGrid = _ref[_i];
      interactions.on(domBtsGrid, "click", this._onBtGrid);
    }
    _ref1 = this._domBtsLogo;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      domBtLogo = _ref1[_j];
      interactions.on(domBtLogo, "click", this._onBtLogo);
    }
    _ref2 = this._domBtsArtists;
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      domBtArtists = _ref2[_k];
      interactions.on(domBtArtists, "click", this._onBtArtists);
    }
    _ref3 = this._domBtsAbout;
    for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
      domBtAbout = _ref3[_l];
      interactions.on(domBtAbout, "click", this._onBtAbout);
    }
    _ref4 = this._domBtsCredits;
    for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
      domBtCredits = _ref4[_m];
      interactions.on(domBtCredits, "click", this._onBtCredits);
    }
    nav.on("change", this._onNavChange);
  }

  Menu.prototype._onBtGrid = function(e) {
    console.log('hihi');
    this.gridActivate = !this.gridActivate;
    this.scene3d.setGrid(this.gridActivate);
    e.preventDefault();
    return nav.set("");
  };

  Menu.prototype._onBtArtists = function(e) {
    e.preventDefault();
    return nav.set("artists");
  };

  Menu.prototype._onBtAbout = function(e) {
    e.preventDefault();
    return nav.set("about");
  };

  Menu.prototype._onBtCredits = function(e) {
    e.preventDefault();
    return this._credits.show();
  };

  Menu.prototype._onBtLogo = function(e) {
    e.preventDefault();
    return nav.set("");
  };

  Menu.prototype._onNavChange = function(id) {
    if (id !== "credits") {
      this._credits.hide();
    }
    if (id !== "" && id !== "credits") {
      if (id === "artists") {
        this._activate(".menu-entry--artists");
      } else {
        this._activate(".menu-entry--about");
      }
      if (window.innerWidth > 640) {
        return this._showMenuLight();
      }
    } else {
      if (window.innerWidth > 640) {
        return this._hideMenuLight();
      }
    }
  };

  Menu.prototype._activate = function(c) {
    var dom, _i, _len, _ref, _results;
    this._deactivate();
    _ref = this._domMenuLight.querySelectorAll(c);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      dom = _ref[_i];
      _results.push(dom.classList.add("activated"));
    }
    return _results;
  };

  Menu.prototype._deactivate = function() {
    var dom, _i, _len, _ref, _results;
    _ref = this._domMenuLight.querySelectorAll(".activated");
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      dom = _ref[_i];
      _results.push(dom.classList.remove("activated"));
    }
    return _results;
  };

  Menu.prototype._showMenuLight = function() {
    if (this._menuLightVisible) {
      return;
    }
    this._menuLightVisible = true;
    this._domMenuLight.style.display = "block";
    this._iceAnim = new IceAnim(this._domMenuLight, this.dom.offsetWidth, this.dom.offsetHeight);
    return this._iceAnim.show();
  };

  Menu.prototype._hideMenuLight = function() {
    if (!this._menuLightVisible) {
      return;
    }
    this._menuLightVisible = false;
    return done(this._iceAnim.hide(.15) * 1000, (function(_this) {
      return function() {
        _this._domMenuLight.style.display = "none";
        return _this._iceAnim.dispose();
      };
    })(this));
  };

  return Menu;

})();

module.exports = Menu;



},{"common/anim/IceAnim":6,"common/interactions":8,"common/nav":9,"home/Credits":12}],16:[function(require,module,exports){
var Credits, MobileMenu, interactions, nav,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

interactions = require("common/interactions");

nav = require("common/nav");

Credits = require("home/Credits");

MobileMenu = (function() {
  MobileMenu.prototype.dom = null;

  MobileMenu.prototype.domNavbar = null;

  MobileMenu.prototype._domMenuCTA = null;

  MobileMenu.prototype._domCloseBtn = null;

  MobileMenu.prototype._isVisible = false;

  MobileMenu.prototype._transitionTimer = null;

  MobileMenu.prototype._domArtistsBtn = null;

  MobileMenu.prototype._domAboutBtn = null;

  MobileMenu.prototype._domCreditsBtn = null;

  function MobileMenu() {
    this._navigateToCredits = __bind(this._navigateToCredits, this);
    this._navigateToAbout = __bind(this._navigateToAbout, this);
    this._navigateToArtists = __bind(this._navigateToArtists, this);
    this._navigateToHome = __bind(this._navigateToHome, this);
    this._hide = __bind(this._hide, this);
    this._show = __bind(this._show, this);
    this._toggleMenu = __bind(this._toggleMenu, this);
    this._onNavChange = __bind(this._onNavChange, this);
    this.dom = document.querySelector('.mobile-menu');
    this.domNavbar = document.querySelector('.mobile-navbar');
    this._domMenuCTA = this.domNavbar.querySelector('.menuCTA');
    this._domCloseBtn = this.dom.querySelector('.bt-close-holder');
    this._domHomeBtn = this.dom.querySelectorAll('.menu-entry')[0];
    this._domArtistsBtn = this.dom.querySelectorAll('.menu-entry')[1];
    this._domAboutBtn = this.dom.querySelectorAll('.menu-entry')[2];
    this._domCreditsBtn = this.dom.querySelector('.menu-subentry--credits');
    interactions.on(this._domMenuCTA, 'click', this._show);
    interactions.on(this._domCloseBtn, 'click', this._hide);
    interactions.on(this._domHomeBtn, 'click', this._navigateToHome);
    interactions.on(this._domArtistsBtn, 'click', this._navigateToArtists);
    interactions.on(this._domAboutBtn, 'click', this._navigateToAbout);
    interactions.on(this._domCreditsBtn, 'click', this._navigateToCredits);
    nav.on("change", this._onNavChange);
    null;
  }

  MobileMenu.prototype._onNavChange = function() {
    console.log('plop');
    return null;
  };

  MobileMenu.prototype._toggleMenu = function() {
    this._isVisible = !this._isVisible;
    if (this._isVisible) {
      this._show();
    } else {
      this._hide();
    }
    return null;
  };

  MobileMenu.prototype._show = function(evt) {
    if (evt) {
      evt.preventDefault();
    }
    this.dom.style.display = 'table';
    if (this._transitionTimer) {
      clearInterval(this._transitionTimer);
    }
    this._transitionTimer = setTimeout((function(_this) {
      return function() {
        _this.dom.classList.add('transitionIn');
        return document.body.scrollTop = 200;
      };
    })(this), 100);
    return null;
  };

  MobileMenu.prototype._hide = function(evt) {
    if (evt) {
      evt.preventDefault();
    }
    this.dom.classList.add('transitionOut');
    if (this._transitionTimer) {
      clearInterval(this._transitionTimer);
    }
    this._transitionTimer = setTimeout((function(_this) {
      return function() {
        _this.dom.classList.remove('transitionIn');
        _this.dom.classList.remove('transitionOut');
        return _this.dom.style.display = 'none';
      };
    })(this), 1500);
    return null;
  };

  MobileMenu.prototype._navigateToHome = function() {
    nav.set("");
    this._hide();
    return null;
  };

  MobileMenu.prototype._navigateToArtists = function() {
    nav.set("artists");
    this._hide();
    return null;
  };

  MobileMenu.prototype._navigateToAbout = function() {
    nav.set("about");
    this._hide();
    return null;
  };

  MobileMenu.prototype._navigateToCredits = function() {
    nav.set("credits");
    this._hide();
    return null;
  };

  return MobileMenu;

})();

module.exports = MobileMenu;



},{"common/interactions":8,"common/nav":9,"home/Credits":12}],17:[function(require,module,exports){
var Share, interactions,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

interactions = require("common/interactions");

Share = (function() {
  function Share() {
    this._onTwitter = __bind(this._onTwitter, this);
    this._onFB = __bind(this._onFB, this);
    var dom, _i, _j, _len, _len1, _ref, _ref1;
    this._domShareFb = document.querySelectorAll(".share--fb");
    this._domShareTwitter = document.querySelectorAll(".share--twitter");
    _ref = this._domShareFb;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      dom = _ref[_i];
      interactions.on(dom, "click", this._onFB);
    }
    _ref1 = this._domShareTwitter;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      dom = _ref1[_j];
      interactions.on(dom, "click", this._onTwitter);
    }
    return;
  }

  Share.prototype._onFB = function(e) {
    e.preventDefault();
    FB.ui({
      method: 'feed',
      name: "Christmas Experiments - 2014",
      caption: "Christmas Experiments 2014, discover the best experiments of the winter!",
      link: "http://christmasexperiments.com/",
      picture: "http://christmasexperiments.com/share.jpg"
    }, function(response) {});
  };

  Share.prototype._onTwitter = function(e) {
    var url;
    e.preventDefault();
    url = "https://twitter.com/share?";
    url += "text=" + encodeURIComponent("Christmas Experiments 2014, discover the best experiments of the winter!");
    url += "&url=" + encodeURIComponent("http://christmasexperiments.com/");
    this._openPopup(url);
  };

  Share.prototype._openPopup = function(url) {
    window.open(url, "", "top=100, left=200, width=600, height = 500");
  };

  return Share;

})();

module.exports = Share;



},{"common/interactions":8}],18:[function(require,module,exports){
var IceAnim, TitleAnim, datas;

IceAnim = require("common/anim/IceAnim");

datas = require("data.json").experiments;

TitleAnim = (function() {
  function TitleAnim(_node, idx) {
    var data, day;
    this._node = _node;
    this.dom = document.querySelector(".home-details-cnt");
    this._w = 300;
    this._h = 140;
    data = datas[idx - 1];
    day = idx;
    if (idx < 10) {
      day = "0" + day;
    }
    this._node.querySelector(".home-details-day").innerHTML = day;
    this._node.querySelector(".home-details-title").innerHTML = data.title;
    this._node.querySelector(".home-details-author").innerHTML = data.author;
  }

  TitleAnim.prototype.show = function() {
    this.dom.appendChild(this._node);
    TweenLite.set(this._node, {
      css: {
        alpha: 0
      }
    });
    return TweenLite.to(this._node, .25, {
      css: {
        alpha: 1
      }
    });
  };

  TitleAnim.prototype.hide = function() {
    return TweenLite.to(this._node, .25, {
      css: {
        alpha: 0
      },
      onComplete: (function(_this) {
        return function() {
          return _this.dom.removeChild(_this._node);
        };
      })(this)
    });
  };

  return TitleAnim;

})();

module.exports = TitleAnim;



},{"common/anim/IceAnim":6,"data.json":2}],19:[function(require,module,exports){
var Xps,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Xps = (function(_super) {
  __extends(Xps, _super);

  function Xps() {
    Xps.__super__.constructor.apply(this, arguments);
  }

  Xps.prototype.over = function(idx) {
    return this.emit("over", idx);
  };

  Xps.prototype.out = function(idx) {
    return this.emit("out");
  };

  return Xps;

})(Emitter);

module.exports = new Xps;



},{}]},{},[1])