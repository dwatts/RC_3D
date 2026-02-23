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

/***Start: Global code to send images on click to modal and launch***/

$('.app-image').click(function (e) {
  let location = $(e.target).attr('src')
  let caption = $(e.target).attr('data-caption')
  $('#neatModalImg').attr('src', location);
  $('#img-modal').fadeIn(500);
  $('#img-caption').html(caption);
});

/***Start: Fade in Splash Screen on Load***/

function showDivInner() {
  $(".splash-inner").fadeIn(500);
}

$(document).ready(function(){
    $(".splash-container")
    .css("display", "flex")
    .hide()
    .fadeIn();
    setTimeout(showDivInner, 2000);
});


/***Start: Close splash screen options: guided tour or self explore***/

//Splash button initially disabled until DC Buildings layer loads

const splashGuidedButton = document.querySelector(".splash-guided-btn");
const splashExploreButton = document.querySelector(".splash-explore-btn");


/************************************************/

//Guided Tour Launch Code

/************************************************/

$('.splash-guided-btn').click(function () {
    $('.splash-container').fadeOut(700);
    $('#dateDisplay').fadeIn(700);
    $('.left-panel-btn-container').css("display", "none");
    $('.right-panel-btn-container').css("display", "none");
    $('.full-screen-transparent').css("display", "flex");
    $('#tour-close').css("display", "none");

    function firstTask() {
      return new Promise((resolve) => {
        showIntroText(); 
        goToFirstView(); // Duration 16 seconds
        resolve();
      });
    }

    function secondTask() {
      return new Promise((resolve) => {
        setTimeout(() => {
          setTimeout(() => {
            
            goToPresetView();
            startIntroAnimation();
            showIntroDate();
            // animateCounter(counterElement, start, end, duration);
            

            setTimeout(() => {
              rcStructures.definitionExpression = "";
              resolve();
            }, 100);

          }, 50);

        }, 10000);
      });
    }

    function thirdTask() {
      return new Promise((resolve) => {
        setTimeout(() => {
          $('.guided-tour-side-panel').fadeIn(500);
          resolve();
        }, 13000)
      })
    }

    async function runTourTasksSequentially() {
      return firstTask()
        .then(() => secondTask())
        .then(() => thirdTask())
        .then(() => {
          console.log("All tasks completed");
        });
    }

    //Call async function
    runTourTasksSequentially();
});

//'Continue Guided Tour' button on Wiebenson side panel 
$('#guided-tour-btn').click(function () {
  toggleTour();
  $('.guided-tour-side-panel').fadeOut(500);
});

//'Continue Guided Tour' button on RC City Tour panel
$('#close-tour-btn').click(function () {
    $('.tour-panel').removeClass('active');
    $('.tour-btn').removeClass('on');

    toggle = 1;

    $('#pagination-container').pagination('selectPage', 1);

    view.goTo({
      position: {
        spatialReference: {
          // latestWkid: 3857,
          wkid: 3857
        },
        x: -8577412.745016245,
        y: 4705481.849946009,
        z: 114.86931450664997
      },
      heading: 72.34190637837995,
      tilt: 79.78677711088956
    }, {
      duration: 3000
    });

    graphicsLayer.graphics.forEach(g => {
      g.visible = false;
    });

    $('.tour-conclusion').addClass('active');
});

//End Guided Tour' button on Conclusion panel
$('#end-guided-tour-btn').click(function () {
    $('.tour-conclusion').removeClass('active');

    // Add map controls
    $('.left-panel-btn-container').css("display", "flex");
    $('.right-panel-btn-container').css("display", "flex");

    $('.full-screen-transparent').css("display", "none");
    $('.tour-panel-btn-holder').css("display", "none");
    $('.tour-panel').css("max-height", "70vh");

    $('#tour-close').css("display", "flex");

    // Highlight Stuctures
    view.whenLayerView(rcStructures).then((layerViewHighlight) => {
      highlightHandle = layerViewHighlight.highlight(specificIds, { name: "notable"});
    });

    // Programatically turn labels
    $('#labelSwitch')
      .prop('checked', true)
      .trigger('change');

    view.goTo({
      position: {
        spatialReference: {
          // latestWkid: 3857,
          wkid: 3857
        },
        x: -8577402.92788584,
        y: 4705134.3496611165,
        z: 405.9044241467491
      },
      heading: 54.60092337030268,
      tilt: 61.38437711848068
    }, {
      duration: 3000
    });    
});

/***Start: Guided Tour Intro Animation Functions***/

//Go to first view function

function goToFirstView() {
  view.goTo({
    position: {
      spatialReference: {
        wkid: 3857
      },
      x: -8577967.540472522,
      y: 4705685.053473854,
      z: 209.81217331252992
    },
    heading: 88.50749854394327,
    tilt: 73.64968337378207
  }, {
    duration: 14000
  });      
}

//Go to second view function

function goToPresetView() {
  view.goTo(
    {
      position: {
        spatialReference: {
          wkid: 3857
        },
        x: -8576553.117303116,
        y: 4704561.225728327,
        z: 396.86767570860684
      },
      heading: 358.9942796413037,
      tilt: 66.66810769718653
    },
    {
      duration: 10000
    }
  );
}

//Guided Tour Text Typing Animation (Show div, begin letter animation)

function showIntroText() {
    $(".intro-text-holder")
      .css("display", "flex") // set flex before showing
      .hide()
      .fadeIn(500)
      .delay(9000)
      .fadeOut(500)

      // .fadeOut(500, function () {
      //     $(this).css("display", "none");
      // });

    setTimeout(() => textTypingEffect(typingText, text), 1000)
}

//Text animation function

const typingText = document.querySelector(".date-sentence-text");
//98 characters in this sentence
const text = "Resurrection City was constructed and occupied over the course of 19 days in May and June of 1968.";

function textTypingEffect(element, text, i = 0, startTime = null) {
  const speed = 65;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;

    const elapsed = timestamp - startTime;
    const charactersToShow = Math.floor(elapsed / speed);

    element.textContent = text.slice(0, charactersToShow);

    if (charactersToShow < text.length) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

//Date Counter 

function showIntroDate() {
  $(".intro-date-holder")
    .css("display", "flex")
    .hide()
    .fadeIn(500)
    .delay(12000)
    .fadeOut(700)

  animateTimeline();
}

const display = document.getElementById("dateDisplay");
const counterElement = document.querySelector(".counter");

// Start date - May 13, 1968
const startDate = new Date(1968, 4, 13);

const start = 0;
const end = 19;              
const totalDateSpan = 19;    // Number of days to reach June 1
const durationTwo = 10000;

function animateTimeline() {
  let startTime = null;

  function update(timestamp) {
    if (!startTime) startTime = timestamp;

    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / durationTwo, 1);

    // Day Counter
    const currentDay = Math.floor(start + (end - start) * progress);
    counterElement.textContent = currentDay;

    // Date Counter
    const date = new Date(startDate);
    const scaledOffset = Math.round((currentDay - 1) * (totalDateSpan / (end - 1)));
    date.setDate(startDate.getDate() + scaledOffset);

    const formattedDate = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });

    display.textContent = formattedDate;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

animateTimeline();

/***End: Guided Tour Intro Animation Functions***/


/************************************************/

//Explore on your own launch code

/************************************************/

$('.splash-explore-btn').click(function () {
    $('.splash-container').fadeOut(700);
    view.goTo({
      position: {
        spatialReference: {
          // latestWkid: 3857,
          wkid: 3857
        },
        x: -8577402.92788584,
        y: 4705134.3496611165,
        z: 405.9044241467491
      },
      heading: 54.60092337030268,
      tilt: 61.38437711848068
    }, {
      duration: 3000
    });

    view.whenLayerView(rcStructures).then((layerViewHighlight) => {
      highlightHandle = layerViewHighlight.highlight(specificIds, { name: "notable"});
    });

    rcStructures.definitionExpression = "";
    $('.tour-panel-btn-holder').css("display", "none");
    $('#tour-close').css("display", "flex");
    $('.tour-panel').css("max-height", "70vh");
    
    $('#labelSwitch')
      .prop('checked', true)
      .trigger('change');
})

/***End: Close splash screen options: guided tour or self explore***/


/***Start: Open guided tour panel and start guided tour***/

let toggle = 1;

function toggleTour() {
  if (toggle == 1) {

    // Remove notable structure highlights
    if (highlightHandle) {
      highlightHandle.remove();
    }

    toggle = 0;
    $('.tour-panel').addClass('active');
    $('.tour-btn').addClass('on');

    view.goTo({
      position: {
        spatialReference: { wkid: 3857 },
        x: -8577004.779774044,
        y: 4705667.843296814,
        z: 10.543300992809236
      },
      heading: 83.59418325714013,
      tilt: 84.22649756027022
    }, { duration: 3000 });

    graphicsLayer.graphics.forEach(g => {
      g.visible = (g === imageOneGraphic);
    });

  } else if (toggle == 0) {

    toggle = 1;
    $('.tour-panel').removeClass('active');
    $('.tour-btn').removeClass('on');
    $('#pagination-container').pagination('selectPage', 1);

    // Add notable structure highlights
    view.whenLayerView(rcStructures).then((layerViewHighlight) => {
      highlightHandle = layerViewHighlight.highlight(specificIds, { name: "notable" });
    });

    view.goTo({
      position: {
        spatialReference: { wkid: 3857 },
        x: -8576700.517221361,
        y: 4704926.522271065,
        z: 748.4846795396879
      },
      heading: 359.4376327221278,
      tilt: 38.177992495378874
    }, { duration: 3000 });

    graphicsLayer.graphics.forEach(g => {
      g.visible = false;
    });
  }
}

$('#tour-btn').click(toggleTour);

/***End: Open guided tour panel and start guided tour***/

/***Start: Close Tour Panel***/

$('#tour-close' ).click(function(){
    toggle = 1;

    $('.tour-panel').removeClass('active');
    $('.tour-btn').removeClass('on');
    $('#pagination-container').pagination('selectPage', 1);
    

    //Add notable structure highlights
  
    view.whenLayerView(rcStructures).then((layerViewHighlight) => {
      highlightHandle = layerViewHighlight.highlight(specificIds, { name: "notable"});
    });

    view.goTo({
        position: {
          spatialReference: {
            // latestWkid: 3857,
            wkid: 3857
          },
          x: -8576700.517221361,
          y: 4704926.522271065,
          z: 748.4846795396879
        },
        heading: 359.4376327221278,
        tilt: 38.177992495378874
    }, {
      duration: 3000
    });

    graphicsLayer.graphics.forEach(g => {
        g.visible = false;
    });
});

/***End: Close Tour Panel***/

/***Start: Assorted controls code***/

//Trigger About Modal

$('.nav-item:nth-of-type(5)').click(function () {
  $('#about-modal').fadeIn(500);
})

//Close all modals

$('#about-close, #img-close').click(function () {
    $('#img-modal').fadeOut(500);
    $('#about-modal').fadeOut(500);
})

//Open / Close side panel

$('#panel-btn').click(function(){
  $('.side-panel').toggleClass('on');
  $('#panel-btn').toggleClass('on');
});

$('#panel-close').click(function(){
  $('.side-panel').removeClass('on');
  $('#panel-btn').toggleClass('on');
});

//Open / Close about panel

$('#help-btn').click(function(){
  $('.help-panel').toggleClass('on');
  $('#help-btn').toggleClass('on');
});

$('#help-close').click(function(){
  $('.help-panel').toggleClass('on');
  $('#help-btn').toggleClass('on');
});

//Close popups

$('#popup-close' ).click(function(){
    $('#cardId').fadeOut();
    highlight?.remove();
});

//Turn on RC structures labels

$('#labelSwitch').change(function(){
  if ($(this).is(':checked')) {
    rcStructureIcons.visible = true
    rcStructureIcons.labelingInfo = [structureUseLabel]
    newDealBuildingsLabelPoint.labelingInfo = [newDealLabel]
  } else {
    rcStructureIcons.visible = false
    rcStructureIcons.labelingInfo = [""]
    newDealBuildingsLabelPoint.labelingInfo = [""]
  }
})

//Toggle Tree Layer

$('#highlightSwitch').change(function(){
  if ($(this).is(':checked')) {
    highlightHandle.remove();
  } else {
    view.whenLayerView(rcStructures).then((layerViewHighlight) => {
      highlightHandle = layerViewHighlight.highlight(specificIds, { name: "notable"});
    });
  }
})

//Change weather

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

//Toggle Timeline Div

$('#timelineSwitch').change(function(){
  if ($(this).is(':checked')) {
    $('.timeline').addClass('show');
    resetAnimation();
  } else {
    $('.timeline').removeClass('show');
  }
})

/***End: Assorted controls code***/

/***Start: Add WebScene Layers***/

const rcStructures = new SceneLayer({
  url: "https://services3.arcgis.com/9nfxWATFamVUTTGb/arcgis/rest/services/Resurrection_City_Structure_Models/SceneServer",
  renderer: rcStructuresRenderer,
  outFields: ["*"],
  id: 'rcStructures',
  elevationInfo: {
    mode: "on-the-ground"
  },
  popupEnabled: false,
  definitionExpression: "Const_Time_Integer = 671"
});

const rcStructureIcons = new FeatureLayer({
  url: "https://services3.arcgis.com/9nfxWATFamVUTTGb/arcgis/rest/services/Structure_Label_Points/FeatureServer",
  popupEnabled: false,
  renderer: rcIconRenderer,
  labelingInfo: [""],
  visible: false
})

const newDealBuildings = new SceneLayer({
  url: "https://services3.arcgis.com/9nfxWATFamVUTTGb/arcgis/rest/services/New_Deal_Mall_Buildings/SceneServer",
  renderer: dcBuildingsRenderer,
  popupEnabled: false
});

const newDealBuildingsLabelPoint = new FeatureLayer({
  url: "https://services3.arcgis.com/9nfxWATFamVUTTGb/arcgis/rest/services/New_Deal_Structure_Label_Point/FeatureServer",
  labelingInfo: [""],
  renderer: newDealPointRenderer
})

const rcTrees = new SceneLayer({                    
  url: "https://services3.arcgis.com/9nfxWATFamVUTTGb/arcgis/rest/services/Resurrection_City_Trees/SceneServer",
  opacity: 0.7,
  popupEnabled: false
});

const mallGroundCover = new FeatureLayer({
  url: "https://services3.arcgis.com/9nfxWATFamVUTTGb/arcgis/rest/services/Mall_Area_Ground_Cover/FeatureServer",
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

/***End: Add WebScene Layers***/

/***Start: Mesh / Historic Images / Graphics Layers for Tour Images***/

const graphicsLayer = new GraphicsLayer({
  elevationInfo: {
    mode: "absolute-height"
  }
});

/*Image One*/

const imageOnePoint = new Point({
  x: -8576975.467217475,
  y: 4705667.056388107,
  z: 8,
  spatialReference: SpatialReference.WebMercator
});

const imageOnePlane = Mesh.createPlane(imageOnePoint, {size: { height: 6, width: 12}, facing: "west", vertexSpace: "georeferenced"});

imageOnePlane.rotate(0,0,0);

imageOnePlane.components[0].material = new MeshMaterial({
  colorTexture: {url: "./assets/images/TourImages/Stop_1.JPG"}
});

const imageOneGraphic = new Graphic({
  geometry: imageOnePlane,
  visible: false,
  symbol: new MeshSymbol3D({
    symbolLayers: [
      new FillSymbol3DLayer({
        material: { color: null },
        edges: {
          type: "solid",
          color: "#ffffff",
          size: 3
        }
      })
    ]
  })
});

imageOnePlane.attributes = {
  "caption": "This is a test caption for image one"
};

/*End Image One*/

/*Image Two*/

const imageTwoPoint = new Point({
  x: -8576962.715648185,
  y: 4705684.373811365,
  z: 8.5,
  spatialReference: SpatialReference.WebMercator
});

const imageTwoPlane = Mesh.createPlane(imageTwoPoint, {size: { height: 6, width: 12}, facing: "west", vertexSpace: "georeferenced"});

imageTwoPlane.rotate(0,0,20);

imageTwoPlane.components[0].material = new MeshMaterial({
  colorTexture: {url: "./assets/images/TourImages/Stop_2.JPG"}
});

const imageTwoGraphic = new Graphic({
  geometry: imageTwoPlane,
  visible: false,
  symbol: new MeshSymbol3D({
    symbolLayers: [
      new FillSymbol3DLayer({
        material: { color: null },
        edges: {
          type: "solid",
          color: "#ffffff",
          size: 3
        }
      })
    ]
  })
});

imageTwoPlane.attributes = {
  "caption": "This is a test caption for image two"
};

/*End Image Two*/

/*Image Three*/

const imageThreePoint = new Point({
  x: -8576888.084422419,
  y: 4705690.157280493,
  z: 8,
  spatialReference: SpatialReference.WebMercator
});

const imageThreePlane = Mesh.createPlane(imageThreePoint, {size: { height: 6, width: 12}, facing: "west", vertexSpace: "georeferenced"});

imageThreePlane.rotate(0,0,15);

imageThreePlane.components[0].material = new MeshMaterial({
  colorTexture: {url: "./assets/images/TourImages/Stop_3.JPG"}
});

const imageThreeGraphic = new Graphic({
  geometry: imageThreePlane,
  visible: false,
  symbol: new MeshSymbol3D({
    symbolLayers: [
      new FillSymbol3DLayer({
        material: { color: null },
        edges: {
          type: "solid",
          color: "#ffffff",
          size: 3
        }
      })
    ]
  })
});

imageThreePlane.attributes = {
  "caption": "This is a test caption for image three"
};

/*End Image Three*/

/*Image Four*/

const imageFourPoint = new Point({
  x: -8576824.272072172,
  y: 4705657.890354409,
  z: 7,
  spatialReference: SpatialReference.WebMercator
});

const imageFourPlane = Mesh.createPlane(imageFourPoint, {size: { height: 5, width: 10}, facing: "north", vertexSpace: "georeferenced"});

imageFourPlane.rotate(0,0,0);

imageFourPlane.components[0].material = new MeshMaterial({
  colorTexture: {url: "./assets/images/TourImages/Stop_4_1.JPG"}
});

const imageFourGraphic = new Graphic({
  geometry: imageFourPlane,
  visible: false,
  symbol: new MeshSymbol3D({
    symbolLayers: [
      new FillSymbol3DLayer({
        material: { color: null },
        edges: {
          type: "solid",
          color: "#ffffff",
          size: 3
        }
      })
    ]
  })
});

imageFourPlane.attributes = {
  "caption": "This is a test caption for image four"
};

/*End Image Four*/

/*Image Five*/

const imageFivePoint = new Point({
  x: -8576585.395584574,
  y: 4705689.322322281,
  z: 6,
  spatialReference: SpatialReference.WebMercator
});

const imageFivePlane = Mesh.createPlane(imageFivePoint, {size: { height: 4, width: 8}, facing: "west", vertexSpace: "georeferenced"});

imageFivePlane.rotate(0,0,0);

imageFivePlane.components[0].material = new MeshMaterial({
  colorTexture: {url: "./assets/images/TourImages/Stop_5.JPG"}
});

const imageFiveGraphic = new Graphic({
  geometry: imageFivePlane,
  visible: false,
  symbol: new MeshSymbol3D({
    symbolLayers: [
      new FillSymbol3DLayer({
        material: { color: null },
        edges: {
          type: "solid",
          color: "#ffffff",
          size: 3
        }
      })
    ]
  })
});

imageFivePlane.attributes = {
  "caption": "This is a test caption for image five"
};

/*End Image Five*/

/*Image Six*/

const imageSixPoint = new Point({
  x: -8576418.172697078,
  y: 4705706.755209459,
  z: 6,
  spatialReference: SpatialReference.WebMercator
});

const imageSixPlane = Mesh.createPlane(imageSixPoint, {size: { height: 4, width: 8}, facing: "north", vertexSpace: "georeferenced"});

imageSixPlane.rotate(0,0,0);

imageSixPlane.components[0].material = new MeshMaterial({
  colorTexture: {url: "./assets/images/TourImages/Stop_6_1.JPG"}
});

const imageSixGraphic = new Graphic({
  geometry: imageSixPlane,
  visible: false,
  symbol: new MeshSymbol3D({
    symbolLayers: [
      new FillSymbol3DLayer({
        material: { color: null },
        edges: {
          type: "solid",
          color: "#ffffff",
          size: 3
        }
      })
    ]
  })
});
imageSixPlane.attributes = {
  "caption": "This is a test caption for image five"
};

/*End Image Six*/

/*Image Seven*/

const imageSevenPoint = new Point({
  x: -8576727.67788017,
  y: 4705666.360655037,
  z: 7,
  spatialReference: SpatialReference.WebMercator
});

const imageSevenPlane = Mesh.createPlane(imageSevenPoint, {size: { height: 6, width: 12}, facing: "north", vertexSpace: "georeferenced"});

imageSevenPlane.rotate(0,0,0);

imageSevenPlane.components[0].material = new MeshMaterial({
  colorTexture: {url: "./assets/images/TourImages/Stop_7_1.JPG"}
});

const imageSevenGraphic = new Graphic({
  geometry: imageSevenPlane,
  visible: false,
  symbol: new MeshSymbol3D({
    symbolLayers: [
      new FillSymbol3DLayer({
        material: { color: null },
        edges: {
          type: "solid",
          color: "#ffffff",
          size: 3
        }
      })
    ]
  })
});

imageSevenPlane.attributes = {
  "caption": "This is a test caption for image five"
};

/*End Image Seven*/

/*Image Eight*/

const imageEightPoint = new Point({
  x: -8576709.849813217,
  y: 4705647.31064385,
  z: 7,
  spatialReference: SpatialReference.WebMercator
});

const imageEightPlane = Mesh.createPlane(imageEightPoint, {size: { height: 6, width: 12}, facing: "west", vertexSpace: "georeferenced"});

imageEightPlane.rotate(0,0,0);

imageEightPlane.components[0].material = new MeshMaterial({
  colorTexture: {url: "./assets/images/TourImages/Stop_8.JPG"}
});

const imageEightGraphic = new Graphic({
  geometry: imageEightPlane,
  visible: false,
  symbol: new MeshSymbol3D({
    symbolLayers: [
      new FillSymbol3DLayer({
        material: { color: null },
        edges: {
          type: "solid",
          color: "#ffffff",
          size: 3
        }
      })
    ]
  })
});

imageEightPlane.attributes = {
  "caption": "This is a test caption for image five"
};

/*End Image Eight*/

/*Image Nine*/

const imageNinePoint = new Point({
  x: -8576955.101205464,
  y: 4705827.734806871,
  z: 7,
  spatialReference: SpatialReference.WebMercator
});

const imageNinePlane = Mesh.createPlane(imageNinePoint, {size: { height: 8, width: 14}, facing: "west", vertexSpace: "georeferenced"});

imageNinePlane.rotate(0,0,0);

imageNinePlane.components[0].material = new MeshMaterial({
  colorTexture: {url: "./assets/images/TourImages/Stop_9.JPG"}
});

const imageNineGraphic = new Graphic({
  geometry: imageNinePlane,
  visible: false,
  symbol: new MeshSymbol3D({
    symbolLayers: [
      new FillSymbol3DLayer({
        material: { color: null },
        edges: {
          type: "solid",
          color: "#ffffff",
          size: 3
        }
      })
    ]
  })
});

imageNinePlane.attributes = {
  "caption": "This is a test caption for image nine"
};

/*End Image Nine*/

/***Add all image / graphics layers) */

graphicsLayer.addMany([imageOneGraphic, imageTwoGraphic, imageThreeGraphic, imageFourGraphic, imageFiveGraphic, imageSixGraphic, imageSevenGraphic, imageEightGraphic, imageNineGraphic]);

/***End: Mesh / Historic Images / Graphics Layers for Tour Images***/

/***Start: Add Custom Basemap Layers***/

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

/***End: Add Custom Basemap Layers***/

/***Start: Create Scene and SceneView***/

const map = new WebScene({
    basemap: customBasemap,
    // basemap: "topo-3d",
    ground: "world-elevation",
    layers: [rcStructures, rcStructureIcons, graphicsLayer, mallGroundCover, rcTrees, newDealBuildingsLabelPoint, newDealBuildings, dcBuildings],
});

map.ground.opacity = 1;

const view = new SceneView({
    container: "viewDiv",
    map: map,
    qualityProfile: "high",
    highlights: [
      {name: "notable", color: "#ff1303", haloColor: "#ff1303", haloOpacity: 1, fillOpacity: 0, shadowOpacity: 0.2},
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
        max: 7000
      }
    },
    camera: {
        position: {
          spatialReference: {
            wkid: 3857
          },
          x: -8582646.003874714,
          y: 4705325.325278847,
          z: 5634.258735703304
        },
        heading: 88.25759425850616,
        tilt: 37.01304637192474 
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

/***End: Create Scene and SceneView***/

/***Start: Add Compass Widget and Custom Zoom Buttons***/

//Add Compass Widget

const zoomButtonsDiv = document.getElementById("zoomButton");

const compassWidget = new Compass({
  view: view, 
  container: zoomButtonsDiv
});

//Custom Zoom In/Out Buttons

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

/***End: Add Compass Widget and Custom Zoom Buttons***/

/***Start: HitTest Cursor Pointer Functionality***/

view.on("pointer-move", (event) => {
  const opts = {
    include: [rcStructures/*, graphicsLayer*/]
  }
  view.hitTest(event, opts).then((response) => {
    if (response.results.length && response.results[0].graphic.attributes.Tour_Building == 1) {
      document.getElementById("viewDiv").style.cursor = "pointer";
    } else {
      document.getElementById("viewDiv").style.cursor = "default";
    }
  });
});

/***End: HitTest Cursor Pointer Functionality***/

/***Start: Popup HitTest Functionality***/

let popupImgUrl = document.getElementById('popup-image-id');
let popupTitle = document.querySelector('.popup-icon-title h3')

let highlight;

view.on("immediate-click", (event) => {
  view.hitTest(event).then((hitResult) => {
    if (hitResult.results.length > 0 && hitResult.results[0].graphic.layer.id == "rcStructures" && hitResult.results[0].graphic.attributes.Tour_Building == 1) {
        
      //Make popup div visible
    
      $('#cardId').fadeIn();
      $('#cardId').css('display','flex');

      //Add Popup Content

      let structureName = hitResult.results[0].graphic.attributes.Name;
      let popupIcon = document.querySelector('.popup-icon-title img');
      let popupImg = document.querySelector('.popup-text img');
      let popupCaption = document.querySelector('.popup-text p:nth-of-type(1)')
      let popupUse = document.querySelector('.popup-text p:nth-of-type(2) span');
      let popupDescription = document.querySelector('.popup-text p:nth-of-type(3) span');

      popupTitle.innerHTML = `${structureName}`;


      if (structureName == 'Meeting Tent') {
        // Meeting Tent
        popupIcon.src = './assets/icons/Gathering.png';
        popupImg.src = "./assets/images/PopupImages/MeetingTent.jpg";
        popupCaption.innerHTML = "Caption: People gather outside of tented canopy. Photo by Paul M. Schmick, Evening Star, 1968. DC Public Library, The People's Archive, Washington Star Photograph Collection.";
        popupUse.innerHTML = "General gathering area for resident meetings";
        popupDescription.innerHTML = "Several large public tents, including the meeting tent, were distributed up and down Main Street to facilitate organizing and communication.";
      } else if (structureName == 'Individual Residential') {
        // Individual Residential
        popupIcon.src = './assets/icons/Residential.png';
        popupImg.src = "./assets/images/PopupImages/IndividualRes.jpg";
        popupCaption.innerHTML = "Caption: Man inside a wooden structure at Resurrection City. Photo by Bernie Boston, Evening Star, 1968. DC Public Library, The People's Archive, Washington Star Photograph Collection.";
        popupUse.innerHTML = "Sleeping facilities for individuals";
        popupDescription.innerHTML = "Residential structures were designed along two scales: individual, which could accommodate two people, and group, which could fit 6-10 people. These “lean-to” style tent designs were standardized and relatively simple to assemble quickly.";
      } else if (structureName == 'Group Residential') {
        // Group Residential
        popupIcon.src = './assets/icons/Residential.png';
        popupImg.src = "./assets/images/PopupImages/MultiRes.jpg";
        popupCaption.innerHTML = "Caption: People build a large residential structure at Resurrection City. Photo by Paul M. Schmick, Evening Star. DC Public Library, the People's Archive, Washington Star Photograph Collection.";
        popupUse.innerHTML = "Sleeping facilities for groups and families";
        popupDescription.innerHTML = "Larger dormitory-style residences could fit up to ten people. Many residents welcomed the opportunity to customize the design of their shelters, whether by painting names, slogans, or their hometowns on the exterior, or even adding additions like a porch, awning, or rooftop deck.";
      } else if (structureName == 'Workshop / Meeting Tent') {
        // Workshop / Meeting Tent
        popupIcon.src = './assets/icons/Gathering.png';
        popupImg.src = "./assets/images/PopupImages/MeetingTent.jpg";
        popupCaption.innerHTML = "Caption: People gather outside of tented canopy. Photo by Paul M. Schmick, Evening Star, 1968. DC Public Library, The People's Archive, Washington Star Photograph Collection.";
        popupUse.innerHTML = "Gathering area for resident meetings and workshops";
        popupDescription.innerHTML = "Several large public tents, including the meeting tent, were distributed up and down Main Street to facilitate organizing and communication.";
      } else if (structureName == 'Security') {
        // Security
        popupIcon.src = './assets/icons/Security.png';
        popupImg.src = "./assets/images/PopupImages/Security.jpg";
        popupCaption.innerHTML = "Caption: Security headquarters, Resurrection City. John Wiebenson Collection, University of Maryland.";
        popupUse.innerHTML = "Security staff headquarters"
        popupDescription.innerHTML = "Security was originally handled by the Marshals, a group formed from among the residents of Resurrection City. Conflicts both between the Marshals and residents and within the organization itself around issues of excessive force prompted reforms. A new group, called the Tent City Rangers, was formed to fill in gaps of security and provide different services. A sense of competition, rather than coordination, shaped the dynamics between the Rangers and the Marshals, with negative consequences for the overall security of Resurrection City.";
      } else if (structureName == 'Campaign Leaders Compound') {
        // Campaign Leaders Compound
        popupIcon.src = './assets/icons/City_Hall.png';
        popupImg.src = "./assets/images/Popupimages/LeadersCompound.jpg";
        popupCaption.innerHTML = "Caption: City Hall in the process of being built at Resurrection City. Photo by Bernie Boston, Evening Star, 1968. DC Public Library, The People's Archive, Washington Star Photograph Collection.";
        popupUse.innerHTML = "Leadership residential area";
        popupDescription.innerHTML = "This photograph captures only some of the central leadership in the Poor People's Campaign and Resurrection City in the days leading up to construction. From left, Reies Tijerina, a spokesperson and activist in the Chicano movement and the leader of the Chicano contingent of the SCLC Poor People's March; Clifton Hill, a Native American leader and representative of the Creek tribe in Oklahoma (who left Washington not long after a confrontation with Ralph Abernathy); Rev. Bernard Lafayette, a veteran Civil Rights organizer with SNCC and the SCLC, along with a central planner of the Poor People's Campaign; and Rev. Walter Fauntroy, a Civil Rights veteran and former Congressional delegate for Washington, D.C. (1971-1991), who acted as the liaison between the NPS and federal government and organizers in the Poor People's Campaign. ";
      } else if (structureName == 'God\'s Eye Bakery') {
        // Gods Eye Bakery
        popupIcon.src = './assets/icons/Bakery.png';
        popupImg.src = "./assets/images/Popupimages/Bakery.jpg";
        popupCaption.innerHTML = "Caption: Man eats a piece of freshly baked bread at Resurrection City. Evening Star. DC Public Library, the People's Archive, Washington Star Photograph Collection.";
        popupUse.innerHTML = "Bakery supplying bread to residents";
        popupDescription.innerHTML = "The God's Eye Bakery was set up and operated by volunteers from The Diggers, a radical political collective from San Francisco (but with historical roots in early modern England) that contributed to Resurrection City in the spirit of solidarity and the commons. Volunteers baked fresh bread in recycled coffee cans for residents - working 16 hours a day, the volunteers produced over 2,000 loaves in the first weeks of its operation. ";
      } else if (structureName == 'Child Care') {
        // Day Care
        popupIcon.src = './assets/icons/Child_Care.png';
        popupImg.src = "./assets/images/PopupImages/Daycare.jpg";
        popupCaption.innerHTML = "Caption: Children play at Resurrection City. Photo by Paul M. Schmick, Evening Star. DC Public Library, The People's Archive, Washington Star Photograph Collection.";
        popupUse.innerHTML = "Child care facilities";
        popupDescription.innerHTML = "Although childcare and a school were part of the original plan for Resurrection City, organizers only had the resources to open a day care center. C's day care was located on Main Street, several yards beyond City Hall towards the Washington Monument. The structure was roughly 20'x6' and housed three separate classrooms, along with a porch running the length of the center. Chairs and tables, along with chalkboards, toys, and clothing, were donated by area charities and churches. Within the building, one room was reserved for infants, with cribs and small beds. The remaining rooms were used by teachers, staff, and students for recreation, lessons, snack time, and naps. Much of the staff were social workers, teachers, childcare workers, and some were SCLC members using their vacation time to be at Resurrection City.";
      } else if (structureName == 'Entertainment Tent') {
        // Entertainment Tent
        popupIcon.src = './assets/icons/Gathering.png';
        popupImg.src = "./assets/images/PopupImages/EntertainmentTent.jpg";
        popupCaption.innerHTML = "Caption: Nite Lite Poster. Southern Christian Leadership Conference Records, 1962-1969, 1968 June 24 Resurrection City, USA. Emory University Libraries.";
        popupUse.innerHTML = "Entertainment tent for residents";
        popupDescription.innerHTML = "Many different musicians, actors, and entertainers passed through Resurrection City over its duration, including Sidney Poitier, Jimmy Collier, Muddy Waters, Dizzy Gillespie, Peter Paul and Mary, and Pete Seeger. Residents also organized entertainment and recreation activities, as this flyer for a full Sunday of family-oriented programming shows.";
      } else if (structureName == 'Department of Sanitation') {
        // Department of Sanitation
        popupIcon.src = './assets/icons/Mechanic.png';
        popupImg.src = "";
        popupCaption.innerHTML = "";
        popupUse.innerHTML = "Facilities for santitation workers";
        popupDescription.innerHTML = "Add Department of Sanitaion information here.";
      } else if (structureName == 'Medical Unit' || structureName == 'Medical Services') {
        // Medical Services
        popupIcon.src = './assets/icons/Medical.png';
        popupImg.src = "";
        popupCaption.innerHTML = "";
        popupUse.innerHTML = "Medical services for residents";
        popupDescription.innerHTML = "Doctors made rounds starting each morning after breakfast, but on-call care was also available at the two medical units onsite: one owned by the Seventh Day Adventists, and the other by the District of Columbia Health Department. 300 members of the Medical Committee for Human Rights, an organization formed in 1965 by doctors and providers in Selma, provide the encampment's medical care. Everything from routine vaccinations for measles and polio to blood tests and X-rays, along with mental health care, was provided through Resurrection City's medical team.";
      } else if (structureName == 'Showers') {
        // Showers
        popupIcon.src = './assets/icons/Showers.png';
        popupImg.src = "./assets/images/Popupimages/Showers.jpg";
        popupCaption.innerHTML = "Caption: Two men lay pipe into the ground at Resurrection City. Evening Star, 1968. DC Public Library, The People's Archive, Washington Star Photograph Collection.";
        popupUse.innerHTML = "Shower facilities";
        popupDescription.innerHTML = "Despite ambitious plans to build and operate basic sanitation infrastructure like showers and running water, the limitations of Resurrection City's geography - its low-lying land, under the ownership of the federal government, and the limited duration of the encampment's permit - meant that a functional hygiene system was never put in. Instead, residents were bussed offsite to nearby churches and universities to bathe.";
      } else if (structureName == 'Dining Area') {
        // Dining Area
        popupIcon.src = './assets/icons/Food_Service.png';
        popupImg.src = "./assets/images/PopupImages/DiningTent.JPG";
        popupCaption.innerHTML = "Caption: Dining tent interior with people eating. Photo by John Vachon, Look Magazine. Library of Congress.";
        popupUse.innerHTML = "Main gathering area for food services";
        popupDescription.innerHTML = "The dining tent became a central social and meeting site for residents and organizers throughout the encampment. Despite the strained resources of Resurrection City, which made it impossible to provide hot meals on a regular basis, residents gravitated to the dining tents to socialize over a cup of coffee. John Wiebenson, an architect who was deeply involved in the planning and construction phases of Resurrection City, noted that the many entry points into the dining tent, along with its central location, made it a particularly inviting place for people to come and gather.";
      } else if (structureName == 'Food Storage Trailer') {
        // Food Storage Trailer
        popupIcon.src = './assets/icons/Food_Storage.png';
        popupImg.src = "./assets/images/PopupImages/FoodStorage.jpg";
        popupCaption.innerHTML = "Caption: Resurrection City's dining tent. Photo by Bernie Boston, Evening Star. DC Public Library, The People's Archive, Washington Star Photograph Collection.";
        popupUse.innerHTML = "Refrigerated trailers for onsite food storage";
        popupDescription.innerHTML = "Approximately 25 tons of donated food reached Resurrection City every day to feed residents. One hot meal was prepared in off-site kitchens at Howard University, St. John's High School, and St. Stephen's Church.";
      } else if (structureName == 'Toilet') {
        // Toilets
        popupIcon.src = './assets/icons/Restroom.png';
        popupImg.src = "./assets/images/PopupImages/Toilets.png";
        popupCaption.innerHTML = "Caption: Truck full of portable bathrooms arrives at Resurrection City. Photo by Ray Lustig, Evening Star. DC Public Library, The People's Archive, Washington Star Photograph Collection";
        popupUse.innerHTML = "Restroom facilities for residents";
        popupDescription.innerHTML = "Portable chemical toilets (twelve in total) were distributed throughout Resurrection City's residential areas, which were formed into compounds composed of nine residential structures (housing roughly 50 people) and an accompanying shower and toilet area.";
      } else if (structureName == 'Construction Warehouse Tent') {
        // Construction Tent
        popupIcon.src = './assets/icons/City_Hall.png';
        popupImg.src = "";
        popupCaption.innerHTML = "";
        popupUse.innerHTML = "Central area for construction supply distribution";
        popupDescription.innerHTML = "Add Construction Tent Information here.";
      } else if (structureName == 'City Hall') {
        // City Hall
        popupIcon.src = './assets/icons/City_Hall.png';
        popupImg.src = "./assets/images/PopupImages/CityHall.jpg";
        popupCaption.innerHTML = "Caption: Reies Tijerina, Clifton Hill, Reverend Bernard Lafayette, and Reverend Walter Fauntroy. Photo by Paul M. Schmick, Evening Star. DC Public Library, The People's Archive, Washington Star Photograph Collection.";
        popupUse.innerHTML = "Center of governance for Resurrection City";
        popupDescription.innerHTML = "Located near the center of Main Street, Resurrection City's primary thoroughfare, City Hall served as the symbolic and practical hub of political activity. City Hall was also an important base of operations with electricity and phone access, and a place where residents could organize for daily marches and lobbying efforts. Although much of the SCLC senior staff, including Ralph Abernathy, lived offsite at the nearby Pitt Motel, they spent most of their time onsite in City Hall.";
      } else if (structureName == 'Main Gathering Tent') {
        // Main Gathering Tent
        popupIcon.src = './assets/icons/Gathering.png';
        popupImg.src = "./assets/images/PopupImages/MainGatheringTent.JPG";
        popupCaption.innerHTML = "Caption: Main Gathering Tent interior. 6/23/1968. Photo by John Vachon, Look Magazine. Library of Congress.";
        popupUse.innerHTML = "Main gathering area for residents";
        popupDescription.innerHTML = "In the main gathering tent, residents could swap supplies and coordinate plans for off-site meetings and protests.";
      } else if (structureName == 'Information Services / Donations / Art Booth') {
        // Information Services / Donations / Art Booth
        popupIcon.src = './assets/icons/Public_Info.png';
        popupImg.src = './assets/images/Popupimages/InfoTent.jpg';
        popupCaption.innerHTML = "Caption: Women walking through mud in Resurrection City. Photo by Darrell C. Crain. 6/1/1968. DC Public Library, the People's Archive p35 Darrell C. Crain, Jr. Photograph Collection, 1968 Resurrection City and Solidarity Day";
        popupUse.innerHTML = "Donation facilities";
        popupDescription.innerHTML = "Just inside Resurrection's City's entrance, visitors and residents were oriented towards these basic information service areas, as well as a well-stocked donations tent that provided clothing and supplies.";
      } else if (structureName == 'Volunteer Sign-in Booth') {
        // Volunteer Sign-in Booth
        popupIcon.src = "./assets/icons/Public_Info.png";
        popupImg.src = "";
        popupCaption.innerHTML = "";
        popupUse.innerHTML = "Volunteer marshalling area";
        popupDescription.innerHTML = "Add Volunteer Sign-in Booth information here.";
      } else if (structureName == 'Dental Services') {
        // Dental Services
        popupIcon.src = './assets/icons/Medical.png';
        popupImg.src = "";
        popupCaption.innerHTML = "";
        popupUse.innerHTML = "Dental services for residents";
        popupDescription.innerHTML = "Two dental vans provided care to Resurrection City's residents throughout the encampment under the leadership of Dr. Joseph L. Henry, then the Dean of the Howard University School of Dentistry. Volunteer physicians and dentists on duty noted that many members of the Poor People's Campaign had never seen a doctor or dentist before.";
      } else if (structureName == 'Seventh Day Adventist') {
        // 7th Day Adventist
        popupIcon.src = './assets/icons/Public_Info.png';
        popupImg.src = "./assests/images/Popupimages/SeventhDayAdvent.jpg";
        popupCaption.innerHTML = "Caption: Seventh-Day Adventist Welfare Service Truck at Resurrection City. Photo by Darrell C. Crain. 6/1/1968. DC Public Library, The People's Archive, p 35 Darrell C. Crain, Jr. Photograph Collection, 1968 Resurrection City and Solidarity Day.";
        popupUse.innerHTML = "Sevent Day Adventists Services";
        popupDescription.innerHTML = "The Seventh-Day Adventist Church provided welfare and medical services in Resurrection City. The organization's mission as an NGO focuses on humanitarian relief efforts around the world.";
      } else if (structureName == 'Public Information Pavilion') {
        // Public Information Pavilion
        popupIcon.src = './assets/icons/Public_Info.png';
        popupImg.src = "";
        popupCaption.innerHTML = "";
        popupUse.innerHTML = "Primary area for public information";
        popupDescription.innerHTML = "Add Public Info Pavillion information here.";
      } else {
        ""
      };

      //Highlight Structures functionality

      let result = hitResult.results[0].graphic;

      view.whenLayerView(result.layer).then((layerView) => {
          highlight?.remove();
          highlight = layerView.highlight(result, { name: "custom"});
      });

    } /* else if (hitResult.results.find(r => r.graphic === planeGraphic)) {

      console.log(planeGraphic.attributes.caption);
      
      $('#cardId').fadeIn();
      $('#cardId').css('display','flex');

      popupImgUrl.src = "./assets/images/Image3.jpg";
      popupText.innerHTML = String(planeGraphic.attributes.caption);
    
    }*/ else {
        $('#cardId').fadeOut();
        highlight?.remove();

        const { x, y, z } = event.mapPoint;
        console.log(`Clicked at X: ${x}, Y: ${y}, Z: ${z}`);
    }
  })
});

/***End: Popup HitTest Functionality***/


/***Start: Add Special Highlight for Selected RC Structures***/

const specificIds = [10, 56, 57, 58, 59, 60, 61, 62, 63, 99, 100, 101, 102, 104, 105, 106, 143, 153, 157, 267, 268, 422, 499, 652, 653, 677, 680, 687, 688, 689, 711, 712];
let highlightHandle;

// view.whenLayerView(rcStructures).then((layerViewHighlight) => {
//   highlightHandle = layerViewHighlight.highlight(specificIds, { name: "notable"});
// });

/***End: Add Special Highlight for Selected RC Structures***/


/***See Camera Coordinates in Console***/

// view.watch('camera.position', function(newValue, oldValue, property, object) {
//   console.log(property , newValue);
// });

// view.watch('camera.heading', function(newValue, oldValue, property, object) {
//   console.log(property , newValue);
// });

// view.watch('camera.tilt', function(newValue, oldValue, property, object) {
//   console.log(property , newValue);
// });


/***Start: Timeline animation for both guided tour intro and timeline widget***/

const sequenceField = "Const_Time_Integer";
const dateText = document.querySelector('.automated-date');

let layerView;
let animationFrameId;
let currentValue = 0;
let maxValue = 0;

let startTime = null;
let pausedElapsed = 0;
const duration = 13000; // Animation length (ms)

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

// Timeline Animation Logic

function animate(timestamp) {
  if (!startTime) startTime = timestamp;

  const elapsed = timestamp - startTime + pausedElapsed;
  const progress = Math.min(elapsed / duration, 1);

  currentValue = Math.floor(progress * maxValue);

  layerView.filter = {
    where: `${sequenceField} <= ${currentValue}`
  };

  updateProgress();
  updateDateText();

  if (progress < 1) {
    animationFrameId = requestAnimationFrame(animate);
  }
}

function startIntroAnimation() {
  if (!layerView) return;

  cancelAnimationFrame(animationFrameId);
  startTime = null;
  pausedElapsed = 0;
  animationFrameId = requestAnimationFrame(animate);
}

// Timeline Controls

function startAnimation() {
  if (!layerView) return;

  cancelAnimationFrame(animationFrameId);
  animationFrameId = requestAnimationFrame(animate);
}

function pauseAnimation() {
  cancelAnimationFrame(animationFrameId);

  if (startTime !== null) {
    pausedElapsed += performance.now() - startTime;
    startTime = null;
  }
}

function resetAnimation() {
  cancelAnimationFrame(animationFrameId);

  currentValue = 0;
  startTime = null;
  pausedElapsed = 0;

  if (layerView) {
    layerView.filter = null;
  }

  updateProgress();
  dateText.innerHTML = 'May 13, 1968';
}

// Timeline Progress Bar

function updateProgress() {
  if (!maxValue) return;
  const percent = (currentValue / maxValue) * 100;
  progressBar.style.width = percent + "%";
}

function updateDateText() {
  if (currentValue >= 1 && currentValue <= 58) {
    dateText.innerHTML = 'May 13, 1968';
  } else if (currentValue >= 59 && currentValue <= 115) {
    dateText.innerHTML = 'May 14, 1968';
  } else if (currentValue >= 116 && currentValue <= 154) {
    dateText.innerHTML = 'May 17, 1968';
  } else if (currentValue >= 155 && currentValue <= 565) {
    dateText.innerHTML = 'May 24, 1968';
  } else if (currentValue >= 566 && currentValue <= 568) {
    dateText.innerHTML = 'May 29, 1968';
  } else if (currentValue >= 569 && currentValue <= 712) {
    dateText.innerHTML = 'June 1, 1968';
  }
}

// Timeline Play / Pause / Reset Buttons

document.getElementById("startBtn").addEventListener("click", startAnimation);
document.getElementById("pauseBtn").addEventListener("click", pauseAnimation);
document.getElementById("resetBtn").addEventListener("click", resetAnimation);

/***End: Timeline animation for both guided tour intro and timeline widget***/


/****Start: Update splashscreen UI after DC Buildings Layer Load Complete****/

const loadingText = document.querySelector(".splash-loading-text");
// const loadedText = document.querySelector(".splash-loaded-text");

view.whenLayerView(dcBuildings).then((layerView) => {
  reactiveUtils.whenOnce(() => !layerView.updating).then(() => {
    loadingText.style.display = 'none';
  });
});

/****End: Update splashscreen UI after DC Buildings Layer Load Complete****/


/****Start: Guided Tour Pagination Logic****/

let items = $(".list-wrapper .list-item");
let numItems = items.length;
let perPage = 1;

items.slice(perPage).hide();

$('#pagination-container').pagination({
    items: numItems,
    itemsOnPage: perPage,
    displayedPages: 999,
    prevText: '<i class="fa-solid fa-arrow-left"></i>',
    nextText: '<i class="fa-solid fa-arrow-right"></i>',
    onPageClick: function (pageNumber) {
        $('.list-wrapper').scrollTop(0);

        let showFrom = perPage * (pageNumber - 1);
        let showTo = showFrom + perPage;
        // items.hide().slice(showFrom, showTo).show();
        items.hide().slice(showFrom, showTo).fadeIn(800)

        function tourZoom() {
          if (pageNumber == 1) {

            view.goTo({
                position: {
                  spatialReference: {
                    // latestWkid: 3857,
                    wkid: 3857
                  },
                  x: -8577004.779774044,
                  y: 4705667.843296814,
                  z: 10.543300992809236
                },
                heading: 83.59418325714013,
                tilt: 84.22649756027022
            }, {
              duration: 3000,
              easing: "expo-in"
            });

            graphicsLayer.graphics.forEach(g => {
              if (g !== imageOneGraphic) {
                g.visible = false;
              } else {
                imageOneGraphic.visible = true;
              }
            });
            
          } else if (pageNumber == 2) {

            view.goTo({
                position: {
                  spatialReference: {
                    // latestWkid: 3857,
                    wkid: 3857
                  },
                  x: -8576989.152729018,
                  y: 4705679.9810580285,
                  z: 10.485039697960019
                },
                heading: 70.35532553222679,
                tilt: 86.11341892628539
            }, {
              duration: 3000,
              easing: "expo-in"
            });

            graphicsLayer.graphics.forEach(g => {
              if (g !== imageTwoGraphic) {
                g.visible = false;
              } else {
                imageTwoGraphic.visible = true;
              }
            });

          } else if (pageNumber == 3) {

            view.goTo({
                position: {
                  spatialReference: {
                    // latestWkid: 3857,
                    wkid: 3857
                  },
                  x: -8576919.096524056,
                  y: 4705683.647870868,
                  z: 10.81275842525065
                },
                heading: 70.62430450730903,
                tilt: 83.49760791353782
            }, {
              duration: 3000,
              easing: "expo-in"
            });

            graphicsLayer.graphics.forEach(g => {
              if (g !== imageThreeGraphic) {
                g.visible = false;
              } else {
                imageThreeGraphic.visible = true;
              }
            });

          } else if (pageNumber == 4) {

            view.goTo({
                position: {
                  spatialReference: {
                    // latestWkid: 3857,
                    wkid: 3857
                  },
                  x: -8576823.540303953,
                  y: 4705686.89671136,
                  z: 10.011710852384567
                },
                heading: 174.7211623546343,
                tilt: 84.40962104687159
            }, {
              duration: 3000,
              easing: "expo-in"
            });

            graphicsLayer.graphics.forEach(g => {
              if (g !== imageFourGraphic) {
                g.visible = false;
              } else {
                imageFourGraphic.visible = true;
              }
            });

          } else if (pageNumber == 5) {

            view.goTo({
                position: {
                  spatialReference: {
                    // latestWkid: 3857,
                    wkid: 3857
                  },
                  x: -8576613.497337826,
                  y: 4705684.875138781,
                  z: 8.82313084602356
                },
                heading: 77.67761909751498,
                tilt: 82.84882863924025
            }, {
              duration: 3000,
              easing: "expo-in"
            });

            graphicsLayer.graphics.forEach(g => {
              if (g !== imageFiveGraphic) {
                g.visible = false;
              } else {
                imageFiveGraphic.visible = true;
              }
            });

          } else if (pageNumber == 6) {

            view.goTo({
                position: {
                  spatialReference: {
                    // latestWkid: 3857,
                    wkid: 3857
                  },
                  x: -8576416.48588196,
                  y: 4705727.700724684,
                  z: 8.832583929412067
                },
                heading: 174.9596704992528,
                tilt: 82.06501693126847
            }, {
              duration: 3000,
              easing: "expo-in"
            });

            graphicsLayer.graphics.forEach(g => {
              if (g !== imageSixGraphic) {
                g.visible = false;
              } else {
                imageSixGraphic.visible = true;
              }
            });

          } else if (pageNumber == 7) {

            view.goTo({
                position: {
                  spatialReference: {
                    // latestWkid: 3857,
                    wkid: 3857
                  },
                  x: -8576725.321068317,
                  y: 4705693.5749877365,
                  z: 13.036840473301709
                },
                heading: 175.39613210790532,
                tilt: 74.14001875546752
            }, {
              duration: 3000,
              easing: "expo-in"
            });

            graphicsLayer.graphics.forEach(g => {
              if (g !== imageSevenGraphic) {
                g.visible = false;
              } else {
                imageSevenGraphic.visible = true;
              }
            });

          } else if (pageNumber == 8) {

            view.goTo({
                position: {
                  spatialReference: {
                    // latestWkid: 3857,
                    wkid: 3857
                  },
                  x: -8576740.581724314,
                  y: 4705662.478255918,
                  z: 13.309347042813897
                },
                heading: 105.06355952716257,
                tilt: 75.64944936130252
            }, {
              duration: 3000,
              easing: "expo-in"
            });

            graphicsLayer.graphics.forEach(g => {
              if (g !== imageEightGraphic) {
                g.visible = false;
              } else {
                imageEightGraphic.visible = true;
              }
            });

          } else if (pageNumber == 9) {

            view.goTo({
                position: {
                  spatialReference: {
                    // latestWkid: 3857,
                    wkid: 3857
                  },
                  x: -8576989.156110896,
                  y: 4705827.416736907,
                  z: 8.81208825390786
                },
                heading: 85.55647711539673,
                tilt: 83.53553024037963
            }, {
              duration: 3000,
              easing: "expo-in"
            });

            graphicsLayer.graphics.forEach(g => {
              if (g !== imageNineGraphic) {
                g.visible = false;
              } else {
                imageNineGraphic.visible = true;
              }
            });

          }  else {};
        }

        tourZoom();
    }
});

/****End: Guided Tour Pagination Logic****/