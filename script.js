// 搜索功能跳转
document.getElementById('searchInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    window.location.href = `search_Content Detail.html?search=${encodeURIComponent(this.value)}`;
  }
});

// Country mapping for file names
const countryFileMap = {
  'China': 'CHN_Content Detail.html',
  'India': 'IND_Content Detail.html',
  'Japan': 'JPN_Content Detail.html',
  'Singapore': 'SGP_Content Detail.html',
  'South Korea': 'KOR_Content Detail.html',
  'Indonesia': 'IDN_Content Detail.html'
};

// Country statistics data
const countryStats = {
  'China': {
    researchPapers: 156,
    trends: 23,
    successStories: 45
  },
  'India': {
    researchPapers: 142,
    trends: 19,
    successStories: 38
  },
  'Japan': {
    researchPapers: 98,
    trends: 15,
    successStories: 32
  },
  'Singapore': {
    researchPapers: 67,
    trends: 12,
    successStories: 28
  },
  'South Korea': {
    researchPapers: 78,
    trends: 14,
    successStories: 25
  },
  'Indonesia': {
    researchPapers: 89,
    trends: 17,
    successStories: 31
  }
};

// Create tooltip element
const tooltip = document.createElement('div');
tooltip.className = 'fixed bg-white shadow-lg rounded-lg p-4 text-sm z-50 hidden transform -translate-x-1/2 -translate-y-full';
document.body.appendChild(tooltip);

// 地图和国家按钮跳转
document.querySelectorAll('.country-btn').forEach(btn => {
  const country = btn.dataset.country;
  if (country === 'More') return; // Skip the "More" button

  // Add hover events for tooltip
  btn.addEventListener('mouseenter', function(e) {
    const stats = countryStats[country];
    if (stats) {
      tooltip.innerHTML = `
        <div class="min-w-[200px]">
          <div class="font-bold text-indigo-700 mb-3 text-center text-base">${country}</div>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Research Papers</span>
              <span class="font-semibold text-indigo-600">${stats.researchPapers}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Trends Identified</span>
              <span class="font-semibold text-indigo-600">${stats.trends}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Success Stories</span>
              <span class="font-semibold text-indigo-600">${stats.successStories}</span>
            </div>
          </div>
        </div>
      `;
      
      // Position tooltip
      const rect = btn.getBoundingClientRect();
      tooltip.style.left = `${rect.left + (rect.width / 2)}px`;
      tooltip.style.top = `${rect.top - 10}px`;
      tooltip.classList.remove('hidden');
    }
  });

  btn.addEventListener('mouseleave', function() {
    tooltip.classList.add('hidden');
  });

  // Click event for navigation
  btn.addEventListener('click', function() {
    const fileName = countryFileMap[country];
    if (fileName) {
      window.location.href = fileName;
    }
  });
});

// ECharts Asia Map Visualization
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded');
  
  // Check if ECharts is loaded
  if (typeof echarts === 'undefined') {
    console.error('ECharts is not loaded!');
    return;
  }
  console.log('ECharts library loaded successfully');

  // Wait for map data to be loaded
  function initMap() {
    var chartDom = document.getElementById('asiaMapEchart');
    if (!chartDom) {
      console.error('Map container not found!');
      return;
    }
    console.log('Map container found');
    
    try {
      // Check if map data is loaded
      if (!echarts.getMap('asia')) {
        console.error('Asia map data not loaded, retrying in 1000ms...');
        setTimeout(initMap, 1000);
        return;
      }
      console.log('Asia map data loaded successfully');

      // Initialize chart
      var myChart = echarts.init(chartDom, null, {
        renderer: 'canvas',
        useDirtyRect: false
      });
      console.log('ECharts instance created');
      
      // Prepare map data with statistics
      const mapData = Object.entries(countryStats).map(([country, stats]) => ({
        name: country,
        value: stats.researchPapers,
        researchPapers: stats.researchPapers,
        trends: stats.trends,
        successStories: stats.successStories
      }));
      
      var option = {
        backgroundColor: '#ffffff',
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          padding: [12, 16],
          textStyle: {
            color: '#1f2937'
          },
          formatter: function(params) {
            if (params.data) {
              return `
                <div style="min-width: 200px;">
                  <div style="font-weight: bold; color: #4f46e5; margin-bottom: 12px; text-align: center; font-size: 14px;">${params.name}</div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #6b7280;">Research Papers</span>
                    <span style="font-weight: 600; color: #4f46e5;">${params.data.researchPapers}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #6b7280;">Trends Identified</span>
                    <span style="font-weight: 600; color: #4f46e5;">${params.data.trends}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #6b7280;">Success Stories</span>
                    <span style="font-weight: 600; color: #4f46e5;">${params.data.successStories}</span>
                  </div>
                </div>
              `;
            }
            return params.name;
          }
        },
        visualMap: {
          show: false,
          min: 0,
          max: 200,
          inRange: {
            color: ['#e0e7ff', '#6366f1']
          }
        },
        series: [
          {
            name: 'Asia',
            type: 'map',
            map: 'asia',
            roam: true,
            emphasis: {
              label: {
                show: true,
                color: '#1e293b',
                fontWeight: 'bold'
              },
              itemStyle: {
                areaColor: '#818cf8',
                borderColor: '#312e81',
                borderWidth: 1.5
              }
            },
            itemStyle: {
              borderColor: '#6366f1',
              borderWidth: 0.5
            },
            label: {
              show: false
            },
            data: mapData
          }
        ]
      };
      
      // Set chart options
      myChart.setOption(option);
      console.log('Map options set successfully');
      
      // Hide loading indicator
      const loadingElement = document.getElementById('mapLoading');
      if (loadingElement) {
        loadingElement.style.display = 'none';
      }
      
      // Add click event
      myChart.on('click', function(params) {
        if (params && params.name) {
          const fileName = countryFileMap[params.name];
          if (fileName) {
            window.location.href = fileName;
          }
        }
      });
      
      // Handle window resize
      window.addEventListener('resize', function() {
        myChart.resize();
      });

      // Force a resize after initialization
      setTimeout(() => {
        myChart.resize();
      }, 100);
      
    } catch (error) {
      console.error('Error initializing map:', error);
      // Show error in loading indicator
      const loadingElement = document.getElementById('mapLoading');
      if (loadingElement) {
        loadingElement.innerHTML = '<div class="text-red-600">Error loading map. Please refresh the page.</div>';
      }
    }
  }
  
  // Start initialization
  initMap();
}); 