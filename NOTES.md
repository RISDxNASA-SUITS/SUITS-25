# FOR DAVID - Voice Notes

## To Create
1. Poi's have audioIds
2. First call post fetch("/api/audio"), attach the audio as form data (See google for this)
3. The above function returns a json, get the id field, there is also a filename field
4. To add a new audioId, call the poiStore.addVoiceNote(poiId, audioId) function, the audioId should be the id from step 3
5. Now we have added it to the backend! They will be loaded to the frontend


## To display
1. Call get fetch("/api/audio?audioId=<id>"), where audioId is a QUERY PARAM
2. This will return the file, take this file and make it playable (somehow)




# FOR SHIVAM


1. In the dashboard, the dashBoard stats use state in the dashboard/page.tsx is ACCURATE. You should NOT have to touch that at all. Just use that hook to fill in the numbers on the actual dashboard
2. If there is a problem with something in the hook I will fix it. Just make it work off of that general structure.


    