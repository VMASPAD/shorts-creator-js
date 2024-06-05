Here is a README file explaining the code you provided, including how to use it:

---

# Random Video Clip Generator

This Node.js script generates random 30-second clips from a given video file, extracts their audio, and creates subtitles for the audio clips using the Whisper model.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 10 or higher)
- [FFmpeg](https://ffmpeg.org/)
- [Whisper](https://github.com/openai/whisper)

## Installation

1. Clone the repository or download the script.
2. Install the necessary Node.js modules:

    ```sh
    npm install util fs child_process
    ```

3. Ensure FFmpeg and Whisper are installed and accessible in your system's PATH.

## Usage

1. Place the video file (`video.mp4`) in the same directory as the script.
2. Run the script using Node.js:

    ```sh
    node script.js
    ```

## How It Works

1. **Obtain Video Duration:**
   The script uses `ffprobe` to get the total duration of the input video (`video.mp4`).

2. **Generate Random Clip Start Times:**
   It generates 10 random start times for 30-second clips, ensuring no overlap.

3. **Cut Video Clips and Extract Audio:**
   For each start time, it creates a directory, cuts a 30-second video clip using FFmpeg, and extracts the audio to a separate file.

4. **Generate Subtitles:**
   It uses Whisper to generate subtitles from the extracted audio and saves them in SRT format.

## File Structure

The generated clips and their corresponding audio and subtitle files will be stored in the `clips` directory with the following structure:

```
clips/
├── clip_0/
│   ├── clip_0.mp4
│   ├── clip_0.wav
│   └── subtitulos.srt
├── clip_1/
│   ├── clip_1.mp4
│   ├── clip_1.wav
│   └── subtitulos.srt
...
```

## Example Output

The script will output logs for the progress of each task, including any errors encountered.

## License

This project is licensed under the MIT License.

---

**a.** Run the code to ensure it works as expected.

**b.** Add unit tests to validate the functionality of the script.