<!DOCTYPE html>
<html lang="en-us">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Unity WebGL Player | Tilting</title>
    <link rel="shortcut icon" href="TemplateData/favicon.ico">
    <link rel="stylesheet" href="TemplateData/style.css">
    <style>
      .mobile {
          display: none;
          background-image: url("./bg.png");
          height: 100vh;
          background-size: cover;
      }
      
      .not-mobile {
          display: block;
          background-image: url("./bg.png");
          height: 100vh;
          background-size: cover;
      }
      .logo_1{
        display: block;
        margin-left: auto;
        margin-right: auto;
        padding-top: 20%;
        width: 20%;
        height: auto;
      }
      .logo_2{
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 200px;
        padding-top: 20px;
        height: auto;
      }
      .text{
        display: block;
        margin-left: auto;
        margin-right: auto;
        margin-top: 20%;
        height: auto;
        font-family: 'Poppins';
        font-style: italic;
        font-weight: 200;
        font-size: 22px;
        line-height: 36px;
        /* identical to box height */

        text-align: center;
        letter-spacing: 0.05em;

        color: #FFFFFF;
      }
      .animation_1{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 30%;
      }
      .animation_2{
    display: block;
        position: absolute;
        bottom: 0;
        margin-bottom: auto;
        margin-left: auto;
        margin-right: auto;
        bottom: 0;
        left: 0;
        width: 80%;
      }
      .comment{
        position: absolute;
        bottom: 100px;
        left: 20%;
        width: 20%;
      }
      .comment_2{
        width: auto;
        position: relative;
      }
      .buttonAccess{
        display: block;
        position: relative;
        box-sizing: border-box;
        width: 145.53px;
        height: 53.9px;
        color: white;
        background: linear-gradient(3.86deg, #D74DA9 3.4%, #D66DA1 52.63%, #E27AA2 97.13%);
        border: 0.5px solid #E39BB1;
        border-radius: 30px;
        font-size: 12px;
        top: 20%;
        display: block;
        margin-left: auto;
        margin-right: auto;
      }
      .commentAndButtonContainer{
          display: block;
          background-image: url("./comment_2.png");
          background-size: contain;
          background-repeat: no-repeat;
          position: fixed;
          top: 50%;
          left: 40%;
          margin-top: -50px;
          margin-left: -100px;
          width: 50%;
          height: 50%;
      }
      @media screen and (max-width: 992px) {
          .mobile {
              display: block;
          }
          .not-mobile {
              display: none;
          }
      }
      </style>
  </head>
  <body>
    <div>
      <div class="not-mobile">
         <img src="./bottom_logo.png" class="logo_1">
          <img src="./comment.png" class="comment" alt="This will display an animated GIF">
        <img src="./animation.gif" class="animation_1" alt="This will display an animated GIF">
      </div>
      <div class="mobile">
        <div id="permissionID" style="display:block">
          <img src="./bottom_logo.png" class="logo_2">
          <div class="commentAndButtonContainer">
            <button id="accelPermsButton" class="buttonAccess" onclick="getAccel()">Give Permission</button>
          </div>
          <img src="./animation_2.gif" class="animation_2" alt="This will display an animated GIF">
        </div>
        <div id="accessID" style="display:none">
          <div id="unity-container" class="unity-desktop">
            <canvas id="unity-canvas" width=360 height=640 tabindex="-1"></canvas>
            <div id="unity-loading-bar">
              <div id="unity-logo"></div>
              <div id="unity-progress-bar-empty">
                <div id="unity-progress-bar-full"></div>
              </div>
            </div>
            <div id="unity-warning"> </div>
            <div id="unity-footer">
              <div id="unity-webgl-logo"></div>
              <div id="unity-fullscreen-button"></div>
              <div id="unity-build-title">Tilting</div>
            </div>
        </div>
      </div>
    </div>
    </div>
    <script type="module">
      import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
      import { getDatabase, set, get, update, remove, ref, child, push } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";
      
      // Import the functions you need from the SDKs you need
      //import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
      // TODO: Add SDKs for Firebase products that you want to use
      // https://firebase.google.com/docs/web/setup#available-libraries
    
      // Your web app's Firebase configuration
      const firebaseConfig = {
        apiKey: "AIzaSyDs9JVsK953_PAmNZTF2-0gyH1sim9wmpQ",
        authDomain: "pelago-cetsa-game.firebaseapp.com",
        databaseURL: "https://pelago-cetsa-game-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "pelago-cetsa-game",
        storageBucket: "pelago-cetsa-game.appspot.com",
        messagingSenderId: "124431317073",
        appId: "1:124431317073:web:635cb141d90cf97d772070"
      };
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);

      var container = document.querySelector("#unity-container");
      var canvas = document.querySelector("#unity-canvas");
      var loadingBar = document.querySelector("#unity-loading-bar");
      var progressBarFull = document.querySelector("#unity-progress-bar-full");
      var fullscreenButton = document.querySelector("#unity-fullscreen-button");
      var warningBanner = document.querySelector("#unity-warning");

      // Shows a temporary message banner/ribbon for a few seconds, or
      // a permanent error message on top of the canvas if type=='error'.
      // If type=='warning', a yellow highlight color is used.
      // Modify or remove this function to customize the visually presented
      // way that non-critical warnings and error messages are presented to the
      // user.
      function unityShowBanner(msg, type) {
        function updateBannerVisibility() {
          warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
        }
        var div = document.createElement('div');
        div.innerHTML = msg;
        warningBanner.appendChild(div);
        if (type == 'error') div.style = 'background: red; padding: 10px;';
        else {
          if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
          setTimeout(function() {
            warningBanner.removeChild(div);
            updateBannerVisibility();
          }, 5000);
        }
        updateBannerVisibility();
      }

      var buildUrl = "Build";
      var loaderUrl = buildUrl + "/PELAGO_Web9.loader.js";
      var config = {
        dataUrl: buildUrl + "/PELAGO_Web9.data",
        frameworkUrl: buildUrl + "/PELAGO_Web9.framework.js",
        codeUrl: buildUrl + "/PELAGO_Web9.wasm",
        streamingAssetsUrl: "StreamingAssets",
        companyName: "DefaultCompany",
        productName: "Tilting",
        productVersion: "0.1",
        showBanner: unityShowBanner,
      };

      // By default Unity keeps WebGL canvas render target size matched with
      // the DOM size of the canvas element (scaled by window.devicePixelRatio)
      // Set this to false if you want to decouple this synchronization from
      // happening inside the engine, and you would instead like to size up
      // the canvas DOM size and WebGL render target sizes yourself.
      // config.matchWebGLToCanvasSize = false;

      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        // Mobile device style: fill the whole browser client area with the game canvas:

        var meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
        document.getElementsByTagName('head')[0].appendChild(meta);
        container.className = "unity-mobile";
        canvas.className = "unity-mobile";

        // To lower canvas resolution on mobile devices to gain some
        // performance, uncomment the following line:
        // config.devicePixelRatio = 1;


      } else {
        // Desktop style: Render the game canvas in a window that can be maximized to fullscreen:

        canvas.style.width = "360px";
        canvas.style.height = "640px";
      }

      loadingBar.style.display = "block";

      var script = document.createElement("script");
      script.src = loaderUrl;
      script.onload = () => {
        createUnityInstance(canvas, config, (progress) => {
          progressBarFull.style.width = 100 * progress + "%";
              }).then((unityInstance) => {
                loadingBar.style.display = "none";
                fullscreenButton.onclick = () => {
                  unityInstance.SetFullscreen(1);
                };
              }).catch((message) => {
                alert(message);
              });
      };
  
      function getAccel() {
        // feature detect
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
          DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
              if (permissionState === 'granted') {
                document.getElementById("permissionID").style.display = 'none';
                document.getElementById("accessID").style.display = 'block';
                document.body.appendChild(script);
                window.addEventListener('deviceorientation', () => {});
              }
            })
            .catch(console.error);
        } else {
          alert("You are using not IOS device")
        }
      }
      window.getAccel = getAccel;
      
      /*const app1 = initializeApp({
        databaseURL: "https://pelago-cetsa-game-default-rtdb.europe-west1.firebasedatabase.app/"
      });*/
      function CallFunction(text){
        const db = getDatabase(app);
        const userListRef = ref(db, 'users');
        const newUserRef = push(userListRef);
        set(newUserRef, {
          message: 555,
          email: 555,
          interests : 555
        }).then(() => {
          alert("Data was added");
        })
        .catch((error) => {
          alert(error);
        });

        /*const db = getDatabase();
        const reference = ref(db, 'users/' + userID);
        set(reference, {
          email: e,
          message: m,
          interests: i,
        })
        .then(() => {
          alert("Data was added");
        })
        .catch((error) => {
          alert(error);
        })*/
      }
    </script>
  
    <script language="JavaScript" type="text/javascript">
     
      function ErrorEmail(){
          alert("Please, Enter Email");
        }
    </script>
  </body>
</html>
