export const products = [
  // --- GEOJSON ---
  {
    id: 'g-63-provinces',
    title: 'Ranh giới 63 tỉnh thành VN',
    desc: 'Bản đồ vector ranh giới hành chính 63 tỉnh thành phố Việt Nam chuẩn mới nhất.',
    format: 'geojson',
    size: '4.2 MB',
    price: null, // null means available for subscribers
    thumb: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800', // Mock abstract map
    featured: true
  },
  {
    id: 'g-districts',
    title: 'Ranh giới quận huyện toàn quốc',
    desc: 'Toàn bộ ranh giới hành chính cấp quận/huyện của 63 tỉnh thành.',
    format: 'geojson',
    size: '12.5 MB',
    price: null,
    thumb: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&q=80&w=800',
    featured: false
  },
  {
    id: 'g-rivers',
    title: 'Hệ thống sông ngòi quốc gia',
    desc: 'Dữ liệu các dòng sông chính, kênh rạch lớn tại Việt Nam phục vụ animation thời tiết/địa lý.',
    format: 'geojson',
    size: '8.1 MB',
    price: null,
    thumb: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&q=80&w=800',
    featured: true
  },
  {
    id: 'g-highways',
    title: 'Mạng lưới đường cao tốc VN',
    desc: 'Chi tiết các tuyến đường cao tốc Bắc Nam và các tuyến nhánh (đã hoàn thành).',
    format: 'geojson',
    size: '2.4 MB',
    price: null,
    thumb: 'https://images.unsplash.com/photo-1518534015033-2144368140ee?auto=format&fit=crop&q=80&w=800',
    featured: false
  },
  {
    id: 'g-tourism',
    title: 'Top 100 điểm du lịch nổi tiếng',
    desc: 'Dữ liệu GeoJSON bao gồm toạ độ và bounding box các khu du lịch.',
    format: 'geojson',
    size: '1.2 MB',
    price: null,
    thumb: 'https://images.unsplash.com/photo-1557160854-e1e89fdd3286?auto=format&fit=crop&q=80&w=800',
    featured: false
  },

  // --- KML ---
  {
    id: 'k-34-provinces-merged',
    title: '34 tỉnh thành (Sau sáp nhập)',
    desc: 'File KML được tối ưu hoá cho Editor phục vụ làm bản đồ lịch sử Việt Nam cận đại.',
    format: 'kml',
    size: '3.1 MB',
    price: null,
    thumb: 'https://images.unsplash.com/photo-1574887309536-224419cb7f13?auto=format&fit=crop&q=80&w=800',
    featured: true
  },
  {
    id: 'k-unesco',
    title: '8 Di sản thế giới UNESCO tại VN',
    desc: 'Vị trí và ranh giới các khu vực di sản thiên nhiên / văn hoá được UNESCO công nhận.',
    format: 'kml',
    size: '0.8 MB',
    price: null,
    thumb: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800',
    featured: false
  },
  {
    id: 'k-economic-zones',
    title: '18 Khu kinh tế ven biển',
    desc: 'Toàn bộ ranh giới các khu kinh tế ven biển Việt Nam cập nhật mới.',
    format: 'kml',
    size: '1.5 MB',
    price: null,
    thumb: 'https://images.unsplash.com/photo-1505374828135-42352136ee1b?auto=format&fit=crop&q=80&w=800',
    featured: true
  },
  {
    id: 'k-qn-routes',
    title: 'Hệ thống quốc lộ trọng điểm',
    desc: 'Tuyến QL1A, QL14 và các quốc lộ huyết mạch.',
    format: 'kml',
    size: '4.5 MB',
    price: null,
    thumb: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800',
    featured: false
  },

  // --- PLUGINS ---
  {
    id: 'p-ae-animator',
    title: 'AE Map Animator Script',
    desc: 'Script After Effects hỗ trợ tạo viền chạy, vẽ line tự động dựa trên mask hoặc path từ KML.',
    format: 'plugin',
    size: '50 KB',
    price: null,
    thumb: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
    featured: true
  },
  {
    id: 'p-pr-overlay',
    title: 'Premiere Map Overlay Pack',
    desc: 'Gói essential graphics (MOGRT) tạo popup vị trí bản đồ cực nhanh trên Premiere Pro.',
    format: 'plugin',
    size: '120 MB',
    price: null,
    thumb: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&q=80&w=800',
    featured: true
  },
  {
    id: 'p-geolayers-vn',
    title: 'Geolayers VN Data Pack',
    desc: 'Bộ preset style và data cấu hình sẵn cho plugin Geolayers 3, phong cách truyền hình Việt Nam.',
    format: 'plugin',
    size: '15 MB',
    price: null,
    thumb: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    featured: false
  }
]
