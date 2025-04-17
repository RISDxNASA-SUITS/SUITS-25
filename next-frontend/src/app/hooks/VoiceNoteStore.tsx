import { create } from 'zustand'

interface Recording {
  id: number
  audioUrl: string | null
  time:string
  date:string
  name:string
}

interface AudioState {
    recordings: Recording[]
    currentRecordingId: string | null
    addRecording: (recording: Recording) => void
}

const useAudioStore = create<AudioState>((set) => ({
    recordings: [],
    currentRecordingId: null,

    addRecording: (recording) => set((state) => ({
        recordings: [...state.recordings, recording]
})),

}))

export default useAudioStore