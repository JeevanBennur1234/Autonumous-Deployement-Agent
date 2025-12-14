import requests
import time

def test_kestra():
    url = "http://localhost:8080/api/v1/flows"
    for i in range(10):
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                print(f"✅ Kestra is ready!")
                return True
        except:
            pass
        print(f"Waiting for Kestra... ({i+1}/10)")
        time.sleep(3)
    return False

if __name__ == "__main__":
    test_kestra()