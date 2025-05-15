# Audio and POI API Testing Guide

This directory contains scripts and instructions for testing the Java backend API for audio uploads and POI (Point of Interest) management.

## API Endpoints

- `POST /audio` — Upload an audio file
- `GET /audio/{id}` — Retrieve an audio file by its ID
- `POST /poi` — Add a POI (can reference an audio file by ID)
- `GET /poi` — Retrieve all POIs

## Process Overview

1. **Upload an Audio File**
2. **Add a POI referencing the uploaded audio**
3. **Retrieve the POI and extract the audio ID**
4. **Retrieve the audio file by its ID**

---

## 1. Upload an Audio File

Send a `POST` request to `/audio` with a multipart form containing your audio file (field name: `audio`).

**Example cURL:**
```sh
curl -F "audio=@test.wav" http://localhost:7070/audio
```
**Response:**
```json
{
  "filename": "test.wav",
  "id": 1
}
```

---

## 2. Add a POI Referencing the Audio

Send a `POST` request to `/poi` with a JSON body. Include the `audioId` field from the previous step.

**Example cURL:**
```sh
curl -X POST http://localhost:7070/poi \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test POI",
    "x": 1.23,
    "y": 4.56,
    "tags": ["test", "audio"],
    "description": "POI with audio",
    "type": "test-type",
    "audioId": 1
  }'
```

---

## 3. Retrieve POIs

Send a `GET` request to `/poi` to get all POIs. Each POI with audio will have an `audioId` field.

**Example cURL:**
```sh
curl http://localhost:7070/poi
```

---

## 4. Retrieve the Audio File by ID

Send a `GET` request to `/audio/{id}` to download the audio file.

**Example cURL:**
```sh
curl http://localhost:7070/audio/1 --output retrieved_test.wav
```

---

## Automated Testing

See `testJavaAudio.py` for a Python script that automates this process:
- Uploads an audio file
- Adds a POI referencing the audio
- Retrieves the POI and audio file

---

## Notes
- The backend must be running on `localhost:7070`.
- The audio file field in the upload must be named `audio`.
- The POI JSON must include all required fields as per backend definition. 