module.exports = async function (req, res) {
  const { id } = req.query;

  if (!id || !/^\d+$/.test(id)) {
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "public, s-maxage=2592000, stale-while-revalidate=2592000");
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invalid Place ID</title>
          <link rel="shortcut icon" href="https://static.wikia.nocookie.net/alter-ego/images/4/4a/Site-favicon.ico">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&family=Special+Elite&display=swap');
            
            body {
              background-color: #f4f4f4;
              font-family: Rubik, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
            }
            img {
              max-width: 200px;
              margin-bottom: 20px;
              filter: invert();
            }
            h1 {
              color: #333;
              font-family: 'Special Elite';
            }
            p {
              color: #3a3a3a;
            }
            a {
              color: #b10000;
              text-decoration: none;
            }
            a:hover {
              color: #4b0000;
            }
            
            @media (prefers-color-scheme: dark) {
              body {
                background-color: #161616;
              }
              h1 {
                color: white;
              }
              p {
                color: #e6e6e6;
              }
              a {
                color: #df4c4c;
              }
              a:hover {
                color: #ff6b6b;
              }
              img {
                filter: none;
              }
            }
          </style>
        </head>
        <body>
          <img src="https://static.wikia.nocookie.net/alter-ego/images/e/e6/Site-logo.png" alt="ALTER EGO Wiki Logo">
          <h1>Error: Invalid Place ID</h1>
          <p>Please provide a valid numeric Roblox Place ID.</p>
        </body>
      </html>
    `);
  }

  const robloxUrl = `roblox://placeId=${id}`;
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "public, s-maxage=1209600, stale-while-revalidate=1209600");
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Launching Roblox...</title>
        <link rel="shortcut icon" href="https://static.wikia.nocookie.net/alter-ego/images/4/4a/Site-favicon.ico">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&family=Special+Elite&display=swap');
          
          body {
            background-color: #f4f4f4;
            font-family: Rubik, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
          }
          img {
            max-width: 200px;
            margin-bottom: 20px;
            filter: invert();
          }
          h1 {
            color: #333;
            font-family: 'Special Elite';
          }
          p {
            color: #3a3a3a;
          }
          a {
            color: #b10000;
            text-decoration: none;
            font-weight: bold;
          }
          a:hover {
            color: #4b0000;
          }
          #countdown {
            font-size: 48px;
            font-weight: bold;
            color: #b10000;
            font-family: 'Special Elite';
            margin-top: 20px;
          }
          
          @media (prefers-color-scheme: dark) {
            body {
              background-color: #161616;
            }
            h1 {
              color: white;
            }
            p {
              color: #e6e6e6;
            }
            a {
              color: #df4c4c;
            }
            a:hover {
              color: #ff6b6b;
            }
            #countdown {
              color: #df4c4c;
            }
            img {
              filter: none;
            }
          }
        </style>
        <script>
          let countdown = 3;
          let countdownInterval;
          let hasUserInteracted = false;

          window.location.href = '${robloxUrl}';
          window.addEventListener('focus', function() {
            hasUserInteracted = true;
          });
          
          window.addEventListener('blur', function() {
            hasUserInteracted = true;
          });
          
          setTimeout(function() {
            const countdownElement = document.getElementById('countdown');
            
            countdownInterval = setInterval(function() {
              if (!document.hasFocus() && hasUserInteracted) {
                return;
              }
              
              countdown--;
              countdownElement.textContent = countdown;
              
              if (countdown <= 0) {
                clearInterval(countdownInterval);
                window.close();
                
                setTimeout(function() {
                  countdownElement.textContent = '✓';
                  document.querySelector('p:last-of-type').textContent = 'You can now close this tab.';
                }, 300);
              }
            }, 1000);
          }, 1000);
        </script>
      </head>
      <body>
        <img src="https://static.wikia.nocookie.net/alter-ego/images/e/e6/Site-logo.png" alt="ALTER EGO Wiki Logo">
        <h1>Launching Roblox...</h1>
        <p>If Roblox doesn't open automatically, <a href="${robloxUrl}">click here</a>.</p>
        <div id="countdown">3</div>
        <p style="font-size: 14px; color: #999; margin-top: 10px;">...until this page closes.</p>
      </body>
    </html>
  `);
};