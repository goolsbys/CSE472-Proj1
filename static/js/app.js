const FFTSIZE = 128;
var renderer;
var camera;
var scene;
var cube;
var container = document.getElementById("container");
var analyser;
var proton = new Proton();

function init() {
    initScene();
    initAudio();
    initProton();
    animate();
}

function initScene() {
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 5;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
}

function initAudio() {
    var audioLoader = new THREE.AudioLoader();
    var listener = new THREE.AudioListener();
    var audio = new THREE.Audio( listener );
    audioLoader.load( 'sound/arabella.mp3', function ( buffer ) {
        audio.setBuffer( buffer );
        audio.setLoop( true );
        audio.play();
    } );
    analyser = new THREE.AudioAnalyser( audio, FFTSIZE );
}

function initProton() {
    proton = new Proton();
    proton.addEmitter(createEmitter());
    proton.addRender(new Proton.SpriteRender(scene));
}

function createSprite() {
    var map = new THREE.TextureLoader().load("static/img/dot.png");
    var material = new THREE.SpriteMaterial({
        map: map,
        color: 0xff0000,
        blending: THREE.AdditiveBlending,
        fog: true
    });
    return new THREE.Sprite(material);
}

/*
 * Create Particle Emitter using Proton
 */
function createEmitter() {
    emitter = new Proton.Emitter();
    emitter.rate = new Proton.Rate(new Proton.Span(5, 10), new Proton.Span(.1, .25));
    emitter.addInitialize(new Proton.Mass(1));
    emitter.addInitialize(new Proton.Radius(100));
    emitter.addInitialize(new Proton.Life(2, 4));
    emitter.addInitialize(new Proton.Body(createSprite()));
    emitter.addInitialize(new Proton.Position(new Proton.BoxZone(100)));
    emitter.addInitialize(new Proton.Velocity(200, new Proton.Vector3D(0, 1, 1), 180));

    emitter.addBehaviour(new Proton.Rotate("random", "random"));
    emitter.addBehaviour(new Proton.Scale(1, 0.5));
    emitter.addBehaviour(new Proton.Alpha(1, 0, Infinity, Proton.easeInQuart));
    var zone2 = new Proton.BoxZone(400);
    emitter.addBehaviour(new Proton.Color(0xff0000, 'random', Infinity, Proton.easeOutQuart));

    emitter.p.x = 0;
    emitter.p.y = 0;
    emitter.emit();
    return emitter;
}

/*
 * Animate the scene
 */
function animate() {
    requestAnimationFrame(animate);
    render();
}

var tha = 0;

/*
 * Render the scene
 */
function render() {
    analyser.getFrequencyData();
    proton.update();
    renderer.render(scene, camera);

    camera.lookAt(scene.position);
    tha += .02;
    camera.position.x = Math.sin(tha) * 500;
    camera.position.z = Math.cos(tha) * 500;
}

init();
