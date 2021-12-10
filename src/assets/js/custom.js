const id = document.getElementById("drawflow");
const editor = new DrawFlow(id);
editor.reroute = true;
editor.reroute_fix_curvature = true;
editor.force_first_input = false;
editor.start();

// Events!
editor.on('nodeCreated', function (id) {
  const node = document.getElementById(`node-${id}`);
  node.dispatchEvent(new Event('nodeCreated', {bubbles: true}));
})

editor.on('nodeRemoved', function (id) {
  const node = document.getElementById(`node-${id}`);
  document.dispatchEvent(new Event('nodeRemoved', {bubbles: true}));
})

editor.on('nodeSelected', function (id) {
  const node = document.getElementById(`node-${id}`);
  node.dispatchEvent(new Event('nodeSelected', {bubbles: true}));
})

editor.on('moduleCreated', function (name) {
  console.log("Module Created " + name);
})

editor.on('moduleChanged', function (name) {
  console.log("Module Changed " + name);
})

editor.on('connectionCreated', function (connection) {
  console.log('Connection created');
  console.log(connection);
})

editor.on('connectionRemoved', function (connection) {
  console.log('Connection removed');
  console.log(connection);
})

editor.on('nodeMoved', function (id) {
  const node = document.getElementById(`node-${id}`);
  node.dispatchEvent(new Event('nodeMoved', {bubbles: true}));
})

editor.on('zoom', function (zoom) {
  console.log('Zoom level ' + zoom);
})

editor.on('translate', function (position) {
  // console.log('Translate x:' + position.x + ' y:' + position.y);
})

editor.on('addReroute', function (id) {
  console.log("Reroute added " + id);
})

editor.on('removeReroute', function (id) {
  console.log("Reroute removed " + id);
})
/* DRAG EVENT */

/* Mouse and Touch Actions */

const elements = document.getElementsByClassName('drag-drawflow');
for (let i = 0; i < elements.length; i++) {
  elements[i].addEventListener('touchend', drop, false);
  elements[i].addEventListener('touchmove', positionMobile, false);
  elements[i].addEventListener('touchstart', drag, false);
}

let mobile_item_select = '';
let mobile_last_move = null;

function positionMobile(ev) {
  mobile_last_move = ev;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  if (ev.type === "touchstart") {
    mobile_item_select = ev.target.closest(".drag-drawflow").getAttribute('data-node');
  } else {
    ev.dataTransfer.setData("node", ev.target.getAttribute('data-node'));
  }
}

function drop(ev) {
  if (ev.type === "touchend") {
    const parentdrawflow = document.elementFromPoint(mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY).closest("#drawflow");
    if (parentdrawflow != null) {
      addNodeToDrawFlow(mobile_item_select, mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY);
    }
    mobile_item_select = '';
  } else {
    ev.preventDefault();
    const node = ev.dataTransfer.getData("node");
    addNodeToDrawFlow(JSON.parse(node), ev.clientX, ev.clientY);
  }

}

function addNodeToDrawFlow(node, pos_x, pos_y) {
  if (editor.editor_mode === 'fixed') {
    return false;
  }
  pos_x = pos_x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)) - (editor.precanvas.getBoundingClientRect().x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)));
  pos_y = pos_y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)) - (editor.precanvas.getBoundingClientRect().y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)));

  let newNode = ``;
  if (node.type === 'ORIGIN_NODE_1') {
    newNode = `
          <div class="title-box">(Node 1) Source Node</div>
        `;
    editor.addNode(node.type, 0, 1, pos_x, pos_y, node.type, {dataNode: node}, newNode);
  } else if (node.type === 'ORIGIN_NODE_2') {
    newNode = `
          <div class="title-box">(Node 2) Process Node</div>
        `;
    editor.addNode(node.type, 1, 1, pos_x, pos_y, node.type, {dataNode: node}, newNode);
  } else if (node.type === 'ORIGIN_NODE_3') {
    newNode = `
          <div class="title-box"> (Node 3) Sink Node</div>
        `;
    editor.addNode(node.type, 1, 0, pos_x, pos_y, node.type, {dataNode: node}, newNode);
  } else {
    newNode = `
          <div class="title-box"> (Node 4) Process Node</div>
        `;
    editor.addNode(node.type, 1, 1, pos_x, pos_y, node.type, {dataNode: node}, newNode);
  }
}

let transform = '';

function showPopup(e) {
  e.target.closest(".drawflow-node").style.zIndex = "9999";
  e.target.children[0].style.display = "block";
  //document.getElementById("modalfix").style.display = "block";

  //e.target.children[0].style.transform = 'translate('+translate.x+'px, '+translate.y+'px)';
  transform = editor.precanvas.style.transform;
  editor.precanvas.style.transform = '';
  editor.precanvas.style.left = editor.canvas_x + 'px';
  editor.precanvas.style.top = editor.canvas_y + 'px';

  //e.target.children[0].style.top  =  -editor.canvas_y - editor.container.offsetTop +'px';
  //e.target.children[0].style.left  =  -editor.canvas_x  - editor.container.offsetLeft +'px';
  editor.editor_mode = "fixed";

}

function closeModal(e) {
  e.target.closest(".drawflow-node").style.zIndex = "2";
  e.target.parentElement.parentElement.style.display = "none";
  //document.getElementById("modalfix").style.display = "none";
  editor.precanvas.style.transform = transform;
  editor.precanvas.style.left = '0px';
  editor.precanvas.style.top = '0px';
  editor.editor_mode = "edit";
}

function changeModule(event) {
  const all = document.querySelectorAll(".menu ul li");
  for (let i = 0; i < all.length; i++) {
    all[i].classList.remove('selected');
  }
  event.target.classList.add('selected');
}
