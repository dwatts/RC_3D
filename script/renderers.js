
//Mall Ground Cover Renderer

const mallRenderer = {
      type: "simple",
      symbol: {
        type: "polygon-3d",
        symbolLayers: [{
          type: "fill",
          material: {
            color: "#e6eae6"
          }
        }]
      }
  };

//DC Buildings Renderer

const dcBuildingsRenderer = {
    type: "simple",
    symbol: {
    type: "mesh-3d",
    symbolLayers: [
        {
        type: "fill",
        material: {
            color: [240, 240, 240, 0.85]
        },
        edges: {
            type: "sketch",
            color: [0, 0, 0, 0.6],
            size: 0.5
        }
        }
    ]
    }
};

//RC Structure Renderer

//***********General Edge Renderer**********//

const structureEdges = {
  type: "sketch",
  color: [0, 0, 0, 0.6],
  size: 0.5
}; 

//***********Category Renderer**********//
          
const admin = {
  type: "mesh-3d",
  symbolLayers: [
    {
      type: "fill",
      material: {
        color: "#730900"
      },
      edges: structureEdges    
    } 
  ]  
};
  
const gathering = {
  type: "mesh-3d",
  symbolLayers: [
    {
      type: "fill",
      material: {
        color: "#944229"
      },
      edges: structureEdges    
    } 
  ]  
};

const groupRes = {
  type: "mesh-3d",
  symbolLayers: [
    {
      type: "fill",
      material: {
        color: "#B67C53"
      },
      edges: structureEdges    
    } 
  ]  
}
  
const indRes = {
  type: "mesh-3d",
  symbolLayers: [
    {
      type: "fill",
      material: {
        color: "#D8B67D"
      },
      edges: structureEdges    
    } 
  ]  
}  

const services = {
  type: "mesh-3d",
  symbolLayers: [
    {
      type: "fill",
      material: {
        color: "#9EA887"
      },
      edges: structureEdges    
    } 
  ]  
}

const utilities = {
  type: "mesh-3d",
  symbolLayers: [
    {
      type: "fill",
      material: {
        color: "#649B92"
      },
      edges: structureEdges    
    } 
  ]  
}

const notDetermined = {
  type: "mesh-3d",
  symbolLayers: [
    {
      type: "fill",
      material: {
        color: "#efefef"
      },
      edges: structureEdges    
    } 
  ]  
}

const rcStructuresRenderer = {
  type: "unique-value",
  defaultSymbol: {
    type: "mesh-3d",
    symbolLayers: [
      {
        type: "fill", 
        material: {
          color: "#4f4f4f"
        },
        edges: structureEdges  
      }
    ]
  },
  field: "Category",
  uniqueValueInfos: [
    {
      value: "Administration",
      symbol: admin,
    },
    {
      value: "Gathering Spaces",
      symbol: gathering,
    },
    {
      value: "Group / Family Residential",
      symbol: groupRes,
    },
    {
      value: "Individual Residential",
      symbol: indRes,
    },
    {
      value: "Not determined",
      symbol: notDetermined,
    },
    {
      value: "Services",
      symbol: services,
    },
    {
      value: "Utilities",
      symbol: utilities,
    }    
  ],
};

//End RC Structure Category Renderer