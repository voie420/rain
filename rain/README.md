<p align="center">  
	<a href="https://aSocket.net">
		<img src="https://i.ibb.co/xSXgQR4/f0hofb-X-1.png">
	</a>
</p>

# <div align="center">💧 aSocket rain - Web Effect</div>
<p align="center">  
	<img src="https://i.ibb.co/h9Sss7F/ezgif-com-gif-maker-2.gif">
	<br>  
	<i>aSocket rain enables individuals to easily add a rainy effect to any web page.</i>
</p>

# Setup

 Simply download **`snow.js`** and include the following line in your HTML file: 
 ```html 
 <script src="snow.js"></script>
 ```

# Modularity
The rain effect can be easily customized via the configuration object.
```js
{
	'LIMIT': 20, // The maximum number of raindrops to create.
	'BLUR': 1, // The filter blur value.
	'FALL_RATE': 5, // The rate at which raindrops fall.
	'SWAY_RATE': 1, // The rate at which raindrops sway.
},
```
*An unlimited amount of layers can be added to the configuration.*

# Control
The rain effect can be controlled by executing the command **`aSocketrain.command(cmd)`**.<br>
*(This can be utilized via a user preferences menu, toggle button, etc.)*

The following can be passed as arguments to the command, enacting the corresponding effects:

**`clear`** - Clear all raindrops from the DOM and controller.

**`spawn`** - Spawn a new rainflake.

**`start`** - Start the rainflake controller animation/creation flow if not already active.

**`stop`** - Stop the rainflake controller animation/creation flow.
