var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera();
var cube = null;
var container = document.querySelector('.webgl');
var span = document.querySelector('span');

var _event = {
  y: 0,
  deltaY: 0 };

var percentage = 0;

var divContainer = document.querySelector('.container');
var maxHeight = (divContainer.clientHeight || divContainer.offsetHeight) - window.innerHeight;

function initThree() {
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setClearColor(0x161216);
  camera.position.y = 10;
  camera.position.z = 100;
  resize();
  container.appendChild(renderer.domElement);
  addCube();
}

function addCube() {
  cube = new THREE.Mesh(new THREE.CubeGeometry(50, 50, 50), new THREE.MeshNormalMaterial());
  cube.position.y = 5;
  cube.position.z = 1;
  scene.add(cube);
}

function animate() {
  // render the 3D scene
  render();
  // relaunch the 'timer' 
  requestAnimationFrame(animate);
}

function render() {
  // easing with treshold on 0.08 (should be between .14 & .2 for smooth animations)
  percentage = lerp(percentage, -_event.y, .07);
  span.innerHTML = 'scroll Y : ' + Math.round(percentage * 100) / 100;
  // animate the cube
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.0125;
  cube.rotation.z += 0.012;
  renderer.render(scene, camera);
}
// linear interpolation function
function lerp(a, b, t) {
  return (1 - t) * a + t * b;
}

function init() {
  initThree();
  window.addEventListener('resize', resize, { passive: true });

  divContainer.addEventListener('wheel', onWheel, { passive: false });
  animate();
}

function resize() {
  // cointainer height - window height to limit the scroll at the top of the screen when we are at the bottom of the container
  maxHeight = (divContainer.clientHeight || divContainer.offsetHeight) - window.innerHeight;
  renderer.width = container.clientWidth;
  renderer.height = container.clientHeight;
  renderer.setSize(renderer.width, renderer.height);
  camera.aspect = renderer.width / renderer.height;
  camera.updateProjectionMatrix();
}

function onWheel(e) {
  // for the embedded demo
  e.stopImmediatePropagation();
  e.stopPropagation();
  e.preventDefault();

  var evt = _event;
  evt.deltaY = e.wheelDeltaY || e.deltaY * -1;
  // reduce by half the delta amount otherwise it scroll too fast
  evt.deltaY *= 0.5;

  scroll(e);
};

function scroll(e) {
  var evt = _event;
  // limit scroll top
  if (evt.y + evt.deltaY > 0) {
    evt.y = 0;
    // limit scroll bottom
  } else if (-(evt.y + evt.deltaY) >= maxHeight) {
    evt.y = -maxHeight;
  } else {
    evt.y += evt.deltaY;
  }
}

init();