# Sensoria - BCI Neurorehabilitation System

<div align="center">

![Sensoria Logo](public/sensoria.svg)

**Brain-Computer Interface system for post-stroke motor rehabilitation**

*Developed for Monash Challenge 2025*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/react-18-61dafb.svg)](https://reactjs.org/)
[![Monash Challenge 2025](https://img.shields.io/badge/Monash%20Challenge-2025-blue.svg)](https://www.monash.edu/)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Scientific Background](#scientific-background)
- [System Architecture](#system-architecture)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technical Specifications](#technical-specifications)
- [Research References](#research-references)
- [Contributing](#contributing)
- [Contact](#contact)
- [License](#license)

---

## 🧠 Overview

**Sensoria** is a Brain-Computer Interface (BCI) system designed for neurorehabilitation of post-stroke patients. The system integrates motor imagery training with real-time neurofeedback, leveraging neuroplasticity principles to enhance motor recovery outcomes.

### Project Goals

The primary objective of this project is to develop an accessible and effective rehabilitation tool that:

1. **Detects cortical activation** through EEG signal processing during motor imagery tasks
2. **Provides real-time visual feedback** to enhance neural training effectiveness
3. **Implements adaptive protocols** with gamification elements to improve patient engagement
4. **Facilitates remote rehabilitation** through an intuitive web-based interface

### Clinical Context

Stroke is a leading cause of long-term disability worldwide, with approximately 80% of survivors experiencing motor dysfunction. Traditional rehabilitation methods often require intensive therapist supervision and can be limited by patient motivation. BCI-based rehabilitation offers a complementary approach that:

- Activates similar neural pathways as physical movement
- Provides objective feedback on neural activity
- Enables self-directed practice sessions
- Supports neuroplastic reorganization of motor cortex

---

## 🔬 Scientific Background

### Motor Imagery and Neuroplasticity

Motor imagery (MI) is the mental rehearsal of movement without actual execution. Research has demonstrated that MI activates similar cortical regions as actual movement, including:

- Primary motor cortex (M1)
- Premotor cortex (PMC)
- Supplementary motor area (SMA)

This cortical activation can promote neuroplastic changes through repeated practice, facilitating motor recovery in stroke patients.

### Neurofeedback Mechanisms

Real-time neurofeedback allows patients to:
1. Visualize their brain activity patterns
2. Learn to modulate specific neural oscillations
3. Strengthen sensorimotor rhythms associated with motor function
4. Receive immediate reinforcement for successful neural activation

### Evidence Base

This system is built on established research in:
- BCI-based stroke rehabilitation ([Xiong et al., 2022](https://www.frontiersin.org/journals/aging-neuroscience/articles/10.3389/fnagi.2022.863379/full))
- Motor imagery training protocols
- Gamification in rehabilitation
- Virtual reality-assisted therapy

---

## 🏗️ System Architecture

### Frontend (Web Interface)

```
├── React 18 + TypeScript
├── Real-time WebSocket communication
├── Modern UI with Tailwind CSS
└── Responsive design for tablets/desktops
```

**Key Components:**
- **Control Panel**: Session management and connection monitoring
- **Signal Display**: Real-time visualization of detected motor imagery
- **Status Indicators**: Connection state and session feedback

### Backend (Signal Processing)

```
├── FastAPI (Python)
├── TCP Server for EEG data acquisition
├── WebSocket server for real-time streaming
└── Signal classification and preprocessing
```

**Data Flow:**
1. EEG signals → OpenVIBE/TCP client
2. TCP server receives and parses signals
3. Signal classification (left/right motor imagery)
4. WebSocket broadcast to frontend
5. Real-time visual feedback to user

### Integration with OpenVIBE

The system is designed to interface with [OpenVIBE](http://openvibe.inria.fr/), an open-source software platform for BCI applications. OpenVIBE handles:
- EEG signal acquisition from hardware
- Real-time signal processing
- Feature extraction and classification
- TCP/IP communication with Sensoria

---

## ✨ Features

### Core Functionality

- **🔌 TCP Connection Verification**: Real-time status monitoring of EEG signal source
- **🎮 Session Management**: Start/stop rehabilitation sessions with connection validation
- **📊 Motor Imagery Detection**: Classification of left/right hand motor imagery
- **🔄 Real-time Feedback**: WebSocket-based signal streaming with < 100ms latency
- **📈 Signal History**: Logging and tracking of all detected motor imagery events

### Research-Based Design

- **Adaptive Feedback**: Gamification elements to maintain engagement
- **Progressive Difficulty**: Adjustable thresholds for motor imagery detection
- **Session Logging**: Comprehensive data recording for clinical analysis

### Technical Features

- **Modular Architecture**: Easy integration with different EEG systems
- **Extensible Protocol**: Support for custom signal processing pipelines
- **Cross-platform**: Web-based interface accessible from any modern browser
- **Development Tools**: Test client for simulation and debugging

---

## 🚀 Installation

### Prerequisites

- **Python** 3.8 or higher
- **Node.js** 18 or higher
- **npm** or **bun** package manager
- **EEG Hardware** (optional, test client provided for development)

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/miguel-isidro05/neurosync-rehab.git
cd neurosync-rehab
```

2. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

3. **Start the FastAPI server**
```bash
python3 main.py
```

The server will start on `http://localhost:8000` with:
- REST API endpoints
- WebSocket endpoint at `/ws/signals`
- TCP server listening on port `5678`

### Frontend Setup

1. **Install Node.js dependencies**
```bash
npm install
# or
bun install
```

2. **Start the development server**
```bash
npm run dev
# or
bun dev
```

The web interface will be available at `http://localhost:8080`

### Testing Without EEG Hardware

Use the included test client to simulate motor imagery signals:

```bash
python3 test_client.py
```

Controls:
- Press `i` to send "izquierda" (left) signal
- Press `d` to send "derecha" (right) signal
- Press `q` to quit

---

## 📖 Usage

### Quick Start

1. **Start the backend server**
```bash
python3 main.py
```

2. **Start the frontend**
```bash
npm run dev
```

3. **Connect the EEG system** (or test client)
```bash
# For testing:
python3 test_client.py
```

4. **In the web interface:**
   - Click "Verify TCP Connection"
   - Wait for "Connection established" confirmation
   - Click "Start Session"
   - Motor imagery signals will display in real-time

### Integration with OpenVIBE

1. Configure OpenVIBE scenario to send classification results via TCP
2. Set target address to `localhost:5678`
3. Use string format: "izquierda" or "derecha"
4. Start OpenVIBE acquisition
5. Launch Sensoria and verify connection

### Session Workflow

```
┌─────────────────────────────────────┐
│ 1. Hardware Setup                    │
│    - Position EEG electrodes         │
│    - Check impedances                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│ 2. Software Initialization           │
│    - Start OpenVIBE                  │
│    - Launch Sensoria backend         │
│    - Open web interface              │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│ 3. Connection Verification           │
│    - TCP handshake                   │
│    - Signal quality check            │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│ 4. Rehabilitation Session            │
│    - Motor imagery tasks             │
│    - Real-time feedback              │
│    - Performance monitoring          │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│ 5. Session Review                    │
│    - Statistics analysis             │
│    - Progress tracking               │
└─────────────────────────────────────┘
```

---

## 🔧 Technical Specifications

### Signal Processing

| Parameter | Specification |
|-----------|--------------|
| Sampling Rate | Configurable (typically 250-500 Hz) |
| Signal Source | OpenVIBE TCP stream |
| Classification | Motor imagery (left/right hand) |
| Latency | < 100ms end-to-end |
| TCP Port | 5678 |
| WebSocket Port | 8000 |

### System Requirements

**Minimum:**
- CPU: Dual-core 2.0 GHz
- RAM: 4 GB
- Browser: Chrome 90+, Firefox 88+, Safari 14+

**Recommended:**
- CPU: Quad-core 2.5 GHz+
- RAM: 8 GB+
- Dedicated GPU (for future 3D visualization)

### API Endpoints

#### REST API

- `GET /` - Server status
- `GET /status` - TCP connection status
- `GET /last-signal` - Most recent motor imagery signal
- `GET /history?limit=N` - Signal history
- `POST /verify-connection` - Verify TCP connection

#### WebSocket

- `ws://localhost:8000/ws/signals` - Real-time signal stream

Message format:
```json
{
  "type": "signal",
  "signal": "izquierda" | "derecha",
  "timestamp": "ISO 8601 timestamp"
}
```

---

## 📚 Research References

This project is based on current research in BCI-based neurorehabilitation:

1. **Xiong, F. et al.** (2022). [Emerging Limb Rehabilitation Therapy After Post-stroke Motor Recovery](https://www.frontiersin.org/journals/aging-neuroscience/articles/10.3389/fnagi.2022.863379/full). *Frontiers in Aging Neuroscience*, 14:863379.

2. **Motor Imagery Training**: [Neural Correlates and Clinical Application](https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2019.00329/full)

3. **Gamification in Rehabilitation**: [Adaptive feedback and progressive difficulty](https://www.sciencedirect.com/science/article/pii/S2451958824001416)

### Key Findings

- Motor imagery activates similar brain regions as actual movement
- Real-time neurofeedback enhances learning and neuroplasticity
- Gamification improves patient engagement and adherence
- BCI-based training shows promise as complementary therapy

---

## 🤝 Contributing

Contributions are welcome! This project can be extended in multiple directions:

### Potential Improvements

- [ ] 3D game environment for enhanced engagement
- [ ] Multi-class motor imagery (e.g., feet, tongue)
- [ ] Machine learning pipeline for personalized thresholds
- [ ] Clinical database for outcome tracking
- [ ] Multi-language support
- [ ] Offline analysis tools

### Development Setup

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Contact

**Miguel Isidro Báez**  
Email: [miguel.isidro@upch.pe](mailto:miguel.isidro@upch.pe)

**Project Repository**: [https://github.com/miguel-isidro05/neurosync-rehab](https://github.com/miguel-isidro05/neurosync-rehab)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

This project was developed as part of the **Monash Challenge 2025**, an international competition focused on innovative solutions for healthcare and biomedical engineering challenges.

### Special Thanks

- **Monash University** for organizing the Monash Challenge 2025 and supporting neurorehabilitation research
- **OpenVIBE Community** for providing the open-source BCI software platform
- Clinical advisors and biomedical engineering faculty for their valuable guidance
- Stroke rehabilitation research community for inspiring this work

### About Monash Challenge 2025

The Monash Challenge is a prestigious international competition that brings together students, researchers, and innovators to address real-world problems in healthcare, engineering, and technology. This project represents our commitment to advancing neurorehabilitation through accessible and effective BCI technology.

---

<div align="center">

**Built with 🧠 for advancing neurorehabilitation**

*Monash Challenge 2025 Project*

</div>
