var polyCoords = null
var styleReady = false

function reqListener() {
  var track = JSON.parse(this.responseText)
  polyCoords = track.map(function(point) {
    return [point.lat, point.lng]
  })
  plotLine()
}

function plotLine() {
  if (!styleReady) return
  if (!polyCoords) return

  map.addSource('isroTrack', {
    'type': 'geojson',
    'data': {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'LineString',
        'coordinates': polyCoords
      }
    }
  })

  map.addLayer({
    'id': 'isroTrack',
    'type': 'line',
    'source': 'isroTrack',
    'layout': {
      'line-join': 'round',
      'line-cap': 'round'
    },
    'paint': {
      'line-color': '#888',
      'line-width': 8
    }
  })

  var pointNum = 0
  setInterval(function() {
    point = polyCoords[pointNum]
    map.panTo(point)
    pointNum++
  }, 250)
}

mapboxgl.accessToken = 'pk.eyJ1IjoibXBsZXdpcyIsImEiOiJpRFNqOTBJIn0.Q1ZmuYl5o3u72T4VFQ4kqQ'
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v9',
})

map.on('load', function() {
  styleReady = true
  plotLine()
})

map.setZoom(10)
map.setCenter([-88.9114786,47.9958654])

var req = new XMLHttpRequest()
req.addEventListener('load', reqListener)
req.open('GET', 'track.json')
req.send()
