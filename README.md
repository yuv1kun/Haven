# Haven: Real-Time Disaster Monitoring & Response Platform 🌍🚨

A modern web application for real-time disaster monitoring, risk prediction, and emergency resource coordination. Built for communities and authorities to respond faster and smarter to natural disasters.

## 🌟 Key Features

- **Real-Time Sensor Data**: Monitor floods, fires, and earthquakes via IoT sensors.
- **AI-Powered Risk Analytics**: Predict disaster risks using machine learning models.
- **Interactive GIS Maps**: Visualize hazards and resources on dynamic Leaflet maps.
- **Automated Alerts**: Notify stakeholders via web, SMS, and sirens.
- **Resource Management**: Optimize rescue team deployment and supply allocation.

## 🛠️ Tech Stack

### Frontend

- React (TypeScript) for dynamic UI
- Leaflet/React-Leaflet for GIS visualization
- Chart.js for data trends
- Tailwind CSS for styling

### Backend & Database

- Supabase (PostgreSQL) for real-time data storage
- RESTful APIs for sensor data ingestion
- PL/pgSQL*for database functions

### IoT Integration

- ESP8266/NodeMCU microcontrollers
- LoRaWAN for long-range communication

## 🚀 Quick Start

1. **Clone the repo**: git clone https://github.com/yuv1kun/Haven.git , then, cd Haven
2. **Install dependencies**: npm install
3. **Configure environment variables (create `.env`)**: VITE_SUPABASE_URL = your-supabase-url and VITE_SUPABASE_KEY = your-anon-key
4. **Start the development server**: npm run dev

## 📊 How It Works

1. **Data Collection**: IoT sensors → ESP8266 → Supabase.
2. **Processing**: AI models analyze trends and predict risks.
3. **Visualization**: React dashboard displays live sensor data, heatmaps, and resource allocation.
4. **Action**: Automated alerts trigger emergency protocols.

## 📄 License

MIT License - See (LICENSE)
