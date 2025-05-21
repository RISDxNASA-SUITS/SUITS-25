import requests

body = {
    "poiId":2,
    "voiceNote":1
}
res = requests.post("http://localhost:7070/poi/addVoiceNote", json=body)


print(res.text)