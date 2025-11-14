const SceneView = await $arcgis.import("@arcgis/core/views/SceneView.js");
const WebScene = await $arcgis.import("@arcgis/core/WebScene.js");
const SceneLayer = await $arcgis.import("@arcgis/core/layers/SceneLayer.js");
const FeatureLayer = await $arcgis.import("@arcgis/core/layers/FeatureLayer.js");
const TileLayer = await $arcgis.import("@arcgis/core/layers/TileLayer.js");
const VectorTileLayer = await $arcgis.import("@arcgis/core/layers/VectorTileLayer.js");
const Basemap = await $arcgis.import("@arcgis/core/Basemap.js");
const FeatureFilter = await $arcgis.import("@arcgis/core/layers/support/FeatureFilter.js");
const Compass = await $arcgis.import("@arcgis/core/widgets/Compass.js");
const reactiveUtils = await $arcgis.import("@arcgis/core/core/reactiveUtils.js");

const Graphic = await $arcgis.import("@arcgis/core/Graphic.js");
const GraphicsLayer = await $arcgis.import("@arcgis/core/layers/GraphicsLayer.js");
const Mesh = await $arcgis.import("@arcgis/core/geometry/Mesh.js");
const Point = await $arcgis.import("@arcgis/core/geometry/Point.js");
const SpatialReference = await $arcgis.import("@arcgis/core/geometry/SpatialReference.js");
const meshUtils = await $arcgis.import("@arcgis/core/geometry/support/meshUtils.js");
const FillSymbol3DLayer = await $arcgis.import("@arcgis/core/symbols/FillSymbol3DLayer.js");
const MeshSymbol3D = await $arcgis.import("@arcgis/core/symbols/MeshSymbol3D.js");
const MeshMaterial = await $arcgis.import("@arcgis/core/geometry/support/MeshMaterial.js");
const MeshLocalVertexSpace = await $arcgis.import("@arcgis/core/geometry/support/MeshLocalVertexSpace.js");

/***Send images to modal and launch***/

$('.app-image').click(function (e) {
  let location = $(e.target).attr('src')
  let caption = $(e.target).attr('data-caption')
  $('#neatModalImg').attr('src', location);
  $('#img-modal').fadeIn(500);
  $('#img-caption').html(caption);
});

/***Fade in Splash Screen on Load***/

$(document).ready(function(){
    $(".splash-container")
    .css("display", "flex")
    .hide()
    .fadeIn();
});


//Splash button initially disabled until DC Buildings layer loads

const splashButton = document.querySelector(".splash-btn");

splashButton.disabled = true;

/***Close Splash Screen***/

$('.splash-btn').click(function () {
    $('.splash-container').fadeOut(700);
    view.goTo({
        position: {
          spatialReference: {
            // latestWkid: 3857,
            wkid: 3857
          },
           x: -8577663.253492767,
          y: 4705478.411412261,
          z: 151.3735215915367
        },
        heading: 79.01463482473405,
        tilt: 81.57362053851135
    }, {
      duration: 7000
    });
    startIntroAnimation();
})

/***Trigger About Modal***/

$('.nav-item:nth-of-type(5)').click(function () {
  $('#about-modal').fadeIn(500);
})

/***Close all modals***/

$('#about-close, #img-close').click(function () {
    $('#img-modal').fadeOut(500);
    $('#about-modal').fadeOut(500);
})

/***Open / Close side panel***/

$('#panel-btn').click(function(){
  $('.side-panel').toggleClass('on');
  $('#panel-btn').toggleClass('on');
});

$('#panel-close').click(function(){
  $('.side-panel').removeClass('on');
  $('#panel-btn').toggleClass('on');
});

/***Open / Close about panel***/

$('#help-btn').click(function(){
  $('.help-panel').toggleClass('on');
  $('#help-btn').toggleClass('on');
});

$('#help-close').click(function(){
  $('.help-panel').toggleClass('on');
  $('#help-btn').toggleClass('on');
});

/***Turn on RC structures labels***/

$('#labelSwitch').change(function(){
  if ($(this).is(':checked')) {
    rcStructures.labelingInfo = [structureUseLabel]
    newDealBuildingsLabelPoint.labelingInfo = [newDealLabel]
  } else {
    rcStructures.labelingInfo = [""]
    newDealBuildingsLabelPoint.labelingInfo = [""]
  }
})

/***Toggle Tree Layer***/

$('#treeSwitch').change(function(){
  if ($(this).is(':checked')) {
    rcTrees.visible = false;
  } else {
    rcTrees.visible = true;
  }
})

/***Change weather***/

$('#weatherSwitch').change(function(){
  if ($(this).is(':checked')) {
    view.environment.weather = {
      type: "rainy",
      precipitation: 0.7,
      cloudCover: 0.7  
    };
  } else {
    view.environment.weather = {
      type: "cloudy",
      cloudCover: 0.5  
    };
  }
})

/***See a picture***/

const opts = {
  duration: 4500
};

$('#pictureSwitch').change(function(){
  if ($(this).is(':checked')) {
    planeGraphic.visible = true;
    view.goTo({
        position: {
          spatialReference: {
            // latestWkid: 3857,
            wkid: 3857
          },
          x: -8576679.20928113,
          y: 4705724.339036823,
          z: 10.870980000123382
        },
        heading: 171.26830269409342,
        tilt: 83.8963921996654 
    }, opts);
  } else {
    planeGraphic.visible = false;
  }
})

/***Toggle Timeline Div */

$('#timelineSwitch').change(function(){
  if ($(this).is(':checked')) {
    $('.timeline').addClass('show');
    resetAnimation();
  } else {
    $('.timeline').removeClass('show');
  }
})

/***Add Map Layers***/

const rcStructures = new SceneLayer({
  url: "https://services2.arcgis.com/njxlOVQKvDzk10uN/arcgis/rest/services/RC_Models_Time_ID_Feature_Layer/SceneServer",
  renderer: rcStructuresRenderer,
  // labelingInfo: [structureUseLabel],
  labelingInfo: [""],
  outFields: ["*"],
  id: 'rcStructures',
  elevationInfo: {
    mode: "on-the-ground"
  },
  popupEnabled: false,
  opacity: 1
});

const newDealBuildings = new SceneLayer({
  url: "https://tiles.arcgis.com/tiles/njxlOVQKvDzk10uN/arcgis/rest/services/NewDeal_Mall_Structures/SceneServer",
  renderer: dcBuildingsRenderer,
  popupEnabled: false
});

const newDealBuildingsLabelPoint = new FeatureLayer({
  url: "https://services2.arcgis.com/njxlOVQKvDzk10uN/arcgis/rest/services/New_Deal_Building_Label/FeatureServer",
  labelingInfo: [""],
  renderer: newDealPointRenderer
})

const rcTrees = new SceneLayer({                    
  url:"https://tiles.arcgis.com/tiles/njxlOVQKvDzk10uN/arcgis/rest/services/RC_Trees_Expanded/SceneServer",
  opacity: 0.7,
  popupEnabled: false
});

const mallGroundCover = new FeatureLayer({
  url: "https://services2.arcgis.com/njxlOVQKvDzk10uN/arcgis/rest/services/Mall_Cover/FeatureServer",
  elevationInfo: {
    mode: "on-the-ground",
  },
  maxScale: 0,
  renderer: mallRenderer,
  popupEnabled: false
});

const dcBuildings = new SceneLayer({
  url: "https://services.arcgis.com/neT9SoYxizqTHZPH/arcgis/rest/services/DC_3D_Buildings/SceneServer",
  definitionExpression: "EGID NOT IN ('DC00002813', 'DC00002812', 'DC00002810', 'DC00002811', 'DC00002814', 'DC00002809')",
  renderer: dcBuildingsRenderer,
  popupEnabled: false
});

/***Mesh / Graphics Layers***/

const graphicsLayer = new GraphicsLayer({
  elevationInfo: {
    mode: "absolute-height"
  }
});

const point = new Point({
  x: -8576674.306947947,
  y: 4705681.796168767,
  z: 7,
  spatialReference: SpatialReference.WebMercator
});

const plane = Mesh.createPlane(point, {size: { height: 7, width: 14}, facing: "north", vertexSpace: "georeferenced"});

plane.rotate(0,0,0);

plane.components[0].material = new MeshMaterial({
  colorTexture: {url: "./assets/images/Image3.jpg"}
});

const planeGraphic = new Graphic({
  geometry: plane,
  visible: false,
  symbol: new MeshSymbol3D({
    symbolLayers: [new FillSymbol3DLayer({
      material: {
        color: null
      }
    })]
  })
});

planeGraphic.attributes = {
  "caption": "This is a test caption for the planeGraphic"
};

graphicsLayer.addMany([planeGraphic]);

/***Basemap Layers***/

const vectorTileLayer = new VectorTileLayer({
    portalItem: {
      id: "86a5d38d9933473cb9c7645f61068295", // Custom CRMP Basemap
    },
    opacity: 0.75,
  });

const hillshadeTileLayer = new TileLayer({
  portalItem: {
    id: "1b243539f4514b6ba35e7d995890db1d", // World Hillshade
  },
});

const customBasemap = new Basemap({ baseLayers: [hillshadeTileLayer, vectorTileLayer] });

/***Create Map and SceneView***/

const map = new WebScene({
    basemap: customBasemap,
    // basemap: "topo-3d",
    ground: "world-elevation",
    layers: [rcStructures, graphicsLayer, mallGroundCover, rcTrees, newDealBuildingsLabelPoint, newDealBuildings, dcBuildings],
});

map.ground.opacity = 1;

const view = new SceneView({
    container: "viewDiv",
    map: map,
    qualityProfile: "high",
    highlights: [
      {name: "custom", color: "#649b92", haloColor: "#649b92", haloOpacity: 0.9, fillOpacity: 0.5, shadowOpacity: 0.2}
    ],
    environment: {
      background:{
          type: "color", 
          color: [244, 245, 240, 1]
      },
      atmosphereEnabled: false,
      starsEnabled: false
    },
    constraints: {
      altitude: {
        min: 0,
        max: 5000
      }
    },
    camera: {
        position: {
          spatialReference: {
            wkid: 3857
          },
          x: -8578333.504165262,
          y: 4705456.0978203695,
          z: 183.14629888907075
        },
        heading: 86.97859465761329,
        tilt: 83.64442210800793 
    },
    environment: {
      lighting: {
          directShadowsEnabled: true
      }
    },
    ui: {
        components: []
    },
    viewingMode: "global"
});

view.environment.weather = {
  type: "cloudy",
  cloudCover: 0.5  
};

/***Add Compass Widget***/

const zoomButtonsDiv = document.getElementById("zoomButtons");

const compassWidget = new Compass({
  view: view, 
  container: zoomButtonsDiv
});

/***Custom Zoom In/Out Buttons***/

function changeZoom(delta) {
  const camera = view.camera.clone();
  const scale = delta > 0 ? 0.7 : 1.3;
  const newPos = camera.position.clone();
  newPos.x = (newPos.x - view.center.x) * scale + view.center.x;
  newPos.y = (newPos.y - view.center.y) * scale + view.center.y;
  newPos.z = (newPos.z - view.center.z) * scale + view.center.z;
  
  camera.position = newPos;
  view.goTo(camera, { duration: 500, easing: "ease-in-out" });
}

document.getElementById("zoom-in-btn").addEventListener("click", () => {
  changeZoom(1);
});

document.getElementById("zoom-out-btn").addEventListener("click", () => {
  changeZoom(-1);
});

/***Start HitTest Cursor Pointer Functionality***/

view.on("pointer-move", (event) => {
  const opts = {
    include: [rcStructures, graphicsLayer]
  }
  view.hitTest(event, opts).then((response) => {
    if (response.results.length) {
      document.getElementById("viewDiv").style.cursor = "pointer";
    } else {
      document.getElementById("viewDiv").style.cursor = "default";
    }
  });
});

/***Start Popup HitTest Functionality***/

let popupImgUrl = document.getElementById('popup-image-id');
let popupText = document.querySelector('.popup-text')

let highlight;

view.on("immediate-click", (event) => {
  view.hitTest(event).then((hitResult) => {
    if (hitResult.results.length > 0 && hitResult.results[0].graphic.layer.id == "rcStructures") {
        
      /***Make popup div visible***/
    
      $('#cardId').fadeIn();
      $('#cardId').css('display','flex');

      /***Add Popup Content***/

      popupImgUrl.src="./assets/images/placeholder2.jpg";
      popupText.innerHTML = "";

      /***Highlight points functionality***/

      let result = hitResult.results[0].graphic;

      view.whenLayerView(result.layer).then((layerView) => {
          highlight?.remove();
          highlight = layerView.highlight(result, { name: "custom"});
      });

      

    } else if (hitResult.results.find(r => r.graphic === planeGraphic)) {

      console.log(planeGraphic.attributes.caption);
      
      $('#cardId').fadeIn();
      $('#cardId').css('display','flex');

      popupImgUrl.src = "./assets/images/Image3.jpg";
      popupText.innerHTML = String(planeGraphic.attributes.caption);
    
    } else {
        $('#cardId').fadeOut();
        highlight?.remove();

        const { x, y, z } = event.mapPoint;
        console.log(`Clicked at X: ${x}, Y: ${y}, Z: ${z}`);
    }
  })
})

/***View Coordinates***/

// view.watch('camera.position', function(newValue, oldValue, property, object) {
//   console.log(property , newValue);
// });

// view.watch('camera.heading', function(newValue, oldValue, property, object) {
//   console.log(property , newValue);
// });

// view.watch('camera.tilt', function(newValue, oldValue, property, object) {
//   console.log(property , newValue);
// });

/***Timeline Animation***/

const sequenceField = "Const_Time_Integer";
const dateText = document.querySelector('.automated-date');

let layerView;
let animationInterval;
let currentValue = 0;
let maxValue = 0;

//Create Query for Animation

view.whenLayerView(rcStructures).then(async (lv) => {
  layerView = lv;

  const query = rcStructures.createQuery();
  query.where = "1=1";
  query.outStatistics = [{
    onStatisticField: sequenceField,
    outStatisticFieldName: "max_seq",
    statisticType: "max"
  }];

  const result = await rcStructures.queryFeatures(query);
  maxValue = result.features[0].attributes.max_seq || 100;
});

//Update Progress Bar

function updateProgress() {
  if (!maxValue) return;
  const percent = (currentValue / maxValue) * 100;
  progressBar.style.width = percent + "%";
}

//Update date text

function updateDateText () {
  if (currentValue >= 1 && currentValue <= 58) {
    dateText.innerHTML = 'May 13, 1968'
  } else if (currentValue >= 59 && currentValue <= 115) {
    dateText.innerHTML = 'May 14, 1968'
  } else if (currentValue >= 116 && currentValue <= 154) {
    dateText.innerHTML = 'May 17, 1968'
  } else if (currentValue >= 155 && currentValue <= 565) {
    dateText.innerHTML = 'May 24, 1968'
  } else if (currentValue >= 566 && currentValue <= 568) {
    dateText.innerHTML = 'May 29, 1968'
  } else if (currentValue >= 569 && currentValue <= 712) {
    dateText.innerHTML = 'June 1, 1968'
  } else {

  }
}

//Intro Animation Sequence 

function startIntroAnimation() {

  if (!layerView) return;

  clearInterval(animationInterval);

  animationInterval = setInterval(() => {
    currentValue++;
    if (currentValue > maxValue) {
      clearInterval(animationInterval);
      return;
    }

    layerView.filter = {
      where: `${sequenceField} <= ${currentValue}`
    };
  }, .1); 

};

//Start Timline Animation Button

function startAnimation() {

  if (!layerView) return;

  clearInterval(animationInterval);

  animationInterval = setInterval(() => {
    currentValue++;
    if (currentValue > maxValue) {
      clearInterval(animationInterval);
      return;
    }

    layerView.filter = {
      where: `${sequenceField} <= ${currentValue}`
    };

    updateProgress();
    updateDateText();
  }, 20); 
};

//Pause Animation Button

function pauseAnimation() {
  clearInterval(animationInterval);
}

//Reset Animation Button

function resetAnimation() {
  clearInterval(animationInterval);
  currentValue = 0;
  if (layerView) {
    layerView.filter = null;
  }
  updateProgress();
  dateText.innerHTML = 'May 13, 1968'
}

//Create Button Event Listeners

document.getElementById("startBtn").addEventListener("click", startAnimation);
document.getElementById("pauseBtn").addEventListener("click", pauseAnimation);
document.getElementById("resetBtn").addEventListener("click", resetAnimation);

/***End Timeline Animation*/

/****Close Splashscreen after DC Buildings Layer Load****/

const loadingText = document.querySelector(".splash-loading-text");
const loadedText = document.querySelector(".splash-loaded-text");

view.whenLayerView(dcBuildings).then((layerView) => {
  reactiveUtils.whenOnce(() => !layerView.updating).then(() => {
    splashButton.style.background = 'var(--Dark-Brown)'
    splashButton.style.cursor = 'pointer'
    splashButton.disabled = false;
    loadingText.style.display = 'none';
    loadedText.style.display = 'flex';
  });
});