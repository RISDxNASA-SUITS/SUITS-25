import { create } from 'zustand'

interface Recording {
  id: number
  audioUrl: string | null
  time:string
  date:string
  name:string

  //the poi id associated with this voice note
  poiID: string | null
}

interface AudioState {
    recordings: Recording[]
    addRecording: (recording: Recording) => void
}

const useAudioStore = create<AudioState>((set) => ({
    recordings: [],

    addRecording: (recording) => set((state) => ({
        recordings: [...state.recordings, recording]
})),

}))

export default useAudioStore