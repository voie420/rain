'use strict';

/**
 * @name rain
 * @desc Create a rain effect on the web.
 * 
 * Last Updated: 12/17/21
 * Last Edit By: tfannin@asocket.net
 */

// - © 2021 aSocket LLC
// ------------------------------

// aSocket Scope
const aSocketrain = {}

/**
 * rainflake layer configuration.
 * @typedef {Object} CONFIG
 * @property {number} LIMIT - The maximum number of rainflakes to create.
 * @property {number} BLUR - The filter blur value.
 * @property {number} FALL_RATE - The rate at which rainflakes fall.
 * @property {number} SWAY_RATE - The rate at which rainflakes sway.
 */

/**
 * @name CONFIG
 * @desc rainflake layer configuration.
 * @type {CONFIG}
 */
aSocketrain.CONFIG = [
    {
        'LIMIT': 30,
        'BLUR': 0,
        'FALL_RATE': 50,
        'SWAY_RATE': 0,
    },
    {
        'LIMIT': 30,
        'BLUR': 0,
        'FALL_RATE': 30,
        'SWAY_RATE': 0, 
    },

    {
        'LIMIT': 30,
        'BLUR': 0,
        'FALL_RATE': 30,
        'SWAY_RATE': 0, 
    },
];

/**
 * @name injectCSS
 * @desc Inject required CSS. (Enables one file requirement)
 * @returns {void}
 */
aSocketrain.injectCSS = function() {
    document.head.appendChild(document.createElement('style')).innerHTML = `
        .rain-container {
            position: fixed;
            overflow: hidden;
            z-index: 100;
            pointer-events: none;
            width: 100%;
            height: 150%;
            top: 20;
            left: 0;
        }

        .rainflake {

            position: absolute;
            height: 30px;
            width: 3px;
            background-color: #272727;
            border-radius: 0%;
            filter: blur(0px);
        }
        
    `;
}


/**
 * @name createContainer
 * @desc Creates main container for rain effect.
 * @returns {HTMLElement} The main container element.
 */
 aSocketrain.createContainer = function() {
    const body = document.createElement('div');
    body.id = 'asocket-rain-container';
    body.classList = 'rain-container';
    document.body.prepend(body);
    return body;
}

/**
 * @name command
 * @desc The method command name to execute on all controller classes.
 * @param {string} cmd - The command to execute.
 * @returns {void}
 */
 aSocketrain.command = function(cmd) {
    if (!aSocketrain.controllers[0][cmd]) { return; }
    for (const controller of aSocketrain.controllers) { controller[cmd](); }
}

/**
 * @name getSine
 * @desc Get a modified sine value.
 * @param {number} amplitude - The amplitude of the sine wave.
 * @param {number} frequency - The frequency of the sine wave.
 * @param {number} verticalShift - The vertical shift of the sine wave.
 * @returns {number} The modified sine value.
 */
aSocketrain.getSine = function(amplitude, frequency, verticalShift) {
    return amplitude * Math.sin(Date.now() * frequency) + verticalShift;
}

/**
 * @name main
 * @desc The main rain effect function.
 * @returns {void}
 */
aSocketrain.main = function() {

    // Inject required CSS.
    aSocketrain.injectCSS();

    // Create body element.
    const body = aSocketrain.createContainer();

    // Create rain "controllers" array.
    aSocketrain.controllers = [];

    // Loop through each configuration layer.
    for (const layer of aSocketrain.CONFIG) {

        // Create new rainflakes controller.
        aSocketrain.controllers.push(new Controller(body, layer));
    }

    // Create 'resize' listener.
    window.addEventListener('resize', () => {
        for (const controller of aSocketrain.controllers) {
            controller.resize(document.documentElement.clientWidth, document.documentElement.clientHeight);
        }
    });
}

/**
 * @name Controller
 * @desc The rainflake controller class.
 */
class Controller {

    /**
     * @param {HTMLElement} body - The main container element.
     * @param {CONFIG} config - The rainflake layer configuration.
     */
    constructor(body, config) {

        /**
         * @property {HTMLElement} body - The main container element.
         */
        this.body = body;

        /**
         * @property {CONFIG} config - The rainflake layer configuration.
         */
        this.config = config;

        /**
         * @property {Array.<rainflake>} rainflakes - The rainflake array.
         */
        this.rainflakes = [];

        /**
         * @property {Object} document - The document object.
         * @property {number} document.width - The document width.
         * @property {number} document.height - The document height.
         */
        this.document = {
            'width': document.documentElement.clientWidth,
            'height': document.documentElement.clientHeight,
        }
        
        this.start();
    }

    /**
     * @name start
     * @desc Start the rainflake controller animation/creation flow.
     * @returns {void}
     */
    start() {
        if (this.active) { return; }
        this.active = true;
        this.generate();
        this.interval = setInterval(() => { this.animate(); }, 17);
    }

    /**
     * @name spawn
     * @desc Spawn a new rainflake.
     * @returns {void}
     */
     spawn() {
        this.rainflakes.push(new rainflake(Math.random() * this.document.width, 0, this.body, this.config.BLUR));
    }

    /**
     * @name generate
     * @desc Initially generate rainflakes at randomly delayed intervals.
     * @returns {void}
     */
     async generate() {
        for (let i = this.rainflakes.length; i < this.config.LIMIT; i++) {
            await new Promise((resolve) => {setTimeout(() => {resolve()}, Math.random() * 400)});
            if (!this.active) { return; }
            this.spawn();
        }
    }

    /**
     * @name animate
     * @desc Animate all existing rainflakes.
     * @returns {void}
     */
     animate() {
        for (const rainflake of this.rainflakes) {
            // Animate rainflake.
            rainflake.top = rainflake.top + this.config.FALL_RATE;
            
            // Verify rainflake lifecycle.
            const bounds = rainflake.bounds;
            if (bounds.x > (this.document.width + bounds.width) || bounds.y > (this.document.height + bounds.height)) {
                this.remove(rainflake);
                this.spawn();
            }
        }
    }

    /**
     * @name remove
     * @desc Remove a rainflake from the DOM and controller.
     * @param {rainflake} rainflake 
     * @returns {void}
     */
     remove(rainflake) {
        this.rainflakes.splice(this.rainflakes.indexOf(rainflake), 1);
        rainflake.element.remove();
    }

    /**
     * @name clear
     * @desc Clear all rainflakes from the DOM and controller.
     * @returns {void}
     */
    clear() {
        // Due to the nature of splice, we can not simply call this.remove(), as it would upset the count. 
        // Alternatively, we will simply remove all elements, then reset the array.
        for (const rainflake of this.rainflakes) { rainflake.element.remove(); } 
        this.rainflakes = [];
    }

    /**
     * @name stop
     * @desc Stop the rainflake controller animation/creation flow.
     * @returns {void}
     */
     stop() {
        this.active = false;
        clearInterval(this.interval);
        this.interval = null;
    }

    /**
     * @name resize
     * @desc Resize the rainflake container / update rainflake positions.
     * @param {number} width - The new document width.
     * @param {number} height - The new document height.
     * @returns {void}
     */
     resize(width, height) {
        for (const rainflake of this.rainflakes) {
            rainflake.left = rainflake.left + (width - this.document.width);
            rainflake.top = rainflake.top + (height - this.document.height);
        }

        this.document.width = width;
        this.document.height = height;
    }
}

/**
 * @name rainflake
 * @desc The rainflake class.
 */
class rainflake {

    /**
     * 
     * @param {number} x - The x position the rainflake should be spawned at.
     * @param {number} y - The y position the rainflake should be spawned at.
     * @param {HTMLElement} container - The container element.
     * @param {number} blur - The blur value.
     */
    constructor(x, y, container, blur) {
        this.element = document.createElement('div');
        this.element.className = 'rainflake';
        this.element.img = document.createElement("caselate.png");
        this.element.style.left = x + 'px';
        this.element.style.top = y + 'px';
        this.element.style.filter = `blur(${blur}px)`; // drop-shadow(5px 5px 5px #000)
        container.appendChild(this.element);
    }

    /**
     * Retrieves the rainflake's top position.
     * @type {number}
     */
    get top() {
        return Number(this.element.style.top.replace('px', ''));
    }

    /**
     * Sets the rainflake's top position.
     * @param {number} value - The new top position.
     */
    set top(value) {
        this.element.style.top = value + 'px';
    }

    /**
     * Retrieves the rainflake's left position.
     * @type {number}
     */
    get left() {
        return Number(this.element.style.left.replace('px', ''));
    }

    /**
     * Sets the rainflake's left position.
     * @param {number} value - The new left position.
     */
    set left(value) {
        this.element.style.left = value + 'px';
    }

    /**
     * Retrieves the rainflake's bounds.
     * @type {Object}
     */
    get bounds() {
        return this.element.getBoundingClientRect();
    }
}

// On window load, call aSocketrain main.
window.addEventListener("load", aSocketrain.main);
