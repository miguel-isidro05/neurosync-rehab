"""
Test TCP client for OpenVIBE signal simulation
Press 'i' to send "izquierda" signal, 'd' to send "derecha" signal
Press 'q' to quit
"""

import socket
import logging
import sys
import select
import termios
import tty

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('test_client.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# TCP Server configuration (must match main.py)
TCP_HOST = "localhost"
TCP_PORT = 5678

class TCPClient:
    def __init__(self, host: str, port: int):
        self.host = host
        self.port = port
        self.socket = None
        
    def connect(self):
        """Connect to TCP server"""
        try:
            logger.info(f"Attempting to connect to {self.host}:{self.port}...")
            self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.socket.settimeout(5)  # 5 second timeout
            self.socket.connect((self.host, self.port))
            logger.info(f"✓ Connected to TCP server at {self.host}:{self.port}")
            return True
        except ConnectionRefusedError:
            logger.error(f"✗ Connection refused. Make sure the server is running on {self.host}:{self.port}")
            logger.error("   Start the server with: python3 main.py")
            return False
        except socket.timeout:
            logger.error(f"✗ Connection timeout. Server might not be responding on {self.host}:{self.port}")
            return False
        except Exception as e:
            logger.error(f"✗ Error connecting to server: {e}")
            return False
    
    def send_signal(self, signal: str):
        """Send signal to server"""
        if not self.socket:
            logger.error("Not connected to server")
            return False
        
        try:
            message = f"{signal}\n"
            self.socket.sendall(message.encode('utf-8'))
            logger.info(f"Sent signal: {signal}")
            
            # Wait for acknowledgment
            response = self.socket.recv(1024)
            if response:
                logger.info(f"Server response: {response.decode('utf-8').strip()}")
            return True
        except Exception as e:
            logger.error(f"Error sending signal: {e}")
            return False
    
    def disconnect(self):
        """Disconnect from server"""
        if self.socket:
            self.socket.close()
            logger.info("Disconnected from server")

def get_key():
    """Get a single keypress from stdin (non-blocking)"""
    if sys.stdin.isatty():
        old_settings = termios.tcgetattr(sys.stdin)
        try:
            tty.setcbreak(sys.stdin.fileno())
            if select.select([sys.stdin], [], [], 0.1)[0]:
                key = sys.stdin.read(1)
                return key
        finally:
            termios.tcsetattr(sys.stdin, termios.TCSADRAIN, old_settings)
    return None

def main():
    """Main function"""
    print("=" * 60)
    print("OpenVIBE TCP Test Client")
    print("=" * 60)
    print(f"Connecting to {TCP_HOST}:{TCP_PORT}...")
    print("Make sure the FastAPI server is running (python3 main.py)")
    print()
    
    client = TCPClient(TCP_HOST, TCP_PORT)
    
    if not client.connect():
        print("\n" + "=" * 60)
        print("Failed to connect. Exiting.")
        print("=" * 60)
        print("\nTroubleshooting:")
        print("1. Make sure the FastAPI server is running:")
        print("   python3 main.py")
        print("2. Check that the server is listening on port 5678")
        print("3. Verify there are no firewall issues")
        sys.exit(1)
    
    print("Connected successfully!")
    print()
    print("Controls:")
    print("  Press 'i' to send 'izquierda' (left) signal")
    print("  Press 'd' to send 'derecha' (right) signal")
    print("  Press 'q' to quit")
    print()
    print("Waiting for input...")
    print("-" * 60)
    
    try:
        while True:
            key = get_key()
            
            if key == 'q' or key == 'Q':
                print("\nQuitting...")
                break
            elif key == 'i' or key == 'I':
                print("\n[Sending: izquierda]")
                client.send_signal("izquierda")
            elif key == 'd' or key == 'D':
                print("\n[Sending: derecha]")
                client.send_signal("derecha")
            elif key:
                print(f"\nUnknown key: {key}. Use 'i', 'd', or 'q'")
    
    except KeyboardInterrupt:
        print("\n\nInterrupted by user")
    except Exception as e:
        logger.error(f"Error in main loop: {e}")
    finally:
        client.disconnect()
        print("Disconnected. Goodbye!")

if __name__ == "__main__":
    main()

