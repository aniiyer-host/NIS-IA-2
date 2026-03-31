#  Shodan Offline Analyzer

###  Team Details
- Aksh Maheshwari 16010123032 TY COMPS A
- Aniket Iyer 16010123044 TY COMPS A
- Aarush Jain 16010123006 TY COMPS A



---

##  Project Overview

The **Shodan Offline Analyzer** is a web-based tool built using React (Vite) that analyzes Shodan JSON data without requiring live API access.  

It helps in identifying:
- Open ports  
- Running services  
- Potential vulnerabilities  
- Overall system risk level  

This tool is designed for **learning, demonstration, and cybersecurity analysis in offline environments**.

---

##  Key Functionalities

###  1. Host Data Analysis
- Parses Shodan host JSON data  
- Extracts:
  - IP address  
  - Organization  
  - Operating system  
  - Open ports  

---

###  2. Service & Banner Detection
- Identifies services running on each port:
  - Apache / Nginx (Web servers)
  - OpenSSH (Remote access)
  - FTP / Telnet / MySQL  
- Displays banners and version information  

---

###  3. Vulnerability Indicators
The analyzer flags risky configurations such as:
- Outdated software versions  
- Use of insecure protocols (e.g., Telnet)  
- Publicly exposed databases  
- Known vulnerable services (e.g., vsFTPd 2.3.4)  

---

###  4. Risk Scoring System
- Assigns a **risk level** based on detected issues:
  - 🟢 Low Risk → Secure configurations  
  - 🟡 Medium Risk → Minor vulnerabilities  
  - 🔴 High Risk → Critical exposure  

- Risk is calculated using rule-based logic (e.g., open Telnet increases risk score)

---

###  5. Domain Intelligence (DNS Analysis)
- Analyzes domain-based Shodan JSON data  
- Extracts:
  - MX records (mail servers)  
  - NS records (nameservers)  
  - TXT records (SPF, verification)  
  - Subdomains  

- Provides insights such as:
  - Email security configuration (SPF/DMARC)  
  - Third-party integrations  
  - Attack surface via subdomains  

---

###  6. Insight Generation
- Converts raw JSON into human-readable findings  
- Explains:
  - Why a configuration is risky  
  - What it means for security  

---

###  7. User Interface
- Built with **React + Vite**  
- Clean and interactive UI  
- Displays:
  - Risk level (color-coded)  
  - Services list  
  - Security findings  

---

##  Sample Use Cases

- Cybersecurity learning and demonstrations  
- Understanding Shodan data structure  
- Practicing vulnerability assessment  
- Academic projects and presentations  

---

##  Tech Stack

- **Frontend:** React (Vite)  
- **Language:** JavaScript  
- **Data Source:** Sample Shodan JSON (offline)  

---

##  Future Enhancements

- CVE (Common Vulnerabilities and Exposures) mapping  
- Graph-based visualization of attack surface  
- Integration with live Shodan API  
- Exportable security reports  

---

##  Disclaimer

This tool is intended for **educational purposes only**.  
It does not perform real-time scanning and should not be used for unauthorized security testing.

---

##  Conclusion

The Shodan Offline Analyzer simplifies complex cybersecurity data into meaningful insights, helping users understand system exposure and potential risks without requiring advanced tools or API access.

---
